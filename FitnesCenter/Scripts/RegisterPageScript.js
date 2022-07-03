var PolEnum = {
    MUSKI: 0,
    ZENSKI: 1
}

var UlogeEnum = {
    POSETILAC: 0,
    TRENER: 1,
    VLASNIK: 2
}

$(document).ready(function () {
    let id;
    let regexUsername = /^[a-zA-Z@!]+$/
    let regexSpace = /^[a-zA-Z ]+$/;
    let regexNoSpace = /^[a-zA-Z]+$/;
    if (sessionStorage.getItem('accessToken')) {
        $('#loginHref').hide();
        id = parseUrl();
    } else {
        $('#loginHref').show();
    }

    console.log("Spremna");

    $('#registerForm').on('focusout', '#username', function () {
        let username = $('#username').val();
        username = $.trim(username);

        if (!regexUsername.test(username)) {
            $('#username').css('border', '1px solid red');
            return;
        }

        if (username == "" || (username.length < 3 || username.length > 12)) {
            $('#username').css('border', '1px solid red');
        } else {
            $('#username').css('border', '1px solid green');
        }
    });

    $('#registerForm').on('focusout', '#password', function () {
        let password = $('#password').val();
        password = $.trim(password);
        if (password == "" || (password.length < 3 || password.length > 20)) {
            $('#password').css('border', '1px solid red');
        } else {
            $('#password').css('border', '1px solid green');
        }
    });

    $('#registerForm').on('focusout', '#ime', function () {
        let ime = $('#ime').val();
        ime = $.trim(ime);

        if (!regexSpace.test(ime)) {
            $('#ime').css('border', '1px solid red');
            return;
        }

        if (ime == "" || ime.length < 2) {
            $('#ime').css('border', '1px solid red');
        } else {
            $('#ime').css('border', '1px solid green');
        }
    });

    $('#registerForm').on('focusout', '#prezime', function () {
        let prezime = $('#prezime').val();
        prezime = $.trim(prezime);

        if (!regexNoSpace.test(prezime)) {
            $('#prezime').css('border', '1px solid red');
            return;
        }

        if (prezime == "" || prezime.length < 2) {
            $('#prezime').css('border', '1px solid red');
        } else {
            $('#prezime').css('border', '1px solid green');
        }
    });

    $('#registerForm').on('focusout', '#email', function () {
        let email = $('#email').val();
        email = $.trim(email);

        let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        if (!regex.test(email)) {
            $('#email').css('border', '1px solid red');
            return;
        }

        if (email == "" || email.length < 4) {
            $('#email').css('border', '1px solid red');
        } else {
            $('#email').css('border', '1px solid green');
        }
    });
 

    $("#btnRegister").click(function () {
        let username = $('#username').val();
        username = $.trim(username);

        if (!regexUsername.test(username)) {
            $('#username').css('border', '1px solid red');
            return;
        }

        if (username == "" || (username.length < 3 || username.length > 12)) {
            $('#username').css('border', '1px solid red');
            return;
        } else {
            $('#username').css('border', '1px solid green');
        }

        let password = $('#password').val();
        password = $.trim(password);
        if (password == "" || (password.length < 3 || password.length > 20)) {
            $('#password').css('border', '1px solid red');
            return;
        } else {
            $('#password').css('border', '1px solid green');
        }

        let ime = $('#ime').val();
        ime = $.trim(ime);

        if (!regexSpace.test(ime)) {
            $('#ime').css('border', '1px solid red');
            return;
        }

        if (ime == "" || ime.length < 2) {
            $('#ime').css('border', '1px solid red');
            return;
        } else {
            $('#ime').css('border', '1px solid green');
        }

        let prezime = $('#prezime').val();
        prezime = $.trim(prezime);

        if (!regexNoSpace.test(prezime)) {
            $('#prezime').css('border', '1px solid red');
            return;
        }

        if (prezime == "" || prezime.length < 2) {
            $('#prezime').css('border', '1px solid red');
            return;
        } else {
            $('#prezime').css('border', '1px solid green');
        }

        let email = $('#email').val();
        email = $.trim(email);

        let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        if (!regex.test(email)) {
            $('#email').css('border', '1px solid red');
            return;
        }

        if (email == "" || email.length < 4) {
            $('#email').css('border', '1px solid red');
            return;
        } else {
            $('#email').css('border', '1px solid green');
        }

        let pol = $('#pol').val(); // DEFAULT: Muski
        let datum = $('#datum').val();

        if (sessionStorage.getItem('accessToken')) {
            let user = JSON.parse(sessionStorage.getItem('activeUser'));
            if (user.Uloga == UlogeEnum.VLASNIK) {
                trener = {
                    Username: username,
                    Password: password,
                    Ime: ime,
                    Prezime: prezime,
                    Email: email,
                    Pol: pol,
                    Uloga: 1,
                    DatumRodjenja: datum
                };

                $.ajax({
                    url: '/api/korisnik/RegisterTrener',
                    type: 'POST',
                    data: {
                        Trener: trener,
                        FitnesCentarId: id
                    },
                    success: function (data) {
                        console.log(data)
                        clearForm();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert('Error: ' + xhr.status);
                    }
                });
            } else {
                $.ajax({
                    url: '/api/korisnik/RegisterKorisnik',
                    type: 'POST',
                    data: {
                        Username: username,
                        Password: password,
                        Ime: ime,
                        Prezime: prezime,
                        Email: email,
                        Pol: pol,
                        Uloga: 0,
                        DatumRodjenja: datum
                    },
                    success: function (data) {
                        console.log(data)
                        clearForm();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert('Error: ' + xhr.status);
                    }
                });
            }
        } else {
            $.ajax({
                url: '/api/korisnik/RegisterKorisnik',
                type: 'POST',
                data: {
                    Username: username,
                    Password: password,
                    Ime: ime,
                    Prezime: prezime,
                    Email: email,
                    Pol: pol,
                    Uloga: 0,
                    DatumRodjenja: datum
                },
                success: function (data) {
                    console.log(data)
                    clearForm();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('Error: ' + xhr.status);
                }
            });
        }
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

function registerPosetilac() {
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
            uloga: 0
        },
        success: function (data) {
            console.log(data)
            clearForm();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Error: ' + xhr.status);
        }
    });
}

function registerTrener() {
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
}

function parseUrl(url = window.location.href) {
    let a = document.createElement('a');
    let searchObject, queries, split, i;
    a.href = url;

    queries = a.search.replace(/^\?/, '').split('&');
    for (let i = 0; i < queries.length; i++) {
        split = queries[i].split('=');
        searchObject = decodeURIComponent(split[1]);
    }

    return searchObject;
}