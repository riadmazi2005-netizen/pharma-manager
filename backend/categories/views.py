"""
Views pour l'application categories.

Expose un ViewSet CRUD complet pour le modèle Categorie.
"""

from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import Categorie
from .serializers import CategorieSerializer


@extend_schema(tags=["Catégories"])
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

    @extend_schema(
        summary="Lister les catégories",
        description="Retourne la liste de toutes les catégories, triées par nom.",
        responses={200: CategorieSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Créer une catégorie",
        description="Crée une nouvelle catégorie de médicaments.",
        responses={201: CategorieSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary="Détail d'une catégorie",
        description="Retourne le détail d'une catégorie identifiée par son `id`.",
        responses={200: CategorieSerializer, 404: OpenApiResponse(description="Catégorie introuvable")},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Mettre à jour une catégorie (complète)",
        description="Remplace entièrement une catégorie existante.",
        responses={200: CategorieSerializer, 404: OpenApiResponse(description="Catégorie introuvable")},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Mettre à jour une catégorie (partielle)",
        description="Met à jour un ou plusieurs champs d'une catégorie existante.",
        responses={200: CategorieSerializer, 404: OpenApiResponse(description="Catégorie introuvable")},
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Supprimer une catégorie",
        description="Supprime définitivement une catégorie. Attention : les médicaments liés peuvent être affectés.",
        responses={204: OpenApiResponse(description="Suppression réussie"), 404: OpenApiResponse(description="Catégorie introuvable")},
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
