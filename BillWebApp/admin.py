from django.contrib import admin
from .models import BillDetail, Company

admin.site.site_header = 'Laxmi Road Lines'

# Register your models here.
admin.site.register(BillDetail)


class CompanyAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'company_address', 'company_city',
                    'company_district', 'company_gstin', 'company_pincode')

    list_filter = ('company_name',)
    search_fields = ('company_name',)


admin.site.register(Company, CompanyAdmin)