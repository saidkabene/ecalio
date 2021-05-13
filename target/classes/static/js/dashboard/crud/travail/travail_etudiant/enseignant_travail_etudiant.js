(function () {
    $(document).ready(function () {
        $("#mainInsertionModal-etudiant-input-field").addClass("no-service-url");
    });
})();

function onClasseLogiqueSelectionChanged() {
    findAllModulesEnseignes("mainInsertionModal-classe-logique-module-classe-logique-input-field");

    findAllEtudiantsByClasseLogiqueId(
        "mainInsertionModal-classe-logique-module-classe-logique-input-field",
        "mainInsertionModal-etudiant-input-field");
}

function getTravailAdditionalInformation(travail) {
    return travail.etudiantDesignation;
}