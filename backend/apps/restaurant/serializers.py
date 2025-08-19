"""
Restaurant API serializers for tables, staff, customers, suppliers, and inventory.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, Table, Staff, Supplier, Ingredient


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for Customer model with validation and display formatting."""
    
    class Meta:
        model = Customer
        fields = [
            'id', 'phone_number', 'name', 'email', 'created_at', 
            'loyalty_points', 'last_visit_date', 'total_visits', 
            'dietary_preferences', 'notes'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_phone_number(self, value):
        """Validate phone number format."""
        if not value.startswith('+254') or len(value) != 13:
            raise serializers.ValidationError(
                "Phone number must be in format +254XXXXXXXXX"
            )
        return value


class CustomerListSerializer(serializers.ModelSerializer):
    """Simplified serializer for customer list views."""
    
    class Meta:
        model = Customer
        fields = [
            'id', 'phone_number', 'name', 'total_visits', 
            'loyalty_points', 'last_visit_date'
        ]


class TableSerializer(serializers.ModelSerializer):
    """Serializer for Table model with status and capacity validation."""
    
    class Meta:
        model = Table
        fields = [
            'id', 'table_number', 'capacity', 'section', 'status',
            'x_coordinate', 'y_coordinate', 'is_active'
        ]
        read_only_fields = ['id']
    
    def validate_capacity(self, value):
        """Validate table capacity is reasonable."""
        if value < 1 or value > 12:
            raise serializers.ValidationError(
                "Table capacity must be between 1 and 12 seats"
            )
        return value


class TableStatusSerializer(serializers.ModelSerializer):
    """Serializer for updating table status only."""
    
    class Meta:
        model = Table
        fields = ['status']
    
    def validate_status(self, value):
        """Validate status is one of the allowed choices."""
        valid_statuses = [choice[0] for choice in Table.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Status must be one of: {', '.join(valid_statuses)}"
            )
        return value


class StaffSerializer(serializers.ModelSerializer):
    """Serializer for Staff model with role and contact validation."""
    
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = Staff
        fields = [
            'id', 'employee_number', 'name', 'role', 'role_display',
            'phone_number', 'email', 'hire_date', 'hourly_rate',
            'is_active', 'emergency_contact', 'emergency_phone'
        ]
        read_only_fields = ['id']
    
    def validate_phone_number(self, value):
        """Validate phone number format."""
        if not value.startswith('+254') or len(value) != 13:
            raise serializers.ValidationError(
                "Phone number must be in format +254XXXXXXXXX"
            )
        return value
    
    def validate_emergency_phone(self, value):
        """Validate emergency phone number format if provided."""
        if value and (not value.startswith('+254') or len(value) != 13):
            raise serializers.ValidationError(
                "Emergency phone number must be in format +254XXXXXXXXX"
            )
        return value


class StaffListSerializer(serializers.ModelSerializer):
    """Simplified serializer for staff list views."""
    
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = Staff
        fields = [
            'id', 'employee_number', 'name', 'role', 'role_display',
            'phone_number', 'is_active', 'hire_date'
        ]


class SupplierSerializer(serializers.ModelSerializer):
    """Serializer for Supplier model with quality rating validation."""
    
    class Meta:
        model = Supplier
        fields = [
            'id', 'name', 'contact_person', 'phone_number', 'email',
            'address', 'payment_terms', 'delivery_schedule',
            'minimum_order', 'delivery_fee', 'quality_rating',
            'is_active', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_phone_number(self, value):
        """Validate phone number format."""
        if not value.startswith('+254') or len(value) != 13:
            raise serializers.ValidationError(
                "Phone number must be in format +254XXXXXXXXX"
            )
        return value
    
    def validate_quality_rating(self, value):
        """Validate quality rating is between 1.0 and 5.0."""
        if value < 1.0 or value > 5.0:
            raise serializers.ValidationError(
                "Quality rating must be between 1.0 and 5.0"
            )
        return value


class SupplierListSerializer(serializers.ModelSerializer):
    """Simplified serializer for supplier list views."""
    
    class Meta:
        model = Supplier
        fields = [
            'id', 'name', 'contact_person', 'phone_number',
            'quality_rating', 'is_active', 'delivery_schedule'
        ]


class IngredientSerializer(serializers.ModelSerializer):
    """Serializer for Ingredient model with stock validation."""
    
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    unit_display = serializers.CharField(source='get_unit_of_measure_display', read_only=True)
    storage_display = serializers.CharField(source='get_storage_location_display', read_only=True)
    stock_status = serializers.CharField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Ingredient
        fields = [
            'id', 'name', 'category', 'category_display',
            'unit_of_measure', 'unit_display', 'current_stock',
            'minimum_stock', 'maximum_stock', 'cost_per_unit',
            'supplier', 'supplier_name', 'storage_location',
            'storage_display', 'shelf_life_days', 'is_perishable',
            'allergen_info', 'last_updated', 'stock_status', 'is_low_stock'
        ]
        read_only_fields = ['id', 'last_updated', 'stock_status', 'is_low_stock']
    
    def validate(self, data):
        """Cross-field validation for stock levels."""
        current_stock = data.get('current_stock', 0)
        minimum_stock = data.get('minimum_stock', 0)
        maximum_stock = data.get('maximum_stock')
        
        if current_stock < 0:
            raise serializers.ValidationError({
                'current_stock': 'Current stock cannot be negative'
            })
        
        if minimum_stock <= 0:
            raise serializers.ValidationError({
                'minimum_stock': 'Minimum stock must be positive'
            })
        
        if maximum_stock and maximum_stock <= minimum_stock:
            raise serializers.ValidationError({
                'maximum_stock': 'Maximum stock must be greater than minimum stock'
            })
        
        return data


class IngredientListSerializer(serializers.ModelSerializer):
    """Simplified serializer for ingredient list views."""
    
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    unit_display = serializers.CharField(source='get_unit_of_measure_display', read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Ingredient
        fields = [
            'id', 'name', 'category', 'category_display',
            'current_stock', 'minimum_stock', 'unit_of_measure',
            'unit_display', 'cost_per_unit', 'supplier_name',
            'is_perishable', 'is_low_stock'
        ]


class IngredientStockUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating ingredient stock levels."""
    
    reason = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Ingredient
        fields = ['current_stock', 'reason']
    
    def validate_current_stock(self, value):
        """Validate stock level is non-negative."""
        if value < 0:
            raise serializers.ValidationError(
                "Stock level cannot be negative"
            )
        return value