$(document).ready(function () {
    $('#rowAccountPol').hide();

    if (!sessionStorage.getItem('accessToken')) {
        window.location.replace("Index.html");
    }

    let user = JSON.parse(sessionStorage.getItem('activeUser'));
    console.log(user.Username);

    $('#changeAccountInfo').hide();
    displayInformation(user);

    $('#enableChanges').click(function () {
        enableChange();
    });

    $('#showPassword').change(function () {
        if ($(this).is(':checked')) {
            $('#accountPassword').attr({ type: 'text' });
        } else {
            $('#accountPassword').attr({ type: 'password' });
        }
    });

    $('#showPasswordNew').change(function () {
        if ($(this).is(':checked')) {
            $('#accountPasswordNew').attr({ type: 'text' });
        } else {
            $('#accountPasswordNew').attr({ type: 'password' });
        }
    });

    $('#showPasswordNewRetype').change(function () {
        if ($(this).is(':checked')) {
            $('#accountPasswordNewRetype').attr({ type: 'text' });
        } else {
            $('#accountPasswordNewRetype').attr({ type: 'password' });
        }
    });

    $('#btnSaveChanges').click(function () {
        if (!validate()) {
            return; 
        }

        let newUsername = `${user.Username}-${$('#accountUsername').val()}`;
        let newPassword = $('#accountPassword').val();
        let newIme = $('#accountIme').val();
        let newPrezime = $('#accountPrezime').val();
        let newEmail = $('#accountEmail').val();
        let datum = $('#accountDatum').val();
        let pol = $('#accountPol').val();

        $.ajax({
            url: 'api/korisnik/UpdateKorisnikInfo',
            type: 'PUT',
            data: {
                Username: newUsername,
                Password: newPassword,
                Ime: newIme,
                Prezime: newPrezime,
                Email: newEmail,
                Pol: pol,
                DatumRodjenja: datum
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                sessionStorage.setItem('activeUser', JSON.stringify(data));
                displayInformation(JSON.parse(sessionStorage.getItem('activeUser')));
            },
            error: function (xhr) {
                console.log(xhr.status);
            }
        });
    });

    // Real-time Validation
    {
        $('#showAccountInfo').on('focusout', '#accountUsername', function () {
            let username = $('#accountUsername').val();
            username = $.trim(username);

            if (username == "") {
                $('#accountUsername').css('border', '1px solid red');
            } else {
                $('#accountUsername').css('border', '1px solid green');
            }
        });

        $('#showAccountInfo').on('focusout', '#accountPassword', function () {
            let password = $('#accountPassword').val();
            password = $.trim(password);

            if (password == "" || password != user.Password) {
                $('#accountPassword').css('border', '1px solid red');
            } else {
                $('#accountPassword').css('border', '1px solid green');
            }
        });

        // Proveri da li se poklapa sa accountPasswordNewRetype ako je to popunjeno.
        $('#showAccountInfo').on('focusout', '#accountPasswordNew', function () {
            let passwordNew = $('#accountPasswordNew').val();
            passwordNew = $.trim(passwordNew);

            if (passwordNew == "" || passwordNew < 3) {
                $('#accountPasswordNew').css('border', '1px solid red');
            } else {
                $('#accountPasswordNew').css('border', '1px solid green');

                let passwordNewRetype = $('#accountPasswordNewRetype').val();
                passwordNewRetype = $.trim(passwordNewRetype);
                if (passwordNewRetype != "" && passwordNewRetype == passwordNew) {
                    $('#accountPasswordNewRetype').css('border', '1px solid green');
                }
            }
        });

        // Proveri da li se poklapa sa accountPasswordNew ako je to popunjeno.
        $('#showAccountInfo').on('focusout', '#accountPasswordNewRetype', function () {
            let passwordNewRetype = $('#accountPasswordNewRetype').val();
            passwordNewRetype = $.trim(passwordNewRetype);

            let passwordNew = $.trim($('#accountPasswordNew').val());
            if (passwordNew != "") {
                if (passwordNewRetype != passwordNew) {
                    $('#accountPasswordNewRetype').css('border', '1px solid red');
                } else {
                    $('#accountPasswordNewRetype').css('border', '1px solid green');
                }
            } else if (passwordNewRetype == "" || passwordNew < 3) {
                $('#accountPasswordNewRetype').css('border', '1px solid red');
            } else {
                $('#accountPasswordNewRetype').css('border', '1px solid green');
            }
        });

        let regexSpace = /^[a-zA-Z ]*$/;
        let regexNoSpace = /^[a-zA-Z]*$/;

        $('#showAccountInfo').on('focusout', '#accountIme', function () {
            let ime = $('#accountIme').val();
            ime = $.trim(ime);

            if (!regexSpace.test(ime)) {
                $('#accountIme').css('border', '1px solid red');
                return;
            }

            if (ime == "" || ime.length < 2) {
                $('#accountIme').css('border', '1px solid red');
            } else {
                $('#accountIme').css('border', '1px solid green');
            }
        });

        $('#showAccountInfo').on('focusout', '#accountPrezime', function () {
            let prezime = $('#accountPrezime').val();
            prezime = $.trim(prezime);

            if (!regexNoSpace.test(prezime)) {
                $('#accountPrezime').css('border', '1px solid red');
                return;
            }

            if (prezime == "" || prezime.length < 2) {
                $('#accountPrezime').css('border', '1px solid red');
            } else {
                $('#accountPrezime').css('border', '1px solid green');
            }
        });

        $('#showAccountInfo').on('focusout', '#accountEmail', function () {
            let email = $('#accountEmail').val();
            email = $.trim(email);

            let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
            if (!regex.test(email)) {
                $('#accountEmail').css('border', '1px solid red');
                return;
            } else {
                $('#accountEmail').css('border', '1px solid green');
            }

        });

        $('#showAccountInfo').on('focusout', '#accountDatum', function () {
            let datum = $('#accountDatum').val();
            datum = $.trim(datum);

            if (datum == "") {
                $('#accountDatum').css('border', '1px solid red');
            } else {
                $('#accountDatum').css('border', '1px solid green');
            }
        });
    }
});

function validate() {
    let datum = $('#accountDatum').val();
    datum = $.trim(datum);

    if (datum == "") {
        $('#accountDatum').css('border', '1px solid red');
        return false;
    } else {
        $('#accountDatum').css('border', '1px solid green');
    }

    let email = $('#accountEmail').val();
    email = $.trim(email);

    let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
    if (!regex.test(email)) {
        $('#accountEmail').css('border', '1px solid red');
        return false;
    } else {
        $('#accountEmail').css('border', '1px solid green');
    }

    let prezime = $('#accountPrezime').val();
    prezime = $.trim(prezime);

    if (!regexNoSpace.test(prezime)) {
        $('#accountPrezime').css('border', '1px solid red');
        return false;
    }

    if (prezime == "" || prezime.length < 2) {
        $('#accountPrezime').css('border', '1px solid red');
        return false;
    } else {
        $('#accountPrezime').css('border', '1px solid green');
    }

    let ime = $('#accountIme').val();
    ime = $.trim(ime);

    if (!regexSpace.test(ime)) {
        $('#accountIme').css('border', '1px solid red');
        return false;
    }

    if (ime == "" || ime.length < 2) {
        $('#accountIme').css('border', '1px solid red');
        return false;
    } else {
        $('#accountIme').css('border', '1px solid green');
    }

    let passwordNewRetype = $('#accountPasswordNewRetype').val();
    passwordNewRetype = $.trim(passwordNewRetype);

    let passwordNew = $.trim($('#accountPasswordNew').val());
    if (passwordNew != "") {
        if (passwordNewRetype != passwordNew) {
            $('#accountPasswordNewRetype').css('border', '1px solid red');
            return false;
        } else {
            $('#accountPasswordNewRetype').css('border', '1px solid green');
        }
    } else if (passwordNewRetype == "" || passwordNew < 3) {
        $('#accountPasswordNewRetype').css('border', '1px solid red');
        return false;
    } else {
        $('#accountPasswordNewRetype').css('border', '1px solid green');
    }

    //let passwordNew = $('#accountPasswordNew').val();
    //passwordNew = $.trim(passwordNew);

    if (passwordNew == "" || passwordNew < 3) {
        $('#accountPasswordNew').css('border', '1px solid red');
        return false;
    } else {
        $('#accountPasswordNew').css('border', '1px solid green');

        let passwordNewRetype = $('#accountPasswordNewRetype').val();
        passwordNewRetype = $.trim(passwordNewRetype);
        if (passwordNewRetype != "" && passwordNewRetype == passwordNew) {
            $('#accountPasswordNewRetype').css('border', '1px solid green');
        }
    }

    let password = $('#accountPassword').val();
    password = $.trim(password);

    if (password == "" || password != user.Password) {
        $('#accountPassword').css('border', '1px solid red');
        return false;
    } else {
        $('#accountPassword').css('border', '1px solid green');
    }

    let username = $('#accountUsername').val();
    username = $.trim(username);

    if (username == "") {
        $('#accountUsername').css('border', '1px solid red');
        return false;
    } else {
        $('#accountUsername').css('border', '1px solid green');
    }

    return true;
}

function displayInformation(user) {
    $('#accountUsername').attr('value', user.Username);
    $('#accountPassword').attr('value', user.Password);
    $('#rowAccountPasswordNew').hide();
    $('#rowAccountPasswordNewRetype').hide();
    $('#accountIme').attr('value', user.Ime);
    $('#accountPrezime').attr('value', user.Prezime);
    $('#accountEmail').attr('value', user.Email);

    if (user.Pol == 0) {
        $('#accountPolDisplay').attr('value', 'MUSKI');
    } else if (user.Pol == 1) {
        $('#accountPolDisplay').attr('value', 'ZENSKI');
    }

    let datum = new Date(user.DatumRodjenja).toLocaleDateString('en-GB');
    datum = datum.split('/');
    datum = `${datum[2]}-${datum[1]}-${datum[0]}`;

    $('#accountDatum').attr('value', datum);  
    disableChange();
}

function enableChange() {
    $('#accountUsername').attr('readonly', false);
    $('#accountPassword').attr('value', "");
    $('#accountPassword').attr('readonly', false);
    $('#rowAccountPasswordNew').show();
    $('#rowAccountPasswordNewRetype').show();
    $('#passwordField').html('Old Password:');
    $('#accountIme').attr('readonly', false);
    $('#accountPrezime').attr('readonly', false);
    $('#accountEmail').attr('readonly', false);
    $('#accountDatum').attr('readonly', false);

    $('#rowAccountPolDisplay').hide();
    $('#rowAccountPol').show();
    $('#btnSaveChanges').show();
}

function disableChange() {
    $('#accountUsername').attr('readonly', true);
    $('#accountPassword').attr('readonly', true);
    $('#accountIme').attr('readonly', true);
    $('#accountPrezime').attr('readonly', true);
    $('#accountEmail').attr('readonly', true);
    $('#accountDatum').attr('readonly', true);
    $('#accountPolDisplay').attr('readonly', true);

    $('#rowAccountPolDisplay').show();
    $('#rowAccountPol').hide();
    $('#btnSaveChanges').hide();
}