from typing import Any

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.generic import TemplateView


class HomeView(TemplateView):
    template_name = "core/home.html"


class PanelPlaceholderView(TemplateView):
    template_name = "core/panel_placeholder.html"


def error_403(request: HttpRequest, exception: Exception | None = None) -> HttpResponse:
    return render(request, "errors/403.html", status=403)


def error_404(request: HttpRequest, exception: Exception) -> HttpResponse:
    return render(request, "errors/404.html", status=404)


def error_500(request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
    return render(request, "errors/500.html", status=500)
