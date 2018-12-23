from django.db import models


class BillDetails(models.Model):
    bill_no = models.BigIntegerField(primary_key=True, db_column="BillNo")
    source = models.CharField(max_length=50)
    destination = models.CharField(max_length=50)
    amount = models.IntegerField()
    docket_charges = models.IntegerField(db_column="DocketCharges")
    docket_number = models.BigIntegerField(db_column="DocketNumber")
    company_name = models.CharField(max_length=100, db_column="CompanyName")
    company_address = models.TextField(db_column="CompanyAddress")
    gst_in = models.CharField(max_length=50, db_column="GSTIN")
    shipment_date = models.DateField(db_column="ShipmentDate")
    bill_submission_date = models.DateField(db_column="BillSubmissionDate")
    vehicle_number = models.CharField(max_length=50, db_column='VehicleNumber')
    is_payment_done = models.BooleanField(db_column="IsPaymentDone")
    detention_charges = models.IntegerField(db_column="OverHeightCharges")
    over_height_charges = models.IntegerField(db_column="DetentionCharges")
    fov_charges = models.IntegerField(db_column="FOVCharges")
    quantity = models.CharField(max_length=50)

    class Meta:
        db_table = 'BillDetails'
        verbose_name = 'BillDetails'
