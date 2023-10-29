from rest_framework_extensions.routers import ExtendedDefaultRouter


class OptionalTrailingSlashRouter(ExtendedDefaultRouter):
    """DefaultRouter with optional trailing slash and drf-extensions nesting."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.trailing_slash = r"/?"
