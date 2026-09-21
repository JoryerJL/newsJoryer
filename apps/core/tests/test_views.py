from importlib import import_module

from django.contrib.postgres.operations import UnaccentExtension
from django.test import RequestFactory, SimpleTestCase
from django.urls import reverse

from apps.core.views import error_403, error_500


class CoreViewTests(SimpleTestCase):
    def test_home_shell_returns_success(self) -> None:
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Portal público")
        self.assertContains(response, 'data-logo-slot')
        self.assertNotContains(response, "Noticias CANACO")
        self.assertNotContains(response, "canaco-logo.svg")

    def test_panel_shell_returns_success(self) -> None:
        response = self.client.get(reverse("panel"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Panel editorial")
        self.assertContains(response, 'data-logo-slot')
        self.assertNotContains(response, "canaco-logo.svg")
        self.assertContains(response, 'data-panel-menu')
        self.assertContains(response, "inert")

    def test_not_found_handler_uses_designed_content(self) -> None:
        response = self.client.get("/route-that-does-not-exist/")

        self.assertEqual(response.status_code, 404)
        self.assertContains(response, "Página no encontrada", status_code=404)

    def test_forbidden_handler_returns_expected_status(self) -> None:
        response = error_403(RequestFactory().get("/restricted/"))

        self.assertEqual(response.status_code, 403)
        self.assertContains(response, "No tienes permiso", status_code=403)

    def test_server_error_handler_returns_safe_content(self) -> None:
        response = error_500(RequestFactory().get("/server-error/"))

        self.assertEqual(response.status_code, 500)
        self.assertContains(response, "Algo salió mal", status_code=500)

    def test_unaccent_migration_declares_postgresql_extension(self) -> None:
        migration_module = import_module("apps.core.migrations.0001_enable_unaccent")

        self.assertIsInstance(migration_module.Migration.operations[0], UnaccentExtension)
