var UlogaEnums = {
    POSETILAC: 0,
    TRENER: 1,
    VLASNIK: 2
}

var data = [];
var dataCurrent = [];

$(document).ready(function () {
    let idDugme = 0;
    loadFitnesCentre();
    $('#createFitnesCentarForm').hide();
    $('#btnUpdateFitnesCentar').hide();
    $('#btnShowCreateFormFitnesCentar').hide();
    $('#btnExitForm').hide();
    $('#btnExitUpdate').hide();

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
        $('#btnShowCreateFormFitnesCentar').hide();
        $('#btnExitForm').show();
    });

    $('#btnExitForm').click(function () {
        $('#createFitnesCentarForm').hide();
        $('#btnShowCreateFormFitnesCentar').show();
        $('#btnExitForm').hide();
    })

    $('#btnAddFitnesCentar').click(function () {
        createFitnesCentar();
    });

    $('#btnExitUpdate').click(function () {
        $('#createFitnesCentarForm').hide();
        $('#btnShowCreateFormFitnesCentar').show();
        $('#btnExitUpdate').hide();
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
        idDugme = $(this).attr('value');
        $('#btnAddFitnesCentar').hide();
        $('#btnUpdateFitnesCentar').show();
        $('#btnExitUpdate').show();
        $('#btnExitForm').hide();
        showForm(idDugme);
    });

    $('#createFitnesCentarForm').on('click', '#btnUpdateFitnesCentar', function () {
        if (!validate()) {
            return;
        }

        let id = idDugme;
        let vlasnik = JSON.parse(sessionStorage.getItem('activeUser'));
        let naziv = $('#nazivFitnesCentra').val();
        let ulica = $('#adresaFitnesCentraUlica').val();
        let broj = $('#adresaFitnesCentraBroj').val();
        let grad = $('#adresaFitnesCentraGrad').val();
        let kod = $('#adresaFitnesCentraKod').val();
        let godinaOtvaranja = $('#godinaOtvaranjaFitnesCentra').val();
        let mesecnaClanarina = $('#cenaMesecnaClanarina').val();
        let godisnjaClanarina = $('#cenaGodisnjaClanarina').val();
        let cenaTreningJedan = $('#cenaTreningJedanFitnesCentar').val();
        let cenaTreningGrupni = $('#cenaTreningGrupniFitnesCentar').val();
        let cenaTreningTrener = $('#cenaTreningTrenerFitnesCentar').val();

        let adresa = `${ulica} ${broj}, ${grad}, ${kod}`;

        $.ajax({
            url: 'api/centri/IzmeniCentar',
            type: 'PUT',
            data: {
                Id: id,
                Naziv: naziv,
                Adresa: adresa,
                Vlasnik: vlasnik,
                GodinaOtvaranja: godinaOtvaranja,
                CenaMesecneClanarine: mesecnaClanarina,
                CenaGodisnjeClanarine: godisnjaClanarina,
                CenaJednogTreninga: cenaTreningJedan,
                CenaJednogGrupnogTreninga: cenaTreningGrupni,
                CenaJednogTreningaSaTrenerom: cenaTreningTrener
            },
            success: function (response) {
                console.log('Uspelo');
                response = sortByNaziv(response);
                $('#createFitnesCentarForm').hide();
                $('#fitnesCentriSpisak').show();
                createTableVlasnik(response);
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    });

    // Validacije za kreiranje novog fitnes centra.
    {
        $('#nazivFitnesCentra').focusout(function () {
            let naziv = $('#nazivFitnesCentra').val();
            naziv = $.trim(naziv);
            if (naziv == "") {
                $('#nazivFitnesCentra').css('border', '1px solid red');
            } else {
                $('#nazivFitnesCentra').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#nazivFitnesCentra', function () {
            let naziv = $('#nazivFitnesCentra').val();
            naziv = $.trim(naziv);
            if (naziv == "") {
                $('#nazivFitnesCentra').css('border', '1px solid red');
            } else {
                $('#nazivFitnesCentra').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#adresaFitnesCentraUlica', function () {
            let ulica = $('#adresaFitnesCentraUlica').val();
            ulica = $.trim(ulica);
            if (ulica == "") {
                $('#adresaFitnesCentraUlica').css('border', '1px solid red');
            } else {
                $('#adresaFitnesCentraUlica').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#adresaFitnesCentraBroj', function () {
            let broj = $('#adresaFitnesCentraBroj').val();
            broj = $.trim(broj);
            if (broj == "" || broj.length > 2) {
                $('#adresaFitnesCentraBroj').css('border', '1px solid red');
            } else {
                $('#adresaFitnesCentraBroj').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#adresaFitnesCentraGrad', function () {
            let grad = $('#adresaFitnesCentraGrad').val();
            grad = $.trim(grad);
            if (grad == "") {
                $('#adresaFitnesCentraGrad').css('border', '1px solid red');
            } else {
                $('#adresaFitnesCentraGrad').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#adresaFitnesCentraKod', function () {
            let kod = $('#adresaFitnesCentraKod').val();
            kod = $.trim(kod);
            if (kod == "" || kod.length != 5) {
                $('#adresaFitnesCentraKod').css('border', '1px solid red');
            } else {
                $('#adresaFitnesCentraKod').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#godinaOtvaranjaFitnesCentra', function () {
            let godinaOtvaranja = $('#godinaOtvaranjaFitnesCentra').val();
            let date = new Date();
            let godina = date.getFullYear();
            if (godinaOtvaranja == "" || godinaOtvaranja.length != 4 || godinaOtvaranja > godina) {
                $('#godinaOtvaranjaFitnesCentra').css('border', '1px solid red');
            } else {
                $('#godinaOtvaranjaFitnesCentra').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#cenaMesecnaClanarina', function () {
            let mesecnaClanarina = $('#cenaMesecnaClanarina').val();
            if (mesecnaClanarina == "" || mesecnaClanarina < 0) {
                $('#cenaMesecnaClanarina').css('border', '1px solid red');
            } else {
                $('#cenaMesecnaClanarina').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#cenaGodisnjaClanarina', function () {
            let godisnjaClanarina = $('#cenaGodisnjaClanarina').val();
            if (godisnjaClanarina == "" || godisnjaClanarina < 0) {
                $('#cenaGodisnjaClanarina').css('border', '1px solid red');
            } else {
                $('#cenaGodisnjaClanarina').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#cenaTreningJedanFitnesCentar', function () {
            let cenaTreningJedan = $('#cenaTreningJedanFitnesCentar').val();
            if (cenaTreningJedan == "" || cenaTreningJedan < 0) {
                $('#cenaTreningJedanFitnesCentar').css('border', '1px solid red');
            } else {
                $('#cenaTreningJedanFitnesCentar').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#cenaTreningGrupniFitnesCentar', function () {
            let cenaTreningGrupni = $('#cenaTreningGrupniFitnesCentar').val();
            if (cenaTreningGrupni == "" || cenaTreningGrupni < 0) {
                $('#cenaTreningGrupniFitnesCentar').css('border', '1px solid red');
            } else {
                $('#cenaTreningGrupniFitnesCentar').css('border', '1px solid green');
            }
        });

        $('#createFitnesCentarForm').on('focusout', '#cenaTreningTrenerFitnesCentar', function () {
            let cenaTreningTrener = $('#cenaTreningTrenerFitnesCentar').val();
            if (cenaTreningTrener == "" || cenaTreningTrener < 0) {
                $('#cenaTreningTrenerFitnesCentar').css('border', '1px solid red');
            } else {
                $('#cenaTreningTrenerFitnesCentar').css('border', '1px solid green');
            }
        });
    }

    // Validacije za filtriranje.
    {
        $('#filterParams').on('focusout', '#minGodina', function () {
            let minGodina = $('#minGodina').val();
            minGodina = $.trim(minGodina);

            if (minGodina == "" || minGodina.length != 4) {
                $('#minGodina').css('border', '1px solid red');
            } else {
                $('#minGodina').css('border', '1px solid green');

                let maxGodina = $('#maxGodina').val();
                maxGodina = $.trim(maxGodina);

                if (maxGodina == "" || maxGodina.length != 4 || maxGodina < minGodina) {
                    $('#maxGodina').css('border', '1px solid red');
                    return;
                } else {
                    $('minGodina').css('border', '1px solid green');
                    $('maxGodina').css('border', '1px solid green');
                }
            }
        });

        $('#filterParams').on('focusout', '#maxGodina', function () {
            let maxGodina = $('#maxGodina').val();
            maxGodina = $.trim(maxGodina);

            if (maxGodina == "" || maxGodina.length != 4) {
                $('#maxGodina').css('border', '1px solid red');
            } else {
                $('#maxGodina').css('border', '1px solid green');

                let minGodina = $('#minGodina').val();
                minGodina = $.trim(minGodina);

                if (minGodina == "" || minGodina.length != 4 || minGodina > minGodina) {
                    $('#minGodina').css('border', '1px solid red');
                    return;
                } else {
                    $('minGodina').css('border', '1px solid green');
                    $('maxGodina').css('border', '1px solid green');
                }
            }
        });
    }
}); 

function validate() {
    let regex = /[a-zA-Z0-9 ]*/;

    let naziv = $('#nazivFitnesCentra').val();
    naziv = $.trim(naziv);
    if (naziv == "") {
        $('#nazivFitnesCentra').css('border', '1px solid red');
        $('#nazivFitnesCentra').focus();
        return false;
    } else {
        $('#nazivFitnesCentra').css('border', '1px solid green');
    }

    let ulica = $('#adresaFitnesCentraUlica').val();
    ulica = $.trim(ulica);
    if (!regex.test(ulica)) {
        $('#adresaFitnesCentraUlica').css('border', '1px solid red');
        return false;
    }

    // Mozda ni ne treba ovo ako imam regex test... Hmm...
    if (ulica == "") {
        $('#adresaFitnesCentraUlica').css('border', '1px solid red');
        $('#adresaFitnesCentraUlica').focus();
        return false;
    } else {
        $('#adresaFitnesCentraUlica').css('border', '1px solid green');
    }

    let broj = $('#adresaFitnesCentraBroj').val();
    broj = $.trim(broj);
    if (broj == "" || broj.length > 2) {
        $('#adresaFitnesCentraBroj').css('border', '1px solid red');
        $('#adresaFitnesCentraBroj').focus();
        return false;
    } else {
        $('#adresaFitnesCentraBroj').css('border', '1px solid green');
    }


    let grad = $('#adresaFitnesCentraGrad').val();
    grad = $.trim(grad);
    if (!regex.test(grad)) {
        $('#adresaFitnesCentraGrad').css('border', '1px solid red');
        $('#adresaFitnesCentraGrad').focus();
        return false;
    }

    if (grad == "") {
        $('#adresaFitnesCentraGrad').css('border', '1px solid red');
        $('#adresaFitnesCentraGrad').focus();
        return false;
    } else {
        $('#adresaFitnesCentraGrad').css('border', '1px solid green');
    }

    let kod = $('#adresaFitnesCentraKod').val();
    kod = $.trim(kod);
    if (kod == "" || kod.length != 5) {
        $('#adresaFitnesCentraKod').css('border', '1px solid red');
        $('#adresaFitnesCentraKod').focus();
        return false;
    } else {
        $('#adresaFitnesCentraKod').css('border', '1px solid green');
    }


    let godinaOtvaranja = $('#godinaOtvaranjaFitnesCentra').val();
    let date = new Date();
    let godina = date.getFullYear();
    if (godinaOtvaranja == "" || godinaOtvaranja.length != 4 || godinaOtvaranja > godina) {
        $('#godinaOtvaranjaFitnesCentra').css('border', '1px solid red');
        $('#godinaOtvaranjaFitnesCentra').focus();
        return false;
    } else {
        $('#godinaOtvaranjaFitnesCentra').css('border', '1px solid green');
    }

    let mesecnaClanarina = $('#cenaMesecnaClanarina').val();
    if (mesecnaClanarina == "") {
        $('#cenaMesecnaClanarina').css('border', '1px solid red');
        $('#cenaMesecnaClanarina').focus();
        return false;
    } else {
        $('#cenaMesecnaClanarina').css('border', '1px solid green');
    }

    let godisnjaClanarina = $('#cenaGodisnjaClanarina').val();
    if (godisnjaClanarina == "") {
        $('#cenaGodisnjaClanarina').css('border', '1px solid red');
        $('#cenaGodisnjaClanarina').focus();
        return false;
    } else {
        $('#cenaGodisnjaClanarina').css('border', '1px solid green');
    }

    let cenaTreningJedan = $('#cenaTreningJedanFitnesCentar').val();
    if (cenaTreningJedan == "") {
        $('#cenaTreningJedanFitnesCentar').css('border', '1px solid red');
        $('#cenaTreningJedanFitnesCentar').focus();
        return false;
    } else {
        $('#cenaTreningJedanFitnesCentar').css('border', '1px solid green');
    }

    let cenaTreningGrupni = $('#cenaTreningGrupniFitnesCentar').val();
    if (cenaTreningGrupni == "") {
        $('#cenaTreningGrupniFitnesCentar').css('border', '1px solid red');
        $('#cenaTreningGrupniFitnesCentar').focus();
        return false;
    } else {
        $('#cenaTreningGrupniFitnesCentar').css('border', '1px solid green');
    }

    let cenaTreningTrener = $('#cenaTreningTrenerFitnesCentar').val();
    if (cenaTreningTrener == "") {
        $('#cenaTreningTrenerFitnesCentar').css('border', '1px solid red');
        $('#cenaTreningTrenerFitnesCentar').focus();
        return false;
    } else {
        $('#cenaTreningTrenerFitnesCentar').css('border', '1px solid green');
    }

    return true;
}

function sort() {
    let checkedCheckbox = document.querySelector('#checkboxFilter input[type=checkbox]:checked').value;
    console.log(checkedCheckbox);
    let selectedSortOption = document.getElementById('sortOption').value;

    if (checkedCheckbox == "naziv") {
        if (selectedSortOption == "rastuce") {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].Naziv.toUpperCase() > dataCurrent[j].Naziv.toUpperCase()) {
                        let temp = dataCurrent[i];
                        dataCurrent[i] = dataCurrent[j];
                        dataCurrent[j] = temp;
                    }
                }
            }
            createTableChecker(dataCurrent);
            return;
        } else {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].Naziv.toUpperCase() < dataCurrent[j].Naziv.toUpperCase()) {
                        let temp = dataCurrent[i];
                        dataCurrent[i] = dataCurrent[j];
                        dataCurrent[j] = temp;
                    }
                }
            }
            createTableChecker(dataCurrent);
            return;
        }
    }
    else if (checkedCheckbox == "adresa") {
        if (selectedSortOption == "rastuce") {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].Adresa.toUpperCase() > dataCurrent[j].Adresa.toUpperCase()) {
                        let temp = dataCurrent[i];
                        dataCurrent[i] = dataCurrent[j];
                        dataCurrent[j] = temp;
                    }
                }
            }
            createTableChecker(dataCurrent);
            return;
        } else {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].Adresa.toUpperCase() < dataCurrent[j].Adresa.toUpperCase()) {
                        let temp = dataCurrent[i];
                        dataCurrent[i] = dataCurrent[j];
                        dataCurrent[j] = temp;
                    }
                }
            }
            createTableChecker(dataCurrent);
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
            createTableChecker(dataCurrent);
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
            createTableChecker(dataCurrent);
            return;
        }
    }
}

function createTableChecker(dataFun) {
    if (sessionStorage.getItem('accessToken')) {
        let user = JSON.parse(sessionStorage.getItem('activeUser'));

        if (user.Uloga == 2) {
            createTableVlasnik(dataFun);
        } else {
            createTable(dataFun)
        }
    } else {
        createTable(dataFun);
    }
}

function sortByNaziv(dataFun) {
    for (let i = 0; i < dataFun.length; i++) {
        for (let j = i + 1; j < dataFun.length; j++) {
            if (dataFun[i].Naziv.toUpperCase() > dataFun[j].Naziv.toUpperCase()) {
                let temp = dataFun[i];
                dataFun[i] = dataFun[j];
                dataFun[j] = temp;
            }
        }
    }

    return dataFun;
}

function searchFitnesCentre() {
    if (!validateFilter()) {
        return;
    }

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

    // IF-ovi za pretragu.
    {
        // 1. Sve
        if (imaNaziv && imaAdresa && imaGodina) {
            for (element in data) {
                if (data[element].Naziv.includes(naziv) && data[element].Adresa.includes(adresa) && (data[element].GodinaOtvaranja >= minGodina && data[element].GodinaOtvaranja <= maxGodina)) {
                    searchTable[searchTable.length] = data[element];
                }
            }
            createTableChecker(searchTable);
            return;
        }

        // 2. Naziv / Adresa
        if (imaNaziv && imaAdresa && !imaGodina) {
            for (element in data) {
                if (data[element].Naziv.includes(naziv) && data[element].Adresa.includes(adresa)) {
                    searchTable[searchTable.length] = data[element];
                }
            }
            createTableChecker(searchTable);
            return;
        }

        // 3. Naziv / Godina 
        if (imaNaziv && !imaAdresa && imaGodina) {
            for (element in data) {
                if (data[element].Naziv.includes(naziv) && (data[element].GodinaOtvaranja >= minGodina && data[element].GodinaOtvaranja <= maxGodina)) {
                    searchTable[searchTable.length] = data[element];
                }
            }
            createTableChecker(searchTable);
            return;
        }

        // 4. Adresa / Godina
        if (!imaNaziv && imaAdresa && imaGodina) {
            for (element in data) {
                if (data[element].Adresa.includes(adresa) && (data[element].GodinaOtvaranja >= minGodina && data[element].GodinaOtvaranja <= maxGodina)) {
                    searchTable[searchTable.length] = data[element];
                }
            }
            createTableChecker(searchTable);
            return;
        }

        // 5. Naziv
        if (imaNaziv && !imaAdresa && !imaGodina) {
            for (element in data) {
                if (data[element].Naziv.includes(naziv)) {
                    searchTable[searchTable.length] = data[element];
                }
            }
            createTableChecker(searchTable);
            return;
        }

        // 6. Adresa
        if (!imaNaziv && imaAdresa && !imaGodina) {
            for (element in data) {
                if (data[element].Adresa.includes(adresa)) {
                    searchTable[searchTable.length] = data[element];
                }
            }
            createTableChecker(searchTable);
            return;
        }

        // 7. Godina
        if (!imaNaziv && !imaAdresa && imaGodina) {
            for (element in data) {
                if (data[element].GodinaOtvaranja >= minGodina && data[element].GodinaOtvaranja <= maxGodina) {
                    searchTable[searchTable.length] = data[element];
                }
            }
            createTableChecker(searchTable);
            return;
        }
    }
}

function validateFilter() {
    let minGodina = $('#minGodina').val();
    let maxGodina = $('#maxGodina').val();
    maxGodina = $.trim(maxGodina);
    minGodina = $.trim(minGodina);

    if (maxGodina == "" && minGodina == "") {
        return true;
    }

    if (minGodina == "" || minGodina.length != 4) {
        $('#minGodina').css('border', '1px solid red');
    } else {
        $('#minGodina').css('border', '1px solid green');

        let maxGodina = $('#maxGodina').val();
        maxGodina = $.trim(maxGodina);

        if (maxGodina == "" || maxGodina.length != 4 || maxGodina < minGodina) {
            $('#maxGodina').css('border', '1px solid red');
            return false;
        } else {
            $('minGodina').css('border', '1px solid green');
            $('maxGodina').css('border', '1px solid green');
        }
    }

    maxGodina = $('#maxGodina').val();
    maxGodina = $.trim(maxGodina);

    if (maxGodina == "" || maxGodina.length != 4) {
        $('#maxGodina').css('border', '1px solid red');
    } else {
        $('#maxGodina').css('border', '1px solid green');

        minGodina = $('#minGodina').val();
        minGodina = $.trim(minGodina);

        if (minGodina == "" || minGodina.length != 4 || minGodina > minGodina) {
            $('#minGodina').css('border', '1px solid red');
            return false;
        } else {
            $('minGodina').css('border', '1px solid green');
            $('maxGodina').css('border', '1px solid green');
        }
    }

    return true;
}

function loadFitnesCentre() {
    $.ajax({
        url: 'api/centri/GetStarter',
        type: 'GET',
        success: function (dataFun) {
            data = dataFun
            dataFun = sortByNaziv(dataFun);
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
            dataFun = sortByNaziv(dataFun);
            createTableVlasnik(dataFun);
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });
}

function createTable(dataFun) {
    let tableCentri = `<table class="centri">`;
    tableCentri += `<tr><th>Naziv</th><th>Adresa</th><th>Godina otvaranja</th><th></th></tr>`;

    for (element in dataFun) {
        let centar = '<td>' + dataFun[element].Naziv + '</td>';
        centar += '<td>' + dataFun[element].Adresa + '</td>';
        centar += '<td>' + dataFun[element].GodinaOtvaranja + '</td>';
        centar += `<td class="btnNormal"><button class="btnDetails" name="${dataFun[element].Id}" onClick="location.href=\'Details.html?id=${dataFun[element].Id}\'">Detalji</td>`;

        tableCentri += '<tr>' + centar + '</tr>';
    }

    tableCentri += `</table>`;
    $('#fitnesCentriSpisak').html(tableCentri);
    console.log("Ucitani centri");
    dataCurrent = dataFun;
}

function createTableVlasnik(dataFun) {
    let tableCentri = `<table class="centri centriVlasnik">`;
    tableCentri += `<tr><th>Naziv</th><th>Adresa</th><th>Godina otvaranja</th><th></th></tr>`;

    let vlasnik = JSON.parse(sessionStorage.getItem('activeUser'));

    for (element in dataFun) {
        let centar = '<td>' + dataFun[element].Naziv + '</td>';
        centar += '<td>' + dataFun[element].Adresa + '</td>';
        centar += '<td>' + dataFun[element].GodinaOtvaranja + '</td>';
        centar += `<td class="btnVlasnik1" ><button class="btnVlasnik" name="${dataFun[element].Id}" onClick="location.href=\'Details.html?id=${dataFun[element].Id}\'">Detalji</td>`;
        let ispisan = false;

        for (_element in vlasnik.FitnesCentarVlasnik) {
            if (dataFun[element].Id == vlasnik.FitnesCentarVlasnik[_element]) {
                ispisan = true;
                centar += `<td class="btnVlasnik1" ><button class="btnVlasnik" value="${dataFun[element].Id}" id="btnIzmeniCentar">Izmeni</button></td>`;
                centar += `<td class="btnVlasnik1" ><button class="btnVlasnik" value="${dataFun[element].Id}" id="btnObrisiCentar">-</button></td>`;
                centar += `<td class="btnVlasnik1" ><button class="btnVlasnik" value="${dataFun[element].Id}" id="btnDodajTreneraCentar" onClick="location.href=\'Register.html?id=${dataFun[element].Id}\'">+</button></td>`;
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
    $('#btnShowCreateFormFitnesCentar').hide();
    if (!validate()) {
        return;
    }

    $('#btnAddFitnesCentar').hide();
    $('#btnUpdateFitnesCentar').hide();

    let naziv = $('#nazivFitnesCentra').val();
    let ulica = $('#adresaFitnesCentraUlica').val();
    let broj = $('#adresaFitnesCentraBroj').val();
    let grad = $('#adresaFitnesCentraGrad').val();
    let kod = $('#adresaFitnesCentraKod').val();
    let cenaMesecna = $('#cenaMesecnaClanarina').val(); 
    let cenaGodisnja = $('#cenaGodisnjaClanarina').val();
    let cenaTreningJedan = $('#cenaTreningJedanFitnesCentar').val();
    let cenaTreningGrupni = $('#cenaTreningGrupniFitnesCentar').val();
    let cenaTreningTrener = $('#cenaTreningTrenerFitnesCentar').val();
    let godinaOtvaranja = $('#godinaOtvaranjaFitnesCentra').val();

    let adresa = `${ulica} ${broj}, ${grad}, ${kod}`;

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
            $('#btnShowCreateFormFitnesCentar').show();
            displayCentre();
            //alert('Napravljen fitnes centrar');
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });
}

function showForm(id) {
    $('#createFitnesCentarForm').show();
    $('#btnShowCreateFormFitnesCentar').hide();

    $('#nazivFitnesCentra').attr('value', '');

    let centar;
    for (el in data) {
        if (data[el].Id == id) {
            centar = data[el];
        }
    }
    let params = centar.Adresa.split(',');
    let ulica = params[0].split(' ')[0];
    let broj = params[0].split(' ')[1];
    let grad = $.trim(params[1]);
    let kod = $.trim(params[2]);

    $('#nazivFitnesCentra').attr('value', centar.Naziv);
    $('#adresaFitnesCentraUlica').attr('value', ulica);
    $('#adresaFitnesCentraBroj').attr('value', broj);
    $('#adresaFitnesCentraGrad').attr('value', grad);
    $('#adresaFitnesCentraKod').attr('value', kod);
    $('#cenaMesecnaClanarina').attr('value', centar.CenaMesecneClanarine)
    $('#cenaGodisnjaClanarina').attr('value', centar.CenaGodisnjeClanarine);
    $('#cenaTreningJedanFitnesCentar').attr('value', centar.CenaJednogTreninga);
    $('#cenaTreningGrupniFitnesCentar').attr('value', centar.CenaJednogGrupnogTreninga);
    $('#cenaTreningTrenerFitnesCentar').attr('value', centar.CenaJednogTreningaSaTrenerom);
    $('#godinaOtvaranjaFitnesCentra').attr('value', centar.GodinaOtvaranja);
}

function clearForm() {
    document.getElementById('nazivFitnesCentra').value = "";
    document.getElementById('adresaFitnesCentraUlica').value = "";
    document.getElementById('adresaFitnesCentraBroj').value = "";
    document.getElementById('adresaFitnesCentraGrad').value = "";
    document.getElementById('adresaFitnesCentraKod').value = "";
    document.getElementById('cenaMesecnaClanarina').value = "";
    document.getElementById('cenaGodisnjaClanarina').value = "";
    document.getElementById('cenaTreningJedanFitnesCentar').value = "";
    document.getElementById('cenaTreningGrupniFitnesCentar').value = "";
    document.getElementById('cenaTreningTrenerFitnesCentar').value = "";
    document.getElementById('godinaOtvaranjaFitnesCentra').value = "";

    $('#nazivFitnesCentra').css('border', '1px solid black');
    $('#adresaFitnesCentraUlica').css('border', '1px solid black');
    $('#adresaFitnesCentraBroj').css('border', '1px solid black');
    $('#adresaFitnesCentraGrad').css('border', '1px solid black');
    $('#adresaFitnesCentraKod').css('border', '1px solid black');
    $('#cenaMesecnaClanarina').css('border', '1px solid black');
    $('#cenaGodisnjaClanarina').css('border', '1px solid black');
    $('#cenaTreningJedanFitnesCentar').css('border', '1px solid black');
    $('#cenaTreningGrupniFitnesCentar').css('border', '1px solid black');
    $('#cenaTreningTrenerFitnesCentar').css('border', '1px solid black');
    $('#godinaOtvaranjaFitnesCentra').css('border', '1px solid black');
}