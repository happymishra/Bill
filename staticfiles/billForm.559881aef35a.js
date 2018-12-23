var getBillDetails = function (rowdata) {
    console.log("Hello");
    var newRow = true;

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
    var companyName = $('#company-name').val();
    var address = $('#address').val();
    var district = $('#district').val();
    var city = $('#city').val();
    var pinCode = $('#pin-code').val();
    var gstin = $('#gstin').val();
    var overHeightCharges = $('#over-height-charges').val();
    var detentionCharges = $('#detention-charges').val();
    var fovCharges = $('#fov-charges').val();

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
        district = rowdata.district;
        city = rowdata.city;
        pinCode = rowdata.pinCode;
        gstin = rowdata['gst_in'];
        overHeightCharges = rowdata.overHeightCharges || 0;
        detentionCharges = rowdata.detentionCharges || 0;
        ovCharges = rowdata.fovCharges || 0;
    }

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
        'vehicleNumber': vehicleNumber,
        'overHeightCharges': overHeightCharges,
        'detentionCharges': detentionCharges,
        'fovCharges': fovCharges,
        'quantity': quantity
    };


    // address = 'A/1, Shop No. 5, Chanakya Society, Lok Bharti Complex, Off Marol Maroshi Road, Marol'

    var add = '', add2 = '';
    var lenAddress = address.length;
    var address1 = address;
    var address2 = '';
    var address3 = '';

    if (lenAddress > 20) {
        var commaIndex = address.indexOf(',', 20)
        address1 = address.substring(0, commaIndex + 1)
        address22 = address.substring(commaIndex + 2)

        if (address22.length > 20) {
            var commaIndex = address22.indexOf(',', 20)
            address2 = address22.substring(0, commaIndex + 1)
            address3 = address22.substring(commaIndex + 2)
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
        }

        if (district) {
            if (pinCode) {
                add2 = '<div>' + district + ' - ' + pinCode + '</div>'
            } else {
                add2 = '<div>' + district + '</div>'
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


    // var billTableDOM = $('<div style="font-family: monospace"> </div>') //$('#bill-table');
    var billTableDOM = $('#bill-table');

    var headerHTML = '<header>' +
        '<div class="header-laxmi">LAXMI ROAD LINES</div>' +
        '<div style="padding-left: 16%; padding-right: 10%">' +
        '<div style="text-align: center">A/1, Shop No. 5, Chanakya Society, Lok Bharti Complex, Off Marol</div>' +
        '<div style="padding-left: 20%">Maroshi Road, Marol, Andheri (E), Mumbai - 400 059.</div>' +
        '</div>' +
        '<div style="padding-left: 35%">' +
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
        '<div class="my-table-cell"> <p>₹ ' + rate + ' /-</p></div>' +
        '<div class="my-table-cell"> <p>₹ ' + rate + ' /-</p></div>' +
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
        '<div class="my-table-cell"><p> ₹ ' + docketCharges + ' /-</p></div>' +
        '</div>';

    var srNo = 6;
    var totalAmount = parseInt(docketCharges) + parseInt(rate)

    if (detentionCharges && detentionCharges != 0) {
        srNo++;
        totalAmount = totalAmount + parseInt(detentionCharges);

        rows = rows +
            '<div class="my-table-row">' +
            '<div class="firstcolumn"><p>' + srNo + '. </p></div>' +
            '<div class="secondcolumn"><p>Detention charges</p></div>' +
            '<div class="thirdcolumn"><p></p></div>' +
            '<div class="my-table-cell"><p></p></div>' +
            '<div class="my-table-cell"><p> ₹ ' + detentionCharges + ' /-</p></div>' +
            '</div>'

    }

    if (overHeightCharges && overHeightCharges != 0) {
        srNo++;
        totalAmount = totalAmount + parseInt(overHeightCharges);

        rows = rows +
            '<div class="my-table-row">' +
            '<div class="firstcolumn"><p>' + srNo + '. </p></div>' +
            '<div class="secondcolumn"><p>Over height charges</p></div>' +
            '<div class="thirdcolumn"><p></p></div>' +
            '<div class="my-table-cell"><p></p></div>' +
            '<div class="my-table-cell"><p> ₹ ' + overHeightCharges + ' /-</p></div>' +
            '</div>'

    }

    if (fovCharges && fovCharges != 0) {
        srNo++;
        totalAmount = totalAmount + parseInt(fovCharges);

        rows = rows +
            '<div class="my-table-row">' +
            '<div class="firstcolumn"><p>' + srNo + '. </p></div>' +
            '<div class="secondcolumn"><p>FOV charges</p></div>' +
            '<div class="thirdcolumn"><p></p></div>' +
            '<div class="my-table-cell"><p></p></div>' +
            '<div class="my-table-cell"><p> ₹ ' + fovCharges + ' /-</p></div>' +
            '</div>'
    }

    var totalAmountInWords = convertNumberToWords(totalAmount);

    var totalAmtInWordsDOM = '<div class="container-table">' +
        '<div class="my-table-row">' +
        '<div class="merge"><p>₹ (in words):  ' + totalAmountInWords + ' only</p></div>' +
        ' <div class="my-table-cell" style="width: 12.5%"><p>Total</p></div>' +
        ' <div class="my-table-cell"><p>₹  ' + totalAmount + ' /-</p></div>' +
        '</div>' +
        '</div>'

    var footerContents = '<div style="padding-top: 60px">' +
        '<div style="width:40%; float: left; padding-bottom: 20px">' +
        '<div>Proprietor / Manager Sign</div>' +
        '</div>' +
        '<div style="float:right">' +
        '<div> Receiver&apos;s Sign</div>' +
        '</div>'
    '</div>'
    var footerMsg = '<div style=" padding-top: 30px">' +
        'Thank you for your business' +
        '</div>'

    var mainDiv = $('<div></div>')

    container1.append(billTableHeader)
    container1.append(rows);
    table.append(container1)
    table.append(totalAmtInWordsDOM)
    mainDiv.append(table)


    billTableDOM.append(headerHTML);
    billTableDOM.append(billAddressDetails);
    billTableDOM.append(mainDiv);
    billTableDOM.append(footerContents);
    billTableDOM.append(footerMsg);

    if (newRow) {
        addBillDB(rowdata)
    }


    billTableDOM.printThis({
        pageTitle: "THis is new",
        header: '',
        footer: '',
        beforePrint: function () {
            document.title = billNo
        },
        afterPrint: function () {
            document.title = 'Laxmi Road Lines Bills'
            window.location = '/'
        }

    });
}

function addBillDB(rowdata) {
    $.ajax({
        type: "POST",
        url: 'http://127.0.0.1:8100/api/addBillDetails',
        dataType: 'json',
        data: rowdata,
        success: function (data) {
            console.log("success")
        },
        error: function (err) {
            console.log("An error occurred")
        }

    })
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

function printData(selectedRowData) {
    getBillDetails(selectedRowData)
}

$('#print-button').on('click', function () {
    printData();
});

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