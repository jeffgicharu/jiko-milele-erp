"""
Restaurant API ViewSets with comprehensive CRUD operations and role-based permissions.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, extend_schema_view
from django.db.models import Q

from .models import Customer, Table, Staff, Supplier, Ingredient
from .serializers import (
    CustomerSerializer, CustomerListSerializer,
    TableSerializer, TableStatusSerializer,
    StaffSerializer, StaffListSerializer,
    SupplierSerializer, SupplierListSerializer,
    IngredientSerializer, IngredientListSerializer, IngredientStockUpdateSerializer
)
from .filters import CustomerFilter, TableFilter, StaffFilter, SupplierFilter, IngredientFilter
from .permissions import (
    IsManagerOrReadOnly, IsManagerOnly, IsFOHStaffOrManager,
    CanModifyTableStatus, CanAccessCustomerData, IsStaffMemberOrManager,
    CanManageInventory, CanUpdateStock
)


@extend_schema_view(
    list=extend_schema(
        summary="List all customers",
        description="Retrieve a paginated list of restaurant customers with filtering and search capabilities.",
        tags=["Customers"]
    ),
    create=extend_schema(
        summary="Create new customer",
        description="Create a new customer record with phone number and optional details.",
        tags=["Customers"]
    ),
    retrieve=extend_schema(
        summary="Get customer details",
        description="Retrieve detailed information about a specific customer including visit history.",
        tags=["Customers"]
    ),
    update=extend_schema(
        summary="Update customer information",
        description="Update customer details and preferences.",
        tags=["Customers"]
    ),
    partial_update=extend_schema(
        summary="Partially update customer",
        description="Update specific fields of a customer record.",
        tags=["Customers"]
    ),
    destroy=extend_schema(
        summary="Delete customer",
        description="Remove a customer record from the system (Manager only).",
        tags=["Customers"]
    ),
)
class CustomerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing restaurant customers with search and filtering.
    
    Provides CRUD operations for customer management including:
    - Customer registration and profile management
    - Search by phone number and name
    - Visit tracking and loyalty points
    - Dietary preferences and notes
    """
    queryset = Customer.objects.all()
    permission_classes = [CanAccessCustomerData]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CustomerFilter
    search_fields = ['name', 'phone_number', 'email']
    ordering_fields = ['name', 'total_visits', 'loyalty_points', 'last_visit_date', 'created_at']
    ordering = ['-last_visit_date']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return CustomerListSerializer
        return CustomerSerializer
    
    @extend_schema(
        summary="Search customers",
        description="Search customers by phone number or name.",
        tags=["Customers"]
    )
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search customers by phone number or name."""
        phone = request.query_params.get('phone', '')
        name = request.query_params.get('name', '')
        
        queryset = self.get_queryset()
        
        if phone:
            queryset = queryset.filter(phone_number__icontains=phone)
        
        if name:
            queryset = queryset.filter(name__icontains=name)
        
        serializer = CustomerListSerializer(queryset[:10], many=True)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(
        summary="List all tables",
        description="Retrieve a list of restaurant tables with current status and capacity information.",
        tags=["Tables"]
    ),
    create=extend_schema(
        summary="Create new table",
        description="Add a new table to the restaurant floor plan (Manager only).",
        tags=["Tables"]
    ),
    retrieve=extend_schema(
        summary="Get table details",
        description="Retrieve detailed information about a specific table.",
        tags=["Tables"]
    ),
    update=extend_schema(
        summary="Update table information",
        description="Update table details including capacity and coordinates (Manager only).",
        tags=["Tables"]
    ),
    partial_update=extend_schema(
        summary="Partially update table",
        description="Update specific table fields.",
        tags=["Tables"]
    ),
    destroy=extend_schema(
        summary="Delete table",
        description="Remove a table from the system (Manager only).",
        tags=["Tables"]
    ),
)
class TableViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing restaurant tables and their status.
    
    Provides operations for:
    - Table layout management
    - Real-time status tracking
    - Capacity and section organization
    - Floor plan coordinates
    """
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [CanModifyTableStatus]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TableFilter
    search_fields = ['table_number', 'section']
    ordering_fields = ['table_number', 'capacity', 'section', 'status']
    ordering = ['table_number']
    
    @extend_schema(
        summary="Update table status",
        description="Update the status of a specific table (available, occupied, cleaning, etc.).",
        tags=["Tables"]
    )
    @action(detail=True, methods=['patch'], serializer_class=TableStatusSerializer)
    def status(self, request, pk=None):
        """Update table status."""
        table = self.get_object()
        serializer = TableStatusSerializer(table, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(TableSerializer(table).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        summary="Get available tables",
        description="Retrieve all currently available tables.",
        tags=["Tables"]
    )
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available tables."""
        available_tables = self.get_queryset().filter(
            status='available', 
            is_active=True
        ).order_by('table_number')
        
        serializer = self.get_serializer(available_tables, many=True)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(
        summary="List staff members",
        description="Retrieve a list of restaurant staff members with role and contact information.",
        tags=["Staff"]
    ),
    create=extend_schema(
        summary="Create staff member",
        description="Add a new staff member to the restaurant (Manager only).",
        tags=["Staff"]
    ),
    retrieve=extend_schema(
        summary="Get staff details",
        description="Retrieve detailed information about a specific staff member.",
        tags=["Staff"]
    ),
    update=extend_schema(
        summary="Update staff information",
        description="Update staff member details and role assignments.",
        tags=["Staff"]
    ),
    partial_update=extend_schema(
        summary="Partially update staff member",
        description="Update specific staff member fields.",
        tags=["Staff"]
    ),
    destroy=extend_schema(
        summary="Delete staff member",
        description="Remove a staff member from the system (Manager only).",
        tags=["Staff"]
    ),
)
class StaffViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing restaurant staff members and roles.
    
    Provides operations for:
    - Staff member management
    - Role assignments and permissions
    - Contact information and emergency contacts
    - Employment status and payroll info
    """
    queryset = Staff.objects.all()
    permission_classes = [IsStaffMemberOrManager]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = StaffFilter
    search_fields = ['name', 'employee_number', 'phone_number', 'email']
    ordering_fields = ['name', 'role', 'hire_date', 'employee_number']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return StaffListSerializer
        return StaffSerializer
    
    def get_permissions(self):
        """Apply different permissions based on action."""
        if self.action in ['create', 'destroy']:
            permission_classes = [IsManagerOnly]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [IsStaffMemberOrManager]
        else:
            permission_classes = [IsStaffMemberOrManager]
        
        return [permission() for permission in permission_classes]
    
    @extend_schema(
        summary="Get active staff",
        description="Retrieve all currently active staff members.",
        tags=["Staff"]
    )
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active staff members."""
        active_staff = self.get_queryset().filter(is_active=True).order_by('name')
        serializer = StaffListSerializer(active_staff, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Get staff by role",
        description="Retrieve staff members filtered by their role.",
        tags=["Staff"]
    )
    @action(detail=False, methods=['get'])
    def by_role(self, request):
        """Get staff members by role."""
        role = request.query_params.get('role', '')
        
        if not role:
            return Response(
                {'error': 'Role parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        staff_by_role = self.get_queryset().filter(
            role=role, 
            is_active=True
        ).order_by('name')
        
        serializer = StaffListSerializer(staff_by_role, many=True)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(
        summary="List suppliers",
        description="Retrieve a list of restaurant suppliers with contact and performance information.",
        tags=["Suppliers"]
    ),
    create=extend_schema(
        summary="Create supplier",
        description="Add a new supplier for restaurant procurement (Kitchen staff or Manager only).",
        tags=["Suppliers"]
    ),
    retrieve=extend_schema(
        summary="Get supplier details",
        description="Retrieve detailed information about a specific supplier.",
        tags=["Suppliers"]
    ),
    update=extend_schema(
        summary="Update supplier information",
        description="Update supplier details and performance ratings.",
        tags=["Suppliers"]
    ),
    partial_update=extend_schema(
        summary="Partially update supplier",
        description="Update specific supplier fields.",
        tags=["Suppliers"]
    ),
    destroy=extend_schema(
        summary="Delete supplier",
        description="Remove a supplier from the system (Manager only).",
        tags=["Suppliers"]
    ),
)
class SupplierViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing restaurant suppliers and vendor relationships.
    
    Provides operations for:
    - Supplier contact management
    - Quality ratings and performance tracking
    - Payment terms and delivery schedules
    - Procurement relationship management
    """
    queryset = Supplier.objects.all()
    permission_classes = [IsManagerOrReadOnly]  # Kitchen staff can view, managers can modify
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = SupplierFilter
    search_fields = ['name', 'contact_person', 'phone_number', 'email']
    ordering_fields = ['name', 'quality_rating', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return SupplierListSerializer
        return SupplierSerializer
    
    @extend_schema(
        summary="Get active suppliers",
        description="Retrieve all currently active suppliers.",
        tags=["Suppliers"]
    )
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active suppliers."""
        active_suppliers = self.get_queryset().filter(is_active=True).order_by('name')
        serializer = SupplierListSerializer(active_suppliers, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Get top rated suppliers",
        description="Retrieve suppliers with high quality ratings (4.0+).",
        tags=["Suppliers"]
    )
    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Get suppliers with quality rating >= 4.0."""
        top_suppliers = self.get_queryset().filter(
            is_active=True,
            quality_rating__gte=4.0
        ).order_by('-quality_rating')
        
        serializer = SupplierListSerializer(top_suppliers, many=True)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(
        summary="List ingredients",
        description="Retrieve a list of inventory ingredients with stock levels and supplier information.",
        tags=["Inventory"]
    ),
    create=extend_schema(
        summary="Create ingredient",
        description="Add a new ingredient to inventory (Kitchen staff only).",
        tags=["Inventory"]
    ),
    retrieve=extend_schema(
        summary="Get ingredient details",
        description="Retrieve detailed information about a specific ingredient including stock history.",
        tags=["Inventory"]
    ),
    update=extend_schema(
        summary="Update ingredient information",
        description="Update ingredient details and supplier assignments.",
        tags=["Inventory"]
    ),
    partial_update=extend_schema(
        summary="Partially update ingredient",
        description="Update specific ingredient fields.",
        tags=["Inventory"]
    ),
    destroy=extend_schema(
        summary="Delete ingredient",
        description="Remove an ingredient from inventory (Manager only).",
        tags=["Inventory"]
    ),
)
class IngredientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing restaurant inventory ingredients and stock levels.
    
    Provides operations for:
    - Ingredient catalog management
    - Stock level tracking and updates
    - Supplier relationship management
    - Cost analysis and tracking
    - Perishable item management
    """
    queryset = Ingredient.objects.select_related('supplier').all()
    permission_classes = [CanManageInventory]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = IngredientFilter
    search_fields = ['name', 'supplier__name', 'category']
    ordering_fields = ['name', 'current_stock', 'minimum_stock', 'cost_per_unit', 'last_updated']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return IngredientListSerializer
        elif self.action == 'update_stock':
            return IngredientStockUpdateSerializer
        return IngredientSerializer
    
    @extend_schema(
        summary="Update ingredient stock",
        description="Update the current stock level of a specific ingredient.",
        tags=["Inventory"]
    )
    @action(detail=True, methods=['patch'], 
            permission_classes=[CanUpdateStock],
            serializer_class=IngredientStockUpdateSerializer)
    def update_stock(self, request, pk=None):
        """Update ingredient stock level."""
        ingredient = self.get_object()
        serializer = IngredientStockUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            ingredient.current_stock = serializer.validated_data['current_stock']
            ingredient.save()
            
            return Response(IngredientSerializer(ingredient).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        summary="Get low stock ingredients",
        description="Retrieve ingredients with stock levels below minimum threshold.",
        tags=["Inventory"]
    )
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get ingredients with stock below minimum level."""
        from django.db.models import F
        low_stock_ingredients = self.get_queryset().filter(
            current_stock__lt=F('minimum_stock')
        ).order_by('current_stock')
        
        serializer = IngredientListSerializer(low_stock_ingredients, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Get out of stock ingredients",
        description="Retrieve ingredients that are completely out of stock.",
        tags=["Inventory"]
    )
    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        """Get ingredients that are out of stock."""
        out_of_stock_ingredients = self.get_queryset().filter(
            current_stock=0
        ).order_by('name')
        
        serializer = IngredientListSerializer(out_of_stock_ingredients, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Get perishable ingredients",
        description="Retrieve all perishable ingredients that require careful stock management.",
        tags=["Inventory"]
    )
    @action(detail=False, methods=['get'])
    def perishable(self, request):
        """Get all perishable ingredients."""
        perishable_ingredients = self.get_queryset().filter(
            is_perishable=True
        ).order_by('shelf_life_days', 'current_stock')
        
        serializer = IngredientListSerializer(perishable_ingredients, many=True)
        return Response(serializer.data)