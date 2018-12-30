from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import BillDetail
from rest_framework import status
from django.http import JsonResponse
import traceback


@api_view(['GET'])
def get_bill_details(request):
    resp = dict()
    data = list()
    last_bill_no = 0

    query = BillDetail.objects.all().order_by('-bill_no')

    try:
        for each_bill in query:
            each_data = {
                "billNo": each_bill.bill_no,
                "source": each_bill.source,
                "destination": each_bill.destination,
                "amount": each_bill.amount,
                "gst_in": each_bill.gst_in,
                "companyName": each_bill.company_name,
                "companyAddress": each_bill.company_address,
                "shipmentDate": each_bill.shipment_date,
                "billSubmissionDate": each_bill.bill_submission_date,
                "docketNumber": each_bill.docket_number,
                "docketCharges": each_bill.docket_charges,
                "vehicleNumber": each_bill.vehicle_number,
                "isPaymentDone": each_bill.is_payment_done,
                'detentionCharges': each_bill.detention_charges,
                'fovCharges': each_bill.fov_charges,
                'overHeightCharges': each_bill.over_height_charges,
                'quantity': each_bill.quantity
            }

            if each_bill.bill_no > last_bill_no:
                last_bill_no = each_bill.bill_no

            data.append(each_data)

        resp["status"] = status.HTTP_200_OK
        resp['data'] = data
        resp['newBillNo'] = int(last_bill_no) + 1

    except Exception as ex:
        raise ex
        resp["status"] = status.HTTP_500_INTERNAL_SERVER_ERROR
        resp['message'] = str(ex)

    return JsonResponse(resp)


@api_view(['POST'])
def add_bill_details(request):
    resp = dict()

    try:
        details = request.data

        import datetime
        bill_details_obj = BillDetail(source=details.get('source'),
                                      destination=details.get('destination'),
                                      amount=details.get('amount'),
                                      gst_in=details.get('gst_in'),
                                      company_name=details.get('companyName'),
                                      company_address=details.get('companyAddress'),
                                      shipment_date=datetime.datetime.strptime(details.get('shipmentDate'),
                                                                                '%d-%m-%Y').strftime('%Y-%m-%d'),
                                      bill_submission_date=datetime.datetime.strptime(
                                           details.get('billSubmissionDate'), '%d-%m-%Y').strftime('%Y-%m-%d'),
                                      docket_number=details.get('docketNumber'),
                                      docket_charges=details.get('docketCharges'),
                                      vehicle_number=details.get('vehicleNumber'),
                                      is_payment_done=details.get('isPaymentDone'),
                                      detention_charges=details.get('detentionCharges'),
                                      fov_charges=details.get('fovCharges'),
                                      over_height_charges=details.get('overHeightCharges'),
                                      quantity=details.get('quantity'))

        if details.get('billNo'):
            bill_details_obj.bill_no = details.get('billNo')

        bill_details_obj.save()
        resp['status'] = status.HTTP_200_OK
    except Exception as ex:
        raise ex
        resp['status'] = status.HTTP_500_INTERNAL_SERVER_ERROR
        resp['message'] = str(ex)

    return JsonResponse(resp)


@api_view(['POST'])
def update_bill_details(request):
    resp = dict()

    try:
        bill_detail = request.data

        bill_detail_obj = BillDetail.objects.filter(bill_no=bill_detail.get('billNo'))
        curr_bill_detail_obj = bill_detail_obj[0]

        bill_detail_obj.update(source=bill_detail.get('source'),
                               destination=bill_detail.get('destination'),
                               amount=bill_detail.get('amount'),
                               gst_in=bill_detail.get('gst_in'),
                               company_name=bill_detail.get('companyName'),
                               company_address=bill_detail.get('companyAddress'),
                               shipment_date=bill_detail.get('shipmentDate'),
                               bill_submission_date=bill_detail.get('billSubmissionDate'),
                               docket_number=bill_detail.get('docketNumber'),
                               docket_charges=bill_detail.get('docketCharges'),
                               vehicle_number=bill_detail.get('vehicleNumber'),
                               is_payment_done=0 if bill_detail.get('isPaymentDone') == 'false' else 1,
                               quantity=bill_detail.get('quantity') or curr_bill_detail_obj.quantity,
                               over_height_charges=bill_detail.get(
                                   'overHeightCharges') or curr_bill_detail_obj.over_height_charges,
                               detention_charges=bill_detail.get(
                                   'detentionCharges') or curr_bill_detail_obj.detention_charges,
                               fov_charges=bill_detail.get('fovCharges') or curr_bill_detail_obj.fov_charges
                               )

        resp['status'] = status.HTTP_200_OK
    except Exception as ex:
        raise ex
        resp['status'] = status.HTTP_500_INTERNAL_SERVER_ERROR
        resp['message'] = str(ex)

    return JsonResponse(resp)


def get_home_page(request):
    return render(request, 'home.html')


def get_bill_add_page(request):
    return render(request, 'billForm.html')
