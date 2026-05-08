"""
Views pour l'application ventes.

Expose un ViewSet pour la création et la consultation des ventes,
ainsi qu'une action d'annulation de vente.
"""

from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import Vente
from .serializers import VenteSerializer


@extend_schema(tags=["Ventes"])
class VenteViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    ViewSet pour la gestion des ventes pharmaceutiques.

    Actions disponibles :
      POST   /api/v1/ventes/              → crée une nouvelle vente avec ses lignes
      GET    /api/v1/ventes/              → liste l'historique de toutes les ventes
      GET    /api/v1/ventes/{id}/         → détail d'une vente

    Action personnalisée :
      POST   /api/v1/ventes/{id}/annuler/ → annule la vente (statut → ANNULEE)

    Seules la création et la lecture sont disponibles ; la modification directe
    d'une vente n'est pas permise. L'annulation passe par l'action dédiée.
    """

    queryset = Vente.objects.all().prefetch_related("lignes__medicament")
    serializer_class = VenteSerializer
    permission_classes = []

    @extend_schema(
        summary="Lister les ventes",
        description="Retourne l'historique complet de toutes les ventes avec leurs lignes.",
        responses={200: VenteSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Créer une vente",
        description=(
            "Crée une nouvelle vente avec ses lignes imbriquées. "
            "Le `prix_unitaire` et le `sous_total` de chaque ligne sont calculés automatiquement. "
            "La `reference` et le `total_ttc` sont également générés automatiquement."
        ),
        responses={201: VenteSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary="Détail d'une vente",
        description="Retourne le détail complet d'une vente identifiée par son `id`, avec toutes ses lignes.",
        responses={200: VenteSerializer, 404: OpenApiResponse(description="Vente introuvable")},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Annuler une vente",
        description=(
            "Change le statut de la vente à `ANNULEE`. "
            "Retourne une erreur 400 si la vente est déjà annulée."
        ),
        request=None,
        responses={
            200: VenteSerializer,
            400: OpenApiResponse(description="La vente est déjà annulée"),
            404: OpenApiResponse(description="Vente introuvable"),
        },
    )
    @action(detail=True, methods=["post"], url_path="annuler")
    def annuler(self, request: Request, pk: int = None) -> Response:
        """
        Annule une vente en changeant son statut à ANNULEE.

        POST /api/v1/ventes/{id}/annuler/

        Règles métier :
        - Une vente déjà annulée ne peut pas être re-annulée (400).
        - Une vente complétée peut être annulée (politique à adapter si besoin).

        Retourne la vente mise à jour avec le nouveau statut.
        """
        vente: Vente = self.get_object()

        if vente.statut == Vente.Statut.ANNULEE:
            return Response(
                {"detail": "Cette vente est déjà annulée."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        vente.statut = Vente.Statut.ANNULEE
        vente.save(update_fields=["statut"])

        serializer = self.get_serializer(vente)
        return Response(serializer.data, status=status.HTTP_200_OK)
