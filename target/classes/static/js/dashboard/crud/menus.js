ADDITIONAL_COLS.mainDatatable = {
    seances: {
        orderable: false,
        width: 40,
        msRender: function (data, type, row) {
            return createChildModalTriggerButton(true, type, row, 'entreesMenuModal',
                'btn-primary', 'fa fa-hamburger');
        }
    }
};