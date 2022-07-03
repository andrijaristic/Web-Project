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


var TipEnumText = {
    "0": "YOGA",
    "1": "LES MILLS TONE",
    "2": "BODY PUMP"
}

var data = []
var fitnesCentar = {}
var treneriGlobal = []
var idTreninga;

$(document).ready(function () {
    $('#btnDodajNoviTrening').hide();
    $('#btnSacuvajIzmeneTrening').hide();
    $('#btnDodajKomentar').hide();
    $('#btnDodajTrening').hide();
    $('#dodajKomentarForm').hide();
    $('#btnPostaviKomentar').hide();
    $('#treneriCentra').hide();
    $('#btnExitForm').hide();
    $('#myAccountHref').hide();

    let idCentra = parseUrl();
    console.log(idCentra);

    getFitnesCentar(idCentra);
    getKomentare(idCentra);

    let user;
    if (sessionStorage.getItem('accessToken')) {
        $('#myAccountHref').show();

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
                    //alert(xhr.status);
                }
            });
        } else if (user.Uloga == 1 && user.FitnesCentarTrener.Id == idCentra) {
            $('#btnDodajTrening').show();
        }
        else if (user.Uloga == 2) {
            for (element in user.FitnesCentarVlasnik) {
                if (user.FitnesCentarVlasnik[element] == idCentra) {
                    $('#treneriCentra').show();
                    getTrenereCentra(idCentra);
                    //displayTrenereCentra(idCentra);
                    break;
                } 
            }
        }
    }
    //else {
    //    getKomentare(idCentra);
    //    getTrenereCentra(idCentra);
    //}
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
                displayTreninge(idCentra);
            },
            error: function (xhr) {
                alert('Nemoguce posecivanje.');
                displayTreninge(idCentra);
            }
        });
    });

    $('#spisakTreninga').on('click', '#btnObrisiTrening', function () {
        if (sessionStorage.getItem('accessToken')) {
            let id = $(this).attr('value');
            let username = user.Username;

            $.ajax({
                url: `api/trening/ObrisiTrening`,
                type: 'DELETE',
                data: {
                    id: id,
                    username: username
                },
                success: function (response) {
                    alert('Uspesno obrisan trening');
                    displayTreninge(idCentra);
                },
                error: function (xhr) {
                    if (xhr.status == 404) {
                        alert('Blokirani ste. Bicete izlogovani');
                        sessionStorage.setItem('accessToken', "");
                        sessionStorage.setItem('activeUser', "");
                    }

                    if (xhr.status == 400) {
                        alert('Nemoguce brisanje. Postoje posetioci!');
                    }
                }

            });
        }
    });

    $('#spisakTreninga').on('click', '#btnIzmeniTrening', function () {
        if (sessionStorage.getItem('accessToken')) {
            $('#btnSacuvajIzmeneTreninga').show();
            idTreninga = $(this).attr('value');
            $('#btnExitForm').show();
            showForm(idTreninga);
        }
    });

    $('#formaTrening').on('click', '#btnSacuvajIzmeneTrening', function () {
        if (!validateUpdateTrening()) {
            return;
        }

        let naziv = $('#treningNaziv').val();
        let tip = $('#treningTip').val();
        let trajanje = $('#treningTrajanje').val();
        let brojPosetioca = $('#treningBrojPosetioca').val();
        let datumVreme = $('#treningVreme').val();

        let trening = {
            Id: idTreninga,
            Naziv: naziv,
            TipTreninga: tip,
            TrajanjeTreninga: trajanje,
            MaksBrojPosetilaca: brojPosetioca,
            DatumVreme: datumVreme
        }

        let username = user.Username;

        $.ajax({
            url: 'api/trening/IzmeniTrening',
            type: 'PUT',
            data: { // Dodati Datum i spisak Posetilaca.
                Trening: trening,
                TrenerUsername: username,
                FitnesCentarId: 0
            },
            success: function (response) {
                console.log('Uspelo');
                $('#spisakTreninga').show();
                $('#formaTrening').hide();
                $('#btnDodajNoviTrening').show();
                displayTreninge(idCentra);
            },
            error: function (xhr) {
                if (xhr.status == 404) {
                    alert('Blokirani ste. Bicete izlogovani');
                    sessionStorage.setItem('accessToken', "");
                    sessionStorage.setItem('activeUser', "");
                }
            }

        });
    });

    $('#spisakTreninga').on('click', '#btnPrikaziSpisakPosetiocaTrening', function () {
        if (sessionStorage.getItem('accessToken')) {
            let id = $(this).attr('value');
            let username = user.Username;

            $.ajax({
                url: `api/trening/SpisakPosetiocaTrening`,
                type: 'GET',
                data: {
                    id: id,
                    username: username
                },
                success: function (response) {
                    showSpisakPosetioca(response)
                },
                error: function (xhr) {
                    if (xhr.status == 400) {
                        alert('Blokirani ste. Bicete izlogovani');
                        sessionStorage.setItem('accessToken', "");
                        sessionStorage.setItem('activeUser', "");
                    }

                    if (xhr.status == 404) {
                        alert('Nema posetioca');
                    }
                }
            });
        }
    });

    // Napravi novu klasu koja ima trenera i grupniTrening.
    $('#btnDodajTrening').click(function () {
        if (sessionStorage.getItem('accessToken')) {
            $('#spisakTreninga').hide();
            $('#formaTrening').show();
            $('#btnDodajTrening').hide();
            $('#btnSacuvajIzmeneTrening').hide();
            $('#btnDodajNoviTrening').show();
            $('#btnExitForm').show();
        }
    });

    $('#formaTrening').on('click', '#btnExitForm', function () {
        $('#spisakTreninga').show();
        $('#formaTrening').hide();
        $('#btnDodajTrening').show();
        $('#btnExitForm').hide();
        $('#btnDodajNoviTrening').hide();
        $('#btnbtnSacuvajIzmeneTrening').hide();
    });

    $('#formaTrening').on('click', '#btnDodajNoviTrening', function () {
        // Odraditi istu validaciju ovde.
        if (!validateDodajTrening()) {
            return;
        }

        let naziv = $('#treningNaziv').val();
        naziv = $.trim(naziv);

        let tipTreninga = $('#treningTip').val();   // Default je YOGA.
        let trajanjeTreninga = $('#treningTrajanje').val();
        let maksBrojPosetilaca = $('#treningBrojPosetioca').val();
        let datumVreme = $('#treningVreme').val();


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
                $('#btnDodajNoviTrening').hide();
                $('#btnDodajTrening').show();

                sessionStorage.setItem('activeUser', JSON.stringify(response));
            },
            error: function (xhr) {
                if (xhr.status == 404) {
                    alert('Blokirani ste. Bicete izlogovani');
                    sessionStorage.setItem('accessToken', "");
                    sessionStorage.setItem('activeUser', "");
                } else if (xhr.status == 400){
                    alert('Vec imate trening u to vreme ili je obrisan fitnes centar.');
                    $('#treningVreme').css('border', '1px solid red');
                    $('#treningVreme').focus();
                }
            }
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
                getKomentare(idCentra);
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
                getKomentare(idCentra);
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
        } else {
            $('#inputSadrzaj').css('border', '1px solid green');
        }
    });

    $('#dodajKomentarForm').on('focusout', '#inputOcena', function () {
        let ocena = $('#inputOcena').val();
        if (ocena == "" || (ocena < 0 || ocena > 5)) {
            // Crveni input i napisi labelu pored.
            $('#inputOcena').css('border', '1px solid red');
        } else {
            $('#inputOcena').css('border', '1px solid green');
        }
    });

    $('#btnPostaviKomentar').click(function () {
        if (!validateKomentar()) {
            return;
        }

        let posetilac = JSON.parse(sessionStorage.getItem('activeUser'));
        let sadrzaj = $('#inputSadrzaj').val();
        sadrzaj = $.trim(sadrzaj);

        let ocena = $('#inputOcena').val();

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
            success: function (response) {
                alert('Uspesno postavljen komentar');
            },
            error: function (xhr) {
                console.log(xhr.status);
            }
        });

        $('#dodajKomentarForm').hide();
        $('#btnPostaviKomentar').hide();
        $('#btnDodajKomentar').show();
    });

    // Validacije dodavanja/edit treninga.
    {
        $('#treningNaziv').focusout(function () {
            let naziv = $('#treningNaziv').val();
            naziv = $.trim(naziv);
            if (naziv == "" || (naziv.length < 3 || naziv.length > 42)) {
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

        let mind = new Date();
        mind.setDate(mind.getDate() + 3);
        mind = mind.toLocaleString('en-GB')
        let params = mind.split(',');
        let datum = params[0].split('/');
        let vreme = params[1].split(':');
        mind = `${datum[2]}-${datum[1]}-${datum[0]}T${vreme[0]}:${vreme[1]}:${vreme[2]}`;

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

    }
});

function validateDodajTrening() {

    let naziv = $('#treningNaziv').val();
    naziv = $.trim(naziv);
    if (naziv == "" || (naziv.length < 3 || naziv.length > 42)) {
        $('#treningNaziv').css('border', '1px solid red');
        $('#treningNaziv').focus();
        return false;
    }

    //let tipTreninga = $('#treningTip').val();   // Default je YOGA.

    let trajanjeTreninga = $('#treningTrajanje').val();
    if ((trajanjeTreninga == "") || (trajanjeTreninga < 30 || trajanjeTreninga > 60)) {
        $('#treningTrajanje').css('border', '1px solid red');
        $('#treningTrajanje').focus();
        return false;
    }

    let maksBrojPosetilaca = $('#treningBrojPosetioca').val();
    if ((maksBrojPosetilaca == "") || (maksBrojPosetilaca < 1 || maksBrojPosetilaca > 6)) {
        $('#treningBrojPosetioca').css('border', '1px solid red');
        $('#treningBrojPosetioc').focus();
        return false;
    }

    let mind = new Date();
    mind.setDate(mind.getDate() + 3);
    mind = mind.toLocaleString('en-GB')
    let params = mind.split(',');
    let datum = params[0].split('/');
    let vreme = params[1].split(':');
    mind = `${datum[2]}-${datum[1]}-${datum[0]}T${vreme[0]}:${vreme[1]}:${vreme[2]}`;

    let datumVreme = $('#treningVreme').val();
    if (datumVreme < mind) {
        $('#treningVreme').css('border', '1px solid red');
        $('#treningVreme').focus();
        return false;
    }

    return true;
}

function validateUpdateTrening() {
    let naziv = $('#treningNaziv').val();
    naziv = $.trim(naziv);
    if (naziv == "") {
        $('#treningNaziv').css('border', '1px solid red');
        return false;
    } else {
        $('#treningNaziv').css('border', '1px solid green');
    }

    let trajanje = $('#treningTrajanje').val();
    trajanje = $.trim('#treningTrajanje');
    if (trajanje == "" || (trajanje < 30 || trajanje > 60)) {
        $('#treningTrajanje').css('border', '1px solid red');
        return false;
    } else {
        $('#treningTrajanje').css('border', '1px solid green');
    }

    let brojPosetioca = $('#treningBrojPosetioca').val();
    brojPosetioca = $.trim(brojPosetioca);
    if (brojPosetioca == "" || (brojPosetioca < 1 || brojPosetioca > 6)) {
        $('#treningBrojPosetica').css('border', '1px solid red');
        return false;
    } else {
        $('#treningBrojPosetica').css('border', '1px solid green');
    }

    let mind = new Date();
    mind.setDate(mind.getDate() + 3);
    mind = mind.toLocaleString('en-GB')
    let params = mind.split(',');
    let datum = params[0].split('/');
    let vreme = params[1].split(':');
    mind = `${datum[2]}-${datum[1]}-${datum[0]}T${vreme[0]}:${vreme[1]}:${vreme[2]}`;

    vreme = $('#treningVreme').val();
    if (vreme == "" || vreme < mind) {
        $('#treningVreme').css('border', '1px solid red');
        return false;
    } else {
        $('#treningVreme').css('border', '1px solid green');
    }

    return true;
}

function validateKomentar() {
    let sadrzaj = $('#inputSadrzaj').val();
    sadrzaj = $.trim(sadrzaj);
    if (sadrzaj == "") {
        // Crveni input i napisi labelu pored.
        $('#inputSadrzaj').css('border', '1px solid red');
        return false;
    } else {
        $('#inputSadrzaj').css('border', '1px solid green');
    }

    let ocena = $('#inputOcena').val();
    if (ocena == "" || (ocena < 0 || ocena > 5)) {
        // Crveni input i napisi labelu pored.
        $('#inputOcena').css('border', '1px solid red');
        return false;
    } else {
        $('#inputOcena').css('border', '1px solid green');
    }

    return true;
}

function showSpisakPosetioca(dataFun) {
    let spisak = "";
    for (el in dataFun) {
        spisak += `${dataFun[el].Ime} ${dataFun[el].Prezime}\n`;
    }

    alert(spisak);
}

function getFitnesCentar(id) {
    $.ajax({
        url: 'api/centri/GetCentar',
        type: 'GET',
        data: {
            id: id
        },
        success: function (response) {
            fitnesCentar = response;
            // Funkcija za ispis podataka o centru.
            displayFitnesCentar(response);
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });
}

function displayFitnesCentar(dataFun) {
    let tableCentar = `<table class="fitnesCentarInfo">`;
    //tableCentar += `<tr><th>Naziv</th><th>Tip treninga</th><th>Trajanje</th><th>Vreme odrzavanja</th><th>Max. broj posetioca</th><th>Broj posetioca</th></tr>`;

    let centar = '<tr><td>Naziv: </td><td class="tableLabel">' + dataFun.Naziv + '</td></tr>';
    centar += '<tr><td>Adresa: </td><td class="tableLabel">' + dataFun.Adresa + '</td></tr>';
    centar += '<tr><td>Godina otvaranja: </td><td class="tableLabel">' + dataFun.GodinaOtvaranja + '</td></tr>';
    centar += `<tr><td>Vlasnik: </td><td class="tableLabel">${dataFun.Vlasnik.Ime} ${dataFun.Vlasnik.Prezime} </td></tr>`;
    centar += '<tr><td>Mesecna clanarina: </td><td class="tableLabel">' + dataFun.CenaMesecneClanarine + ' RSD</td></tr>';
    centar += '<tr><td>Godisnja clanarina: </td><td class="tableLabel">' + dataFun.CenaGodisnjeClanarine + ' RSD</td></tr>';
    centar += '<tr><td>Cena jednog treninga: </td><td class="tableLabel">' + dataFun.CenaJednogTreninga + ' RSD</td></tr>';
    centar += '<tr><td>Cena grupnog treninga: </td><td class="tableLabel">' + dataFun.CenaJednogGrupnogTreninga + ' RSD</td></tr>';
    centar += '<tr><td class="test">Cena grupnog sa trenerom: </td><td class="tableLabel">' + dataFun.CenaJednogTreningaSaTrenerom + ' RSD</td></tr>';

    tableCentar += '<tr>' + centar + '</tr>';

    tableCentar += `</table>`;
    $('#podaciCentar').html(tableCentar);
}

function display(data) {
    $('#content').html(`${data.Naziv}`);
}

function showForm(id) {
    $('#spisakTreninga').hide();
    $('#formaTrening').show();
    $('#btnDodajTrening').hide();
    $('#btnSacuvajIzmeneTrening').show();

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

function clearForm() {
    $('#treningNaziv').attr('value', "");
    $('#treningTip').attr('value', "");
    $('#treningTrajanje').attr('value', "")
    $('#treningBrojPosetioca').attr('value', "");
    $('#treningVreme').attr('value', "");
}

function displayTreninge(id) {
    $('#formaTrening').hide();
    $.ajax({
        url: "api/centri/GetTreninge/",
        type: "GET",
        data: {
            id: id
        },
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
    let tableTreninzi = `<table class="treninziDisplay">`;
    tableTreninzi += `<tr class="tableHeader"><th>Naziv</th><th>Tip treninga</th><th>Trajanje</th><th>Vreme odrzavanja</th><th>Max. broj posetioca</th><th>Broj posetioca</th></tr>`;

    for (element in dataFun) {
        let trening = '<td>' + dataFun[element].Naziv + '</td>';
        trening += '<td>' + TipEnumText[dataFun[element].TipTreninga] + '</td>';
        trening += '<td>' + dataFun[element].TrajanjeTreninga + ' minuta</td>';

        let vremeOdrzavanja = new Date(dataFun[element].DatumVreme).toLocaleString('en-GB');    // Godina-mesec-dan sat:minut:sekunda
        let params = vremeOdrzavanja.split(',');
        let datum = params[0].split('/');
        let vreme = params[1].split(':');
        vremeOdrzavanja = `${datum[0]}-${datum[1]}-${datum[2]} | ${vreme[0]}:${vreme[1]}`;

        trening += '<td>' + vremeOdrzavanja + '</td>';
        trening += '<td>' + dataFun[element].MaksBrojPosetilaca + '</td>';
        trening += '<td>' + dataFun[element].Posetioci.length + '</td>';
        tableTreninzi += '<tr>' + trening + '</tr>';
    }

    tableTreninzi += `</table>`;
    $('#spisakTreninga').html(tableTreninzi);
}

function createTablePosetioc(dataFun) {
    let tableTreninzi = `<table class="treninziDisplay">`;
    tableTreninzi += `<tr><th>Naziv</th><th>Tip treninga</th><th>Trajanje</th><th>Vreme odrzavanja</th><th>Max. broj posetioca</th><th>Broj posetioca</th></tr>`;

    for (element in dataFun) {
        let trening = '<td>' + dataFun[element].Naziv + '</td>';
        trening += '<td>' + TipEnumText[dataFun[element].TipTreninga] + '</td>';
        trening += '<td>' + dataFun[element].TrajanjeTreninga + ' minuta</td>';

        let vremeOdrzavanja = new Date(dataFun[element].DatumVreme).toLocaleString('en-GB');
        let params = vremeOdrzavanja.split(',');
        let datum = params[0].split('/');
        let vreme = params[1].split(':');
        vremeOdrzavanja = `${datum[0]}-${datum[1]}-${datum[2]} | ${vreme[0]}:${vreme[1]}`;

        trening += '<td>' + vremeOdrzavanja + '</td>';
        trening += '<td>' + dataFun[element].MaksBrojPosetilaca + '</td>';
        trening += '<td>' + dataFun[element].Posetioci.length + '</td>';
        trening += `<td><button class="PosetiClass" value="${dataFun[element].Id}" name="${dataFun[element].Id}" id="btnPosetiTrening">+</button></td>`;
        tableTreninzi += '<tr>' + trening + '</tr>';
    }

    tableTreninzi += `</table>`;
    $('#spisakTreninga').html(tableTreninzi);
}

function createTableTrener(dataFun) {
    let tableTreninzi = `<table class="treninziDisplay">`;
    tableTreninzi += `<tr><th>Naziv</th><th>Tip treninga</th><th>Trajanje</th><th>Vreme odrzavanja</th><th>Max. broj posetioca</th><th>Broj posetioca</th></tr>`;

    let user = JSON.parse(sessionStorage.getItem('activeUser'));
    if (user.FitnesCentarTrener.Id == parseUrl()) {
        $('#btnDodajTrening').show();
    }

    for (element in dataFun) { 
        let trening = '<td>' + dataFun[element].Naziv + '</td>';
        trening += '<td>' + TipEnumText[dataFun[element].TipTreninga] + '</td>';
        trening += '<td>' + dataFun[element].TrajanjeTreninga + ' minuta</td>';

        let vremeOdrzavanja = new Date(dataFun[element].DatumVreme).toLocaleString('en-GB');
        let params = vremeOdrzavanja.split(',');
        let datum = params[0].split('/');
        let vreme = params[1].split(':');
        vremeOdrzavanja = `${datum[0]}-${datum[1]}-${datum[2]} | ${vreme[0]}:${vreme[1]}`;

        trening += '<td>' + vremeOdrzavanja + '</td>';
        trening += '<td class="broj">' + dataFun[element].MaksBrojPosetilaca + '</td>';
        trening += '<td class="broj">' + dataFun[element].Posetioci.length + '</td>';
        let ispisan = false;

        for (_element in user.GrupniTreninziTrener) { 
            if (dataFun[element].Id == user.GrupniTreninziTrener[_element].Id) {
                ispisan = true;
                trening += `<td class="btnTrener"><button class="TrenerClass" value="${dataFun[element].Id}" id="btnPrikaziSpisakPosetiocaTrening">Spisak</button></td>`;
                trening += `<td class="btnTrener"><button class="TrenerClass" value="${dataFun[element].Id}" id="btnIzmeniTrening">Izmeni</button></td>`;
                trening += `<td class="btnTrener"><button class="TrenerClass" value="${dataFun[element].Id}" id="btnObrisiTrening">Obrisi</button></td>`;
                tableTreninzi += '<tr>' + trening + '</tr>';
            }
        }

        if (!ispisan) {
            //trening = '<td>' + dataFun[element].Naziv + '</td>';
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
            //alert(xhr.status);
            console.log('Empty');
        }
    })
}

function displayTrenereCentra(treneri) {
    let tableTreneri = `<table class="treneriDisplay">`;
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
            //alert('Nema komentara');
        }

    });
}

function checkIfVlasnikCentra(user) {
    let idCentra = parseUrl();
    
    for (element in user.FitnesCentarVlasnik) {
        if (user.FitnesCentarVlasnik[element] == idCentra) {
            return true;
        }
    }

    return false;
}

function displayKomentare(komentari) {
    let tableKomentari = `<table class="komentariDisplay">`;
    tableKomentari += `<tr><td class="header" colspan="3">KOMENTARI</td></tr>`;
    tableKomentari += `<tr class="headerSecond"><td>Sadrzaj</td><td>Ocena</td></tr>`;

    if (sessionStorage.getItem('accessToken')) {
        let user = JSON.parse(sessionStorage.getItem('activeUser'));
        if (user.Uloga == 2) {
            if (checkIfVlasnikCentra(user)) {
                for (element in komentari) {
                    let komentar = `<td>${komentari[element].Sadrzaj}</td>`;
                    komentar += `<td class="ocena">${komentari[element].Ocena}</td>`
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
                        komentar += `<td class="ocena">${komentari[element].Ocena}</td>`
                        tableKomentari += `<tr>${komentar}</tr>`
                    }
                }
            }

        } else {
            for (element in komentari) {
                if (komentari[element].NotTouched == false && komentari[element].Odobren == true) {
                    let komentar = `<td>${komentari[element].Sadrzaj}</td>`;
                    komentar += `<td class="ocena">${komentari[element].Ocena}</td>`
                    tableKomentari += `<tr>${komentar}</tr>`
                }
            }
        }
    } else {
        for (element in komentari) {
            if (komentari[element].NotTouched == false && komentari[element].Odobren == true) {
                let komentar = `<td>${komentari[element].Sadrzaj}</td>`;
                komentar += `<td class="ocena">${komentari[element].Ocena}</td>`
                tableKomentari += `<tr>${komentar}</tr>`
            }
        }
    }

    tableKomentari += `</table>`;
    $('#komentari').html(tableKomentari);
}