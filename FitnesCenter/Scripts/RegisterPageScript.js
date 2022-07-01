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
    if (sessionStorage.getItem('accessToken')) {
        $('#loginHref').hide();
        id = parseUrl();
    } else {
        $('#loginHref').show();
    }

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

        if (sessionStorage.getItem('accessToken')) {
            let user = JSON.parse(sessionStorage.getItem('activeUser'));
            if (user.Uloga == UlogeEnum.VLASNIK) {
                trener = {
                    username: username,
                    password: password,
                    ime: ime,
                    prezime: prezime,
                    email: email,
                    pol: pol,
                    uloga: 1
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
        } else {
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