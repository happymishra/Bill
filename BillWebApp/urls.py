from .views import *
from django.conf.urls import url

urlpatterns = [
    url(r'getBillDetails', get_bill_details),
    url(r'addBillDetails', add_bill_details),
    url(r'updateBillDetails', update_bill_details),
    url(r'^addBill', get_bill_add_page),
    url(r'getCompanyDetails', get_company_details),
    url(r'', get_home_page),
]
