var companyData;

$(document).ready(function () {
    // the selector will match all input controls of type :checkbox
    // and attach a click event handler
    $("input:checkbox").on('click', function () {
        // in the handler, 'this' refers to the box clicked on
        var $box = $(this);
        if ($box.is(":checked")) {
            // the name of the box is retrieved using the .attr() method
            // as it is assumed and expected to be immutable
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            // the checked state of the group/box on the other hand will change
            // and the current value is retrieved using .prop() method
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    });

    billNo = GetURLParameter('billNo');
    isEditBill = GetURLParameter('edit');

    $.ajax({
        type: "GET",
        url: '/api/getCompanyDetails',
        dataType: 'json',
        success: function (response) {
            if (response.status == 200) {
                console.log("success")
                var data = response.data;
                companyData = data;
                var companyContainer = $('#company-name-container');
                var option = '<option value="1">Select Company </option>';

                $.each(data, function (key, value) {
                    option += '<option value="' + key + '">' + key + '</option>';
                });

                companyContainer.append(option);

                $('select').change(data, function (event) {
                    debugger;
                    var selectCompany = data[this.value];

                    if (selectCompany) {

                        $('#address').val(selectCompany.address || '');
                        $('#district').val(selectCompany.district || '');
                        $('#city').val(selectCompany.city || '');
                        $('#pin-code').val(selectCompany.pincode || '');
                        $('#gstin').val(selectCompany.gstin || '');
                    } else {
                        $('#address').val('');
                        $('#district').val('');
                        $('#city').val('');
                        $('#pin-code').val('');
                        $('#gstin').val('');
                    }
                });

                $(function () {
                    $('#bill-no').val(billNo);

                    if (isEditBill) {
                        populateDataFromCache()
                    } else {
                        $('#update-bill').hide()
                    }

                });
            } else {
                console.log("An error occurred in the api")
            }
        },
        error: function (err) {
            console.log("An error occurred")
        }
    })
});


var getBillDetails = function (rowdata, onlyAdd) {
    var newRow = true;
    onlyAdd = onlyAdd || false;

    var billNo = $('#bill-no').val();
    var source = $('#source').val();
    var destination = $('#destination').val();
    var shippingDate = $('#shipping-date-val').val();
    var billingDate = $('#billing-date-val').val();
    var vehicleNumber = $('#vehicle-num').val();
    var docketNumber = $('#docket-num').val();
    var docketCharges = $('#docket-charges').val();
    var rate = $('#rate').val();
    var quantity = $('#quantity').val();
    var companyName = $('#company-name-container').val();
    var address = $('#address').val();
    var district = $('#district').val();
    var city = $('#city').val();
    var pinCode = $('#pin-code').val();
    var gstin = $('#gstin').val();
    var gstPaidBy = $("input[name='gst-paid-by']:checked").val();

    var overHeightCharges = $('#over-height-charges').val() || 0;
    var overHeightChargesRemark = $('#over-height-charges-remark').val() || '';
    var detentionCharges = $('#detention-charges').val() || 0;
    var detentionChargesRemark = $('#detention-charges-remark').val() || '';
    var fovCharges = $('#fov-charges').val() || 0;
    var fovChargesRemark = $('#fov-charges-remark').val() || '';
    var loadingCharges = $('#loading-charges').val() || 0;
    var loadingChargesRemark = $('#loading-charges-remark').val() || '';

    var gstCharges = $('#gst-charges').val() || 0;
    var gstChargesRemark = '';

    if (rowdata) {
        billNo = rowdata['billNo'];
        source = rowdata['source'];
        destination = rowdata['destination'];
        shippingDate = rowdata['shipmentDate'];
        billingDate = rowdata['billSubmissionDate'];
        vehicleNumber = rowdata.vehicleNumber;
        docketNumber = rowdata['docketNumber'];
        docketCharges = rowdata['docketCharges'];
        rate = rowdata['amount'];
        quantity = rowdata.quantity;
        companyName = rowdata['companyName'];
        address = rowdata['companyAddress'];

        variousCharges = rowdata['variousCharges'] || '{}';

        compDetails = companyData && companyData[companyName];

        if (compDetails) {
            district = compDetails.district;
            city = compDetails.city;
            pinCode = compDetails.pinCode;
            gstin = compDetails.gstin;
        }


        // overHeightCharges = rowdata.overHeightCharges || 0;
        // detentionCharges = rowdata.detentionCharges || 0;
        // fovCharges = rowdata.fovCharges || 0;

        // var overHeight = variousCharges.ohc || {}

        variousCharges = JSON.parse(variousCharges);


        overHeightCharges = (variousCharges.ohc || {}).c || 0;
        overHeightChargesRemark = (variousCharges.ohc || {}).r || '';

        detentionCharges = (variousCharges.dc || {}).c || 0;
        detentionChargesRemark = (variousCharges.dc || {}).r || '';

        fovCharges = (variousCharges.fc || {}).c || 0;
        fovChargesRemark = (variousCharges.fc || {}).r || '';

        loadingCharges = (variousCharges.lc || {}).c || 0;
        loadingChargesRemark = (variousCharges.lc || {}).r || '';

        gstCharges = (variousCharges.gc || {}).c || 0;
        gstChargesRemark = (variousCharges.gc || {}).r || '';

        gstPaidBy = variousCharges.gstPaidBy;

        newRow = false;
    }

    var variousCharges = {
        "lc": {
            "r": loadingChargesRemark,
            "c": loadingCharges
        },
        "ohc": {
            "r": overHeightChargesRemark,
            "c": overHeightCharges
        },
        "dc": {
            "r": detentionChargesRemark,
            "c": detentionCharges
        },
        "fc": {
            "r": fovChargesRemark,
            "c": fovCharges
        },
        "gc": {
            "r": gstChargesRemark,
            "c": gstCharges
        },
        "gstPaidBy": gstPaidBy
    };

    rowdata = {
        "billNo": billNo,
        "source": source,
        "destination": destination,
        "amount": rate,
        "gst_in": gstin,
        "companyName": companyName,
        "companyAddress": address,
        "shipmentDate": shippingDate,
        "billSubmissionDate": billingDate,
        "docketNumber": docketNumber,
        "docketCharges": docketCharges,
        "vehicleNumber": vehicleNumber,
        "quantity": quantity,
        "variousCharges": variousCharges
    };


    // address = 'A/1, Shop No. 5, Chanakya Society, Lok Bharti Complex, Off Marol Maroshi Road, Marol'

    var add = '', add2 = '';
    var lenAddress = address.length;
    var address1 = address;
    var address2 = '';
    var address3 = '';

    if (lenAddress > 20) {
        var commaIndex = address.indexOf(',', 20)
        if (commaIndex != -1) {
            address1 = address.substring(0, commaIndex + 1)
            address22 = address.substring(commaIndex + 2)
        } else {
            address1 = address
            address22 = ''
        }

        if (address22.length > 20) {
            var commaIndex = address22.indexOf(',', 20)
            if(commaIndex != -1) {
                address2 = address22.substring(0, commaIndex + 1)
                address3 = address22.substring(commaIndex + 2)
            } else {
                address2 = address22
            }
        } else {
            address2 = address22
        }
    }

    if (city) {
        if (city.length >= 15) {
            add = '<div>' + city + '</div>'
        } else if (address2 && address2.length <= 10) {
            address2 = address2 + ', ' + city
        } else if (address3 && address3.length <= 10) {
            address3 = address3 + ', ' + city
        } else {
            address3 = address3 + ' ' + city
        }

        if (district) {
            if (pinCode) {
                add2 = '<div>' + district + ' - ' + pinCode + '</div>'
            } else {
                var c = ''
                if (address3.indexOf(city) > -1 && address3.length < 10) {
                    c = address3 + ', '
                    address3 = ''
                } else if (address2.indexOf(city) > -1 && address2.length < 10) {
                    c = address2 + ', '
                    address2 = ''
                }

                add2 = '<div>' + c + district + '</div>'
            }
        } else if (pinCode) {
            add2 = '<div>' + pinCode + '</div>'
        }


    } else if (district) {
        if (pinCode) {
            add = '<div>' + district + ' - ' + pinCode + '</div>'
        } else {
            add = '<div>' + district + '</div>'
        }
    } else if (pinCode) {
        add = '<div>' + pinCode + '</div>'
    }


    var billTableDOM = $('<div style="font-family: monospace; margin-top:50px"> </div>') //$('#bill-table');
    // var billTableDOM = $('#bill-table');

    var headerHTML = '<header>' +
        '<div class="header-laxmi">LAXMI ROAD LINES</div>' +
        '<div style="padding-left: 16%; padding-right: 10%">' +
        '<div style="text-align: center">A/1, Shop No. 5, Chanakya Society, Lok Bharti Complex, Off Marol</div>' +
        '<div style="padding-left: 20%">Maroshi Road, Marol, Andheri (E), Mumbai - 400 059.</div>' +
        '</div>' +
        '<div style="padding-left: 35%">' +
        '<div>Visit us at: www.laxmiroadlines.com</div>' +
        '<div>Email: brajeshm@laxmiroadlines.com</div>' +
        '<div>Phone: +91 932 173 1735, 779 820 5807</div>' +
        '<div>GSTIN: 27APVPM3241D1ZS</div>' +
        '<div>PAN: APVPM3241D</div>' +
        '</div>' +
        '</header>'

    var billAddressDetails = '<div style="padding-top: 20px">' +
        '<div style="width: 50%; float: left; padding-bottom: 20px">' +
        '<div>Bill To: </div>' +
        '<div>' + companyName + '</div>' +
        '<div>' + address1 + ' </div>' +
        '<div>' + address2 + ' </div>' +
        '<div>' + address3 + ' </div>' +
        add +
        add2 +
        (gstin ? '<div>GSTIN: ' + gstin + '</div>' : '') +
        '</div>' +
        '<div style="float: right">' +
        '<div>Bill No: ' + billNo + '</div>' +
        '<div>Date: ' + billingDate + '</div>' +
        '</div>' +
        '</div>'
    '</div>'

    var billTableHeader = '<div class="my-table-heading">' +
        '<div class="firstcolumn"> Sr.No </div>' +
        '<div class="secondcolumn"> Description </div>' +
        '<div class="thirdcolumn"> Quantity </div>' +
        '<div class="my-table-cell header-css"> Rate </div>' +
        '<div class="my-table-cell header-css"> Amount </div>' +
        '</div>'

    var table = $('<div class="my-table-table">' + '</div>')

    var container1 = $('<div class="container-table">' + '</div>')

    var rows = '<div class="my-table-row">' +
        '<div class="firstcolumn"> <p>1. </p> </div>' +
        '<div class="secondcolumn"> <p>Source: ' + source + ' </p></div>' +
        '<div class="thirdcolumn"> <p> ' + quantity + ' </p></div>' +
        '<div class="my-table-cell"> <p>₹ ' + rate + ' </p></div>' +
        '<div class="my-table-cell"> <p>₹ ' + rate + ' </p></div>' +
        '</div>' +

        '<div class="my-table-row">' +
        '<div class="firstcolumn"> <p>2. </p> </div>' +
        '<div class="secondcolumn"><p> Destination: ' + destination + ' </p></div>' +
        '<div class="thirdcolumn"><p></p> </div>' +
        '<div class="my-table-cell"><p></p></div>' +
        '<div class="my-table-cell"><p></p></div>' +
        '</div>' +

        '<div class="my-table-row">' +
        '<div class="firstcolumn"><p>3. </p></div>' +
        '<div class="secondcolumn"><p>Vehicle No: ' + vehicleNumber + ' </p></div>' +
        '<div class="thirdcolumn"><p></p></div>' +
        '<div class="my-table-cell"><p></p></div>' +
        '<div class="my-table-cell"><p></p></div>' +
        '</div>' +

        '<div class="my-table-row">' +
        '<div class="firstcolumn"><p>4. </p></div>' +
        '<div class="secondcolumn"><p>Shipment Date: ' + shippingDate + ' </p></div>' +
        '<div class="thirdcolumn"><p></p></div>' +
        '<div class="my-table-cell"><p></p></div>' +
        '<div class="my-table-cell"><p></p></div>' +
        '</div>' +

        '<div class="my-table-row">' +
        '<div class="firstcolumn"><p>5. </p></div>' +
        '<div class="secondcolumn"><p>Docket No: ' + docketNumber + ' </p></div>' +
        '<div class="thirdcolumn"><p></p></div>' +
        '<div class="my-table-cell"><p></p></div>' +
        '<div class="my-table-cell"><p></p></div>' +
        '</div>' +

        '<div class="my-table-row">' +
        '<div class="firstcolumn"><p>6. </p></div>' +
        '<div class="secondcolumn"><p>Docket charges</p></div>' +
        '<div class="thirdcolumn"><p></p></div>' +
        '<div class="my-table-cell"><p></p></div>' +
        '<div class="my-table-cell"><p> ₹ ' + docketCharges + ' </p></div>' +
        '</div>';

    var srNo = 6;
    var totalAmount = parseInt(docketCharges) + parseInt(rate)

    if (detentionCharges && detentionCharges != 0) {
        srNo++;
        totalAmount = totalAmount + parseInt(detentionCharges);

        rows = rows +
            '<div class="my-table-row">' +
            '<div class="firstcolumn"><p>' + srNo + '. </p></div>' +
            '<div class="secondcolumn"><p>Detention charges (' + detentionChargesRemark +
            ')</p></div>' +
            '<div class="thirdcolumn"><p></p></div>' +
            '<div class="my-table-cell"><p></p></div>' +
            '<div class="my-table-cell"><p> ₹ ' + detentionCharges + ' </p></div>' +
            '</div>'

    }

    if (overHeightCharges && overHeightCharges != 0) {
        srNo++;
        totalAmount = totalAmount + parseInt(overHeightCharges);

        rows = rows +
            '<div class="my-table-row">' +
            '<div class="firstcolumn"><p>' + srNo + '. </p></div>' +
            '<div class="secondcolumn"><p>Over height charges (' + overHeightChargesRemark +
            ')</p></div>' +
            '<div class="thirdcolumn"><p></p></div>' +
            '<div class="my-table-cell"><p></p></div>' +
            '<div class="my-table-cell"><p> ₹ ' + overHeightCharges + ' </p></div>' +
            '</div>'

    }

    if (fovCharges && fovCharges != 0) {
        srNo++;
        totalAmount = totalAmount + parseInt(fovCharges);

        rows = rows +
            '<div class="my-table-row">' +
            '<div class="firstcolumn"><p>' + srNo + '. </p></div>' +
            '<div class="secondcolumn"><p>FOV charges (' + fovChargesRemark +
            ')</p></div>' +
            '<div class="thirdcolumn"><p></p></div>' +
            '<div class="my-table-cell"><p></p></div>' +
            '<div class="my-table-cell"><p> ₹ ' + fovCharges + ' </p></div>' +
            '</div>'
    }

    if (loadingCharges && loadingCharges != 0) {
        srNo++;
        totalAmount = totalAmount + parseInt(loadingCharges);

        rows = rows +
            '<div class="my-table-row">' +
            '<div class="firstcolumn"><p>' + srNo + '. </p></div>' +
            '<div class="secondcolumn"><p>Loading / Unloading charges (' + loadingChargesRemark + ')</p></div>' +
            '<div class="thirdcolumn"><p></p></div>' +
            '<div class="my-table-cell"><p></p></div>' +
            '<div class="my-table-cell"><p> ₹ ' + loadingCharges + ' </p></div>' +
            '</div>'
    }

    if(gstCharges && gstCharges != 0) {
        srNo++;
        totalAmount = totalAmount + parseInt(gstCharges);

        rows = rows +
            '<div class="my-table-row">' +
            '<div class="firstcolumn"><p>' + srNo + '. </p></div>' +
            '<div class="secondcolumn"><p>GST charges</p></div>' +
            '<div class="thirdcolumn"><p></p></div>' +
            '<div class="my-table-cell"><p></p></div>' +
            '<div class="my-table-cell"><p> ₹ ' + gstCharges + ' </p></div>' +
            '</div>'

    }

    var totalAmountInWords = convertNumberToWords(totalAmount);

    var totalAmtInWordsDOM = '<div class="container-table">' +
        '<div class="my-table-row">' +
        '<div class="merge"><p>₹ (in words):  ' + totalAmountInWords + ' only</p></div>' +
        ' <div class="my-table-cell" style="width: 12.5%"><p>Total</p></div>' +
        ' <div class="my-table-cell"><p>₹  ' + totalAmount + ' </p></div>' +
        '</div>' +
        '</div>'

    var gstPaidByEle = '<div style="padding-top:10px">' +
                            '<b><u>Note</u>: </b> GST paid by ' + gstPaidBy +
                       '</div>'

    var footerContents = '<div style="padding-top: 110px">' +
        '<div style="width:40%; float: left; padding-bottom: 20px">' +
        '<div> Receiver&apos;s Sign</div>' +
        '</div>' +
        '<div style="float:right">' +
        '<div>Proprietor / Manager Sign</div>' +
        '</div>'
    '</div>'
    var footerMsg = '<div style=" padding-top: 60px; text-align: center">' +
        'Thank you for doing business with us' +
        '</div>'

    var mainDiv = $('<div></div>')

    container1.append(billTableHeader);
    container1.append(rows);
    table.append(container1);
    table.append(totalAmtInWordsDOM);
    mainDiv.append(table);


    billTableDOM.append(headerHTML);
    billTableDOM.append(billAddressDetails);
    billTableDOM.append(mainDiv);

    if (gstPaidBy) {
        billTableDOM.append(gstPaidByEle);
    }

    billTableDOM.append(footerContents);
    billTableDOM.append(footerMsg);

    if (newRow) {
        addBillDB(rowdata);

        if (onlyAdd) {
            window.location = '/'
            return
        }
    }

    billTableDOM.printThis({
        pageTitle: "",
        header: '',
        footer: '',
        beforePrint: function () {
            document.title = billNo
        },
        afterPrint: function () {
            document.title = 'Laxmi Road Lines Bills'

            if (newRow) {
                window.location = '/'
            }
        }

    });
};

function addBillDB(rowdata) {
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        type: "POST",
        url: '/api/addBillDetails',
        dataType: 'json',
        data: JSON.stringify(rowdata),
        success: function (data) {
            console.log("success")
        },
        error: function (err) {
            console.log("An error occurred")
        }

    })
}

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return decodeURIComponent(sParameterName[1]);
        }
    }
}


function genPDF() {
    getBillDetails()
    html2canvas($('#bill-table')[0]).then(function (canvas) {
        var img = canvas.toDataURL("image/png")
        var doc = new jsPDF()
        doc.addImage(img, 'JPEG', 10, 10);
        doc.save('test.pdf');
    })
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function printData(selectedRowData) {
    getBillDetails(selectedRowData)
}

$('#print-button').on('click', function () {
    printData();
});

function populateDataFromCache() {
    $('#print-add-form').hide();
    $('#add-bill').hide();

    var loadingCharges = {};
    var detentionCharges = {};
    var overHeightCharges = {};
    var fovCharges = {};
    var gstCharges = {};
    var gstPaidBy;

    var billDetails = JSON.parse(localStorage.getItem('billDetailCache'));
    var variousCharges = JSON.parse(billDetails.variousCharges);

    if (variousCharges) {
        loadingCharges = variousCharges.lc;
        detentionCharges = variousCharges.dc;
        overHeightCharges = variousCharges.ohc;
        fovCharges = variousCharges.fc;
        gstCharges = variousCharges.gc;
        gstPaidBy = variousCharges.gstPaidBy
    }

    $('#bill-no').val(billDetails.billNo);
    $('#source').val(billDetails.source);
    $('#destination').val(billDetails.destination);
    $('#shipping-date-val').val(billDetails.shipmentDate);
    $('#billing-date-val').val(billDetails.billSubmissionDate);
    $('#vehicle-num').val(billDetails.vehicleNumber);
    $('#docket-num').val(billDetails.docketNumber);
    $('#docket-charges').val(billDetails.docketCharges);
    $('#rate').val(billDetails.amount);
    $('#quantity').val(billDetails.quantity);
    $('#company-name-container').val(billDetails.companyName).trigger('change');

    $('#over-height-charges').val(overHeightCharges.c);
    $('#over-height-charges-remark').val(overHeightCharges.r);

    $('#detention-charges').val(detentionCharges.c);
    $('#detention-charges-remark').val(detentionCharges.r);

    $('#fov-charges').val(fovCharges.c);
    $('#fov-charges-remark').val(fovCharges.r);

    $('#loading-charges').val(loadingCharges.c);
    $('#loading-charges-remark').val(loadingCharges.r);

    $('input:checkbox[name="gst-paid-by"][value="' + gstPaidBy + '"]').attr('checked', true);

    if (gstCharges) {
        $('#gst-charges').val(gstCharges.c);
    }

}

function convertNumberToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
}

function updateServerDb() {
    var csrftoken = getCookie('csrftoken');

    var billNo = $('#bill-no').val();
    var source = $('#source').val();
    var destination = $('#destination').val();
    var shippingDate = $('#shipping-date-val').val();
    var billingDate = $('#billing-date-val').val();
    var vehicleNumber = $('#vehicle-num').val();
    var docketNumber = $('#docket-num').val();
    var docketCharges = $('#docket-charges').val();
    var rate = $('#rate').val();
    var quantity = $('#quantity').val();
    var companyName = $('#company-name-container').val();
    var address = $('#address').val();
    var district = $('#district').val();
    var city = $('#city').val();
    var pinCode = $('#pin-code').val();
    var gstin = $('#gstin').val();
    var gstPaidBy = $("input[name='gst-paid-by']:checked").val();

    var overHeightCharges = $('#over-height-charges').val() || 0;
    var overHeightChargesRemark = $('#over-height-charges-remark').val() || '';
    var detentionCharges = $('#detention-charges').val() || 0;
    var detentionChargesRemark = $('#detention-charges-remark').val() || '';
    var fovCharges = $('#fov-charges').val() || 0;
    var fovChargesRemark = $('#fov-charges-remark').val() || '';
    var loadingCharges = $('#loading-charges').val() || 0;
    var loadingChargesRemark = $('#loading-charges-remark').val() || '';

    var gstCharges = $('#gst-charges').val() || 0;
    var gstChargesRemark = '';

    var variousCharges = {
        "lc": {
            "r": loadingChargesRemark,
            "c": loadingCharges
        },
        "ohc": {
            "r": overHeightChargesRemark,
            "c": overHeightCharges
        },
        "dc": {
            "r": detentionChargesRemark,
            "c": detentionCharges
        },
        "fc": {
            "r": fovChargesRemark,
            "c": fovCharges
        },
        "gc": {
            "r": gstChargesRemark,
            "c": gstCharges
        },
        "gstPaidBy": gstPaidBy
    };

    rowdata = {
        "billNo": billNo,
        "source": source,
        "destination": destination,
        "amount": rate,
        "gst_in": gstin,
        "companyName": companyName,
        "companyAddress": address,
        "shipmentDate": shippingDate,
        "billSubmissionDate": billingDate,
        "docketNumber": docketNumber,
        "docketCharges": docketCharges,
        "vehicleNumber": vehicleNumber,
        "quantity": quantity,
        "variousCharges": variousCharges
    };

    var data = JSON.stringify(rowdata);


    $.ajax({
        type: "POST",
        url: '/api/updateBillDetails',
        dataType: 'json',
        data: data,
        success: function (data) {
            console.log("success");
            window.location = '/'
        },
        error: function (err) {
            console.log("An error occurred " + err)
        }

    })
}