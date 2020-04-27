var sanbongs = [];
var update_link = '';

$(document).ready(function () {

    if(sessionStorage.getItem("islogined")==="true"){
        $('.username-text').html(sessionStorage.getItem("adminTen"));
        $('.inf-name').html(sessionStorage.getItem("adminTen"));
        $('.inf-email').html(sessionStorage.getItem("adminEmail"));
        $('.avatar').prop('src', sessionStorage.getItem("adminAnhbia"));
        $('.user-logo img').prop('src', sessionStorage.getItem("adminAnhbia"));
        
    }
    else{
        window.location.href = "/Quanlybatdoi/login.html";
    }

    initMasterEvents();

    getSanBongs();
    $('#btnAddGroup').on('click', function () {
        clearFormAdd();
        loadAddSanBongModal();
    });
    $('#close-add').on('click', function () {
        $('.popup-background').fadeOut(function () {
            $('#formadd').hide();
        });
    });
    $('#submit-add').on('click', function () {
        clearFormAdd();
        showLoadingGif(sendAddSanBongRequest);
    });
    $('#submit-edit').on('click', function () {
        clearFormEdit();
        showLoadingGif(sendEditSanBongRequest);
    });
    $('#submit-remove').on('click', function () {
        showLoadingGif(sendRemoveSanBongRequest);
    });
    $('#close-edit').on('click', function () {
        $('.popup-background').fadeOut(function () {
            $('#formedit').hide();
        });
    });
    $('#close-remove').on('click', function () {
        $('.popup-background').fadeOut(function () {
            $('#formRemove').hide();
        });
    });

    initSortEvent();
});

function reload(){
    clearTable();
    getSanBongs();
    returnPageOne();
}

function clearInp() {
    document.getElementsByTagName("input").value = "";
}

function searchSanBong() {
    var input, filter, table, tr, i;
    input = document.getElementById("input-search");
    filter = input.value.trim().toUpperCase();
    table = document.getElementById("table-group");
    tr = table.getElementsByTagName("tr");
    if (filter === "") {
        curPage--;
        nextPage();
    } else {
        for (i = 0; i < tr.length; i++) {
            if (tr[i].getElementsByTagName("td")[1]) {
                if (tr[i].getElementsByTagName("td")[1].textContent.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

function initSortEvent() {
    var name = 1;
    $('#sortGroupName').on('click', function () {
        if (name % 2 === 1) sortColumnText('table-group', 1);
        else sortColumnTextReverse('table-group', 1);
        name++;
    });
}

function getSanBongs() {
    $.ajax({
        url: 'http://192.168.0.103/ApiDoAn/public/api/sanbong',
        method: 'GET',
        success: function (jqXHR) {
            loadSanBongs(jqXHR);
            console.log(jqXHR);
        }
    });
}

function loadSanBongs(jqXHR) {
    $.each(jqXHR, function (i) {
        var sanbong = jqXHR[i];
        sanbongs.push({
            id: sanbong.id,
            ten: sanbong.ten,
            songuoi: sanbong.songuoi,
            diachi: sanbong.diachi,
            mota: sanbong.mota,
            sdt: sanbong.sdt,
            link: sanbong.link,
        })
    });
    addSanBongsToTable();
}

function addSanBongsToTable() {
    var tbody = $('#table-input');
    var count = 1;
    sanbongs.forEach(function (r) {
        count = addRow(r, count, tbody);
    });
    updateTotal();
}

function addRow(r, count, tbody) {
    // create row
    var row = $('<tr></tr>');
    if (count > curEntriesNum) {
        row.css('display', 'none');
    }
    var index = count - 1;
    // create # cell
    var numOrder = $('<td class="cell-num"></td>').text(count);
    // create name cell
    var ten = $('<td class="cell-ten"></td>');
    var tenVal = $('<data></data>').text(r.ten.toUpperCase());
    tenVal.val(r.ten);
    ten.append(tenVal);
    //
    var songuoi = $('<td class="cell-songuoi"></td>');
    var songuoiVal = $('<data></data>').text(r.songuoi);
    songuoiVal.val(r.songuoi);
    songuoi.append(songuoiVal);
    //
    var diachi = $('<td class="cell-diachi"></td>');
    var diachiVal = $('<data></data>').text(r.diachi);
    diachiVal.val(r.diachi);
    diachi.append(diachiVal);
     //
    var mota = $('<td class="cell-mota"></td>');
    var motaVal = $('<data></data>').text(r.mota);
    motaVal.val(r.mota);
    mota.append(motaVal);
    //
    var sdt = $('<td class="cell-sdt"></td>');
    var sdtVal = $('<data></data>').text(r.sdt);
    sdtVal.val(r.sdt);
    sdt.append(sdtVal);

    var link = $('<td class="cell-link"></td>');
    var linkVal = $('<data></data>').text(r.link);
    linkVal.val(r.link);
    link.append(linkVal);

    // create action cell
    var action = $('<td class="action cell-action"></td>');
    var actionEdit = $('<i class="fa fa-pencil overlay" style="color:#f26903"></i>');
    actionEdit.on('click', function () {
        clearFormEdit();
        loadEditSanBongModal(index);
    });
    var actionDelete = $('<i class="fa fa-trash-o overlay" style="color:#f26903"></i>');
    actionDelete.on('click', function () {
        loadRemoveSanBongModal(index);
    });
    action.append(actionEdit, actionDelete);
    // add all cell to row
    row.append(numOrder, ten, songuoi, diachi, mota, sdt, action);
    // add row to table
    tbody.append(row);
    // increase index by 1
    count++;
    return count;
}

function loadAddSanBongModal(index) {
    initSanBongImgAddEvents();

    $('.edit-id').html('');
    $('#formadd input[name="ten"]').val('');
    $('#formadd input[name="songuoi"]').val('');
    $('#formadd input[name="diachi"]').val('');
    $('#formadd input[name="mota"]').val('');
    $('#formadd input[name="sdt"]').val('');
    $('#formadd .sanbongImg').prop('src', 'content/image/Product.png');

    $('.popup-background').show();
    $('#formadd').show();
}

function loadEditSanBongModal(index) {
    initSanBongImgEditEvents();

    var sanbong = sanbongs[index];
    $('.edit-id').html(sanbong.id);
    $('.edit-index').html(index);
    $('#formedit input[name="ten"]').val(sanbong.ten);
    $('#formedit input[name="songuoi"]').val(sanbong.songuoi);
    $('#formedit input[name="diachi"]').val(sanbong.diachi);
    $('#formedit input[name="mota"]').val(sanbong.mota);
    $('#formedit input[name="sdt"]').val(sanbong.sdt);
    $('#formedit .sanbongImg').prop('src', sanbong.link);
    update_link = sanbong.link;
    $('.popup-background').show();
    $('#formedit').show();
}

function loadRemoveSanBongModal(index) {
    var sanbong = sanbongs[index];
    $('.remove-index').html(index);
    $('.popup-background').show();
    $('#formRemove').show();
    $('.remove-id').html(sanbong.id);
}

function sendAddSanBongRequest() {
    validateForm('formadd');
}

function sendEditSanBongRequest() {
    validateForm('formedit');
}

function sendRemoveSanBongRequest() {
    var id = $('.remove-id').html();
    console.log(id);
    $.ajax({
        url: 'http://192.168.0.103/ApiDoAn/public/api/sanbong/' + id,
        method: 'DELETE',
        success: function () {
            $('.popup-background').fadeOut(function () {
                hideLoadingGif();
                showMessageSuccess('Sân bóng đã được xóa');
                $('#formRemove').hide();
            });
            reload();
        },
        error: function () {
            showMessageSuccess("error");
        }
    });
}

/**
 * Validate multiple SanBong form
 * @param formId form html id
 */
function validateForm(formId) {
    var ajaxMethod = 'POST';
    var formSelector = '#' + formId + ' ';
    // get form values
    var ten = $(formSelector + 'input[name="ten"]').val().trim();
    var songuoi = $(formSelector + 'input[name="songuoi"]').val().trim();
    var diachi = $(formSelector + 'input[name="diachi"]').val().trim();
    var mota = $(formSelector + 'input[name="mota"]').val().trim();
    var sdt = $(formSelector + 'input[name="sdt"]').val().trim();
    var link = update_link;

    var id = -1;
    if (formId === 'formedit') {
        id = $('.edit-id').html();
        ajaxMethod = 'PUT';
    }
    var valid = true;
    if(ajaxMethod === 'POST'){
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            url: 'http://192.168.0.103/ApiDoAn/public/api/sanbong',
            method: ajaxMethod,
            data: JSON.stringify({
                "ten": ten,
                "songuoi": songuoi,
                "diachi": diachi,
                "mota": mota,
                "sdt": sdt,
                "link": link,
            }),
            success: function (jqXHR) {
                $('.popup-background').fadeOut(function () {
                    reload();
                    $('#formadd').fadeOut(function () {
                        showMessageSuccess('Sân bóng đã được tạo');
                    });
                    hideLoadingGif();
                });
                $(formSelector).hide();
            },
            error: function (xhr) {
                showModalErrorMessage(formId, 'server', JSON.parse(xhr.responseText).message);
                hideLoadingGif();
            },
            statusCode: {
                500: function () {
                }
            }
        });
    } else {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            url: 'http://192.168.0.103/ApiDoAn/public/api/sanbong/'+id,
            method: ajaxMethod,
            data: JSON.stringify({
                "id": id,
                "ten": ten,
                "songuoi": songuoi,
                "diachi": diachi,
                "mota": mota,
                "sdt": sdt,
                "link": link
            }),
            success: function (jqXHR) {
                $('.popup-background').fadeOut(function () {
                    updateSanBong(ten, songuoi, diachi, mota, sdt, link, $('.edit-index').html());
                    console.log(id);
                    $('#formedit').fadeOut(function () {
                        showMessageSuccess('Sân bóng đã được cập nhật');
                    });
                    hideLoadingGif();
                });
                $(formSelector).hide();
            },
            error: function (xhr) {
                showModalErrorMessage(formId, 'server', JSON.parse(xhr.responseText).message
                );
                hideLoadingGif();
            },
            statusCode: {
                500: function () {

                }
            }
        });
    }
}

function addCreatedSanBong(jqXHR) {
    reload();
}

function updateSanBong(ten, songuoi, diachi, mota, sdt, link, index) {
    var row = $('#table-input tr')[index];

    var sanbong = sanbongs[index];
    var tenData = $(row).children('.cell-ten').children();
    tenData.html(ten);
    tenData.val(ten);
    sanbong.ten = ten;
    //
    var songuoiData = $(row).children('.cell-songuoi').children();
    songuoiData.html(songuoi);
    songuoiData.val(songuoi);
    sanbong.songuoi = songuoi;
    //
    var diachiData = $(row).children('.cell-diachi').children();
    diachiData.html(diachi);
    diachiData.val(diachi);
    sanbong.diachi = diachi;
    //
    var motaData = $(row).children('.cell-mota').children();
    motaData.html(mota);
    motaData.val(mota);
    sanbong.mota = mota;
    //
    var sdtData = $(row).children('.cell-sdt').children();
    sdtData.html(sdt);
    sdtData.val(sdt);
    sanbong.sdt = sdt;

    var linkData = $(row).children('.cell-link').children();
    linkData.html(link);
    linkData.val(link);
    sanbong.link = link;

}

function clearFormEdit() {
    $('#formedit input[name="name"]').removeClass('red-border');
    $('.valid-name').removeClass("dangerous-form");
    $('.valid-name .error-name').html('');
    $('#formedit .error-message').css('display', 'none');
}

function clearFormAdd() {
    $('#formadd input[name="name"]').removeClass('red-border');
    $('.valid-name').removeClass("dangerous-form");
    $('.valid-name .error-name').html('');
    $('#formadd .error-message').css('display', 'none');
}

function clearTable() {
    sanbongs = [];
    $('#table-input').empty();
}

function initSanBongImgEditEvents() {
    $('#formedit .sanbong-upload').on('click', function () {
        $('input[name="upload-edit"]').click();
    });
    document.getElementById('linkEdit').addEventListener('change', function (e) {
        
        var file = e.target.files[0];
        var formData = new FormData();
        formData.append('uploaded_file', file);
        console.log("edit");
        $.ajax({
            url: 'http://192.168.0.103/ApiDoAn/public/api/upload',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (jqXHR) {
                update_link = 'http://192.168.0.103/ApiDoAn/public/images/'+jqXHR;
                $('#formedit .sanbongImg').prop('src', update_link);
            },
            error: function (xhr) {
                showMessageSuccess(JSON.parse(xhr.responseText).message);
            }
        });
        this.value = '';
    }, false)
}

function initSanBongImgAddEvents() {
    $('#formadd .sanbong-upload').on('click', function () {
        $('input[name="upload-add"]').click();
    });
    document.getElementById('linkAdd').addEventListener('change', function (e) {
        console.log("Add");
        var file = e.target.files[0];
        var formData = new FormData();
        formData.append('uploaded_file', file);
        console.log(formData);
        $.ajax({
            url: 'http://192.168.0.103/ApiDoAn/public/api/upload',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (jqXHR) {
                update_link = 'http://192.168.0.103/ApiDoAn/public/images/'+jqXHR;
                $('#formadd .sanbongImg').prop('src', update_link);
            },
            error: function (xhr) {
                showMessageSuccess(JSON.parse(xhr.responseText).message);
            }
        });
        this.value = '';
    }, false)
}