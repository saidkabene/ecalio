(function () {
    $(document).ready(function () {
        $.get(
            addUrlRequestIdToUrlFromDocument($("#schedule-table").attr("ms-service-url")), {},

            function (json) {
                removeUnsusedColumns(json);

                $("#schedule-table").DataTable({
                    searching: false,
                    paging: false,
                    info: false,

                    responsive: true,
                    data: json,
                    columnDefs: [
                        {
                            targets: 0,
                            sortable: false,
                            orderable: false,
                            width: "5%",

                            data: function (row, type, val, meta) {
                                return row.horaire;
                            },

                            render: function (data, type, row, meta) {
                                if (type == 'display') {
                                    if (data != null) {
                                        return fromHoraireToCell(data);
                                    } else return "";
                                } else return "";
                            }
                        },

                        {
                            targets: "_all",
                            sortable: false,
                            orderable: false,

                            data: function (row, type, val, meta) {
                                var seances = row.seances;
                                var jourDeSemaine = fromColumnIndexToColumnKey(meta.col);
                                var result = null;

                                $.each(seances, function (index, seance) {
                                    if (seance.jourDeSemaine.value.toLowerCase() == jourDeSemaine)
                                        result = seance;
                                });

                                return result;
                            },

                            render: function (data, type, row, meta) {
                                if (type == 'display') {
                                    if (data != null) {
                                        return fromSeanceToCell(data);
                                    } else return "<div class='text-center'>?</div>";
                                } else return "";
                            }
                        }
                    ],

                    language: {
                        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/" + getLanguageName() + ".json"
                    },

                    initComplete: function () {
                        $("#schedule-table").find(".sorting_asc").removeClass("sorting_asc");
                    }
                });
            }
        );
    });
})();

function fromColumnIndexToColumnKey(index) {
    var jourDeSemaine = $("#schedule-table").find("th");
    var result = $(jourDeSemaine[index]).attr("ms-field-name");

    return result;
}

function fromSeanceToCell(seance) {
    var seanceContainer = $("<div>").addClass("container");

    var enseignantContainer = $("<div>").addClass("mb-2").append(
        $("<span>").addClass("kt-list-timeline__icon fas fa-chalkboard-teacher kt-font-brand"),
        $("<span>").addClass("ml-2 mr-2 kt-list-timeline__text").text(seance.enseignant)
    );

    var classeLogiqueContainer = $("<div>").addClass("mb-2").append(
        $("<span>").addClass("ml-1 kt-list-timeline__icon fas fa-user-graduate kt-font-danger"),
        $("<span>").addClass("ml-2 mr-2 kt-list-timeline__text").text(seance.classeLogique)
    );

    var moduleContainer = $("<div>").addClass("mb-2").append(
        $("<span>").addClass("kt-list-timeline__icon fas fa-marker kt-font-warning"),
        $("<span>").addClass("ml-2 mr-2 kt-list-timeline__text").text(seance.module)
    );

    var classePhysiqueContainer = $("<div>").addClass("mb-2").append(
        $("<span>").addClass("kt-list-timeline__icon fa fa-door-open kt-font-success"),
        $("<span>").addClass("ml-2 mr-2 kt-list-timeline__text").text(seance.classePhysique)
    );

    var designationContainer = $("<div>").addClass("").append(
        $("<span>").addClass("ml-1 kt-list-timeline__icon flaticon2-document kt-font-information"),
        $("<span>").addClass("ml-2 mr-2 kt-list-timeline__text").text(seance.designation)
    );

    $(seanceContainer).append($(enseignantContainer));
    $(seanceContainer).append($(classeLogiqueContainer));
    $(seanceContainer).append($(moduleContainer));
    $(seanceContainer).append($(classePhysiqueContainer));
    $(seanceContainer).append($(designationContainer));

    var result = $("<td>").append($(seanceContainer));

    return result.html();
}

function fromHoraireToCell(horaire) {
    var heureDebutSpan = $("<span>")
        .text(horaire.heureDebut)
        .addClass("container mb-2 ms-med-badge kt-badge kt-badge--unified-brand kt-badge--lg kt-badge--bold");

    var heureFinSpan = $("<span>")
        .text(horaire.heureFin)
        .addClass("container mt-2 ms-med-badge kt-badge kt-badge--unified-danger kt-badge--lg kt-badge--bold");

    var result = $("<td>")
        .append($("<div>").addClass("container text-center").append($(heureDebutSpan), $(heureFinSpan)));

    return result.html();
}

function removeUnsusedColumns(seancesLines) {
    var reminders = {
        saturday: false,
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false
    };

    $.each(seancesLines, function (index, seanceLine) {
        var seances = seanceLine.seances;

        $.each(seances, function (index, seance) {
            var jourDeSemaine = seance.jourDeSemaine.value.toLowerCase();
            reminders[jourDeSemaine] = true;
        })
    });

    $.each(reminders, function (key, reminder) {
        if (reminder == false) {
            var th = $("#schedule-table").find("th[ms-field-name='" + key + "']").remove();
        }
    });
}