"""
API Version 1 URLs - Main API routing configuration.
"""
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

app_name = 'api_v1'

urlpatterns = [
    # API Documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='api_v1:schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='api_v1:schema'), name='redoc'),
    
    # Authentication endpoints
    path('auth/', include('apps.authentication.urls')),
    
    # System endpoints (health check, etc.)
    path('system/', include('apps.core.urls')),
    
    # Restaurant management endpoints
    path('tables/', include('apps.restaurant.urls.tables')),
    path('staff/', include('apps.restaurant.urls.staff')),
    path('customers/', include('apps.restaurant.urls.customers')),
    path('suppliers/', include('apps.restaurant.urls.suppliers')),
    path('inventory/', include('apps.restaurant.urls.inventory')),
]