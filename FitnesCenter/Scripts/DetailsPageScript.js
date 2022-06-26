var UlogaEnums = {
    POSETILAC: 0,
    TRENER: 1,
    VLASNIK: 2
}

var PolEnums = {
    MUSKI: 0,
    ZENSKI: 1
}

var data = []

$(document).ready(function () {
    // Ucitati sve podatke o datom FitnesCentru.
    let id = getParameterByName('id');

    let user = JSON.parse(sessionStorage.getItem('activeUser'));;

    $.ajax({
        url: "api/centri/GetTreninge",
        type: "GET",
        data: {
            naziv: id
        },
        success: function (dataFun) {
            if (dataFun == null) { return; }
            data = dataFun;
            if (sessionStorage.getItem('accessToken') && user.Uloga == UlogaEnums.POSETILAC) {
                createTablePosetioc(dataFun);
            } else {
                createTableNeprijavljen(dataFun);
            }
        }
    });
});

function display(data) {
    $('#content').html(`${data.Naziv}`);
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function createTableNeprijavljen(dataFun) {
    let tableTreninzi = `<table border="1">`;
    tableTreninzi += `<tr><th>Naziv</th></tr>`;

    for (element in dataFun) {
        let trening = '<td>' + dataFun[element].Naziv + '</td>';
        tableTreninzi += '<tr>' + trening + '</tr>';
    }

    tableTreninzi += `</table>`;
    $('#spisakTreninga').html(tableTreninzi);
}

function createTablePosetioc(dataFun) {
    let tableTreninzi = `<table border="1">`;
    tableTreninzi += `<tr><th>Naziv</th></tr>`;

    for (element in dataFun) {
        let trening = '<td>' + dataFun[element].Naziv + '</td>';
        trening += `<td><button id="btnPosetiTrening">+</button></td>`;
        tableTreninzi += '<tr>' + trening + '</tr>';
    }

    tableTreninzi += `</table>`;
    $('#spisakTreninga').html(tableTreninzi);
}