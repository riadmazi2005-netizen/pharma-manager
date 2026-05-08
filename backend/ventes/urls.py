"""
Configuration des URLs pour l'application ventes.

Enregistre VenteViewSet via un DefaultRouter sous le préfixe 'ventes'.
Inclut automatiquement l'action personnalisée /annuler/.
"""

from rest_framework.routers import DefaultRouter

from .views import VenteViewSet

router = DefaultRouter()
router.register(r"ventes", VenteViewSet, basename="vente")

urlpatterns = router.urls
