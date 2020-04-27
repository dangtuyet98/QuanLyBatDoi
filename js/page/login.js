$(document).ready(function () {
    var loginF = new loginForm();
    loginF.initEvent();
});

$(document).on('keyup', function (e) {
    if (e.keyCode === 13)
        $('.btn-login').click();
});

class loginForm {
    constructor() {
    };

    initEvent() {

        if(sessionStorage.getItem("islogined") === 'true'){
            window.location.href = "/Quanlybatdoi/sanbong.html";
        }

        //sessionStorage.setItem("islogined", "false");

        $('#login-form a.btn-login').on("click", this.submitEvent);
        
        $('#login-form input[name="email"]').on('focusout', function () {
            var email = $(this).val();
            if (email === '') {
                $('.valid-email').addClass("dangerous-form");
                $('.valid-email').addClass("form-group");
                $(this).addClass('red');
                $('.valid-email .textEmailInfo').html('The email field is required.');
            } else {
                $('.valid-email').removeClass("dangerous-form");
                $('.valid-email').removeClass("form-group");
                $(this).removeClass('red');
                $('.valid-email .textEmailInfo').html('');
            }
        });

        $('#login-form input[name="password"]').on('focusout', function () {
            var paw = $(this).val();
            if (paw == '') {
                $('.valid-paw').addClass("dangerous-form");
                $('.valid-paw').addClass("form-group");
                $(this).addClass('red');
                $('.valid-paw .textPawInfo').html('The password field is required.');
            } else {
                $('.valid-paw').removeClass("dangerous-form");
                $('.valid-paw').removeClass("form-group");
                $(this).removeClass('red');
                $('.valid-paw .textPawInfo').html('');
            }
        });

        $('#login-form input[name="email"]').on('focus', function () {
            $(this).removeClass('red');
        });
        $('#login-form input[name="email"]').on('focus', function () {
            $(this).removeClass('red');
        });
    }

    // sự kiện khi bấm vào đăng nhập
    submitEvent() {
        var email = $('#login-form input[name="email"] ').val();
        var paw = $('#login-form input[name="password"] ').val();
        console.log(email+' '+paw);
        if (email === '') {
            $('.valid-email').addClass("dangerous-form");
            $('.valid-email').addClass("form-group");
            $('#login-form input[name="email"]').addClass('red');
            $('.valid-email .textEmailInfo').html('The email field is required.');
        } else {
            $('.valid-email').removeClass("dangerous-form");
            $('.valid-email').removeClass("form-group");
            $('#login-form input[name="email"]').removeClass('red');
            $('.valid-email .textEmailInfo').html('');
        }
        if (paw === '') {
            $('.valid-paw').addClass("dangerous-form");
            $('.valid-paw').addClass("form-group");
            $('#login-form input[name="password"]').addClass('red');
            $('.valid-paw .textPawInfo').html('The password field is required.');
        } else {
            $('.valid-paw').removeClass("dangerous-form");
            $('.valid-paw').removeClass("form-group");
            $('#login-form input[name="password"]').removeClass('red');
            $('.valid-paw .textPawInfo').html('');
        }
        if (email !== '' && paw !== '') {
            var dataRequest = JSON.stringify({
                "email": email,
                "password": paw
            });
            showLoadingGif(() => {
                $.ajax({
                    url: "http://192.168.0.103/ApiDoAn/public/api/login",
                    method: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: dataRequest,
                    success: function (jqXHR) {
                        console.log(jqXHR);
                        if (typeof(Storage) !== "undefined") {
                          // Store
                          sessionStorage.setItem("adminId", jqXHR.id);
                          sessionStorage.setItem("adminTen", jqXHR.ten);
                          sessionStorage.setItem("adminEmail", jqXHR.email);
                          sessionStorage.setItem("adminToken", jqXHR.token);
                          sessionStorage.setItem("adminAnhbia", jqXHR.anhbia);
                          sessionStorage.setItem("islogined", "true");

                        }
                        window.location.href = "/Quanlybatdoi/sanbong.html";
                    },
                    error: function () {
                        $('.server-response').addClass('form-group');
                        $('.server-response').addClass('dangerous-form');
                        $('.error-response').html('No connection!');
                        hideLoadingGif();
                    },
                    statusCode: {
                        500: function () {
                            $('.server-response').addClass('form-group');
                            $('.server-response').addClass('dangerous-form');
                            $('.error-response').html('Incorrect email or password!');
                        }
                    },
                    timeout: 5000,
                });
            });
        }
    }
}