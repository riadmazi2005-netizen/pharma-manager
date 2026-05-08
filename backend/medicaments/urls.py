"""
Configuration des URLs pour l'application medicaments.

Enregistre MedicamentViewSet via un DefaultRouter sous le préfixe 'medicaments'.
Inclut automatiquement l'action personnalisée /alertes/.
"""

from rest_framework.routers import DefaultRouter

from .views import MedicamentViewSet

router = DefaultRouter()
router.register(r"medicaments", MedicamentViewSet, basename="medicament")

urlpatterns = router.urls
