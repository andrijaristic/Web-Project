var UlogaEnum = {
    POSETIOC: 0,
    TRENER: 1,
    VLASNIK: 2
}

var data = []
var dataCurrent = []

$(document).ready(function () {
    if (!sessionStorage.getItem('accessToken')) {
        alert('Niste ulogovani!');
        window.location.replace('Login.html');
    }

    let user = JSON.parse(sessionStorage.getItem('activeUser'));

    if (user.Uloga == UlogaEnum.POSETIOC) {
        displayTreningePosetioc(user);
    } else if (user.Uloga == UlogaEnum.TRENER) {
        displayTreningeTrener(user);
    }

});

function displayTreningePosetioc(user) {
    $('#tipTreninga').hide();
    $('#minGodina').hide();
    $('#maxGodina').hide();
    $('#checkboxTipTreninga').hide();
    $('#checkboxDatum').hide();
    $('#nazivFitnesCentra').show();
    $('#checkboxFitnesCentar').show();

    $.ajax({
        url: 'api/korisnik/GetTreningeKorisnik?username=' + user.Username,
        type: 'GET',
        success: function (dataRet) {
            console.log('Uspesno preuzeto!');
            data = dataRet;
            createTablePosetioc(data);
        },
        error: function (xhr) {
            if (xhr.status == 404) {
                console.log('Empty');
                return;
            }
        }
    });
}

function displayTreningeTrener(user) {
    $('#nazivFitnesCentra').hide();
    $('#checkboxFitnesCentar').hide();
    $('#tipTreninga').show();
    $('#minGodina').show();
    $('#maxGodina').show();
    $('#checkboxTipTreninga').show();
    $('#checkboxDatum').show();

    $.ajax({
        url: 'api/korisnik/GetTreningeKorisnik',
        type: 'GET',
        data: {
            username: user.Username  
        },
        dataType: 'json',
        success: function (dataRet) {
            data = dataRet;
            createTableTrener(data);
        },
        error: function (xhr) {
            alert(xhr.status);
        },
    });
}

function createTablePosetioc(dataFun) {
    let tableTreninzi = `<table border="1">`;
    tableTreninzi += `<tr><th>Naziv</th></tr>`;

    for (element in dataFun) {
        let trening = '<td>' + dataFun[element].Naziv + '</td>';
        tableTreninzi += '<tr>' + trening + '</tr>';
    }

    tableTreninzi += `</table>`;
    $('#spisakTreninga').html(tableTreninzi);
    dataCurrent = dataFun;
}


function createTableTrener(dataFun) {
    let tableTreninzi = `<table border="1">`;
    tableTreninzi += `<tr><th>Naziv</th></tr>`;

    for (element in dataFun) {
        let trening = '<td>' + dataFun[element].Naziv + '</td>';
        trening += `<td><button class="TrenerClass" value="${dataFun[element].Naziv}" id="btnPrikaziSpisakPosetiocaTrening">List</button></td>`;
        tableTreninzi += '<tr>' + trening + '</tr>';
    }

    tableTreninzi += `</table>`;
    $('#spisakTreninga').html(tableTreninzi);
    dataCurrent = dataFun;
}

