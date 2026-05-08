"""
Module models pour l'application medicaments.
Définit le modèle Medicament avec gestion du stock et des alertes.
"""

from django.db import models

from categories.models import Categorie


class Medicament(models.Model):
    """
    Représente un médicament référencé dans le stock de la pharmacie.

    Inclut les informations pharmaceutiques (DCI, forme, dosage),
    les données tarifaires, la gestion du stock, et les métadonnées
    de cycle de vie (date d'expiration, statut actif).
    """

    nom = models.CharField(
        max_length=200,
        verbose_name="Nom commercial",
    )
    dci = models.CharField(
        max_length=200,
        verbose_name="Dénomination Commune Internationale (DCI)",
        blank=True,
    )
    categorie = models.ForeignKey(
        Categorie,
        on_delete=models.PROTECT,
        related_name="medicaments",
        verbose_name="Catégorie",
    )
    forme = models.CharField(
        max_length=100,
        verbose_name="Forme pharmaceutique",
        help_text="Ex : comprimé, sirop, injectable…",
    )
    dosage = models.CharField(
        max_length=100,
        verbose_name="Dosage",
        help_text="Ex : 500 mg, 100 mg/5 ml…",
    )
    prix_achat = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix d'achat (HT)",
    )
    prix_vente = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix de vente (TTC)",
    )
    stock_actuel = models.PositiveIntegerField(
        default=0,
        verbose_name="Stock actuel",
    )
    stock_minimum = models.PositiveIntegerField(
        default=10,
        verbose_name="Seuil d'alerte stock",
    )
    date_expiration = models.DateField(
        verbose_name="Date d'expiration",
    )
    ordonnance_requise = models.BooleanField(
        default=False,
        verbose_name="Ordonnance requise",
    )
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création",
    )
    est_actif = models.BooleanField(
        default=True,
        verbose_name="Médicament actif",
    )

    class Meta:
        verbose_name = "Médicament"
        verbose_name_plural = "Médicaments"
        ordering = ["nom"]

    def __str__(self) -> str:
        return f"{self.nom} {self.dosage}"

    @property
    def est_en_alerte(self) -> bool:
        """Retourne True si le stock actuel est inférieur ou égal au seuil minimum."""
        return self.stock_actuel <= self.stock_minimum
