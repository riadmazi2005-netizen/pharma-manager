"""
Serializers pour l'application categories.
"""

from rest_framework import serializers

from .models import Categorie


class CategorieSerializer(serializers.ModelSerializer):
    """
    Serializer complet pour le modèle Categorie.

    Expose tous les champs : id, nom, description.
    """

    class Meta:
        model = Categorie
        fields = ["id", "nom", "description"]
