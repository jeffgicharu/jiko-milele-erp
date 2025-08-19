"""
Inventory API URLs for ingredient and stock management.
"""
from rest_framework.routers import DefaultRouter
from ..viewsets import IngredientViewSet

router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet)

urlpatterns = router.urls