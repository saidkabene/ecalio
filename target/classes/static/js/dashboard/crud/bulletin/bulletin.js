DATATABLES = {};

X_AXIS_IDS = {"fiche-modulaire": [], "fiche-non-modulaire": []};
Y_AXIS_IDS = {"fiche-modulaire": [], "fiche-non-modulaire": []};

FIRST_TABLE_VALUES = [];
SECOND_TABLE_VALUES = [];

(function () {
    $(document).ready(function () {
        $("#bulletin-filter-etudiant-rentree-scolaire-periode-enseignement-etudiant-input").addClass("no-service-url");

        $(".rentree-scolaire-select").addClass("no-service-url");
        $(".periode-enseignement-select").addClass("no-service-url");

        findAllAnneeScolaires(function () {
            findAllFillieres(function () {
                initClassesLogiquesBulletin(function () {
                    findAllPeriodeEnseignements(function () {
                        findAllRentreeScolaires(function () {
                            $.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
                                $.each(DATATABLES, function (index, element) {
                                    element.clear().draw();
                                })
                            };

                            $('.datatable').each(function (index, htmlDatatable) {
                                var datatableId = $(htmlDatatable).attr("id");
                                var msJsonRoot = $(htmlDatatable).attr("ms-json-root");
                                var serviceUrl = $(htmlDatatable).attr("ms-service-url");

                                if (typeof msJsonRoot == 'undefined')
                                    msJsonRoot = '';

                                var dataTable = $(htmlDatatable).on('xhr.dt', function (e, settings, json, xhr) {
                                    fromDatasetToTable(datatableId, json,
                                        fromDatatableIdToDatatableIsFirst(datatableId));

                                }).DataTable({
                                    searching: false,
                                    paging: false,
                                    info: false,

                                    responsive: true,

                                    ajax: {
                                        url: addUrlRequestIdToUrlFromDocument(serviceUrl),
                                        dataSrc: msJsonRoot,
                                        data: function () {
                                            return formatFormAsUrl("#bulletin-filter-form");
                                        },
                                        beforeSend: function (request) {
                                            request.setRequestHeader('accept-language', getLanguage());
                                        }
                                    },

                                    columnDefs: [
                                        fromDatatableIdToDatatableFirstColumnDefinition(datatableId),

                                        {
                                            targets: "_all",
                                            sortable: false,
                                            orderable: false,

                                            data: function (row, type, val, meta) {
                                                //console.log("data: ", datatableId, meta.row, meta.col);

                                                var i = meta.row;
                                                var j = meta.col;

                                                var array = fromDatatableIdToDatatableContentAsArray(datatableId);

                                                return array[i][j].value;
                                            },

                                            render: function (data, type, row, meta) {
                                                if (type == 'display') {
                                                    if (isBulletinEditable()) {
                                                        return onConstructEditableCell(datatableId, data, type, row, meta);
                                                    } else
                                                        return onConstructNoneEditableCell(data, type, row, meta);
                                                } else return "";
                                            }
                                        }
                                    ],

                                    language: {
                                        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/" + getLanguageName() + ".json"
                                    },

                                    initComplete: function () {
                                        $(".datatable").find(".sorting_asc").removeClass("sorting_asc");
                                    }
                                });

                                DATATABLES[datatableId] = dataTable;
                            });
                        });
                    });
                });
            });
        });
    });
})();

function findAllNotes() {
    $.each(DATATABLES, function (index, datatable) {
        datatable.ajax.reload();
    });
}

function onCellEdited(datatableId, rowIndex, colIndex) {
    var cellId = fromCellIdToCellSelector(datatableId, rowIndex, colIndex);

    $(cellId).addClass("text-danger");
    $(cellId).removeClass("text-success");
}

function onUpdateNote(datatableId, rowIndex, colIndex) {
    var cellSelector = fromCellIdToCellSelector(datatableId, rowIndex, colIndex);

    var values = fromDatatableIdToDatatableContentAsArray(datatableId);
    var newValue = $(cellSelector).val();

    var serviceUrl = $("#" + datatableId).attr("ms-service-url");
    var updateParams = getEvaluationUpdateParams();

    updateParams.critereEvaluation = Y_AXIS_IDS[datatableId][colIndex];
    updateParams.valeur = newValue;

    if (fromDatatableIdToDatatableIsFirst(datatableId)) {
        var key = $("#" + datatableId).attr("ms-x-axis-attribute-name");

        updateParams[key] = X_AXIS_IDS[datatableId][rowIndex];
    }

    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(updateParams),
        headers: {'accept-language': getLanguage()},
        success: function (response) {
            show_generic_response_toast(response);

            $(cellSelector).addClass("text-success");
            $(cellSelector).removeClass("text-danger");

            values[rowIndex][colIndex].value = newValue;
        },

        dataType: "json",
        contentType: "application/json"
    });
}

function onConstructNoneEditableCell(data, type, row, meta) {
    var result =
        $("<td>").append($("<div>").text(data).addClass("text-center"));

    return result.html();
}

function onConstructEditableCell(datatableId, data, type, row, meta) {
    var result =
        $("<td>").append(
            $("<input>")
                .attr("value", data)
                .addClass("form-control text-center")
                .attr("type", "text")
                .attr("placeholder", "?")
                .attr("id", datatableId + "-input-" + meta.row + "-" + meta.col)
                .attr("onchange", 'onUpdateNote(\"' + datatableId + '\", \"'
                    + meta.row + '\", \"' + meta.col + '\")')
                .attr("onkeydown", 'onCellEdited(\"' + datatableId + '\", \"'
                    + meta.row + '\", \"' + meta.col + '\")')
        );

    return result.html();
}

function fromDatasetToTable(datatableId, dataset, isFirstTableValue) {
    var critarias = $("#" + datatableId + " thead th");

    $.each(dataset, function (rowIndex, row) {
        X_AXIS_IDS[datatableId][rowIndex] = row.firstColumnId;
    });

    $(critarias).each(function (columnIndex, column) {
        Y_AXIS_IDS[datatableId][columnIndex] = $(column).attr("ms-field-id");
    });

    // ---------------------------------------------------------------------------------

    if (isFirstTableValue) {
        $.each(dataset, function (moduleIndex, moduleRow) {
            FIRST_TABLE_VALUES[moduleIndex] = [];

            $.each(critarias, function (critariaIndex, critaria) {
                FIRST_TABLE_VALUES[moduleIndex][critariaIndex] = {
                    value: ""
                };

                var currentCritariaId = $(critaria).attr("ms-field-id");

                $.each(moduleRow.notes, function (noteIndex, note) {
                    var currentNoteCritariaId = note.critereEvaluation.id;

                    if (currentCritariaId == currentNoteCritariaId) {
                        FIRST_TABLE_VALUES[moduleIndex][critariaIndex] = {
                            module: {
                                id: moduleRow.id,
                                designation: moduleRow.designation
                            },

                            critereEvaluation: {
                                id: note.critereEvaluation.id,
                                designation: note.critereEvaluation.designation
                            },

                            value: note.valeur
                        }
                    }
                });
            });
        });
    } else {
        SECOND_TABLE_VALUES[0] = [];

        $.each(critarias, function (critariaIndex, critaria) {
            SECOND_TABLE_VALUES[0][critariaIndex] = {
                value: ""
            };

            var currentCritariaId = $(critaria).attr("ms-field-id");

            $.each(dataset[0].notes, function (noteIndex, note) {
                var currentNoteCritariaId = note.critereEvaluation.id;

                if (currentCritariaId == currentNoteCritariaId) {
                    SECOND_TABLE_VALUES[0][critariaIndex] = {
                        critereEvaluation: {
                            id: note.critereEvaluation.id,
                            designation: note.critereEvaluation.designation
                        },

                        value: note.valeur
                    }
                }
            });
        });
    }
}

function fromDatatableIdToDatatableIsFirst(datatableId) {
    return datatableId == 'fiche-modulaire';
}

function fromDatatableIdToDatatableContentAsArray(datatableId) {
    if (datatableId == 'fiche-modulaire')
        return FIRST_TABLE_VALUES;
    else if (datatableId == 'fiche-non-modulaire')
        return SECOND_TABLE_VALUES;
}

function fromCellIdToCellSelector(datatableId, rowIndex, colIndex) {
    var result = "#" + datatableId + "-input-" + rowIndex + "-" + colIndex;

    if ($(".dtr-data " + result).length != 0)
        return ".dtr-data " + result;

    else return result;
}

function fromDatatableIdToDatatableFirstColumnDefinition(datatableId) {
    if (datatableId == 'fiche-modulaire')
        return {
            targets: [0],
            data: function (row, type, val, meta) {
                return row.firstColumnDesignation;
            },
            render: function (data, type, row, meta) {
                return '<td class="text-center">' + data + '</td>';
            }
        };
    else return {};
}