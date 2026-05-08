"""
Configuration de l'interface d'administration Django pour l'application ventes.

Enregistre les modèles Vente et LigneVente. Les lignes de vente sont intégrées
comme inline dans la page de détail d'une vente pour faciliter la consultation
et la saisie directe depuis l'interface administrateur.
"""

from django.contrib import admin

from .models import LigneVente, Vente


class LigneVenteInline(admin.TabularInline):
    """
    Inline tabulaire pour afficher et gérer les lignes d'une vente
    directement depuis la page de détail de la vente parente.
    """

    model = LigneVente
    extra = 0
    readonly_fields = ["prix_unitaire", "sous_total"]
    fields = ["medicament", "quantite", "prix_unitaire", "sous_total"]


@admin.register(Vente)
class VenteAdmin(admin.ModelAdmin):
    """
    Interface d'administration pour le modèle Vente.

    Affiche la référence, la date, le total TTC et le statut de chaque vente.
    Les lignes associées apparaissent en inline sur la page de détail.
    """

    list_display = ["reference", "date_vente", "total_ttc", "statut"]
    list_filter = ["statut"]
    search_fields = ["reference", "notes"]
    readonly_fields = ["reference", "date_vente", "total_ttc"]
    ordering = ["-date_vente"]
    inlines = [LigneVenteInline]


@admin.register(LigneVente)
class LigneVenteAdmin(admin.ModelAdmin):
    """
    Interface d'administration autonome pour le modèle LigneVente.

    Permet de consulter toutes les lignes de vente indépendamment de la vente
    parente, avec filtrage par vente et recherche par médicament.
    """

    list_display = ["vente", "medicament", "quantite", "prix_unitaire", "sous_total"]
    list_filter = ["vente__statut"]
    search_fields = ["medicament__nom", "vente__reference"]
    readonly_fields = ["prix_unitaire", "sous_total"]
