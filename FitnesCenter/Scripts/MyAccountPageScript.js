$(document).ready(function () {
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

    $('#btnSaveChanges').click(function () {
        let newUsername = `${user.Username}-${$('#accountUsername').val()}`;
        let newPassword = $('#accountPassword').val();
        let newIme = $('#accountIme').val();
        let newPrezime = $('#accountPrezime').val();
        let newEmail = $('#accountEmail').val();
        let datum = $('#accountDatum').val();
        let pol = user.Pol;

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
                window.location.reload();
            },
            error: function (xhr) {
                console.log(xhr.status);
            }
        });
    });
});

function displayInformation(user) {
    $('#accountUsername').attr('value', user.Username);
    $('#accountPassword').attr('value', user.Password);
    $('#rowAccountPasswordNew').hide();
    $('#rowAccountPasswordNewRetype').hide();
    $('#accountIme').attr('value', user.Ime);
    $('#accountPrezime').attr('value', user.Prezime);
    $('#accountEmail').attr('value', user.Email);

    let datum = new Date(user.DatumRodjenja).toLocaleDateString('en-GB');
    datum = datum.split('/');
    datum = `${datum[2]}-${datum[1]}-${datum[0]}`;

    $('#accountDatum').attr('value', datum);    // Problem u prikazivanju vremena. kada je .attr('value', user.DatumRodjenja), sa 'placeholder' nista ne javlja.
    disableChange();
}

function enableChange() {
    $('#accountUsername').attr('readonly', false);
    $('#accountPassword').attr('readonly', false);
    $('#rowAccountPasswordNew').show();
    $('#rowAccountPasswordNewRetype').show();
    $('#passwordField').html('Old Password:');
    $('#accountIme').attr('readonly', false);
    $('#accountPrezime').attr('readonly', false);
    $('#accountEmail').attr('readonly', false);
    $('#accountDatum').attr('readonly', false);
}

function disableChange() {
    $('#accountUsername').attr('readonly', true);
    $('#accountPassword').attr('readonly', true);
    $('#accountIme').attr('readonly', true);
    $('#accountPrezime').attr('readonly', true);
    $('#accountEmail').attr('readonly', true);
    $('#accountDatum').attr('readonly', true);
}