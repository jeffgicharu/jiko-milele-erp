from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from .models import UserProfile, AuthenticationLog


class UserProfileInline(admin.StackedInline):
    """Inline admin for UserProfile."""
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = (
        'staff_profile', 
        'current_role', 
        'failed_login_attempts', 
        'account_locked_until',
        'last_login_ip'
    )
    readonly_fields = ('failed_login_attempts', 'last_login_ip')


class UserAdmin(BaseUserAdmin):
    """Extended User admin with profile inline."""
    inlines = (UserProfileInline,)
    
    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(UserAdmin, self).get_inline_instances(request, obj)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin configuration for UserProfile model."""
    
    list_display = [
        'user',
        'current_role_display',
        'staff_profile',
        'failed_login_attempts',
        'account_status',
        'last_login_ip',
        'created_at'
    ]
    
    list_filter = [
        'current_role',
        'failed_login_attempts',
        'account_locked_until',
        'created_at',
        'staff_profile__role'
    ]
    
    search_fields = [
        'user__username',
        'user__email',
        'user__first_name',
        'user__last_name',
        'staff_profile__name'
    ]
    
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'staff_profile', 'current_role')
        }),
        ('Security', {
            'fields': ('failed_login_attempts', 'account_locked_until', 'last_login_ip')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def current_role_display(self, obj):
        """Display current role with color coding."""
        if not obj.current_role:
            return format_html('<span style="color: gray;">No Role</span>')
        
        colors = {
            'general_manager': '#dc3545',    # Red
            'shift_supervisor': '#fd7e14',   # Orange
            'head_chef': '#6f42c1',         # Purple
            'sous_chef': '#6610f2',         # Indigo
            'line_cook': '#20c997',         # Teal
            'server': '#0dcaf0',            # Cyan
            'host': '#198754',              # Green
            'bartender': '#0d6efd',         # Blue
            'busser': '#6c757d',            # Gray
        }
        
        color = colors.get(obj.current_role, '#000')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.current_role.replace('_', ' ').title()
        )
    current_role_display.short_description = 'Current Role'
    
    def account_status(self, obj):
        """Display account status with color coding."""
        if obj.is_account_locked:
            return format_html(
                '<span style="color: red; font-weight: bold;">🔒 LOCKED</span>'
            )
        elif obj.failed_login_attempts > 0:
            return format_html(
                '<span style="color: orange;">⚠️ {} Failed Attempts</span>',
                obj.failed_login_attempts
            )
        else:
            return format_html(
                '<span style="color: green;">✅ Active</span>'
            )
    account_status.short_description = 'Account Status'
    
    actions = ['unlock_selected_accounts', 'reset_failed_attempts']
    
    def unlock_selected_accounts(self, request, queryset):
        """Action to unlock selected accounts."""
        count = 0
        for profile in queryset:
            if profile.is_account_locked:
                profile.unlock_account()
                count += 1
        
        self.message_user(
            request,
            f'Successfully unlocked {count} account(s).'
        )
    unlock_selected_accounts.short_description = 'Unlock selected accounts'
    
    def reset_failed_attempts(self, request, queryset):
        """Action to reset failed login attempts."""
        count = queryset.update(failed_login_attempts=0, account_locked_until=None)
        self.message_user(
            request,
            f'Reset failed attempts for {count} account(s).'
        )
    reset_failed_attempts.short_description = 'Reset failed login attempts'


@admin.register(AuthenticationLog)
class AuthenticationLogAdmin(admin.ModelAdmin):
    """Admin configuration for AuthenticationLog model."""
    
    list_display = [
        'timestamp',
        'user_display',
        'action_display',
        'success_display',
        'ip_address',
        'details_short'
    ]
    
    list_filter = [
        'action',
        'success',
        'timestamp'
    ]
    
    search_fields = [
        'user__username',
        'username_attempted',
        'ip_address',
        'details'
    ]
    
    ordering = ['-timestamp']
    
    readonly_fields = [
        'user',
        'username_attempted',
        'action',
        'ip_address',
        'user_agent',
        'success',
        'details',
        'timestamp'
    ]
    
    fieldsets = (
        ('Authentication Event', {
            'fields': ('timestamp', 'action', 'success')
        }),
        ('User Information', {
            'fields': ('user', 'username_attempted')
        }),
        ('Request Details', {
            'fields': ('ip_address', 'user_agent', 'details')
        }),
    )
    
    def user_display(self, obj):
        """Display user or attempted username."""
        if obj.user:
            return obj.user.username
        return obj.username_attempted or 'Unknown'
    user_display.short_description = 'User'
    
    def action_display(self, obj):
        """Display action with color coding."""
        colors = {
            'login_success': 'green',
            'login_failed': 'red',
            'logout': 'blue',
            'token_refresh': 'gray',
            'account_locked': 'red',
            'account_unlocked': 'green',
            'password_changed': 'orange',
            'role_changed': 'purple',
        }
        
        color = colors.get(obj.action, 'black')
        return format_html(
            '<span style="color: {};">{}</span>',
            color,
            obj.get_action_display()
        )
    action_display.short_description = 'Action'
    
    def success_display(self, obj):
        """Display success status with icons."""
        if obj.success:
            return format_html('<span style="color: green;">✅</span>')
        else:
            return format_html('<span style="color: red;">❌</span>')
    success_display.short_description = 'Success'
    
    def details_short(self, obj):
        """Display shortened details."""
        if len(obj.details) > 50:
            return f"{obj.details[:50]}..."
        return obj.details
    details_short.short_description = 'Details'
    
    def has_add_permission(self, request):
        """Disable adding log entries through admin."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Disable changing log entries through admin."""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Allow deletion for log cleanup."""
        return request.user.is_superuser


# Unregister the original User admin and register our custom one
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
