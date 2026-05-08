"""
Views pour l'application categories.

Expose un ViewSet CRUD complet pour le modèle Categorie.
"""

from rest_framework import viewsets

from .models import Categorie
from .serializers import CategorieSerializer


class CategorieViewSet(viewsets.ModelViewSet):
    """
    ViewSet CRUD complet pour le modèle Categorie.

    Endpoints générés automatiquement par le router :
      GET    /api/v1/categories/         → liste toutes les catégories
      POST   /api/v1/categories/         → crée une nouvelle catégorie
      GET    /api/v1/categories/{id}/    → détail d'une catégorie
      PUT    /api/v1/categories/{id}/    → mise à jour complète
      PATCH  /api/v1/categories/{id}/    → mise à jour partielle
      DELETE /api/v1/categories/{id}/    → supprime une catégorie
    """

    queryset = Categorie.objects.all().order_by("nom")
    serializer_class = CategorieSerializer
    permission_classes = []
