(function () {
    $(document).ready(function () {
        $("#mainInsertionModal-annee-scolaire-filliere-classe-logique-input-form-classe-logique-input")
            .addClass("allow-empty-combobox-value");

        $("#mainUpdateModal-annee-scolaire-filliere-classe-logique-input-form-classe-logique-input")
            .addClass("allow-empty-combobox-value");

        findAllAnneeScolaires();
        findAllFillieres();
    });
})();

function initInformationsForUpdate(etudiant) {
    findAllClassesLogiquesByAnneeScolaireAndFilliere(
        "mainUpdateModal-annee-scolaire-filliere-classe-logique-input-form-annee-scolaire-input",
        "mainUpdateModal-annee-scolaire-filliere-classe-logique-input-form-filliere-input",
        "mainUpdateModal-annee-scolaire-filliere-classe-logique-input-form-classe-logique-input",
        function () {
            selectOptionUsingDesignation(
                "#mainUpdateModal-annee-scolaire-filliere-classe-logique-input-form-classe-logique-input",
                etudiant.classeLogiqueDesignation);
        });
}