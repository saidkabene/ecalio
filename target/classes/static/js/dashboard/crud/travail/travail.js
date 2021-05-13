ADDITIONAL_COLS.mainDatatable = {
    consult: {
        orderable: false,
        width: 40,
        msRender: function (data, type, row) {
            return createButtonCell(true, type, row, 'displayTravailInformations', 'btn-primary', 'fa fa-copy', [{
                name: "modalId",
                value: 'travailDetailsModal'
            }, {
                name: "fetchUrl",
                value: row.fetchUrl
            }]);
        }
    }
};

function displayTravailInformations(params) {
    $.blockUI();

    $.get(getUrlWithContext(params.fetchUrl + "/" + params.entityId), {}, function (travail) {
        $.unblockUI();

        $("#subject-holder").text(travail.subject);
        $("#module-holder").text(travail.moduleDesignation);
        $("#validity-period-start-holder").text(travail.debut.designation);
        $("#validity-period-end-holder").text(travail.fin.designation);
        $("#additional-information-holder").text(getTravailAdditionalInformation(travail));
        $("#registration-moment-date-holder").text(travail.registrationMoment.dateDesignation);
        $("#registration-moment-time-holder").text(travail.registrationMoment.timeDesignation);
        $("#content-holder").summernote('code', travail.content);

        $("#consul-modal").modal("show");
    });
}

(function () {
    $("#main-filter-date-range-filter-debut").addClass('one-month-ago-date-picker');
    $("#main-filter-date-range-filter-debut").change(function () {
        if (typeof DATATABLES["mainDatatable"] != 'undefined')
            DATATABLES["mainDatatable"].ajax.reload();
    });

    $("#main-filter-date-range-filter-fin").addClass('one-year-after-date-picker');
    $("#main-filter-date-range-filter-fin").change(function () {
        if (typeof DATATABLES["mainDatatable"] != 'undefined')
            DATATABLES["mainDatatable"].ajax.reload();
    });

    $(document).ready(function () {
        $("#mainInsertionModal-classe-logique-module-classe-logique-input-field")
            .addClass("no-service-url");
        $("#mainInsertionModal-classe-logique-module-module-input-field")
            .addClass("no-service-url");
    });
})();