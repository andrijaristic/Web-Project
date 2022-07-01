var UlogaEnums = {
    POSETILAC: 0,
    TRENER: 1,
    VLASNIK: 2
}

var data = [];
var dataCurrent = [];

$(document).ready(function () {
    loadFitnesCentre();
    $('#createFitnesCentarForm').hide();
    $('#btnShowCreateFormFitnesCentar').hide();

    if (sessionStorage.getItem('accessToken')) {
        $('#loginHref').hide();
        $('#logoutHref').show();
        $('#myAccountHref').show();

        let user = JSON.parse(sessionStorage.getItem('activeUser'));
        if (user.Uloga == UlogaEnums.VLASNIK) {
            $('#btnShowCreateFormFitnesCentar').show();
        }
    } else {
        $('#loginHref').show();
        $('#logoutHref').hide();
        $('#myAccountHref').hide();
    }

    $('#logoutHref').click(function () {
        sessionStorage.setItem('accessToken', '');
        sessionStorage.setItem('activeUser', '');
        alert('Logged out!');
    });

    $('#btnSearch').click(function () {
        searchFitnesCentre();
    });

    $('#btnSearchClear').click(function () {
        loadFitnesCentre();
        document.getElementById("inputNaziv").value = "";
        document.getElementById("inputAdresa").value = "";
        document.getElementById("minGodina").value = "";
        document.getElementById("maxGodina").value = "";
    });

    // Omogucavanje samo jednog checkbox-a.
    $(function () {
        $('#checkboxFilter input[type=checkbox]').prop('checked', false);
        $('#checkboxFilter input[type=checkbox]').click(function () {
            if ($('#checkboxFilter input[type=checkbox]').is(':checked')) {
                $('#checkboxFilter input[type=checkbox]').not(this).prop('checked', false);
            }
        });
    });

    // Sort po checkbox.
    $('#btnSort').click(function () {
        sort();
    });

    $('#btnShowCreateFormFitnesCentar').click(function () {
        $('#createFitnesCentarForm').show();
    });

    $('#btnAddFitnesCentar').click(function () {
        createFitnesCentar();
    });


    $('#fitnesCentriSpisak').on('click', '#btnObrisiCentar', function () {
        let id = $(this).attr('value');

        $.ajax({
            url: 'api/centri/ObrisiCentar?id=' + id,
            type: 'DELETE',
            success: function (response) {
                alert('Uspesno obrisan centar');
                displayCentre();
            },
            error: function (xhr) {
                alert('Postoje treninzi koji jos trebaju da se odrze.');
            }
        });
    });

    $('#fitnesCentriSpisak').on('click', '#btnIzmeniCentar', function () {
        let id = $(this).attr('value');
        $('#btnAddFitnesCentar').hide();
        $('#btnUpdateFitnesCentar').show();
        showForm(id);

        let vlasnik = JSON.parse(sessionStorage.getItem('activeUser'));

        $('#createFitnesCentarForm').on('click', '#btnUpdateFitnesCentar', function () {
            let nazivCentra = $('#nazivFitnesCentra').val();
            let adresa = $('#adresaFitnesCentra').val();
            let godinaOtvaranja = $('#godinaOtvaranjaFitnesCentra').val();
            let cenaMesecneClanarine = $('#cenaMesecnaClanarina').val();
            let cenaGodisnjeClanarine = $('#cenaGodisnjaClanarina').val();
            let cenaJednogTreninga = $('#cenaTreningJedanFitnesCentar').val();
            let cenaJednogGrupnogTreninga = $('#cenaTreningGrupniFitnesCentar').val();
            let cenaJednogTreningaSaTrenerom = $('#cenaTreningTrenerFitnesCentar').val();

            $.ajax({
                url: 'api/centri/IzmeniCentar',
                type: 'PUT',
                data: { // Dodati Datum i spisak Posetilaca.
                    Naziv: nazivCentra,
                    Adresa: adresa,
                    Vlasnik: vlasnik,
                    GodinaOtvaranja: godinaOtvaranja,
                    CenaMesecneClanarine: cenaMesecneClanarine,
                    CenaGodisnjeClanarine: cenaGodisnjeClanarine,
                    CenaJednogTreninga: cenaJednogTreninga,
                    CenaJednogGrupnogTreninga: cenaJednogGrupnogTreninga,
                    CenaJednogTreningaSaTrenerom: cenaJednogTreningaSaTrenerom
                },
                success: function (response) {
                    console.log('Uspelo');
                    displayCentre();
                    $('#createFitnesCentarForm').hide();
                    $('#fitnesCentriSpisak').show();
                },
                error: function (xhr) {
                    alert(xhr.status);
                }

            });
        });
    });
});

function sort() {
    let checkedCheckbox = document.querySelector('#checkboxFilter input[type=checkbox]:checked').value;
    console.log(checkedCheckbox);
    let selectedSortOption = document.getElementById('sortOption').value;

    if (checkedCheckbox == "naziv") {
        if (selectedSortOption == "rastuce") {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].Naziv > dataCurrent[j].Naziv) {
                        let temp = dataCurrent[i];
                        dataCurrent[i] = dataCurrent[j];
                        dataCurrent[j] = temp;
                    }
                }
            }
            createTable(dataCurrent);
            return;
        } else {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].Naziv < dataCurrent[j].Naziv) {
                        let temp = dataCurrent[i];
                        dataCurrent[i] = dataCurrent[j];
                        dataCurrent[j] = temp;
                    }
                }
            }
            createTable(dataCurrent);
            return;
        }
    }
    else if (checkedCheckbox == "adresa") {
        if (selectedSortOption == "rastuce") {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].Adresa > dataCurrent[j].Adresa) {
                        let temp = dataCurrent[i];
                        dataCurrent[i] = dataCurrent[j];
                        dataCurrent[j] = temp;
                    }
                }
            }
            createTable(dataCurrent);
            return;
        } else {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].Adresa < dataCurrent[j].Adresa) {
                        let temp = dataCurrent[i];
                        dataCurrent[i] = dataCurrent[j];
                        dataCurrent[j] = temp;
                    }
                }
            }
            createTable(dataCurrent);
            return;
        }
    }
    else if (checkedCheckbox == "godina") {
        if (selectedSortOption == "rastuce") {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].GodinaOtvaranja > dataCurrent[j].GodinaOtvaranja) {
                        let temp = dataCurrent[i];
                        dataCurrent[i] = dataCurrent[j];
                        dataCurrent[j] = temp;
                    }
                }
            }
            createTable(dataCurrent);
            return;
        } else {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].GodinaOtvaranja < dataCurrent[j].GodinaOtvaranja) {
                        let temp = dataCurrent[i];
                        dataCurrent[i] = dataCurrent[j];
                        dataCurrent[j] = temp;
                    }
                }
            }
            createTable(dataCurrent);
            return;
        }
    }
}

function searchFitnesCentre() {
    let naziv = $('#inputNaziv').val();
    let adresa = $('#inputAdresa').val();
    let minGodina = $('#minGodina').val() == "" ? 0 : $('#minGodina').val();
    let maxGodina = $('#maxGodina').val() == "" ? 0 : $('#maxGodina').val();

    let imaNaziv = false, imaAdresa = false, imaGodina = false;
    if (naziv.length != 0) { imaNaziv = true; }
    if (adresa.length != 0) { imaAdresa = true; }
    if (minGodina != 0) { imaGodina = true; }

    if (!imaNaziv && !imaAdresa && !imaGodina) { return; }
    searchTable = []

    // 1. Sve
    if (imaNaziv && imaAdresa && imaGodina) {
        for (element in data) {
            if (data[element].Naziv == naziv && data[element].Adresa == adresa && (data[element].GodinaOtvaranja >= minGodina && data[element].GodinaOtvaranja <= maxGodina)) {
                searchTable[searchTable.length] = data[element];
            }
        }
        createTable(searchTable);
        return;
    }

    // 2. Naziv / Adresa
    if (imaNaziv && imaAdresa && !imaGodina) {
        for (element in data) {
            if (data[element].Naziv == naziv && data[element].Adresa == adresa) {
                searchTable[searchTable.length] = data[element];
            }
        }
        createTable(searchTable);
        return;
    }

    // 3. Naziv / Godina 
    if (imaNaziv && imaAdresa && !imaGodina) {
        for (element in data) {
            if (data[element].Naziv == naziv && (data[element].GodinaOtvaranja >= minGodina && data[element].GodinaOtvaranja <= maxGodina)) {
                searchTable[searchTable.length] = data[element];
            }
        }
        createTable(searchTable);
        return;
    }

    // 4. Adresa / Godina
    if (!imaNaziv && imaAdresa && imaGodina) {
        for (element in data) {
            if (data[element].Adresa == adresa && (data[element].GodinaOtvaranja >= minGodina && data[element].GodinaOtvaranja <= maxGodina)) {
                searchTable[searchTable.length] = data[element];
            }
        }
        createTable(searchTable);
        return;
    }

    // 5. Naziv
    if (imaNaziv && !imaAdresa && !imaGodina) {
        for (element in data) {
            if (data[element].Naziv == naziv) {
                searchTable[searchTable.length] = data[element];
            }
        }
        createTable(searchTable);
        return;
    }

    // 6. Adresa
    if (!imaNaziv && imaAdresa && !imaGodina) {
        for (element in data) {
            if (data[element].Adresa == adresa) {
                searchTable[searchTable.length] = data[element];
            }
        }
        createTable(searchTable);
        return;
    }

    // 7. Godina
    if (!imaNaziv && !imaAdresa && imaGodina) {
        for (element in data) {
            if (data[element].GodinaOtvaranja >= minGodina && data[element].GodinaOtvaranja <= maxGodina) {
                searchTable[searchTable.length] = data[element];
            }
        }
        createTable(searchTable);
        return;
    }
    //$.get("api/centri", function (data, status) {

    //});
}

function loadFitnesCentre() {
    $.ajax({
        url: 'api/centri/GetStarter',
        type: 'GET',
        success: function (dataFun) {
            data = dataFun
            if (!sessionStorage.getItem('accessToken')) {
                createTable(dataFun);
                return;
            }

            let user = JSON.parse(sessionStorage.getItem('activeUser'));
            if (user.Uloga == UlogaEnums.VLASNIK) {
                createTableVlasnik(dataFun);
            } else {
                createTable(dataFun);
            }
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });
}

function displayCentre() {
    $.ajax({
        url: 'api/centri/GetCentre',
        type: 'GET',
        success: function (dataFun) {
            createTableVlasnik(dataFun);
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });
}

function createTable(dataFun) {
    let tableCentri = `<table border="1">`;
    tableCentri += `<tr><th>Naziv</th><th>Adresa</th><th>Godina otvaranja</th><th></th></tr>`;

    for (element in dataFun) {
        let centar = '<td>' + dataFun[element].Naziv + '</td>';
        centar += '<td>' + dataFun[element].Adresa + '</td>';
        centar += '<td>' + dataFun[element].GodinaOtvaranja + '</td>';
        centar += `<td><button class="btnDetails" name="${dataFun[element].Id}" onClick="location.href=\'Details.html?id=${dataFun[element].Id}\'">Detalji</td>`;

        tableCentri += '<tr>' + centar + '</tr>';
    }

    tableCentri += `</table>`;
    $('#fitnesCentriSpisak').html(tableCentri);
    console.log("Ucitani centri");
    dataCurrent = dataFun;
}

function createTableVlasnik(dataFun) {
    let tableCentri = `<table border="1">`;
    tableCentri += `<tr><th>Naziv</th><th>Adresa</th><th>Godina otvaranja</th><th></th></tr>`;

    let vlasnik = JSON.parse(sessionStorage.getItem('activeUser'));

    for (element in dataFun) {
        let centar = '<td>' + dataFun[element].Naziv + '</td>';
        centar += '<td>' + dataFun[element].Adresa + '</td>';
        centar += '<td>' + dataFun[element].GodinaOtvaranja + '</td>';
        centar += `<td><button class="btnDetails" name="${dataFun[element].Id}" onClick="location.href=\'Details.html?id=${dataFun[element].Id}\'">Detalji</td>`;
        let ispisan = false;

        for (_element in vlasnik.FitnesCentarVlasnik) {
            if (dataFun[element].Id == vlasnik.FitnesCentarVlasnik[_element]) {
                ispisan = true;
                centar += `<td><button class="VlasnikClass" value="${dataFun[element].Id}" id="btnObrisiCentar">-</button></td>`;
                centar += `<td><button class="VlasnikClass" value="${dataFun[element].Id}" id="btnIzmeniCentar">?</button></td>`;
                centar += `<td><button class="VlasnikClass" value="${dataFun[element].Id}" id="btnDodajTreneraCentar" onClick="location.href=\'Register.html?id=${dataFun[element].Id}\'">+</button></td>`;
                tableCentri += '<tr>' + centar + '</tr>';
            }
        }

        if (!ispisan) {
            tableCentri += '<tr>' + centar + '</tr>';
        }
    }

    tableCentri += `</table>`;
    $('#fitnesCentriSpisak').html(tableCentri);
    console.log("Ucitani centri");
    dataCurrent = dataFun;
}

function createFitnesCentar() {
    // Validacija ovoga svega.
    $('#btnAddFitnesCentar').show();
    $('#btnUpdateFitnesCentar').hide();
    let naziv = $('#nazivFitnesCentra').val();
    let adresa = $('#adresaFitnesCentra').val();
    let cenaMesecna = $('#cenaMesecnaClanarina').val(); 
    let cenaGodisnja = $('#cenaGodisnjaClanarina').val();
    let cenaTreningJedan = $('#cenaTreningJedanFitnesCentar').val();
    let cenaTreningGrupni = $('#cenaTreningGrupniFitnesCentar').val();
    let cenaTreningTrener = $('#cenaTreningTrenerFitnesCentar').val();
    let godinaOtvaranja = $('#godinaOtvaranjaFitnesCentra').val();

    let vlasnik = JSON.parse(sessionStorage.getItem('activeUser'));
    let vlasnikNaziv = vlasnik.Username;

    $.ajax({
        url: 'api/centri/CreateFitnesCentar',
        type: 'POST',
        data: {
            Naziv: naziv,
            Adresa: adresa,
            Vlasnik: vlasnik,
            GodinaOtvaranja: godinaOtvaranja,
            CenaMesecneClanarine: cenaMesecna,
            CenaGodisnjeClanarine: cenaGodisnja,
            CenaJednogTreninga: cenaTreningJedan,
            CenaJednogGrupnogTreninga: cenaTreningGrupni,
            CenaJednogTreningaSaTrenerom: cenaTreningTrener
        },
        success: function (response) {
            sessionStorage.setItem('activeUser', '');
            sessionStorage.setItem('activeUser', JSON.stringify(response));
            $('#createFitnesCentarForm').hide();
            displayCentre();
            alert('Napravljen fitnes centrar');
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });
}

function showForm(id) {
    $('#fitnesCentriSpisak').hide();
    $('#createFitnesCentarForm').show();
    $('#btnShowCreateFormFitnesCentar').hide();

    let centar;
    for (el in data) {
        if (data[el].Id == id) {
            centar = data[el];
        }
    }

    $('#nazivFitnesCentra').attr('value', centar.Naziv);
    $('#adresaFitnesCentra').attr('value', centar.Adresa);
    $('#cenaMesecnaClanarina').attr('value', centar.CenaMesecneClanarine)
    $('#cenaGodisnjaClanarina').attr('value', centar.CenaGodisnjeClanarine);
    $('#cenaTreningJedanFitnesCentar').attr('value', centar.CenaJednogTreninga);
    $('#cenaTreningGrupniFitnesCentar').attr('value', centar.CenaJednogGrupnogTreninga);
    $('#cenaTreningTrenerFitnesCentar').attr('value', centar.CenaJednogTreningaSaTrenerom);
    $('#godinaOtvaranjaFitnesCentra').attr('value', centar.GodinaOtvaranja);
}