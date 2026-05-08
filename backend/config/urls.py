"""
URL configuration du projet PharmaManager.

Toutes les routes de l'API sont regroupées sous le préfixe /api/v1/.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("categories.urls")),
    path("api/v1/", include("medicaments.urls")),
    path("api/v1/", include("ventes.urls")),
]
