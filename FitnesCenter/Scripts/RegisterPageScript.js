﻿var PolEnum = {
    MUSKI: 0,
    ZENSKI: 1
}

$(document).ready(function () {
    console.log("Spremna");
    $("#btnRegister").click(function () {
        let username = $('#username').val();
        let password = $('#password').val();
        let ime = $('#ime').val();
        let prezime = $('#prezime').val();
        let email = $('#email').val();
        let pol = $('#pol').val();

        if (pol == "musko") { pol = PolEnum.MUSKI; }
        else { pol = PolEnum.ZENSKI; }

        $.ajax({
            url: '/api/korisnik/RegisterKorisnik',
            type: 'POST',
            data: {
                username: username,
                password: password,
                ime: ime,
                prezime: prezime,
                email: email,
                pol: pol,
                uloga: null
            },
            success: function (data) {
                console.log(data)
                clearForm();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('Error: ' + xhr.status);
            }
        });
        event.preventDefault();
    });
});

function clearForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("ime").value = "";
    document.getElementById("prezime").value = "";
    document.getElementById("email").value = "";
}