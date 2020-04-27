function showLoadingGif(callback) {
    $('#loading-gif').css('visibility', 'visible');
    if (callback) callback();
}

function hideLoadingGif() {
    $('#loading-gif').css('visibility', 'hidden');
}

function initMasterEvents() {
    adjustSidebarOnResize(); //resize hi size man hinh thay doi
    //addExpandEvent();// giong bam nut f11
    addModalEvent();  // can : show profile, dong profile qua close
    
    //initOpenGoogleAuthEvent();
    // initDisableGoogleCalendarSyncEvent();
    // initAvatarEvents();
    // getAvatar(); // avatar thoi
    $('a#btn-logout').on('click', function () {
        if (confirm('Are you sure you want to exit?')) {
            window.location.href = '/logout';
        }
    });
    $(window).on('resize', function () {
        adjustSidebarOnResize();
    });
}

function addModalEvent() {
    $(document).on('keyup', function (e) {
        if (e.key == "Escape") {
            $('.modal, .block, .search-result-modal').fadeOut();
        }
    });
    $('#btn-profile').on('click', function () {
        $('#profile').show();
    });
    $('.profile-footer button').on('click', function () {
        $('#profile').fadeOut();
    })
}

var expand = false;

function addExpandEvent() {
    $('.expand-icon i').on('click', function () {
        if (expand === false) {
            openFullscreen(document.documentElement);
            $(this).removeClass('fa-expand');
            $(this).addClass('fa-compress');
            expand = true;
        } else {
            closeFullscreen();
            $(this).removeClass('fa-compress');
            $(this).addClass('fa-expand');
            expand = false;
        }
    });
    $(document).on('keydown', function (e) {
        if (e.key === 'F11') {
            e.preventDefault();
            // if (expand === false) {
            //     $('.expand-icon i').removeClass('fa-expand');
            //     $('.expand-icon i').addClass('fa-compress');
            //     expand = true;
            // } else {
            //     $('.expand-icon i').removeClass('fa-compress');
            //     $('.expand-icon i').addClass('fa-expand');
            //     expand = false;
            // }
            $('.expand-icon i').click();
        }
    })
}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

/**
 * hide sidebar when window resize to smaller width
 */
function adjustSidebarOnResize() {
    if ($('.sidebar').css('width').split('px')[0] < 180) {
        $('.sidebar').hide();
        $('.main').css('width', '100%')
    } else {
        $('.sidebar').show();
        $('.main').css('width', '85%');
    }
}


/**
 * display latest events on sidebar
 * @param jqXHR
 */
function loadNewEvents(jqXHR) {
    var ul = $('.new-events ul');
    $.each(jqXHR, function (i) {
        var e = jqXHR[i];
        var li = $('<li></li>');
        var outer = $('<span></span>');
        var title = $('<span></span>').text(e.eventName);
        title.addClass('new-event-name');
        var br = $('<br>');
        var user = $('<span></span>').html('<b>Booker</b>: ' + e.userName);
        user.addClass('new-event-booker');
        outer.append(title, br, user);
        li.append(outer);
        ul.append(li);
    })
}

function initOpenGoogleAuthEvent() {
    $('#btn-gmail').on('click', function () {
        $.ajax({
            url: "/google/calendar/setup",
            method: "GET",
            success: function (jqXHR) {
                window.open(jqXHR)
            },
            error: function () {
                alert('Unable to connect to Google Service!');
            }
        })
    })
}

function initDisableGoogleCalendarSyncEvent() {
    $('#btn-disable-gmail').on('click', function () {
        $('#disableSync').show();
        $('#disableSync .disable-sync-confirm-modal').show();
    });

    $('#disableSync .closeBtn').on('click', function () {
        $('.disable-sync-confirm-modal').fadeOut(function () {
            $('#disableSync').hide();
        })
    });

    $('#confirmDisableSync').on('click', function () {
        showLoadingGif(function () {
            $.ajax({
                url: '/google/calendar/disable',
                method: 'GET',
                success: function () {
                    showMessageSuccess('Synchronization disabled!');
                    $('#disableSync .closeBtn').click();
                    hideLoadingGif();
                },
                error: function () {
                    showMessageSuccess('Unable to execute! Please try again later!');
                    $('#disableSync .closeBtn').click();
                    hideLoadingGif();
                }
            })
        });
    })
}

function initAvatarEvents() {
    $('.avatar-upload').on('click', function () {
        $('input[name="upload-avatar"]').click();
    });

    document.getElementById('uploadAvatar').addEventListener('change', function (e) {
        var file = e.target.files[0];
        var formData = new FormData();
        formData.append('image', file);
        //console.log(imageData.split('base64,')[1]);
        $.ajax({
            url: '/api/users/image',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (jqXHR) {
                updateAvatar(jqXHR);
            },
            error: function (xhr) {
                showMessageSuccess(JSON.parse(xhr.responseText).message);
            }
        });
        this.value = '';
    }, false)
}


function updateAvatar(avatar) {
    $('.avatar').prop('src', avatar);
    $('.user-logo img').prop('src', avatar);
    $('.welcome-user-logo img').prop('src', avatar);
}