"""
Django Admin configuration for restaurant models.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Customer, Table, Staff, Supplier, Ingredient


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    """Admin configuration for Customer model."""
    
    list_display = [
        'phone_number', 
        'name', 
        'total_visits', 
        'last_visit_date', 
        'loyalty_points',
        'created_at'
    ]
    
    list_filter = [
        'last_visit_date',
        'total_visits',
        'created_at',
        'loyalty_points'
    ]
    
    search_fields = [
        'phone_number',
        'name',
        'email'
    ]
    
    ordering = ['-last_visit_date']
    
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('phone_number', 'name', 'email')
        }),
        ('Visit History', {
            'fields': ('total_visits', 'last_visit_date', 'loyalty_points')
        }),
        ('Preferences', {
            'fields': ('dietary_preferences', 'notes')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    """Admin configuration for Table model."""
    
    list_display = [
        'table_number',
        'capacity',
        'section',
        'status',
        'is_active'
    ]
    
    list_filter = [
        'status',
        'section',
        'capacity',
        'is_active'
    ]
    
    search_fields = [
        'table_number',
        'section'
    ]
    
    ordering = ['table_number']
    
    list_editable = ['status', 'is_active']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('table_number', 'capacity', 'section', 'is_active')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Floor Plan Coordinates', {
            'fields': ('x_coordinate', 'y_coordinate'),
            'classes': ('collapse',),
            'description': 'Optional coordinates for drag-and-drop floor plan interface'
        }),
    )
    
    def status_badge(self, obj):
        """Display colored status badge."""
        colors = {
            'available': 'green',
            'occupied': 'red',
            'reserved': 'orange',
            'cleaning': 'blue',
            'out_of_order': 'gray'
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    """Admin configuration for Staff model."""
    
    list_display = [
        'employee_number',
        'name',
        'role',
        'phone_number',
        'is_active',
        'hire_date'
    ]
    
    list_filter = [
        'role',
        'is_active',
        'hire_date'
    ]
    
    search_fields = [
        'employee_number',
        'name',
        'phone_number'
    ]
    
    ordering = ['name']
    
    list_editable = ['is_active']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('employee_number', 'name', 'role')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'email')
        }),
        ('Employment Details', {
            'fields': ('hire_date', 'hourly_rate', 'is_active')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact', 'emergency_phone'),
            'classes': ('collapse',)
        }),
        ('System Access', {
            'fields': ('permissions',),
            'classes': ('collapse',),
            'description': 'JSON format for custom permissions'
        }),
    )


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    """Admin configuration for Supplier model."""
    
    list_display = [
        'name',
        'contact_person',
        'phone_number',
        'quality_rating_stars',
        'is_active'
    ]
    
    list_filter = [
        'is_active',
        'quality_rating',
        'payment_terms'
    ]
    
    search_fields = [
        'name',
        'contact_person',
        'phone_number'
    ]
    
    ordering = ['name']
    
    list_editable = ['is_active']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'contact_person', 'is_active')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'email', 'address')
        }),
        ('Business Terms', {
            'fields': ('payment_terms', 'delivery_schedule', 'minimum_order', 'delivery_fee')
        }),
        ('Performance', {
            'fields': ('quality_rating',)
        }),
        ('Notes', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at']
    
    def quality_rating_stars(self, obj):
        """Display quality rating as stars."""
        full_stars = int(obj.quality_rating)
        half_star = obj.quality_rating - full_stars >= 0.5
        stars = '★' * full_stars
        if half_star:
            stars += '☆'
        return format_html(
            '<span title="{} / 5.0">{}</span>',
            obj.quality_rating,
            stars
        )
    quality_rating_stars.short_description = 'Quality'


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    """Admin configuration for Ingredient model."""
    
    list_display = [
        'name',
        'category',
        'current_stock_display',
        'minimum_stock',
        'stock_status_badge',
        'cost_per_unit',
        'supplier',
        'is_perishable'
    ]
    
    list_filter = [
        'category',
        'storage_location',
        'is_perishable',
        'supplier'
    ]
    
    search_fields = [
        'name',
        'category'
    ]
    
    ordering = ['name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'supplier')
        }),
        ('Stock Management', {
            'fields': ('current_stock', 'minimum_stock', 'maximum_stock', 'unit_of_measure')
        }),
        ('Pricing', {
            'fields': ('cost_per_unit',)
        }),
        ('Storage & Handling', {
            'fields': ('storage_location', 'is_perishable', 'shelf_life_days')
        }),
        ('Additional Information', {
            'fields': ('allergen_info', 'reorder_point'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('last_updated',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['last_updated']
    
    def current_stock_display(self, obj):
        """Display current stock with unit of measure."""
        return f"{obj.current_stock} {obj.unit_of_measure}"
    current_stock_display.short_description = 'Current Stock'
    
    def stock_status_badge(self, obj):
        """Display colored stock status badge."""
        status = obj.stock_status
        colors = {
            'out_of_stock': 'red',
            'low_stock': 'orange',
            'normal': 'green',
            'overstocked': 'blue'
        }
        color = colors.get(status, 'black')
        labels = {
            'out_of_stock': 'Out of Stock',
            'low_stock': 'Low Stock',
            'normal': 'Normal',
            'overstocked': 'Overstocked'
        }
        label = labels.get(status, status.title())
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            label
        )
    stock_status_badge.short_description = 'Stock Status'
    
    def get_queryset(self, request):
        """Optimize queries with supplier join."""
        return super().get_queryset(request).select_related('supplier')


# Admin site customization
admin.site.site_header = "Jiko Milele Restaurant ERP"
admin.site.site_title = "Jiko Milele Admin"
admin.site.index_title = "Restaurant Management System"
