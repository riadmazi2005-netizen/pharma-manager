"""
Serializers pour l'application ventes.

Gère la création imbriquée d'une Vente avec ses LigneVente,
le snapshot du prix unitaire, et le calcul automatique du total TTC.
"""

from decimal import Decimal

from rest_framework import serializers

from medicaments.models import Medicament

from .models import LigneVente, Vente


class LigneVenteSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle LigneVente.

    Les champs ``prix_unitaire`` et ``sous_total`` sont en lecture seule :
    - ``prix_unitaire`` est alimenté automatiquement depuis ``medicament.prix_vente``
      au moment de la création (snapshot tarifaire).
    - ``sous_total`` est calculé automatiquement (quantite × prix_unitaire).

    À la création, seuls ``medicament`` et ``quantite`` sont requis en entrée.
    """

    prix_unitaire = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    sous_total = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    medicament_nom = serializers.CharField(source="medicament.nom", read_only=True)

    class Meta:
        model = LigneVente
        fields = ["id", "medicament", "medicament_nom", "quantite", "prix_unitaire", "sous_total"]


class VenteSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Vente avec lignes imbriquées (nested).

    Fonctionnement à la création :
    - Accepte une liste de lignes (``lignes``) contenant ``medicament`` et ``quantite``.
    - Pour chaque ligne, le ``prix_unitaire`` est copié depuis ``medicament.prix_vente``
      (snapshot — indépendant des modifications futures du prix).
    - Le ``sous_total`` de chaque ligne et le ``total_ttc`` de la vente sont calculés
      automatiquement.
    - La ``reference`` est générée automatiquement par le modèle.

    Le champ ``total_ttc`` est en lecture seule dans ce serializer.
    """

    lignes = LigneVenteSerializer(many=True)
    total_ttc = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = Vente
        fields = [
            "id",
            "reference",
            "date_vente",
            "total_ttc",
            "statut",
            "notes",
            "lignes",
        ]
        read_only_fields = ["reference", "date_vente", "total_ttc"]

    def create(self, validated_data: dict) -> Vente:
        """
        Crée une Vente et ses LigneVente associées.

        Pour chaque ligne :
        - Applique le snapshot du prix de vente du médicament.
        - Calcule le sous-total.
        Calcule ensuite le total TTC global et le persiste sur la Vente.
        """
        lignes_data = validated_data.pop("lignes")
        vente = Vente.objects.create(**validated_data)

        total = Decimal("0.00")

        for ligne_data in lignes_data:
            medicament: Medicament = ligne_data["medicament"]
            quantite: int = ligne_data["quantite"]
            prix_unitaire: Decimal = medicament.prix_vente
            sous_total: Decimal = quantite * prix_unitaire

            LigneVente.objects.create(
                vente=vente,
                medicament=medicament,
                quantite=quantite,
                prix_unitaire=prix_unitaire,
                sous_total=sous_total,
            )
            total += sous_total

            # Déduire le stock
            medicament.stock_actuel -= quantite
            medicament.save(update_fields=["stock_actuel"])

        vente.total_ttc = total
        vente.save(update_fields=["total_ttc"])

        return vente

    def update(self, instance: Vente, validated_data: dict) -> Vente:
        """
        Met à jour une Vente existante.

        Les lignes imbriquées ne sont pas modifiables via ce serializer
        (gestion dédiée recommandée via un endpoint /lignes/).
        """
        validated_data.pop("lignes", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
