from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import BillDetail, Company
from rest_framework import status
from django.http import JsonResponse
import json
import datetime


@api_view(['GET'])
def get_bill_details(request):
    resp = dict()
    data = list()
    last_bill_no = 0

    query = BillDetail.objects.all().order_by('-bill_no')

    try:
        for each_bill in query:
            various_charges = each_bill.extras

            each_data = {
                "billNo": each_bill.bill_no,
                "source": each_bill.source,
                "destination": each_bill.destination,
                "amount": each_bill.amount,
                "gst_in": each_bill.gst_in,
                "companyName": each_bill.company_name,
                "companyAddress": each_bill.company_address,
                "shipmentDate": each_bill.shipment_date.strftime('%d-%m-%Y'),
                "billSubmissionDate": each_bill.bill_submission_date.strftime('%d-%m-%Y'),
                "docketNumber": each_bill.docket_number,
                "docketCharges": each_bill.docket_charges,
                "vehicleNumber": each_bill.vehicle_number,
                "isPaymentDone": True if each_bill.is_payment_done == 1 else False,
                "variousCharges": various_charges,
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
        details = json.loads(request.body)

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
                                      quantity=details.get('quantity'),
                                      extras=json.dumps(details.get('variousCharges', "{}")))

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
        bill_detail = json.loads(request.body)

        bill_detail_obj = BillDetail.objects.filter(bill_no=bill_detail.get('billNo'))
        curr_bill_detail_obj = bill_detail_obj[0]

        if bill_detail.get('isPayment'):
            bill_detail_obj.update(is_payment_done=1 if bill_detail.get('isPaymentDone') else 0)
        else:
            bill_detail_obj.update(source=bill_detail.get('source'),
                                   destination=bill_detail.get('destination'),
                                   amount=bill_detail.get('amount'),
                                   gst_in=bill_detail.get('gst_in'),
                                   company_name=bill_detail.get('companyName'),
                                   company_address=bill_detail.get('companyAddress'),
                                   shipment_date=datetime.datetime.strptime(bill_detail.get('shipmentDate'),
                                                                            '%d-%m-%Y').strftime('%Y-%m-%d'),
                                   bill_submission_date=datetime.datetime.strptime(
                                       bill_detail.get('billSubmissionDate'), '%d-%m-%Y').strftime('%Y-%m-%d'),
                                   docket_number=bill_detail.get('docketNumber'),
                                   docket_charges=bill_detail.get('docketCharges'),
                                   vehicle_number=bill_detail.get('vehicleNumber'),
                                   is_payment_done=1 if bill_detail.get('isPaymentDone') else 0,
                                   quantity=bill_detail.get('quantity') or curr_bill_detail_obj.quantity,
                                   extras=json.dumps(bill_detail.get('variousCharges', "{}"))
                                   )

        resp['status'] = status.HTTP_200_OK
    except Exception as ex:
        raise ex
        resp['status'] = status.HTTP_500_INTERNAL_SERVER_ERROR
        resp['message'] = str(ex)

    return JsonResponse(resp)


@api_view(['GET'])
def get_company_details(request):
    resp = dict()
    data = dict()

    try:
        query = Company.objects.all()

        for each_company in query:
            data[each_company.company_name] = {
                'address': each_company.company_address,
                'city': each_company.company_city,
                'district': each_company.company_district,
                'gstin': each_company.company_gstin,
                'pincode': each_company.company_pincode
            }

        resp['data'] = data

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
