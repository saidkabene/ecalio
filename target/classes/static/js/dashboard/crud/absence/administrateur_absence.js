(function () {
    $(document).ready(function () {
        findAllAnneeScolaires(initClassesLogiquesAbsence);
        findAllFillieres(initClassesLogiquesAbsence);
    });
})();

function initClassesLogiquesAbsence() {
    findAllClassesLogiquesByAnneeScolaireAndFilliere(
        "mainInsertionModal-annee-scolaire-filliere-classe-logique-annee-scolaire-input",
        "mainInsertionModal-annee-scolaire-filliere-classe-logique-filliere-input",
        "mainInsertionModal-annee-scolaire-filliere-classe-logique-classe-logique-input");
}