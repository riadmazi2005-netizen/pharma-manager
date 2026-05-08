"""
Module models pour l'application categories.
Définit le modèle Categorie utilisé pour classifier les médicaments.
"""

from django.db import models


class Categorie(models.Model):
    """
    Représente une catégorie de médicaments dans le système PharmaManager.

    Permet de regrouper les médicaments par famille thérapeutique ou usage,
    facilitant la navigation et la gestion de l'inventaire.
    """

    nom = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nom de la catégorie",
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name="Description",
    )

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ["nom"]

    def __str__(self) -> str:
        return self.nom
