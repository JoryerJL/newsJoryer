from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from apps.core.views import HomeView, PanelPlaceholderView

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("panel/", PanelPlaceholderView.as_view(), name="panel"),
    path("admin/", admin.site.urls),
    path("core/", include("apps.core.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler403 = "apps.core.views.error_403"
handler404 = "apps.core.views.error_404"
handler500 = "apps.core.views.error_500"
