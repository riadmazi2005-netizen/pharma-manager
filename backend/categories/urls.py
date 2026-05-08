"""
Configuration des URLs pour l'application categories.

Enregistre CategorieViewSet via un DefaultRouter sous le préfixe 'categories'.
"""

from rest_framework.routers import DefaultRouter

from .views import CategorieViewSet

router = DefaultRouter()
router.register(r"categories", CategorieViewSet, basename="categorie")

urlpatterns = router.urls
