ADDITIONAL_COLS.mainDatatable = {
    seances: {
        orderable: false,
        width: 40,
        msRender: function (data, type, row) {
            return createChildModalTriggerButton(true, type, row, 'seancesModal',
                'btn-primary', 'fa fa-calendar-alt');
        }
    }
};

(function () {
    $(document).ready(function () {
        findAllAnneeScolaires();
        findAllFillieres();
    });
})();

function initModule() {
    findAllModulesByAnneeScolaireAndFilliere(
        "seancesModal-annee-scolaire-filliere-classe-logique-input-form-annee-scolaire-input",
        "seancesModal-annee-scolaire-filliere-classe-logique-input-form-filliere-input",
        "seancesModal-module-enseignant-input-form-module-input",
        initEnseignants
    )
}

function initEnseignants() {
    findAllEnseignantsByModule(
        "seancesModal-module-enseignant-input-form-module-input",
        "seancesModal-module-enseignant-input-form-enseignant-input");
}