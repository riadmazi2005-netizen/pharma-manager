"""
Views pour l'application medicaments.

Expose un ViewSet CRUD complet pour le modèle Medicament,
ainsi qu'une action personnalisée pour récupérer les médicaments en alerte stock.
"""

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Medicament
from .serializers import MedicamentSerializer


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
