from django.urls import path
from .views import TripListCreateView, TripDetailView, TripHistoryView, TripHistoryDetailView, save_trip_to_history

urlpatterns = [
    path('trips/', TripListCreateView.as_view(), name='trip-list-create'),
    path('history/', TripHistoryView.as_view(), name='trip-history'),
    path('history/save/', save_trip_to_history, name='save-trip'),
    path('history/<str:pk>/', TripHistoryDetailView.as_view(), name='history-detail'),
    path('trips/<int:pk>/', TripDetailView.as_view(), name='trip-detail'),
]
