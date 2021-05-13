(function () {
    $("#main-filter-date-range-filter-debut").addClass('one-month-ago-date-picker');
    $("#main-filter-date-range-filter-debut").change(function () {
        if (typeof DATATABLES["mainDatatable"] != 'undefined')
            DATATABLES["mainDatatable"].ajax.reload();
    });

    $("#main-filter-date-range-filter-fin").addClass('one-month-after-date-picker');
    $("#main-filter-date-range-filter-fin").change(function () {
        if (typeof DATATABLES["mainDatatable"] != 'undefined')
            DATATABLES["mainDatatable"].ajax.reload();
    });

    $(document).ready(function () {
        $("#mainInsertionModal-etudiant-date-heure-etudiant-input").addClass('no-service-url');
    })
})();