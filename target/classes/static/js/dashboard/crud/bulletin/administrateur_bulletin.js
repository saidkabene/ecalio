function initClassesLogiquesBulletin(callback) {
    findAllClassesLogiquesByAnneeScolaireAndFilliere(
        "bulletin-filter-annee-scolaire-filliere-classe-logique-annee-scolaire-input",
        "bulletin-filter-annee-scolaire-filliere-classe-logique-filliere-input",
        "bulletin-filter-annee-scolaire-filliere-classe-logique-classe-logique-input", callback);
}

function isBulletinEditable() {
    return true;
}

function getEvaluationUpdateParams() {
    var etudiant = $("#bulletin-filter-etudiant-rentree-scolaire-periode-enseignement-etudiant-input").val();
    var rentreeScolaire = $("#bulletin-filter-etudiant-rentree-scolaire-periode-enseignement-rentree-scolaire-input").val();
    var periodeEnseignement = $("#bulletin-filter-etudiant-rentree-scolaire-periode-enseignement-periode-enseignement-input").val();

    return {
        rentreeScolaire: rentreeScolaire,
        periodeEnseignement: periodeEnseignement,
        etudiant: etudiant
    }
}