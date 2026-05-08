"""
Configuration de l'interface d'administration Django pour l'application categories.

Enregistre le modèle Categorie afin qu'il soit accessible et gérable
depuis l'interface d'administration Django (/admin/).
"""

from django.contrib import admin

from .models import Categorie


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    """
    Interface d'administration pour le modèle Categorie.

    Affiche la liste des catégories avec leur nom et permet
    la recherche par nom ou description.
    """

    list_display = ["nom", "description"]
    search_fields = ["nom", "description"]
    ordering = ["nom"]
