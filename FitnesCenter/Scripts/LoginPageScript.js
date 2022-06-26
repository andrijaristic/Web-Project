﻿$(document).ready(function () {
    $("#btnLogin").click(function () {
        let username = $('#username').val();
        let password = $('#password').val();

        $.ajax({
            url: 'api/korisnik/LoginKorisnik',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            dataType: 'json',
            success: function (data) {
                sessionStorage.setItem('accessToken', data.AccessToken);
                sessionStorage.setItem('activeUser', JSON.stringify(data.Korisnik));
                alert('Uspesno logovanje!');
            },
            error: function () { }
        });

        event.preventDefault();
    });
});