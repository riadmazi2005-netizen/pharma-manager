"""
Serializers pour l'application medicaments.
"""

from rest_framework import serializers

from .models import Medicament


class MedicamentSerializer(serializers.ModelSerializer):
    """
    Serializer complet pour le modèle Medicament.

    Expose tous les champs du modèle ainsi que la propriété calculée
    ``est_en_alerte`` (lecture seule).

    Validations métier :
    - ``prix_vente`` doit être strictement supérieur à ``prix_achat``.
    - ``stock_minimum`` doit être strictement positif (>= 1).
    """

    est_en_alerte = serializers.BooleanField(read_only=True)

    class Meta:
        model = Medicament
        fields = [
            "id",
            "nom",
            "dci",
            "categorie",
            "forme",
            "dosage",
            "prix_achat",
            "prix_vente",
            "stock_actuel",
            "stock_minimum",
            "date_expiration",
            "ordonnance_requise",
            "date_creation",
            "est_actif",
            "est_en_alerte",
        ]
        read_only_fields = ["date_creation", "est_en_alerte"]

    def validate_stock_minimum(self, value: int) -> int:
        """Vérifie que le stock minimum est strictement positif."""
        if value < 1:
            raise serializers.ValidationError(
                "Le stock minimum doit être au moins égal à 1."
            )
        return value

    def validate(self, data: dict) -> dict:
        """Vérifie que le prix de vente est supérieur au prix d'achat."""
        prix_achat = data.get("prix_achat", getattr(self.instance, "prix_achat", None))
        prix_vente = data.get("prix_vente", getattr(self.instance, "prix_vente", None))

        if prix_achat is not None and prix_vente is not None:
            if prix_vente <= prix_achat:
                raise serializers.ValidationError(
                    {"prix_vente": "Le prix de vente doit être supérieur au prix d'achat."}
                )
        return data
