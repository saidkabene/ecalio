(function () {
    $(document).ready(function () {
        $.get(
            getUrlWithContext('cantine/menu-actuel'), {}, function (json) {
                removeUnsusedColumns(json);

                $("#canteen-table").DataTable({
                    searching: false,
                    paging: false,
                    info: false,

                    responsive: true,
                    data: [json],
                    columnDefs: [
                        {
                            targets: "_all",
                            orderable: false,

                            data: function (row, type, val, meta) {
                                var jourDeSemaine = fromColumnIndexToColumnKey(meta.col);

                                return row[jourDeSemaine.toUpperCase()];
                            },

                            render: function (data, type, row, meta) {
                                if (type == 'display') {
                                    if (data != null) {
                                        return fromEntriesToCell(data);
                                    } else return "<div class='text-center'>?</div>";
                                } else return "";
                            }
                        }
                    ],

                    language: {
                        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/" + getLanguageName() + ".json"
                    },

                    initComplete: function () {
                        $("#canteen-table").find(".sorting_asc").removeClass("sorting_asc");
                    }
                });
            }
        );
    });
})();

function fromColumnIndexToColumnKey(index) {
    var jourDeSemaine = $("#canteen-table").find("th");
    var result = $(jourDeSemaine[index]).attr("ms-field-name");

    return result;
}

function fromEntriesToCell(entries) {
    var result = $("<td>");
    var colors = ["kt-font-brand", "kt-font-danger", "kt-font-warning", "kt-font-success"];

    $.each(entries, function (index, entry) {
        var entryContainer = $("<div>").addClass("mb-2")
            .append(
                $("<span>").addClass("kt-list-timeline__icon fa fa-bullseye").addClass(colors[index % colors.length]),
                $("<span>").addClass("ml-2 mr-2 kt-list-timeline__text").text(entry.designation)
            );

        $(result).append($(entryContainer));
    });

    return result.html();
}

function removeUnsusedColumns(lines) {
    var reminders = {
        saturday: false,
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false
    };

    $.each(lines, function (dayOfWeek, entries) {
        var jourDeSemaine = dayOfWeek.toLowerCase();

        reminders[jourDeSemaine] = true;
    });

    $.each(reminders, function (key, reminder) {
        if (reminder == false) {
            var th = $("#canteen-table").find("th[ms-field-name='" + key + "']").remove();
        }
    });
}