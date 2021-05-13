(function () {
    $(document).ready(function () {
        $("#mainInsertionModal-classe-logique-module-classe-logique-input-field")
            .addClass("no-service-url");
        $("#mainInsertionModal-classe-logique-module-module-input-field")
            .addClass("no-service-url");

        findMyClassesLogiquesEnseignees(
            "mainInsertionModal-classe-logique-module-classe-logique-input-field", function () {
                onClasseLogiqueSelectionChanged();
            });
    })
})();

function onClasseLogiqueSelectionChanged() {
    findAllModulesEnseignes(
        "mainInsertionModal-classe-logique-module-classe-logique-input-field");

    findAllEtudiantsByClasseLogiqueId(
        "mainInsertionModal-classe-logique-module-classe-logique-input-field",
        "mainInsertionModal-etudiant-date-heure-etudiant-input");
}