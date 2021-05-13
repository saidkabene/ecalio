ADDITIONAL_COLS.mainDatatable = {
    consult: {
        orderable: false,
        width: 40,
        msRender: function (data, type, row) {
            return createCustomModalTriggerButton(true, type, row, 'messageModal',
                'btn-primary', 'fa fa-mail-bulk', 'displayMessageInformations');
        }
    }
};

function displayMessageInformations(params) {
    $.blockUI();

    $.get(params.selfUrl, {}, function (message) {
        $.unblockUI();

        $("#subject-holder").text(message.subject);
        $("#date-holder").text(message.date.designation);
        $("#time-holder").text(message.heure);
        $("#emeeter-holder").text(message.emetteur.email);
        $("#receiver-holder").text(message.recepteur.email);
        $("#content-holder").summernote('code', message.content);

        if (message.nomPieceJointe != null) {
            $("#attachment_holder").removeClass("d-none");
            $("#attachment_name_holder").text(message.nomPieceJointe);
            $("#attachment_link_holder").attr("href", "messagerie/attachment/download/" + message.id);
            $("#attachment_size_holder").text(message.tailleMedia);
        } else {
            $("#attachment_holder").addClass("d-none");
        }

        $("#consul-modal").modal('show');
    });
}