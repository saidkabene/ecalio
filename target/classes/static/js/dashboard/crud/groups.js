ADDITIONAL_COLS.mainDatatable = {
    students: {
        orderable: false,
        width: 40,
        msRender: function (data, type, row) {
            return createChildModalTriggerButton(true, type, row, 'studentsModal',
                'btn-primary', 'fa fa-user-graduate');
        }
    }
};

(function () {
    $(document).ready(function () {
        findAllAnneeScolaires();
        findAllFillieres();
        findAllEtudiants();
    });
})();