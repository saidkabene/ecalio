ADDITIONAL_COLS.mainDatatable = {
    program: {
        orderable: false,
        width: 40,
        msRender: function (data, type, row) {
            return createChildModalTriggerButton(true, type, row, 'modulesModal',
                'btn-primary', 'fa fa-book-open');
        }
    }
};

(function () {
    $(document).ready(function () {
        $("#module-input-field").addClass('no-service-url');

        findAllModules();
    });
})();