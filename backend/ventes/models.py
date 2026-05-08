"""
Module models pour l'application ventes.
Définit les modèles Vente et LigneVente pour la gestion des transactions.
"""

from django.db import models
from django.utils import timezone

from medicaments.models import Medicament


class Vente(models.Model):
    """
    Représente une transaction de vente réalisée en pharmacie.

    Chaque vente possède une référence unique auto-générée au format
    VNT-AAAA-NNNN, un statut de cycle de vie, et un total TTC calculé
    à partir de ses lignes de vente associées.
    """

    class Statut(models.TextChoices):
        EN_COURS = "EN_COURS", "En cours"
        COMPLETEE = "COMPLETEE", "Complétée"
        ANNULEE = "ANNULEE", "Annulée"

    reference = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        verbose_name="Référence",
    )
    date_vente = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de vente",
    )
    total_ttc = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Total TTC",
    )
    statut = models.CharField(
        max_length=20,
        choices=Statut.choices,
        default=Statut.EN_COURS,
        verbose_name="Statut",
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Notes",
    )

    class Meta:
        verbose_name = "Vente"
        verbose_name_plural = "Ventes"
        ordering = ["-date_vente"]

    def __str__(self) -> str:
        return f"{self.reference} — {self.get_statut_display()}"

    def _generer_reference(self) -> str:
        """Génère une référence unique au format VNT-AAAA-NNNN."""
        annee = timezone.now().year
        dernier = (
            Vente.objects.filter(reference__startswith=f"VNT-{annee}-")
            .order_by("reference")
            .last()
        )
        if dernier:
            dernier_numero = int(dernier.reference.split("-")[-1])
            nouveau_numero = dernier_numero + 1
        else:
            nouveau_numero = 1
        return f"VNT-{annee}-{nouveau_numero:04d}"

    def save(self, *args, **kwargs) -> None:
        if not self.reference:
            self.reference = self._generer_reference()
        super().save(*args, **kwargs)


class LigneVente(models.Model):
    """
    Représente une ligne d'article au sein d'une vente.

    Chaque ligne est liée à une Vente et à un Medicament. Le prix unitaire
    est un snapshot au moment de la vente (non lié dynamiquement) afin de
    conserver l'historique tarifaire même en cas de modification ultérieure
    du prix du médicament.
    """

    vente = models.ForeignKey(
        Vente,
        on_delete=models.CASCADE,
        related_name="lignes",
        verbose_name="Vente",
    )
    medicament = models.ForeignKey(
        Medicament,
        on_delete=models.PROTECT,
        related_name="lignes_vente",
        verbose_name="Médicament",
    )
    quantite = models.PositiveIntegerField(
        verbose_name="Quantité",
    )
    prix_unitaire = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix unitaire TTC (snapshot)",
    )
    sous_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name="Sous-total TTC",
    )

    class Meta:
        verbose_name = "Ligne de vente"
        verbose_name_plural = "Lignes de vente"

    def __str__(self) -> str:
        return f"{self.quantite}× {self.medicament} — {self.vente.reference}"

    def save(self, *args, **kwargs) -> None:
        self.sous_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)
