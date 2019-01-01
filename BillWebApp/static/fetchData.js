function getAllBillDetails() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        async: false,
        url: '/api/getBillDetails',
        contentType: 'application/json',
        success: function (data) {
            gridDataAdapter = prepareDataForGrid(data.data)
            dataAdapter = new $.jqx.dataAdapter(prepareDataForGrid(data.data));
            makeTable(dataAdapter, data.data)
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
        cellhover: function (element, pageX, pageY) {
            // update tooltip.
            $("#grid").jqxTooltip({content: element.innerHTML});
            // open tooltip.
            $("#grid").jqxTooltip('open', pageX + 15, pageY + 15);
        },
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
            {name: 'fovCharges', type: 'number'},
            {name: 'overHeightCharges', type: 'number'},
            {name: 'vehicleNumber', type: 'string'},
            {name: 'isPaymentDone', type: 'bool'},
            {name: 'quantity', type: 'string'},
            // {name: 'total', type:'number'}
        ]
    }

    return source
}


function makeTable(dataAdapter, gridData) {
    var tooltiprenderer = function (element) {
        $(element).jqxTooltip({position: 'mouse', content: $(element).text()});
    }

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
        enabletooltips: true,
        ready: function () {
            var filterCells = $("#grid .jqx-grid-cell-filter-row");
            var dateFilterCell1 = $(filterCells[8]);
            var dateFilterCell2 = $(filterCells[9]);

            dateFilterCell1.mouseover(function () {
                var newContent = $("#grid .jqx-grid-cell-filter-row:eq(8) input").val();
                if (newContent) {
                     dateFilterCell1.jqxTooltip({content: newContent});
                }
            });

            dateFilterCell2.mouseover(function () {
                var newContent = $("#grid .jqx-grid-cell-filter-row:eq(9) input").val();
                if (newContent) {
                    dateFilterCell2.jqxTooltip({content: newContent});
                }
            });
        },
        columns: [

            {
                text: 'Bill No', columntype: 'textbox', editable: false, filtertype: 'textbox',
                datafield: 'billNo', width: '7%', menu:false,
                cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                    return "<div style='margin: 4px;'>" + value + "</div>";

                }
            },
            {
                text: 'Docket No', filtertype: 'textbox', datafield: 'docketNumber', width: 100,
                columntype: 'textbox', menu:false
            },
            {
                text: 'Company Name', filtertype: 'textbox', datafield: 'companyName',
                width: "18%", columntype: 'textbox', menu:false
            },
            {
                text: 'Total Amount', editable: false, datafield: 'total',
                rendered: tooltiprenderer, exportable:true, menu:false,
                cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                    var rowFullData = dataAdapter.records[index]
                    var total = rowFullData.amount + rowFullData.docketCharges + rowFullData.fovCharges +
                        rowFullData.overHeightCharges;

                    return "<div style='margin: 4px;' class='jqx-right-align'>" +
                        convertNumberToCurrency(total) +
                        "</div>";
                }
            },
            {text: 'Payment Done', columntype: 'checkbox', datafield: 'isPaymentDone',
                filtertype: 'bool' , menu:false},
            {text: 'Source', filtertype: 'textbox', datafield: 'source', width: "15%",
                columntype: 'textbox' , menu:false},
            {text: 'Destination', filtertype: 'textbox', datafield: 'destination',
                width: "15%", columntype: 'textbox' , menu:false},
            {
                text: 'Shipment Date', datafield: 'shipmentDate', columntype: 'datetimeinput',
                filtertype: 'range', width: 120, cellsformat: 'dd-MM-yyyy',menu:false
            },
            {
                text: 'Bill Submission Date', datafield: 'billSubmissionDate', columntype: 'datetimeinput',
                filtertype: 'range', width: 120, cellsformat: 'dd-MM-yyyy',
                rendered: tooltiprenderer , menu:false
            },
            {
                text: 'Vehicle No',
                filtertype: 'textbox',
                datafield: 'vehicleNumber',
                width: "10%",
                columntype: 'textbox', menu:false
            },
            {
                text: 'Amount', datafield: 'amount', columntype: 'numberinput', width: "7%",
                filtertype: 'numberinput', menu:false,
                cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                    return "<div style='margin: 4px;'>" + convertNumberToCurrency(value) + "</div>";

                }
            },
            {
                text: 'Docket Charges', datafield: 'docketCharges', columntype: 'numberinput',
                filtertype: 'numberinput', menu:false,
                cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                    return "<div style='margin: 4px;'>" + convertNumberToCurrency(value) + "</div>";

                }
            },
            {
                text: 'FOV Charges', datafield: 'fovCharges', columntype: 'numberinput',
                filtertype: 'numberinput', menu:false,
                cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                    return "<div style='margin: 4px;'>" + convertNumberToCurrency(value) + "</div>";

                }
            },
            {
                text: 'Over Height Charges', datafield: 'overHeightCharges', columntype: 'numberinput',
                filtertype: 'numberinput', rendered: tooltiprenderer , width:120, menu:false,
                cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                    return "<div style='margin: 4px;'>" + convertNumberToCurrency(value) + "</div>";

                }
            },
            {
                text: 'Address', filtertype: 'textbox', datafield: 'companyAddress',
                columntype: 'textbox', hidden: true
            },
            {
                text: 'GSTIN', datafield: 'gst_in', columntype: 'textbox', filtertype:
                'textbox', width: 120 , menu:false
            },
            {
                text: 'Quantity', datafield: 'quantity', columntype: 'textbox',
                filtertype: 'textbox', width: 100 , menu:false
            },
        ]
    });
}

function updateServerDb(rowdata, commit) {
    $.ajax({
        type: "POST",
        url: '/api/updateBillDetails',
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