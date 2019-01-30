from django.db import models


class BillDetail(models.Model):
    bill_no = models.BigIntegerField(primary_key=True, db_column="BillNo")
    source = models.CharField(max_length=50, db_column="Source")
    destination = models.CharField(max_length=50, db_column="Destination")
    amount = models.IntegerField(db_column="Amount")
    docket_charges = models.IntegerField(db_column="DocketCharges")
    docket_number = models.CharField(db_column="DocketNumber", max_length=100)
    company_name = models.CharField(max_length=100, db_column="CompanyName")
    company_address = models.TextField(db_column="CompanyAddress")
    gst_in = models.CharField(max_length=50, db_column="GSTIN")
    shipment_date = models.DateField(db_column="ShipmentDate")
    bill_submission_date = models.DateField(db_column="BillSubmissionDate")
    vehicle_number = models.CharField(max_length=50, db_column='VehicleNumber')
    is_payment_done = models.BooleanField(db_column="IsPaymentDone", default=False, null=True)
    quantity = models.CharField(max_length=50, db_column="Quantity")
    extras = models.TextField(null=True, blank=True)

    class Meta:
        db_table = u'bill_detail'


class Company(models.Model):
    id = models.AutoField(primary_key=True, db_column='Id')
    company_name = models.CharField(max_length=100, db_column='CompanyName')
    company_address = models.TextField(db_column='CompanyAddress')
    company_city = models.CharField(max_length=100, db_column='CompanyCity', null=True, blank=True)
    company_district = models.CharField(max_length=100, db_column='CompanyDistrict', null=True, blank=True)
    company_gstin = models.CharField(max_length=50, db_column='CompanyGSTIN', null=True, blank=True)
    company_pincode = models.CharField(max_length=50, db_column='CompanyPinCode', null=True, blank=True)

    class Meta:
        db_table = u'company'
