function getAllBillDetails() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        async: false,
        url: 'http://127.0.0.1:8100/api/getBillDetails',
        contentType: 'application/json',
        success: function (data) {
            var dataAdapter = new $.jqx.dataAdapter(prepareDataForGrid(data.data));
            makeTable(dataAdapter)
            $('#new-bill').attr('href', $('#new-bill').attr('href') + '?billNo=' + data.newBillNo)

        },
        error: function (err) {
            console.log("An error occurred " + err)
        }
    })
}


function prepareDataForGrid(data) {
    var source = {
        localdata: data,
        dataType: 'array',
        updaterow: function (rowid, rowdata, commit) {
            var dataAdapter = new $.jqx.dataAdapter(rowdata);
            var billSubmissionDate = dataAdapter.formatDate(rowdata.billSubmissionDate, 'dd-MM-yyyy')
            var shipmentDate = dataAdapter.formatDate(rowdata.shipmentDate, 'dd-MM-yyyy')

            rowdata['billSubmissionDate'] = dataAdapter.formatDate(rowdata.billSubmissionDate, 'yyyy-MM-dd')
            rowdata['shipmentDate'] = dataAdapter.formatDate(rowdata.shipmentDate, 'yyyy-MM-dd')

            updateServerDb(rowdata, commit);
        },
        datafields: [
            {name: 'billNo', type: 'number'},
            {name: 'source', type: 'string'},
            {name: 'destination', type: 'string'},
            {name: 'amount', type: 'number'},
            {name: 'companyAddress', type: 'string'},
            {name: 'shipmentDate', type: 'date'},
            {name: 'billSubmissionDate', type: 'date'},
            {name: 'docketNumber', type: 'number'},
            {name: 'gst_in', type: 'string'},
            {name: 'companyName', type: 'string'},
            {name: 'docketCharges', type: 'number'},
            {name: 'vehicleNumber', type: 'string'},
            {name: 'isPaymentDone', type: 'bool'},
            {name: 'quantity', type: 'string'},
        ]
    }

    return source
}


function makeTable(dataAdapter) {
    $("#grid").jqxGrid({
        width: '100%',
        source: dataAdapter,
        editable: true,
        selectionmode: 'singlerow',
        editmode: 'selectedrow',
        filterable: true,
        showfilterrow: true,
        pageable: true,
        autoheight: true,
        columnsresize: true,
        sortable: true,
        altrows: true,
        columns: [

            {
                text: 'Bill No', columntype: 'textbox', filtertype: 'textbox', datafield: 'billNo', width: '8%',
                cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                    return "<div style='margin: 4px;'>" + convertNumberToCurrency(value) + "</div>";

                }
            },
            {text: 'Source', filtertype: 'textbox', datafield: 'source', width: "20%", columntype: 'textbox'},
            {text: 'Destination', filtertype: 'textbox', datafield: 'destination', width: "20%", columntype: 'textbox'},
            {
                text: 'Company Name',
                filtertype: 'textbox',
                datafield: 'companyName',
                width: "20%",
                columntype: 'textbox'
            },
            {
                text: 'Amount', datafield: 'amount', columntype: 'numberinput', width: "10%",
                filtertype: 'numberinput',
                cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                    return "<div style='margin: 4px;'>" + convertNumberToCurrency(value) + "</div>";

                }
            },
            {
                text: 'Shipment Date', datafield: 'shipmentDate', columntype: 'datetimeinput',
                filtertype: 'date', width: 150, cellsformat: 'dd-MM-yyyy'
            },
            {
                text: 'Bill Submission Date', datafield: 'billSubmissionDate', columntype: 'datetimeinput',
                filtertype: 'date', width: 150, cellsformat: 'dd-MM-yyyy',
            },
            {
                text: 'Vehicle No',
                filtertype: 'textbox',
                datafield: 'vehicleNumber',
                width: "10%",
                columntype: 'textbox'
            },
            {
                text: 'Docket Charges', datafield: 'docketCharges', columntype: 'numberinput',
                filtertype: 'numberinput',
                cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                    var total = 1000; //(some calculation is done)
                    return "<div style='margin: 4px;'>" + convertNumberToCurrency(value) + "</div>";

                }
            },
            {
                text: 'Address', filtertype: 'textbox', datafield: 'companyAddress', width: 220,
                columntype: 'textbox', hidden: true
            },
            {
                text: 'Docket Number', filtertype: 'textbox', datafield: 'docketNumber', width: 130,
                columntype: 'textbox'
            },
            {
                text: 'GSTIN', datafield: 'gst_in', columntype: 'textbox', filtertype: 'textbox', width: 150
            },
            {text: 'Is Payment Done', columntype: 'checkbox', datafield: 'isPaymentDone'},
            {
                text: 'Quantity', datafield: 'quantity', columntype: 'textbox', filtertype: 'textbox', width: 150,
                hidden: true
            },
        ]
    });
}

function updateServerDb(rowdata, commit) {
    $.ajax({
        type: "POST",
        url: 'http://127.0.0.1:8100/api/updateBillDetails',
        dataType: 'json',
        data: rowdata,
        success: function (data) {
            console.log("success")
            commit(true)
        },
        error: function (err) {
            console.log("An error occurred " + err)
            commit(false)
        }

    })
}

function convertNumberToCurrency(number) {
    number = number.toString();
    var lastThree = number.substring(number.length - 3);
    var otherNumbers = number.substring(0, number.length - 3);

    if (otherNumbers != '')
        lastThree = ',' + lastThree;

    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    return ' ₹ ' + res;
}