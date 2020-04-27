$(document).ready(function () {
    $('#success').on('click', function () {
        $('.body-message').html('');
        $('.popup-background').hide();
        $('#success-message').hide();
    });
    $('#numOfEntries').on('change', function () {
        changeEntries($(this).val());
    });
    $('#nextPage').on('click', nextPage);
    $('#previousPage').on('click', previousPage);
});

function showMessageSuccess(message) {
    $('.body-message').html(message);
    $('#success-message').show();
}

function changeEntries(num) {
    if (num === curEntriesNum) return;
    curEntriesNum = num;
    returnPageOne();
    updateTotal();
}

var curEntriesNum = 5;
var totalPage;
var curPage = 1;

function updateTotal() {
    var total = $('#table-input tr').length;
    $('#footerTotal span').html(total);
    $('#footerPageSize span').html(curEntriesNum);
    var base = total / curEntriesNum;
    if (total < curEntriesNum) totalPage = 1;
    else
        totalPage = Math.round(total / curEntriesNum);
    if (totalPage < base) {
        var remainder = total % curEntriesNum;
        if (remainder > 0 && remainder !== total) totalPage++;
    }
}

function returnPageOne() {
    curPage = 0;
    nextPage();
}

function reachLastPage() {
    curPage = totalPage - 1;
    nextPage();
}

function nextPage() {
    if (curPage + 1 > totalPage) return;
    var rows = $('#table-input tr');
    rows.hide();
    var first = curPage * curEntriesNum;
    for (var i = first; i < parseInt(first) + parseInt(curEntriesNum); i++) {
        $(rows[i]).show();
    }
    curPage++;
    $('#footerCurPage span').html(curPage);
}

function previousPage() {
    if (curPage - 1 === 0) return;
    var rows = $('#table-input tr');
    rows.hide();
    var first = (curPage - 2) * curEntriesNum;
    for (var i = first; i < parseInt(first) + parseInt(curEntriesNum); i++) {
        $(rows[i]).show();
    }
    curPage--;
    $('#footerCurPage span').html(curPage);
}


function sortColumnText(table_id, sortColumn) {
    var tableData = document.getElementById(table_id).getElementsByTagName('tbody').item(0);
    var rowData = tableData.getElementsByTagName('tr');
    for (var i = 0; i < rowData.length - 1; i++) {
        for (var j = 0; j < rowData.length - (i + 1); j++) {
            if ((rowData.item(j).getElementsByTagName('td').item(sortColumn).getElementsByTagName('data')[0].value).toLowerCase() >
                (rowData.item(j + 1).getElementsByTagName('td').item(sortColumn).getElementsByTagName('data')[0].value).toLowerCase()) {
                tableData.insertBefore(rowData.item(j + 1), rowData.item(j));
            }
        }
    }
    returnPageOne();
}

function sortColumnTextReverse(table_id, sortColumn) {
    var tableData = document.getElementById(table_id).getElementsByTagName('tbody').item(0);
    var rowData = tableData.getElementsByTagName('tr');
    for (var i = 0; i < rowData.length - 1; i++) {
        for (var j = 0; j < rowData.length - (i + 1); j++) {
            if ((rowData.item(j).getElementsByTagName('td').item(sortColumn).getElementsByTagName('data')[0].value).toLowerCase() <
                (rowData.item(j + 1).getElementsByTagName('td').item(sortColumn).getElementsByTagName('data')[0].value).toLowerCase()) {
                tableData.insertBefore(rowData.item(j + 1), rowData.item(j));
            }
        }
    }
    returnPageOne();
}

function sortColumnNumber(table_id, sortColumn) {
    var tableData = document.getElementById(table_id).getElementsByTagName('tbody').item(0);
    var rowData = tableData.getElementsByTagName('tr');
    for (var i = 0; i < rowData.length - 1; i++) {
        for (var j = 0; j < rowData.length - (i + 1); j++) {
            if (parseInt(rowData.item(j).getElementsByTagName('td').item(sortColumn).getElementsByTagName('data')[0].value, 10) >
                parseInt(rowData.item(j + 1).getElementsByTagName('td').item(sortColumn).getElementsByTagName('data')[0].value, 10)) {
                tableData.insertBefore(rowData.item(j + 1), rowData.item(j));
            }
        }
    }
    returnPageOne();
}

function sortColumnNumberReverse(table_id, sortColumn) {
    var tableData = document.getElementById(table_id).getElementsByTagName('tbody').item(0);
    var rowData = tableData.getElementsByTagName('tr');
    for (var i = 0; i < rowData.length - 1; i++) {
        for (var j = 0; j < rowData.length - (i + 1); j++) {
            if (parseInt(rowData.item(j).getElementsByTagName('td').item(sortColumn).getElementsByTagName('data')[0].value, 10) <
                parseInt(rowData.item(j + 1).getElementsByTagName('td').item(sortColumn).getElementsByTagName('data')[0].value, 10)) {
                tableData.insertBefore(rowData.item(j + 1), rowData.item(j));
            }
        }
    }
    returnPageOne();
}

function showModalErrorMessage(form, messageClass, message) {
    $('#' + form + ' .error-' + messageClass).html(message);
    $('#' + form + ' .error-' + messageClass).css('display', 'block');
}
