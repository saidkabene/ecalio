var LAST_SELECTED_ENTITY_FOR_DELETION = null;
var LAST_SELECTED_ENTITY_FOR_UPDATE = null;

var DATATABLES = {};
var ADDITIONAL_COLS = {};

(function () {
    $(document).ready(function () {
        $('.datatable').each(function (index, htmlDatatable) {
            var datatableId = $(htmlDatatable).attr("id");
            var columns = constructSimpleColumns(htmlDatatable);
            var msJsonRoot = $(htmlDatatable).attr("ms-json-root");
            var serviceUrl = $(htmlDatatable).attr("ms-url") + "/search/findAll";

            if (typeof msJsonRoot == 'undefined')
                msJsonRoot = '';

            constructAdditonalColumns(datatableId, columns);
            constructDeleteEditButtons(datatableId, columns);

            var dataTable = $(htmlDatatable).DataTable({
                responsive: true,

                ajax: {
                    url: addUrlRequestIdToUrlFromDocument(serviceUrl),
                    dataSrc: msJsonRoot,
                    data: function () {
                        return constructSearchCritarias(datatableId);
                    },
                    beforeSend: function (request) {
                        request.setRequestHeader('accept-language', getLanguage());
                    }
                },

                columns: columns,
                columnDefs: [{
                    targets: 0,
                    width: "5%"
                }, {
                    targets: "_all",
                    className: "text-center"
                }],

                language: {
                    url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/" + getLanguageName() + ".json"
                }
            });

            DATATABLES[datatableId] = dataTable;
        });
    });
})();

// --------------------------------------------------------------------------------------------------

function constructAdditonalColumns(datatableId, columns) {
    $.each(ADDITIONAL_COLS[datatableId], function (index, col) {
        col.render = function (data, type, row) {
            row.datatableId = datatableId;

            return col.msRender(data, type, row);
        };

        columns.push(col);
    });
}

function constructDeleteEditButtons(datatableId, columns) {
    var isDeletable = $("#" + datatableId).find("th[ms-col='deletable']").length != 0;
    var isEditable = $("#" + datatableId).find("th[ms-col='editable']").length != 0;

    if (isEditable) {
        columns.push({
            sortable: false,
            width: 40,
            render: function (data, type, row) {
                row.datatableId = datatableId;

                return createEditButton(true, type, row);
            }
        });
    }

    if (isDeletable) {
        columns.push({
            sortable: false,
            width: 40,
            render: function (data, type, row) {
                row.datatableId = datatableId;

                return createDeleteButton(true, type, row);
            }
        });
    }
}

function createDeleteButton(data, type, row) {
    return createButtonCell(data, type, row, 'showDeleteModal', 'btn-danger', 'fa fa-trash-alt');
}

function createEditButton(data, type, row) {
    return createButtonCell(data, type, row, 'showEditModal', 'btn-warning', 'fa fa-pen');
}

function createCheckButton(data, type, row) {
    var color = '';
    var iconName = '';

    if (data == true) {
        color = 'btn-success';
        iconName = 'fa fa-check-circle';
    } else {
        color = 'btn-danger';
        iconName = 'fa fa-times-circle';
    }

    return createButtonCell(true, type, row, '', color, iconName);
}

function createChildModalTriggerButton(data, type, row, modalId, color, icon) {
    return createCustomModalTriggerButton(data, type, row, modalId, color, icon, 'triggerChildModal');
}

function createCustomModalTriggerButton(data, type, row, modalId, color, icon, triggerFunction) {
    return createButtonCell(true, type, row, triggerFunction, color, icon, [{
        name: "modalId",
        value: modalId
    }]);
}

function createButtonCell(data, type, row, onClickFunction, color, iconName, params) {
    if (type != 'display')
        return "";
    else {
        var callbackParams = {
            entityId: row.id,
            datatableId: row.datatableId,
            designation: row.designation
        };

        if (typeof row['_links'] != 'undefined')
            callbackParams.selfUrl = row['_links']['self']['href'];
        else if (typeof row['selfUrl'] != 'undefined')
            callbackParams.selfUrl = row['selfUrl'];

        $.each(params, function (index, param) {
            callbackParams[param.name] = param.value;
        });

        var disable = data == true ? '' : 'disable';
        var button =
            $("<td>").addClass("align-middle text-center")
                .append(
                    $("<button>")
                        .attr("type", "button")
                        .addClass("btn btn-elevate btn-elevate-air " + color)
                        .attr('onclick', onClickFunction + '(' + JSON.stringify(callbackParams) + ')')
                        .attr("disable", disable)
                        .append(
                            $("<i>").addClass(iconName + " text-white p-0")
                        )
                );

        return button.html();
    }
}

// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

function showDeleteModal(row) {
    LAST_SELECTED_ENTITY_FOR_DELETION = row;

    $("#deletionDescriptionTitle").text(row.designation);
    $("#deletionModal").modal("show");
}

function showEditModal(row) {
    LAST_SELECTED_ENTITY_FOR_UPDATE = row.selfUrl;

    var modalId = $("#" + row.datatableId).attr("ms-update-modal-id");

    $.get(LAST_SELECTED_ENTITY_FOR_UPDATE, {}, function (entity) {
        initSimpleInformationsForUpdate(entity, modalId);

        if (typeof initInformationsForUpdate == 'function')
            initInformationsForUpdate(entity);
    });

    $("#" + modalId + " form").attr("method", "PATCH");
    $("#" + modalId + " form").attr("action", row.selfUrl);

    $("#" + modalId + "Title").text(row.designation);
    $("#" + modalId).modal("show");
};

// -------------------------------------------------------------------------------------------------

function confirmDeletion() {
    if (LAST_SELECTED_ENTITY_FOR_DELETION != null) {
        $.ajax({
            url: LAST_SELECTED_ENTITY_FOR_DELETION.selfUrl,
            type: 'DELETE',
            success: function (result) {
                show_success_toast();

                $("#deletionModal").modal("hide");

                if (typeof LAST_SELECTED_ENTITY_FOR_DELETION.datatableId != "undefined")
                    DATATABLES[LAST_SELECTED_ENTITY_FOR_DELETION.datatableId].ajax.reload();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                try {
                    var response = JSON.parse(XMLHttpRequest.responseText);

                    show_generic_response_toast(response);
                } catch (e) {
                    show_error_toast();
                }
            }
        });
    }
}

// -------------------------------------------------------------------------------------------------

function initSimpleInformationsForUpdate(entity, modalId) {
    $("#" + modalId + " form").find("input").each(function (index, input) {
        var key = $(input).attr("name");
        var value = entity[key];
        var isCheckbox = $(input).attr("type") == 'checkbox';

        if (typeof value == 'object') {
            try {
                value = value["value"];
            } catch (e) {
            }
        }

        if (isCheckbox) {
            var hiddenTwinInputId = $(this).attr("ms-hidden-twin");
            var hiddenTwinInputKey = $("#" + hiddenTwinInputId).attr("name");
            var hiddenTwinInputValue = entity[hiddenTwinInputKey];

            $("#" + hiddenTwinInputId).val(hiddenTwinInputValue);

            if (hiddenTwinInputValue == false) {
                $(input).removeAttr('checked');
            } else {
                $(input).attr('checked', 'checked');
            }
        } else $(input).attr("value", value);
    });

    $("#" + modalId + " form").find("select").each(function (index, select) {
        var key = $(select).attr("name") + 'Designation';
        var value = entity[key];

        selectOptionUsingDesignation("#" + $(this).attr("id"), value);
    });
}

function constructSimpleColumns(htmlDatatable) {
    var result = [
        {
            orderable: false,
            data: function (row, type, val, meta) {
                return meta.row + 1;
            }
        }
    ];

    $("#" + $(htmlDatatable).attr("id") + ' thead th').each(function (index, th) {
        if (typeof $(th).attr("ms-field-name") != 'undefined') {
            result.push({
                sortable: false,
                data: $(th).attr("ms-field-name"),
                defaultContent: ""
            });
        }

        if (typeof $(th).attr("ms-check-field-name") != 'undefined') {
            result.push({
                width: '40px',
                sortable: false,
                data: $(th).attr("ms-check-field-name"),
                defaultContent: false,
                render: function (data, type, row) {
                    row.datatableId = $(htmlDatatable).attr("id");

                    return createCheckButton(data, type, row);
                }
            });
        }
    });

    return result;
}

function constructSearchCritarias(datatableId) {
    var formFilterId = $("#" + datatableId).attr("main-filter-form");
    var filters = $("#" + formFilterId);

    if (typeof filters != 'undefined')
        return formatFormAsUrl("#" + formFilterId);
    else return '';
}