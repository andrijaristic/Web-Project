$(document).ready(function () {
    // Ucitati sve podatke o datom FitnesCentru.

    $.ajax({
        url: "api/centri",
        type: "GET",
        data: {
            naziv: getParameterByName('id')
        },
        success: function (data) {
            console.log(data.Naziv);
            display(data);
        },
        error: function (xhr) {
            //Do Something to handle error
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