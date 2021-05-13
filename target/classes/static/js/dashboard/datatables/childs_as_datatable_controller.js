LAST_SELECTED_ENTITY_FOR_TABLE_AS_CHILD = null;

(function () {
    $(document).ready(function () {
        $(".childs-as-table-modal").each(function (index, modal) {
            $(modal).on('shown.bs.modal', function (e) {
                var datatableId = $(modal).attr("id") + "Datatable";
                var rootElement = $(modal).attr("rootElement");
                var childAttribute = $(modal).attr("childAttribute");
                var childsUrl = LAST_SELECTED_ENTITY_FOR_TABLE_AS_CHILD.selfUrl + "/" + childAttribute;

                var columns = constructSimpleColumns($("#" + datatableId));

                prepareDatatableForUpdate($(modal));
                prepareFormSubmit($(modal));

                constructDeleteEditButtons(datatableId, columns);
                constructAssociationBrokerButton($(modal), columns);

                var datatable = $("#" + datatableId).DataTable({
                    responsive: true,

                    ajax: {
                        dataSrc: rootElement,
                        url: childsUrl,
                        beforeSend: function (request) {
                            request.setRequestHeader('accept-language', getLanguage());
                        }
                    },

                    columnDefs: [{
                        targets: 0,
                        width: "5%"
                    }, {
                        targets: "_all",
                        className: "text-center"
                    }],

                    language: {
                        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/" + getLanguageName() + ".json"
                    },

                    columns: columns
                });

                DATATABLES[datatableId] = datatable;
            });
        });
    });
})();

function constructAssociationBrokerButton(modal, columns) {
    var datatableId = $(modal).attr("id") + "Datatable";
    var isAssociationBrokable =
        $("#" + datatableId).find("th[ms-col='association-brokable']").length != 0;

    if (isAssociationBrokable) {
        var parentAttribute = $(modal).attr("parentAttribute");

        columns.push({
            sortable: false,
            width: 40,
            render: function (data, type, row) {
                if (!row.associationBrokableAlreadyRendered) {
                    row.datatableId = datatableId;
                    row['_links']['self']['href'] = row['_links']['self']['href'] + "/" +
                        parentAttribute + '/' + LAST_SELECTED_ENTITY_FOR_TABLE_AS_CHILD.entityId;
                }

                row.associationBrokableAlreadyRendered = true;

                return createButtonCell(data, type, row, 'showDeleteModal',
                    'btn-danger', 'fa fa-unlink');
            }
        });
    }
}

function prepareFormSubmit(modal) {
    var includeParentUrlInsideFormInput = $(modal).attr("includeParentUrlInsideFormInput");
    var formId = $(modal).attr('id') + 'Form';

    if (includeParentUrlInsideFormInput == 'true')
        $("#" + formId + " #parentId").val(LAST_SELECTED_ENTITY_FOR_TABLE_AS_CHILD.selfUrl);
    else $("#" + formId + " #parentId").val(LAST_SELECTED_ENTITY_FOR_TABLE_AS_CHILD.entityId);
}

function prepareDatatableForUpdate(modal) {
    var datatableId = $(modal).attr("id") + "Datatable";

    if ($.fn.dataTable.isDataTable('#' + datatableId)) {
        DATATABLES[datatableId].destroy();

        $('#' + datatableId + " tbody").empty();
    }
}

function triggerChildModal(row) {
    LAST_SELECTED_ENTITY_FOR_TABLE_AS_CHILD = row;

    $("#" + row.modalId + "Title").text(row.designation);
    $("#" + row.modalId).modal("show");
}

function onChildDatatableInsertionSuccessCallback(entity) {
    var childDatatableId = LAST_SELECTED_ENTITY_FOR_TABLE_AS_CHILD.modalId + "Datatable";

    if (typeof entity.id != "undefined")
        DATATABLES[childDatatableId].row.add(entity).draw(false);
    else DATATABLES[childDatatableId].ajax.reload();
}