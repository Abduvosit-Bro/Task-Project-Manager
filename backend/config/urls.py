from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/', include('apps.projects.urls')),
    path('api/', include('apps.tags.urls')),
    path('api/', include('apps.tasks.urls')),
    path('api/', include('apps.events.urls')),
    path('api/', include('apps.notifications.urls')),
    path('api/', include('apps.translations.urls')),
]
