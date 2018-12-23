from whitenoise.django import DjangoWhiteNoise
application = DjangoWhiteNoise(application)

import os
from django.core.wsgi import get_wsgi_application
from whitenoise.django import DjangoWhiteNoise

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "BillApp.settings")

application = get_wsgi_application()
application = DjangoWhiteNoise(application)