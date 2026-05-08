"""
Configuration de l'interface d'administration Django pour l'application medicaments.

Enregistre le modèle Medicament avec un affichage enrichi des colonnes clés,
des filtres latéraux, et la possibilité de rechercher par nom ou DCI.
"""

from django.contrib import admin

from .models import Medicament


@admin.register(Medicament)
class MedicamentAdmin(admin.ModelAdmin):
    """
    Interface d'administration pour le modèle Medicament.

    Colonnes affichées : nom, catégorie, stock actuel, seuil d'alerte,
    statut actif, et indicateur d'alerte de stock (propriété calculée).
    """

    list_display = [
        "nom",
        "categorie",
        "stock_actuel",
        "stock_minimum",
        "est_actif",
        "est_en_alerte",
    ]
    list_filter = ["categorie", "est_actif", "ordonnance_requise"]
    search_fields = ["nom", "dci"]
    ordering = ["nom"]
    readonly_fields = ["date_creation", "est_en_alerte"]

    @admin.display(boolean=True, description="En alerte stock")
    def est_en_alerte(self, obj: Medicament) -> bool:
        """Indique si le médicament est en alerte de stock (icône booléenne)."""
        return obj.est_en_alerte
