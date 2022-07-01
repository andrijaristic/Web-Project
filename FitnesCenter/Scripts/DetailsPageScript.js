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
var treneriGlobal = []

$(document).ready(function () {
    $('#btnDodajKomentar').hide();
    $('#btnDodajTrening').hide();
    $('#dodajKomentarForm').hide();
    $('#btnPostaviKomentar').hide();
    $('#treneriCentra').hide();

    let idCentra = parseUrl();
    console.log(idCentra);

    let user;
    if (sessionStorage.getItem('accessToken')) {
        getKomentare(idCentra);
        getTrenereCentra(idCentra);

        user = JSON.parse(sessionStorage.getItem('activeUser'));
        if (user.Uloga == 0) {
            $.ajax({
                url: 'api/trening/GetAllTrenings?centarId=' + idCentra,
                type: 'GET',
                success: function (response) {
                    for (element in response) { // grupniTreninzi
                        for (_element in user.GrupniTreninziPosetioc) {
                            if (user.GrupniTreninziPosetioc[_element] == response[element].Id) {
                                $('#btnDodajKomentar').show();
                                break;
                            }
                        }
                    }
                },
                error: function (xhr) {
                    alert(xhr.status);
                }
            });
        } else if (user.Uloga == 1 && user.FitnesCentarTrener.Id == idCentra) {
            $('#btnDodajTrening').show();
        }
        else if (user.Uloga == 2) {
            $('#treneriCentra').show();
            displayTrenereCentra(idCentra);
        }
    } else {
        getKomentare(idCentra);
        getTrenereCentra(idCentra);
    }
    //let user = JSON.parse(sessionStorage.getItem('activeUser'));
    //console.log(user);

    $('#formaTrening').hide();
    $.ajax({
        url: "api/centri/GetTreninge",
        type: "GET",
        data: {
            id: idCentra
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
            } else {
                createTableNeprijavljen(dataFun);
            }
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });

    $('#spisakTreninga').on('click', '#btnPosetiTrening', function () {

        $.ajax({
            url: 'api/trening/PosetiTrening',
            type: 'POST',
            data: {
                id: $(this).attr('value'),
                korisnik: user
            },
            dataType: 'json',
            success: function (response) {
                console.log(response);
                sessionStorage.setItem('activeUser', JSON.stringify(response));
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
                displayTreninge(idCentra);
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    });

    $('#spisakTreninga').on('click', '#btnIzmeniTrening', function () {
        let id = $(this).attr('value');
        showForm(id);

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

        let mind = new Date();
        mind.setDate(mind.getDate() + 3);
        mind = mind.toLocaleString('en-GB')
        let params = mind.split(',');
        let datum = params[0].split('/');
        let vreme = params[1].split(':');
        mind = `${datum[2]}-${datum[1]}-${datum[0]}T${vreme[0]}:${vreme[1]}:${vreme[2]}`;

        $('#treningNaziv').focusout(function () {
            let naziv = $('#treningNaziv').val();
            naziv = $.trim(naziv);
            if (naziv == "" || (naziv.length < 3 || naziv.length >  42)) {
                $('#treningNaziv').css('border', '1px solid red');
                $('#treningNaziv').focus();
            } else {
                $('#treningNaziv').css('border', '1px solid green');
            } 
        });

        $('#formaTrening').on('focusout', '#treningTrajanje', function () {
            let trajanje = $('#treningTrajanje').val();
            if ((trajanje == "") || (trajanje < 30 || trajanje > 60)) {
                $('#treningTrajanje').css('border', '1px solid red');
                $('#treningTrajanje').focus();
            } else {
                $('#treningTrajanje').css('border', '1px solid green');
            }
        });

        $('#formaTrening').on('focusout', '#treningBrojPosetioca', function () {
            let brojPosetilaca = $('#treningBrojPosetioca').val();

            if ((brojPosetilaca == "") || (brojPosetilaca < 1 || brojPosetilaca > 6)) {
                $('#treningBrojPosetioca').css('border', '1px solid red');
                $('#treningBrojPosetioca').focus();
            } else {
                $('#treningBrojPosetioca').css('border', '1px solid green');
            }

        });

        $('#formaTrening').on('focusout', '#treningVreme', function () {
            let datumVreme = $('#treningVreme').val();
            if (datumVreme < mind) {
                $('#treningVreme').css('border', '1px solid red');
                $('#treningVreme').focus();
                return;
            } else {
                $('#treningVreme').css('border', '1px solid green');
            }
        });


        $('#formaTrening').on('click', '#btnSacuvajIzmeneTrening', function () {
            // Odraditi istu validaciju ovde.

            let naziv = $('#treningNaziv').val();
            naziv = $.trim(naziv);
            if (naziv == "" || (naziv.length < 3 || naziv.length > 42)) {
                $('#treningNaziv').css('border', '1px solid red');
                $('#treningNaziv').focus();
                return;
            }

            let tipTreninga = $('#treningTip').val();   // Default je YOGA.

            let trajanjeTreninga = $('#treningTrajanje').val();
            if ((trajanjeTreninga == "") || (trajanjeTreninga < 30 || trajanjeTreninga > 60)) {
                $('#treningTrajanje').css('border', '1px solid red');
                $('#treningTrajanje').focus();
                return;
            }

            let maksBrojPosetilaca = $('#treningBrojPosetioca').val();
            if ((maksBrojPosetilaca == "") || (maksBrojPosetilaca < 1 || maksBrojPosetilaca > 6)) {
                $('#treningBrojPosetioca').css('border', '1px solid red');
                $('#treningBrojPosetioc').focus();
                return;
            }

            let datumVreme = $('#treningVreme').val();
            if (datumVreme < mind) {
                $('#treningVreme').css('border', '1px solid red');
                $('#treningVreme').focus();
                return;
            }

            let trening = {
                Naziv: naziv,
                TipTreninga: tipTreninga,
                TrajanjeTreninga: trajanjeTreninga,
                DatumVreme: datumVreme,
                MaksBrojPosetilaca: maksBrojPosetilaca,
                isDelete: false
            }

            let trenerUsername = user.Username;

            $.ajax({
                url: 'api/trening/DodajTrening',
                type: 'POST',
                data: { // Dodati Datum i spisak Posetilaca.
                    Trening: trening,
                    FitnesCentarId: idCentra,
                    TrenerUsername: trenerUsername
                },
                success: function (response) {
                    console.log('Uspelo');
                    displayTreninge(idCentra);
                    $('#spisakTreninga').show();
                    $('#formaTrening').hide();
                    $('#btnDodajTrening').show();
                },
                error: function (xhr) {
                    alert('Vec imate trening u to vreme.');
                    $('#treningVreme').css('border', '1px solid red');
                    $('#treningVreme').focus();
                }
            });
        });
    });

    $('#treneriCentra').on('click', '#btnBlockTrener', function () {
        let usernameTrenera = $(this).attr('value');

        let trener;
        for (el in treneriGlobal) {
            if (treneriGlobal[el].Username == usernameTrenera) {
                trener = treneriGlobal[el];
                break;
            }
        }

        $.ajax({
            url: 'api/korisnik/BlockTrener?username=' + usernameTrenera,
            type: 'PUT',
            success: function (response) {
                getTrenereCentra(idCentra);
            },
            error: function (xhr) {
                alert(xhr.status);
            }

        });
    });

    $('#komentari').on('click', '#btnOdobriKomentar', function () {
        let id = $(this).attr('value');

        $.ajax({
            url: 'api/centri/OdobriKomentar?komentarId=' + id,
            type: 'PUT',
            success: function (response) {
                console.log('Odobren komentar');
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    });

    $('#komentari').on('click', '#btnOdbijKomentar', function () {
        let id = $(this).attr('value');

        $.ajax({
            url: 'api/centri/OdbijKomentar?komentarId=' + id,
            type: 'PUT',
            success: function (response) {
                console.log('Odbijen komentar');
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    });

    $('#btnDodajKomentar').click(function () {
        $('#dodajKomentarForm').show();
        $('#btnPostaviKomentar').show();
        $('#btnDodajKomentar').hide();
    });

    $('#dodajKomentarForm').on('focusout', '#inputSadrzaj', function () {
        let sadrzaj = $('#inputSadrzaj').val();
        sadrzaj = $.trim(sadrzaj);
        if (sadrzaj == "") {
            // Crveni input i napisi labelu pored.
            $('#inputSadrzaj').css('border', '1px solid red');
            $('#inputSadrzaj').focus();
        }
    });

    $('#dodajKomentarForm').on('focusout', '#inputOcena', function () {
        let ocena = $('#inputOcena').val();
        if (ocena == "" || (ocena < 0 && ocena > 5)) {
            // Crveni input i napisi labelu pored.
            $('#inputOcena').css('border', '1px solid red');
            $('#inputOcena').focus();
        }
    });

    $('#btnPostaviKomentar').click(function () {
        $('#dodajKomentarForm').hide();
        $('#btnPostaviKomentar').hide();
        $('#btnDodajKomentar').show();

        let posetilac = JSON.parse(sessionStorage.getItem('activeUser'));
        let sadrzaj = $('#inputSadrzaj').val();
        sadrzaj = $.trim(sadrzaj);
        if (sadrzaj == ""){
            // Crveni input i napisi labelu pored.
            $('#inputSadrzaj').css('border', '1px solid red');
            $('#inputSadrzaj').focus();
            return;
        }

        let ocena = $('#inputOcena').val();
        if (ocena == "" || (ocena < 0 && ocena > 5)) {
            // Crveni input i napisi labelu pored.
            $('#inputOcena').css('border', '1px solid red');
            $('#inputOcena').focus();
            return;
        }

        $.ajax({
            url: 'api/centri/AddKomentar',
            type: 'POST',
            data: {
                Id: null,
                Posetilac: posetilac.Username,
                FitnesCentar: idCentra,
                Sadrzaj: sadrzaj,
                Ocena: ocena,
                NotTouched: true,
                Odobren: false
            },
            success: function (response) { },
            error: function (xhr) {
                console.log(xhr.status);
            }

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

function showForm(id) {
    $('#spisakTreninga').hide();
    $('#formaTrening').show();
    $('#btnDodajTrening').hide();

    let trening;
    for (el in data) {
        if (data[el].Id == id) {
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
        url: "api/centri/GetTreninge/",
        type: "GET",
        data: id,
        dataType: 'string',
        success: function (dataFun) {
            if (dataFun == null) { return; }
            data = dataFun;
            if (!sessionStorage.getItem('accessToken')  ) {
                createTableNeprijavljen(dataFun);
                return;
            }

            let user = JSON.parse(sessionStorage.getItem('activeUser'));
            if (user.Uloga == UlogaEnums.POSETILAC) {
                createTablePosetioc(dataFun);
            } else if (user.Uloga == UlogaEnums.TRENER) {
                createTableTrener(dataFun);
            } else {
                createTableNeprijavljen(dataFun);
            }
        }
    });
}

//function getParameterByName(name, url = window.location.href) {
//    name = name.replace(/[\[\]]/g, '\\$&');
//    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);

//    if (!results) return null;
//    if (!results[2]) return '';
//    return decodeURIComponent(results[2].replace(/\+/g, ' '));
//}

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
        trening += `<td><button class="PosetiClass" value="${dataFun[element].Id}" id="btnPosetiTrening">+</button></td>`;
        tableTreninzi += '<tr>' + trening + '</tr>';
    }

    tableTreninzi += `</table>`;
    $('#spisakTreninga').html(tableTreninzi);
}

function createTableTrener(dataFun) {
    let tableTreninzi = `<table>`;
    tableTreninzi += `<tr><th>Naziv</th></tr>`;

    let user = JSON.parse(sessionStorage.getItem('activeUser'));
    if (user.FitnesCentarTrener.Id == parseUrl()) {
        $('#btnDodajTrening').show();
    }

    for (element in dataFun) { 
        let trening = '<td>' + dataFun[element].Naziv + '</td>';
        let ispisan = false;

        for (_element in user.GrupniTreninziTrener) { 
            if (dataFun[element].Naziv == user.GrupniTreninziTrener[_element].Naziv) {
                ispisan = true;
                trening += `<td><button class="TrenerClass" value="${dataFun[element].Id}" id="btnObrisiTrening">-</button></td>`;
                trening += `<td><button class="TrenerClass" value="${dataFun[element].Id}" id="btnIzmeniTrening">?</button></td>`;
                trening += `<td><button class="TrenerClass" value="${dataFun[element].Id}" id="btnPrikaziSpisakPosetiocaTrening">List</button></td>`;
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

function getTrenereCentra(idCentra) {
    $.ajax({
        url: 'api/centri/GetTrenere',
        type: 'GET',
        data: {
            id: idCentra
        },
        success: function (response) {
            treneriGlobal = response;
            displayTrenereCentra(response);
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    })
}

function displayTrenereCentra(treneri){
    let tableTreneri = `<table>`;
    tableTreneri += `<tr><th>Username</th><tr>`;

    for (element in treneri) {
        let trener = `<td>${treneri[element].Username}</td>`;
        trener += `<td><button class="TrenerBlock" value="${treneri[element].Username}" id="btnBlockTrener">Block</td>`
        tableTreneri += `<tr>${trener}</tr>`
    }

    tableTreneri += `</table>`;
    $('#treneriCentra').html(tableTreneri);
}

function getKomentare(idCentra) {
    $.ajax({
        url: 'api/centri/GetKomentare?centarId=' + idCentra,
        type: 'GET',
        success: function (response) {
            displayKomentare(response);
        },
        error: function (xhr) {
            alert('Nema komentara');
        }

    });
}

function displayKomentare(komentari) {
    let tableKomentari = `<table>`;
    tableKomentari += `<tr><th colspan="3">KOMENTARI</th></tr>`

    if (sessionStorage.getItem('accessToken')) {
        let user = JSON.parse(sessionStorage.getItem('activeUser'));
        if (user.Uloga == 2) {
            for (element in komentari) {
                let komentar = `<td>${komentari[element].Sadrzaj}</td>`;
                komentar += `<td>${komentari[element].Ocena}</td>`
                if (komentari[element].NotTouched == true && komentari[element].Odobren == false) {
                    komentar += `<td><button id="btnOdobriKomentar" value="${komentari[element].Id}">+</button> <button id="btnOdbijKomentar" value="${komentari[element].Id}">-</button></td>`
                } else if (komentari[element].NotTouched == false && komentari[element].Odobren == false) {
                    komentar += `<td><b>ODBIJEN</b></td>`;
                } else if (komentari[element].NotTouched == false && komentari[element].Odobren == true) {
                    komentar += `<td><b>ODOBREN</b></td>`;
                }

                tableKomentari += `<tr>${komentar}</tr>`
            }
        } else {
            for (element in komentari) {
                if (komentari[element].NotTouched == false && komentari[element].Odobren == true) {
                    let komentar = `<td>${komentari[element].Sadrzaj}</td>`;
                    komentar += `<td>${komentari[element].Ocena}</td>`
                    tableKomentari += `<tr>${komentar}</tr>`
                }
            }
        }
    } else {
        for (element in komentari) {
            if (komentari[element].NotTouched == false && komentari[element].Odobren == true) {
                let komentar = `<td>${komentari[element].Sadrzaj}</td>`;
                komentar += `<td>${komentari[element].Ocena}</td>`
                tableKomentari += `<tr>${komentar}</tr>`
            }
        }
    }

    tableKomentari += `</table>`;
    $('#komentari').html(tableKomentari);
}