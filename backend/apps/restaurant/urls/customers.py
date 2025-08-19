"""
Customers API URLs for customer management and loyalty tracking.
"""
from rest_framework.routers import DefaultRouter
from ..viewsets import CustomerViewSet

router = DefaultRouter()
router.register(r'', CustomerViewSet)

urlpatterns = router.urls