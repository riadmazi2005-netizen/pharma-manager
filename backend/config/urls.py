"""
URL configuration du projet PharmaManager.

Toutes les routes de l'API sont regroupées sous le préfixe /api/v1/.
"""

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("categories.urls")),
    path("api/v1/", include("medicaments.urls")),
    path("api/v1/", include("ventes.urls")),
    # OpenAPI schema & Swagger UI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
