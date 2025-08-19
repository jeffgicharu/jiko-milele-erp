"""
Staff API URLs for staff member management and role assignments.
"""
from rest_framework.routers import DefaultRouter
from ..viewsets import StaffViewSet

router = DefaultRouter()
router.register(r'', StaffViewSet)

urlpatterns = router.urls