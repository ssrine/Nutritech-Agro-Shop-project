from django.urls import path
from .views import HomePageView
from .views import SignupView
from .views import LoginView
from .views import AddToList

from . import views

urlpatterns = [
    path('home/', HomePageView.as_view(), name='home'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('add-to-list/', AddToList.as_view(), name='add_to_list'),
]
