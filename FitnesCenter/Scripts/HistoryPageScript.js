var UlogaEnum = {
    POSETIOC: 0,
    TRENER: 1,
    VLASNIK: 2
}

var TipEnum = {
    "YOGA": 0,
    "LES MILLS TONE": 1,
    "BODY PUMP": 2
}

var TipEnumText = {
    "0": "YOGA",
    "1": "LES MILLS TONE",
    "2": "BODY PUMP"
}

var data = []
var dataCurrent = []

$(document).ready(function () {
    if (!sessionStorage.getItem('accessToken')) {
        alert('Niste ulogovani!');
        //window.location.replace('Login.html');
    }
    let user = JSON.parse(sessionStorage.getItem('activeUser'));
    $('#sve').hide();
    if (user.Uloga == UlogaEnum.VLASNIK) {
        alert('Nema history jer ste vlasnik');
        return;
    }

    $('#sve').show();
    $('#pretragaNaziv').hide();
    $('#nazivFitnesCentra').hide();
    $('#tipTreninga').hide();
    $('#minGodina').hide();
    $('#maxGodina').hide();
    $('#rowNaziv').hide();
    $('#rowTip').hide();
    $('#rowFitnes').hide();
    $('#rowDatum').hide();

    $(function () {
        $('#checkboxFilter input[type=checkbox]').prop('checked', false);
        $('#checkboxFilter input[type=checkbox]').click(function () {
            if ($('#checkboxFilter input[type=checkbox]').is(':checked')) {
                $('#checkboxFilter input[type=checkbox]').not(this).prop('checked', false);
            }
        });
    });

    // NAZIV, TIP, FITNES - Pretraga
    // NAZIV, TIP, DATUM i VREME - Sort
    if (user.Uloga == UlogaEnum.POSETIOC) {
        $('#pretragaNaziv').show();
        $('#nazivFitnesCentra').show();
        $('#tipTreninga').show();

        $('#rowNaziv').show();
        $('#rowTip').show();
        $('#rowDatum').show();
        displayTreningePosetioc(user);
    } else if (user.Uloga == UlogaEnum.TRENER) {
        $('#pretragaNaziv').show();
        $('#tipTreninga').show();
        $('#minGodina').show();
        $('#maxGodina').show();

        $('#rowNaziv').show();
        $('#rowTip').show();
        $('#rowDatum').show();
        displayTreningeTrener(user);
    }

    $('#btnSort').click(function () {
        sort();
    });

    $('#btnSearch').click(function () {
        searchTrenings(user);
    });

    $('#btnSearchClear').click(function () {
        if (user.Uloga == UlogaEnum.POSETIOC) {
            displayTreningePosetioc(user);
        } else if (user.Uloga == UlogaEnum.TRENER) {
            displayTreningeTrener(user);
        }

        document.getElementById('pretragaNaziv').value = "";
        document.getElementById('nazivFitnesCentra').value = "";
        document.getElementById('tipTreninga').value = "";
        document.getElementById('minGodina').value = "";
        document.getElementById('maxGodina').value = "";
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


    // Real-time validacija.
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

function showSpisakPosetioca(dataFun) {
    let spisak = "";
    for (el in dataFun) {
        spisak += `${dataFun[el].Ime}\n`;
    }

    alert(spisak);
}

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
            createTableChecker(dataCurrent);
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
            createTableChecker(dataCurrent);
            return;
        }
    }
    else if (checkedCheckbox == "tip") {
        if (selectedSortOption == "rastuce") {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (TipEnumText[dataCurrent[i].TipTreninga] > TipEnumText[dataCurrent[i].TipTreninga]) {
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
                    if (TipEnumText[dataCurrent[i].TipTreninga] < TipEnumText[dataCurrent[i].TipTreninga]) {
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
    else if (checkedCheckbox == "fitnes") {
        if (selectedSortOption == "rastuce") {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].FitnesCentar.Naziv > dataCurrent[j].FitnesCentar.Naziv) {
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
                    if (dataCurrent[i].FitnesCentar.Naziv < dataCurrent[j].FitnesCentar.Naziv) {
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
    else if (checkedCheckbox == "datum") {
        if (selectedSortOption == "rastuce") {
            for (let i = 0; i < dataCurrent.length; i++) {
                for (let j = i + 1; j < dataCurrent.length; j++) {
                    if (dataCurrent[i].DatumVreme > dataCurrent[j].DatumVreme) {
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
                    if (dataCurrent[i].DatumVreme < dataCurrent[j].DatumVreme) {
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

function searchTrenings(user) {
    if (user.Uloga == UlogaEnum.POSETIOC) {
        let naziv = $('#pretragaNaziv').val();
        let fitnes = $('#nazivFitnesCentra').val();
        let tipTreninga = $('#tipTreninga').val();

        let imaNaziv = false, imaFitnes = false, imaTip = false;
        if (naziv.length != 0) { imaNaziv = true; }
        if (fitnes.length != 0) { imaFitnes = true; }
        if (tipTreninga.length != 0) { imaTip = true; }

        if (!imaNaziv && !imaFitnes && !imaTip) { return; }
        searchTable = [];

        // IF-ovi za pretragu.
        {
            // 1. Sve
            if (imaNaziv && imaFitnes && imaTip) {
                for (element in data) {
                    if (data[element].Naziv.includes(naziv) && data[element].FitnesCentar.Naziv.includes(fitnes) && data[element].TipTreninga == TipEnum[tipTreninga]) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 2. Naziv / Fitnes
            if (imaNaziv && imaFitnes && !imaTip) {
                for (element in data) {
                    if (data[element].Naziv.includes(naziv) && data[element].FitnesCentar.Naziv.includes(fitnes)) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 3. Naziv / Tip
            if (imaNaziv && !imaFitnes && imaTip) {
                for (element in data) {
                    if (data[element].Naziv.includes(naziv) && data[element].TipTreninga == TipEnum[tipTreninga]) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 4. Fitnes / Tip
            if (!imaNaziv && imaFitnes && imaTip) {
                for (element in data) {
                    if (data[element].FitnesCentar.Naziv.includes(fitnes) && data[element].TipTreninga == TipEnum[tipTreninga.toUpperCase()]) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 5. Naziv
            if (imaNaziv && !imaFitnes && !imaTip) {
                for (element in data) {
                    if (data[element].Naziv.includes(naziv)) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 6. Fitnes
            if (!imaNaziv && imaFitnes && !imaTip) {
                for (element in data) {
                    if (data[element].FitnesCentar.Naziv.includes(fitnes)) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 7. Tip
            if (!imaNaziv && !imaFitnes && imaTip) {
                for (element in data) {
                    if (data[element].TipTreninga == TipEnum[tipTreninga.toUpperCase()]) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

        }
    }
    else if (user.Uloga == UlogaEnum.TRENER) {
        if (!validateGodinu()) {
            return;
        }

        let naziv = $('#pretragaNaziv').val();
        let minGodina = $('#minGodina').val() == "" ? 0 : $('#minGodina').val();
        let maxGodina = $('#maxGodina').val() == "" ? 0 : $('#maxGodina').val();
        let tipTreninga = $('#tipTreninga').val();

        let imaNaziv = false, imaTip = false, imaGodinu = false;
        if (naziv.length != 0) { imaNaziv = true; }
        if (tipTreninga.length != 0) { imaTip = true; }
        if (minGodina != 0) { imaGodinu = true; }

        if (!imaNaziv && !imaTip && !imaGodinu) { return; }
        searchTable = [];

        // IF-ovi za pretragu.
        {
            // 1. Sve
            if (imaNaziv && imaGodinu && imaTip) {
                for (element in data) {
                    if (data[element].Naziv.includes(naziv) && (data[element].DatumVreme >= minGodina && data[element].DatumVreme <= maxGodina) && data[element].TipTreninga == TipEnum[tipTreninga]) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 2. Naziv / Datum
            if (imaNaziv && imaGodinu && !imaTip) {
                for (element in data) {
                    if (data[element].Naziv.includes(naziv) && (data[element].DatumVreme >= minGodina && data[element].DatumVreme <= maxGodina)) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 3. Naziv / Tip
            if (imaNaziv && !imaGodinu && imaTip) {
                for (element in data) {
                    if (data[element].Naziv.includes(naziv) && data[element].TipTreninga == TipEnum[tipTreninga]) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 4. Datum / Tip
            if (!imaNaziv && imaGodinu && imaTip) {
                for (element in data) {
                    if ((data[element].DatumVreme >= minGodina && data[element].DatumVreme <= maxGodina) && data[element].TipTreninga == TipEnum[tipTreninga.toUpperCase()]) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 5. Naziv
            if (imaNaziv && !imaGodinu && !imaTip) {
                for (element in data) {
                    if (data[element].Naziv.includes(naziv)) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 6. Datum
            if (!imaNaziv && imaGodinu && !imaTip) {
                for (element in data) {
                    if ((data[element].DatumVreme >= minGodina && data[element].DatumVreme <= maxGodina)) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

            // 7. Tip
            if (!imaNaziv && !imaGodinu && imaTip) {
                for (element in data) {
                    if (data[element].TipTreninga == TipEnum[tipTreninga.toUpperCase()]) {
                        searchTable[searchTable.length] = data[element];
                    }
                }

                createTableChecker(searchTable);
                return;
            }

        }
    }
}

function createTableChecker(dataFun) {
    let user = JSON.parse(sessionStorage.getItem('activeUser'));

    if (user.Uloga == UlogaEnum.TRENER) {
        createTableTrener(dataFun);
    } else if (user.Uloga == UlogaEnum.POSETIOC){
        createTablePosetioc(dataFun);
    }
}

function validateGodinu() {
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

function displayTreningePosetioc(user) {
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
        trening += `<td><button class="TrenerClass" value="${dataFun[element].Id}" id="btnPrikaziSpisakPosetiocaTrening">List</button></td>`;
        tableTreninzi += '<tr>' + trening + '</tr>';
    }

    tableTreninzi += `</table>`;
    $('#spisakTreninga').html(tableTreninzi);
    dataCurrent = dataFun;
}

