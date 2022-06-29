var UlogaEnums = {
    POSETILAC: 0,
    TRENER: 1,
    VLASNIK: 2
}

var PolEnums = {
    MUSKI: 0,
    ZENSKI: 1
}


var TipTreningaEnums = {
    YOGA: 0,
    LES_MILLS_TONE: 1,
    BODY_PUMP: 2,
}

var data = []

$(document).ready(function () {
    let id = getParameterByName('id');
    let user;
    if (sessionStorage.getItem('accessToken')) {
        user = JSON.parse(sessionStorage.getItem('activeUser'));
    }
    //let user = JSON.parse(sessionStorage.getItem('activeUser'));
    //console.log(user);

    displayTreninge(id);

    $('#spisakTreninga').on('click', '#btnPosetiTrening', function () {

        $.ajax({
            url: 'api/trening/PosetiTrening',
            type: 'POST',
            data: {
                nazivGrupniTrening: $(this).attr('value'),
                korisnik: user
            },
            dataType: 'json',
            success: function (response) {
                console.log(response);
                alert("Uspesno dodat na trening");
                $(this).hide();
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    });

    $('#spisakTreninga').on('click', '#btnObrisiTrening', function () {
        $.ajax({
            url: 'api/trening/ObrisiTrening?naziv=' + $(this).attr('value'),
            type: 'DELETE',
            success: function (response) {
                alert('Uspesno obrisan trening');
                displayTreninge(id);
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    });

    $('#spisakTreninga').on('click', '#btnIzmeniTrening', function () {
        let naziv = $(this).attr('value');
        showForm(naziv);

        $('#formaTrening').on('click', '#btnSacuvajIzmeneTrening', function () {
            $.ajax({
                url: 'api/trening/IzmeniTrening',
                type: 'PUT',
                data: { // Dodati Datum i spisak Posetilaca.
                    Naziv: $('#treningNaziv').val(),
                    TipTreninga: 0,
                    TrajanjeTreninga: $('#treningTrajanje').val(),
                    MaksBrojPosetilaca: $('#treningBrojPosetioca').val(),
                },
                success: function (response) {
                    console.log('Uspelo');
                },
                error: function (xhr) {
                    alert(xhr.status);
                }

            });
        });
    });

    $('#spisakTreninga').on('click', '#btnPrikaziSpisakPosetiocaTrening', function () {
        let naziv = $(this).attr('value');
        $.ajax({
            url: 'api/trening/SpisakPosetiocaTrening',
            type: 'GET',
            data: {
                naziv: naziv
            },
            success: function (response) {
                showSpisakPosetioca(response)
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    });

    // Napravi novu klasu koja ima trenera i grupniTrening.
    $('#btnDodajTrening').click(function () {
        $('#spisakTreninga').hide();
        $('#formaTrening').show();
        $('#btnDodajTrening').hide();
        $('#btnSacuvajIzmeneTrening').html('Dodaj trening');

        $('#formaTrening').on('click', '#btnSacuvajIzmeneTrening', function () {
            $.ajax({
                url: 'api/trening/DodajTrening',
                type: 'POST',
                data: { // Dodati Datum i spisak Posetilaca.
                    Naziv: $('#treningNaziv').val(),
                    TipTreninga: 0,
                    TrajanjeTreninga: $('#treningTrajanje').val(),
                    MaksBrojPosetilaca: $('#treningBrojPosetioca').val(),
                },
                success: function (response) {
                    console.log('Uspelo');
                },
                error: function (xhr) {
                    alert(xhr.status);
                    console.log('Trening sa datim nazivom vec postoji!');
                }
            });
        });
    });
});

function showSpisakPosetioca(dataFun) {
    let spisak = "";
    for (el in dataFun) {
        spisak += `${dataFun[el].Ime}\n`;
    }

    alert(spisak);
}

function getFitnesCentar(id) {
    $.ajax({
        url: 'api/centri/GetCentar',
        type: 'GET',
        data: id,
        dataType: 'string',
        success: function (response) {
            fitnesCentar = response;
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });
}

function display(data) {
    $('#content').html(`${data.Naziv}`);
}

function showForm(naziv) {
    $('#spisakTreninga').hide();
    $('#formaTrening').show();
    $('#btnDodajTrening').hide();

    let trening;
    for (el in data) {
        if (data[el].Naziv == naziv) {
            trening = data[el];
        }
    }

    $('#treningNaziv').attr('value', trening.Naziv);
    $('#treningTip').attr('value', TipTreningaEnums[trening.TipTreninga]);
    $('#treningTrajanje').attr('value', trening.TrajanjeTreninga)
    $('#treningBrojPosetioca').attr('value', trening.MaksBrojPosetilaca);
    $('#treningVreme').attr('value', trening.DatumVreme);
}

function displayTreninge(id) {
    $('#formaTrening').hide();
    $.ajax({
        url: "api/centri/GetTreninge",
        type: "GET",
        data: {
            naziv: id
        },
        success: function (dataFun) {
            if (dataFun == null) { return; }
            data = dataFun;
            if (!sessionStorage.getItem('accessToken')) {
                createTableNeprijavljen(dataFun);
                return;
            }
            let user = JSON.parse(sessionStorage.getItem('activeUser'));
            if (user.Uloga == UlogaEnums.POSETILAC) {
                createTablePosetioc(dataFun);
            } else if (user.Uloga == UlogaEnums.TRENER) {
                createTableTrener(dataFun);
            }
        }
    });
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
        trening += `<td><button class="PosetiClass" value="${dataFun[element].Naziv}" id="btnPosetiTrening">+</button></td>`;
        tableTreninzi += '<tr>' + trening + '</tr>';
    }

    tableTreninzi += `</table>`;
    $('#spisakTreninga').html(tableTreninzi);
}

function createTableTrener(dataFun) {
    let tableTreninzi = `<table>`;
    tableTreninzi += `<tr><th>Naziv</th></tr>`;

    let user = JSON.parse(sessionStorage.getItem('activeUser'));

    for (element in dataFun) { 
        let trening = '<td>' + dataFun[element].Naziv + '</td>';
        let ispisan = false;

        for (_element in user.GrupniTreninziTrener) { 
            if (dataFun[element].Naziv == user.GrupniTreninziTrener[_element].Naziv) {
                ispisan = true;
                trening += `<td><button class="TrenerClass" value="${dataFun[element].Naziv}" id="btnObrisiTrening">-</button></td>`;
                trening += `<td><button class="TrenerClass" value="${dataFun[element].Naziv}" id="btnIzmeniTrening">?</button></td>`;
                trening += `<td><button class="TrenerClass" value="${dataFun[element].Naziv}" id="btnPrikaziSpisakPosetiocaTrening">List</button></td>`;
                tableTreninzi += '<tr>' + trening + '</tr>';
            }
        }

        if (!ispisan) {
            trening = '<td>' + dataFun[element].Naziv + '</td>';
            tableTreninzi += '<tr>' + trening + '</tr>';
        }
    }

    tableTreninzi += `</table>`;
    $('#spisakTreninga').html(tableTreninzi);
}