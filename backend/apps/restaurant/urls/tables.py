"""
Tables API URLs for restaurant table management.
"""
from rest_framework.routers import DefaultRouter
from ..viewsets import TableViewSet

router = DefaultRouter()
router.register(r'', TableViewSet)

urlpatterns = router.urls