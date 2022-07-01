$(document).ready(function () {
    $('#showPassword').change(function () {
        if ($(this).is(':checked')) {
            $('#password').attr({ type: 'text' });
        } else {
            $('#password').attr({ type: 'password' });
        }
    });

    $("#btnLogin").click(function () {
        let username = $('#username').val();
        username = $.trim(username);
        if (username == "") {
            $('#username').css('border', '1px solid red');
            $('#username').focus();
        } else {
            $('#username').css('border', '1px solid green');
        }

        let password = $('#password').val();
        password = $.trim(password);
        if (password == "") {
            $('#password').css('border', '1px solid red');
            $('#password').focus();
        } else {
            $('#password').css('border', '1px solid green');
        }

        if (!sessionStorage.getItem('accessToken')) {
            $.ajax({
                url: 'api/korisnik/LoginKorisnik',
                type: 'POST',
                data: {
                    Username: username,
                    Password: password
                },
                dataType: 'json',
                success: function (data) {
                    sessionStorage.setItem('accessToken', data.AccessToken);
                    sessionStorage.setItem('activeUser', JSON.stringify(data.Korisnik));
                    alert('Uspesno logovanje!');
                },
                error: function (xhr) {
                    if (xhr.status == 400) {
                        alert('BLOKIRANI ste. Nemoguc login.');
                    } else if (xhr.status == 404) {
                        alert('Pogresan username ili password');
                        $('#username').css('border', '1px solid red');
                        $('#password').css('border', '1px solid red');
                        $('#username').focus();
                    }
                }
            });
        } else {
            alert('Vec ste ulogovani!');
        }


        event.preventDefault();
    });
});
