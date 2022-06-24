var data = [];
var dataCurrent = [];

$(document).ready(function () {
    loadFitnesCentre();
    

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
        //$.get("api/centri", function (data, status) {
           
        //});
    });
});

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
    $.get("api/centri", function (dataFun, status) {
        createTable(dataFun);
        data = dataFun
    });
}

function createTable(dataFun) {
    let tableCentri = `<table border="1">`;
    tableCentri += `<tr><th>Naziv</th><th>Adresa</th><th>Godina otvaranja</th><th></th></tr>`;

    for (element in dataFun) {
        let centar = '<td>' + dataFun[element].Naziv + '</td>';
        centar += '<td>' + dataFun[element].Adresa + '</td>';
        centar += '<td>' + dataFun[element].GodinaOtvaranja + '</td>';
        centar += `<td><button class="btnDetails" name="${dataFun[element].Naziv}" onClick="location.href=\'Details.html?id=${dataFun[element].Naziv}\'">Detalji</td>`;

        tableCentri += '<tr>' + centar + '</tr>';
    }

    tableCentri += `</table>`;
    $('#fitnesCentriSpisak').html(tableCentri);
    console.log("Ucitani centri");
    dataCurrent = dataFun;
}