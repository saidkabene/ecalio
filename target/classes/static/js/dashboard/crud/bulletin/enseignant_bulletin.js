(function () {
    $("#bulletin-filter-classe-logique-module-classe-logique-input-field").addClass("no-service-url");
    $("#bulletin-filter-classe-logique-module-module-input-field").addClass("no-service-url");
})();

function initClassesLogiquesBulletin(callback) {
    findMyClassesLogiquesEnseignees(
        "bulletin-filter-classe-logique-module-classe-logique-input-field", function () {
            findAllModulesEnseignes("bulletin-filter-classe-logique-module-classe-logique-input-field",
                callback);
        });
}

function onClasseLogiqueSelectionChanged() {
    findAllModulesEnseignes("bulletin-filter-classe-logique-module-classe-logique-input-field", function () {
        findAllNotes();
    });
}


function isBulletinEditable() {
    return true;
}

function getEvaluationUpdateParams() {
    var module = $("#bulletin-filter-classe-logique-module-module-input-field").val();

    return {
        module: module
    }
}