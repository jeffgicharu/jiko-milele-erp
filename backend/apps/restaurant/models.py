"""
Restaurant management models.
"""
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .validators import (
    validate_kenyan_phone_number, 
    validate_positive_decimal, 
    validate_quality_rating,
    validate_future_date,
    validate_stock_levels,
    normalize_kenyan_phone_number
)


class Customer(models.Model):
    """
    Store guest information for reservations, loyalty tracking, and personalized service.
    """
    phone_number = models.CharField(
        max_length=20,
        unique=True,
        validators=[validate_kenyan_phone_number],
        help_text=_("Kenyan phone number format: +254XXXXXXXXX")
    )
    name = models.CharField(
        max_length=100,
        blank=True,
        help_text=_("Customer name for personalized service")
    )
    email = models.EmailField(
        blank=True,
        help_text=_("For digital receipts and marketing")
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text=_("Account creation timestamp")
    )
    loyalty_points = models.IntegerField(
        default=0,
        validators=[validate_positive_decimal],
        help_text=_("Points accumulated through visits")
    )
    last_visit_date = models.DateField(
        null=True,
        blank=True,
        help_text=_("Most recent visit tracking")
    )
    total_visits = models.IntegerField(
        default=0,
        validators=[validate_positive_decimal],
        help_text=_("Lifetime visit counter")
    )
    dietary_preferences = models.TextField(
        blank=True,
        help_text=_("Allergies, vegetarian preferences, etc.")
    )
    notes = models.TextField(
        blank=True,
        help_text=_("Staff notes about customer preferences")
    )

    class Meta:
        ordering = ['-last_visit_date']
        db_table = 'customers'
        indexes = [
            models.Index(fields=['phone_number']),
            models.Index(fields=['last_visit_date']),
            models.Index(fields=['loyalty_points']),
        ]

    def __str__(self):
        return f"{self.name or 'Customer'} ({self.phone_number})"

    def clean(self):
        """Custom validation for the Customer model."""
        super().clean()
        
        # Normalize phone number
        if self.phone_number:
            self.phone_number = normalize_kenyan_phone_number(self.phone_number)
        
        # Validate loyalty points are non-negative
        if self.loyalty_points < 0:
            raise ValidationError({
                'loyalty_points': _('Loyalty points must be non-negative.')
            })

    def save(self, *args, **kwargs):
        """Override save to perform validation."""
        self.clean()
        super().save(*args, **kwargs)


class Table(models.Model):
    """
    Define restaurant floor plan, table capacity, and real-time status tracking.
    """
    STATUS_CHOICES = [
        ('available', _('Available')),
        ('occupied', _('Occupied')),
        ('reserved', _('Reserved')),
        ('cleaning', _('Cleaning')),
        ('out_of_order', _('Out of Order')),
    ]

    table_number = models.CharField(
        max_length=10,
        unique=True,
        help_text=_("Display identifier (e.g., 'T1', 'BAR2')")
    )
    capacity = models.PositiveIntegerField(
        help_text=_("Number of seats at table")
    )
    section = models.CharField(
        max_length=50,
        blank=True,
        help_text=_("Area designation (e.g., 'Main Dining', 'Bar Area')")
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available',
        help_text=_("Current table status")
    )
    x_coordinate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_("X coordinate for floor plan interface")
    )
    y_coordinate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_("Y coordinate for floor plan interface")
    )
    is_active = models.BooleanField(
        default=True,
        help_text=_("For temporarily disabling tables")
    )

    class Meta:
        ordering = ['table_number']
        db_table = 'tables'
        indexes = [
            models.Index(fields=['table_number']),
            models.Index(fields=['status']),
            models.Index(fields=['is_active']),
            models.Index(fields=['section']),
        ]

    def __str__(self):
        return f"Table {self.table_number} ({self.capacity} seats)"

    def clean(self):
        """Custom validation for the Table model."""
        super().clean()
        
        # Validate capacity is reasonable (1-12 typical range)
        if self.capacity and (self.capacity < 1 or self.capacity > 12):
            raise ValidationError({
                'capacity': _('Table capacity should be between 1 and 12 seats.')
            })


class Staff(models.Model):
    """
    Employee management, role assignment, and authentication foundation.
    """
    ROLE_CHOICES = [
        ('general_manager', _('General Manager')),
        ('shift_supervisor', _('Shift Supervisor')),
        ('head_chef', _('Head Chef')),
        ('sous_chef', _('Sous Chef')),
        ('line_cook', _('Line Cook')),
        ('server', _('Server')),
        ('host', _('Host')),
        ('bartender', _('Bartender')),
        ('busser', _('Busser')),
    ]

    employee_number = models.CharField(
        max_length=20,
        unique=True,
        help_text=_("Unique staff identifier")
    )
    name = models.CharField(
        max_length=100,
        help_text=_("Full employee name")
    )
    role = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        help_text=_("Job position")
    )
    phone_number = models.CharField(
        max_length=20,
        validators=[validate_kenyan_phone_number],
        help_text=_("Contact information")
    )
    email = models.EmailField(
        blank=True,
        help_text=_("Optional email contact")
    )
    hire_date = models.DateField(
        validators=[validate_future_date],
        help_text=_("Employment start date")
    )
    hourly_rate = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[validate_positive_decimal],
        help_text=_("Hourly wage rate")
    )
    is_active = models.BooleanField(
        default=True,
        help_text=_("Current employment status")
    )
    permissions = models.TextField(
        blank=True,
        help_text=_("JSON storage for custom permissions")
    )
    emergency_contact = models.CharField(
        max_length=100,
        blank=True,
        help_text=_("Emergency contact name")
    )
    emergency_phone = models.CharField(
        max_length=20,
        blank=True,
        validators=[validate_kenyan_phone_number],
        help_text=_("Emergency contact number")
    )

    class Meta:
        ordering = ['name']
        db_table = 'staff'
        verbose_name_plural = 'Staff'
        indexes = [
            models.Index(fields=['employee_number']),
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
            models.Index(fields=['hire_date']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"

    def clean(self):
        """Custom validation for the Staff model."""
        super().clean()
        
        # Normalize phone numbers
        if self.phone_number:
            self.phone_number = normalize_kenyan_phone_number(self.phone_number)
        
        if self.emergency_phone:
            self.emergency_phone = normalize_kenyan_phone_number(self.emergency_phone)


class Supplier(models.Model):
    """
    Vendor relationship management for inventory procurement.
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text=_("Supplier business name")
    )
    contact_person = models.CharField(
        max_length=100,
        blank=True,
        help_text=_("Primary contact name")
    )
    phone_number = models.CharField(
        max_length=20,
        validators=[validate_kenyan_phone_number],
        help_text=_("Primary contact number")
    )
    email = models.EmailField(
        blank=True,
        help_text=_("Email contact")
    )
    address = models.TextField(
        blank=True,
        help_text=_("Physical address")
    )
    payment_terms = models.CharField(
        max_length=50,
        blank=True,
        help_text=_("e.g., 'Net 30', 'Cash on Delivery'")
    )
    delivery_schedule = models.CharField(
        max_length=100,
        blank=True,
        help_text=_("e.g., 'Monday/Wednesday/Friday'")
    )
    minimum_order = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[validate_positive_decimal],
        help_text=_("Minimum order amount")
    )
    delivery_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[validate_positive_decimal],
        help_text=_("Delivery fee amount")
    )
    quality_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=5.0,
        validators=[validate_quality_rating],
        help_text=_("Quality rating from 1.0 to 5.0")
    )
    is_active = models.BooleanField(
        default=True,
        help_text=_("Current vendor status")
    )
    notes = models.TextField(
        blank=True,
        help_text=_("Additional supplier information")
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['name']
        db_table = 'suppliers'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
            models.Index(fields=['quality_rating']),
        ]

    def __str__(self):
        return self.name

    def clean(self):
        """Custom validation for the Supplier model."""
        super().clean()
        
        # Normalize phone number
        if self.phone_number:
            self.phone_number = normalize_kenyan_phone_number(self.phone_number)


class Ingredient(models.Model):
    """
    Inventory tracking for all food and beverage items.
    """
    CATEGORY_CHOICES = [
        ('protein', _('Protein')),
        ('vegetables', _('Vegetables')),
        ('grains', _('Grains')),
        ('dairy', _('Dairy')),
        ('spices', _('Spices')),
        ('beverages', _('Beverages')),
        ('dry_goods', _('Dry Goods')),
    ]

    UOM_CHOICES = [
        ('kg', _('Kilograms')),
        ('grams', _('Grams')),
        ('liters', _('Liters')),
        ('ml', _('Milliliters')),
        ('pieces', _('Pieces')),
        ('cases', _('Cases')),
    ]

    STORAGE_CHOICES = [
        ('dry_storage', _('Dry Storage')),
        ('walk_in_cooler', _('Walk-in Cooler')),
        ('freezer', _('Freezer')),
        ('bar', _('Bar')),
        ('prep_area', _('Prep Area')),
    ]

    name = models.CharField(
        max_length=100,
        help_text=_("Ingredient name")
    )
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        help_text=_("Ingredient category")
    )
    unit_of_measure = models.CharField(
        max_length=20,
        choices=UOM_CHOICES,
        help_text=_("Unit of measurement")
    )
    current_stock = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        default=0,
        validators=[validate_positive_decimal],
        help_text=_("Current stock level")
    )
    minimum_stock = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        validators=[validate_positive_decimal],
        help_text=_("Reorder point")
    )
    maximum_stock = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        null=True,
        blank=True,
        validators=[validate_positive_decimal],
        help_text=_("Maximum stock level")
    )
    cost_per_unit = models.DecimalField(
        max_digits=8,
        decimal_places=4,
        validators=[validate_positive_decimal],
        help_text=_("Cost per unit")
    )
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE,
        help_text=_("Primary supplier")
    )
    storage_location = models.CharField(
        max_length=50,
        choices=STORAGE_CHOICES,
        help_text=_("Storage location")
    )
    shelf_life_days = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text=_("Shelf life in days for perishables")
    )
    reorder_point = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        null=True,
        blank=True,
        validators=[validate_positive_decimal],
        help_text=_("Automatic reorder point")
    )
    is_perishable = models.BooleanField(
        default=False,
        help_text=_("Whether item is perishable")
    )
    allergen_info = models.TextField(
        blank=True,
        help_text=_("Allergen warnings")
    )
    last_updated = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ['name']
        db_table = 'ingredients'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category']),
            models.Index(fields=['current_stock']),
            models.Index(fields=['minimum_stock']),
            models.Index(fields=['supplier']),
            models.Index(fields=['is_perishable']),
        ]

    def __str__(self):
        return f"{self.name} ({self.current_stock} {self.unit_of_measure})"

    def clean(self):
        """Custom validation for the Ingredient model."""
        super().clean()
        
        # Validate stock levels using custom validator
        stock_errors = validate_stock_levels(
            minimum_stock=self.minimum_stock,
            maximum_stock=self.maximum_stock,
            current_stock=self.current_stock
        )
        
        if stock_errors:
            raise ValidationError(stock_errors)
        
        # Validate that perishable items have shelf life
        if self.is_perishable and not self.shelf_life_days:
            raise ValidationError({
                'shelf_life_days': _('Perishable items must have a shelf life specified.')
            })

    @property
    def is_low_stock(self):
        """Check if current stock is below minimum stock level."""
        return self.current_stock < self.minimum_stock

    @property
    def stock_status(self):
        """Return stock status as string."""
        if self.current_stock <= 0:
            return 'out_of_stock'
        elif self.is_low_stock:
            return 'low_stock'
        elif self.maximum_stock and self.current_stock >= self.maximum_stock:
            return 'overstocked'
        else:
            return 'normal'
