"""
URL Configuration for jiko_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # API Version 1
    path('api/v1/', include('jiko_backend.api_urls')),
    # Legacy endpoints for backward compatibility
    path('api/auth/', include('apps.authentication.urls')),
    path('api/', include('apps.core.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
