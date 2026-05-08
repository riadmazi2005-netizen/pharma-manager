"""
Views pour l'application medicaments.

Expose un ViewSet CRUD complet pour le modèle Medicament,
ainsi qu'une action personnalisée pour récupérer les médicaments en alerte stock.
"""

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import Medicament
from .serializers import MedicamentSerializer


@extend_schema(tags=["Médicaments"])
class MedicamentViewSet(viewsets.ModelViewSet):
    """
    ViewSet CRUD complet pour le modèle Medicament.

    Endpoints générés automatiquement par le router :
      GET    /api/v1/medicaments/            → liste tous les médicaments actifs
      POST   /api/v1/medicaments/            → crée un nouveau médicament
      GET    /api/v1/medicaments/{id}/       → détail d'un médicament
      PUT    /api/v1/medicaments/{id}/       → mise à jour complète
      PATCH  /api/v1/medicaments/{id}/       → mise à jour partielle
      DELETE /api/v1/medicaments/{id}/       → supprime un médicament

    Action personnalisée :
      GET    /api/v1/medicaments/alertes/    → médicaments avec stock en alerte
    """

    queryset = Medicament.objects.filter(est_actif=True).select_related("categorie")
    serializer_class = MedicamentSerializer
    permission_classes = []

    @extend_schema(
        summary="Lister les médicaments",
        description="Retourne la liste de tous les médicaments actifs, avec leur catégorie.",
        responses={200: MedicamentSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Créer un médicament",
        description="Crée un nouveau médicament. Le prix de vente doit être supérieur au prix d'achat.",
        responses={201: MedicamentSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary="Détail d'un médicament",
        description="Retourne le détail complet d'un médicament identifié par son `id`.",
        responses={200: MedicamentSerializer, 404: OpenApiResponse(description="Médicament introuvable")},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Mettre à jour un médicament (complète)",
        description="Remplace entièrement un médicament existant.",
        responses={200: MedicamentSerializer, 404: OpenApiResponse(description="Médicament introuvable")},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Mettre à jour un médicament (partielle)",
        description="Met à jour un ou plusieurs champs d'un médicament existant.",
        responses={200: MedicamentSerializer, 404: OpenApiResponse(description="Médicament introuvable")},
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Supprimer un médicament",
        description="Supprime définitivement un médicament du système.",
        responses={204: OpenApiResponse(description="Suppression réussie"), 404: OpenApiResponse(description="Médicament introuvable")},
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @extend_schema(
        summary="Médicaments en alerte de stock",
        description=(
            "Retourne uniquement les médicaments dont `stock_actuel <= stock_minimum`. "
            "La propriété `est_en_alerte` vaudra `True` pour chaque résultat."
        ),
        responses={200: MedicamentSerializer(many=True)},
    )
    @action(detail=False, methods=["get"], url_path="alertes")
    def alertes(self, request: Request) -> Response:
        """
        Retourne uniquement les médicaments dont le stock est en alerte.

        Un médicament est en alerte lorsque ``stock_actuel <= stock_minimum``.
        La propriété ``est_en_alerte`` sur chaque objet retourné vaudra ``True``.

        GET /api/v1/medicaments/alertes/
        """
        medicaments_alertes = [
            med for med in self.get_queryset() if med.est_en_alerte
        ]
        serializer = self.get_serializer(medicaments_alertes, many=True)
        return Response(serializer.data)
