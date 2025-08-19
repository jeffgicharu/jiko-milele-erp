"""
Django filters for restaurant API endpoints.
"""
import django_filters
from django.db.models import Q, F
from .models import Customer, Table, Staff, Supplier, Ingredient


class CustomerFilter(django_filters.FilterSet):
    """Filter set for Customer API."""
    
    phone = django_filters.CharFilter(field_name='phone_number', lookup_expr='icontains')
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    min_visits = django_filters.NumberFilter(field_name='total_visits', lookup_expr='gte')
    max_visits = django_filters.NumberFilter(field_name='total_visits', lookup_expr='lte')
    min_loyalty_points = django_filters.NumberFilter(field_name='loyalty_points', lookup_expr='gte')
    has_email = django_filters.BooleanFilter(method='filter_has_email')
    visited_after = django_filters.DateFilter(field_name='last_visit_date', lookup_expr='gte')
    visited_before = django_filters.DateFilter(field_name='last_visit_date', lookup_expr='lte')
    
    class Meta:
        model = Customer
        fields = {
            'phone_number': ['exact', 'icontains'],
            'name': ['exact', 'icontains'],
            'total_visits': ['exact', 'gte', 'lte'],
            'loyalty_points': ['exact', 'gte', 'lte'],
        }
    
    def filter_has_email(self, queryset, name, value):
        """Filter customers who have or don't have email addresses."""
        if value:
            return queryset.exclude(email__exact='')
        else:
            return queryset.filter(email__exact='')


class TableFilter(django_filters.FilterSet):
    """Filter set for Table API."""
    
    status = django_filters.ChoiceFilter(choices=Table.STATUS_CHOICES)
    section = django_filters.CharFilter(lookup_expr='icontains')
    capacity_min = django_filters.NumberFilter(field_name='capacity', lookup_expr='gte')
    capacity_max = django_filters.NumberFilter(field_name='capacity', lookup_expr='lte')
    available = django_filters.BooleanFilter(method='filter_available')
    
    class Meta:
        model = Table
        fields = {
            'table_number': ['exact', 'icontains'],
            'capacity': ['exact', 'gte', 'lte'],
            'section': ['exact', 'icontains'],
            'status': ['exact'],
            'is_active': ['exact'],
        }
    
    def filter_available(self, queryset, name, value):
        """Filter tables that are available or not available."""
        if value:
            return queryset.filter(status='available', is_active=True)
        else:
            return queryset.exclude(status='available').filter(is_active=True)


class StaffFilter(django_filters.FilterSet):
    """Filter set for Staff API."""
    
    role = django_filters.ChoiceFilter(choices=Staff.ROLE_CHOICES)
    name = django_filters.CharFilter(lookup_expr='icontains')
    phone = django_filters.CharFilter(field_name='phone_number', lookup_expr='icontains')
    hired_after = django_filters.DateFilter(field_name='hire_date', lookup_expr='gte')
    hired_before = django_filters.DateFilter(field_name='hire_date', lookup_expr='lte')
    kitchen_staff = django_filters.BooleanFilter(method='filter_kitchen_staff')
    foh_staff = django_filters.BooleanFilter(method='filter_foh_staff')
    
    class Meta:
        model = Staff
        fields = {
            'employee_number': ['exact', 'icontains'],
            'name': ['exact', 'icontains'],
            'role': ['exact'],
            'is_active': ['exact'],
            'hire_date': ['exact', 'gte', 'lte'],
        }
    
    def filter_kitchen_staff(self, queryset, name, value):
        """Filter kitchen staff roles."""
        kitchen_roles = ['head_chef', 'sous_chef', 'line_cook']
        if value:
            return queryset.filter(role__in=kitchen_roles)
        else:
            return queryset.exclude(role__in=kitchen_roles)
    
    def filter_foh_staff(self, queryset, name, value):
        """Filter front-of-house staff roles."""
        foh_roles = ['server', 'host', 'bartender', 'busser']
        if value:
            return queryset.filter(role__in=foh_roles)
        else:
            return queryset.exclude(role__in=foh_roles)


class SupplierFilter(django_filters.FilterSet):
    """Filter set for Supplier API."""
    
    name = django_filters.CharFilter(lookup_expr='icontains')
    contact_person = django_filters.CharFilter(lookup_expr='icontains')
    phone = django_filters.CharFilter(field_name='phone_number', lookup_expr='icontains')
    min_rating = django_filters.NumberFilter(field_name='quality_rating', lookup_expr='gte')
    max_rating = django_filters.NumberFilter(field_name='quality_rating', lookup_expr='lte')
    payment_terms = django_filters.CharFilter(lookup_expr='icontains')
    delivery_day = django_filters.CharFilter(method='filter_delivery_day')
    
    class Meta:
        model = Supplier
        fields = {
            'name': ['exact', 'icontains'],
            'contact_person': ['exact', 'icontains'],
            'is_active': ['exact'],
            'quality_rating': ['exact', 'gte', 'lte'],
            'payment_terms': ['exact', 'icontains'],
        }
    
    def filter_delivery_day(self, queryset, name, value):
        """Filter suppliers by delivery day."""
        return queryset.filter(delivery_schedule__icontains=value)


class IngredientFilter(django_filters.FilterSet):
    """Filter set for Ingredient API."""
    
    name = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.ChoiceFilter(choices=Ingredient.CATEGORY_CHOICES)
    storage_location = django_filters.ChoiceFilter(choices=Ingredient.STORAGE_CHOICES)
    supplier = django_filters.ModelChoiceFilter(queryset=Supplier.objects.filter(is_active=True))
    supplier_name = django_filters.CharFilter(field_name='supplier__name', lookup_expr='icontains')
    low_stock = django_filters.BooleanFilter(method='filter_low_stock')
    out_of_stock = django_filters.BooleanFilter(method='filter_out_of_stock')
    perishable = django_filters.BooleanFilter(field_name='is_perishable')
    min_stock = django_filters.NumberFilter(field_name='current_stock', lookup_expr='gte')
    max_stock = django_filters.NumberFilter(field_name='current_stock', lookup_expr='lte')
    allergens = django_filters.CharFilter(field_name='allergen_info', lookup_expr='icontains')
    
    class Meta:
        model = Ingredient
        fields = {
            'name': ['exact', 'icontains'],
            'category': ['exact'],
            'unit_of_measure': ['exact'],
            'storage_location': ['exact'],
            'is_perishable': ['exact'],
            'current_stock': ['exact', 'gte', 'lte'],
        }
    
    def filter_low_stock(self, queryset, name, value):
        """Filter ingredients with stock below minimum level."""
        if value:
            return queryset.filter(current_stock__lt=F('minimum_stock'))
        else:
            return queryset.filter(current_stock__gte=F('minimum_stock'))
    
    def filter_out_of_stock(self, queryset, name, value):
        """Filter ingredients that are completely out of stock."""
        if value:
            return queryset.filter(current_stock=0)
        else:
            return queryset.exclude(current_stock=0)