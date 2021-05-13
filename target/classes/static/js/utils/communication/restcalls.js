notificationsMarked = false;

function getMyNotifications() {
    $.ajax({
        type: "get",
        url: getUrlWithContext("notification/getMyNotifications"),
        data: {},
        headers: {'accept-language': getLanguage()},
        success: function (notifications) {
            $.each(notifications, function (index, notification) {
                addNotificationToDashboard(notification);
            });
        },

        dataType: "json",
        contentType: "application/json"
    });
}

function getMyNumberOfNewNotifications() {
    $.get(getUrlWithContext("notification/getMyNumberOfUnseenNotifications"), {}, function (value) {
        addNewNotificationCountToDashboard(value);
    });
}

function markNotifications() {
    if (!notificationsMarked) {
        $.post(getUrlWithContext("notification/markNotifications"), {});

        notificationsMarked = true;
    }
}

// -----------------------------------------------------------------------------------------------

function findAllEtudiants(callback) {
    $.get(getUrlWithContext("restapi/etudiants/search/findAll"), {}, function (response) {
        addEtudiantsToGroupedSelect(response._embedded.etudiants);

        callbackAnotherCallback(callback);
    });
}

function findAllEtudiantsByClasseLogique(classeLogiqueInputId, etudiantInputId, callback) {
    var classeLogiqueId = $("#" + classeLogiqueInputId).val();

    if (classeLogiqueId != null) {
        $.get(getUrlWithContext("restapi/etudiants/search/findAllByClasseLogique"), {
            classeLogique: classeLogiqueId
        }, function (response) {
            addEtudiantsAsOptions(response._embedded.etudiants, "#" + etudiantInputId);

            callbackAnotherCallback(callback);
        });
    }
}

function findAllEtudiantsByClasseLogiqueId(classeLogiqueInputId, etudiantInputId, callback) {
    var classeLogiqueId = $("#" + classeLogiqueInputId).val();

    if (classeLogiqueId != null) {
        $.get(getUrlWithContext("restapi/etudiants/search/findAllByClasseLogiqueId"), {
            classeLogiqueId: classeLogiqueId
        }, function (response) {
            addEtudiantsAsOptions(response._embedded.etudiants, "#" + etudiantInputId);

            callbackAnotherCallback(callback);
        });
    }
}


// -----------------------------------------------------------------------------------------------

function findAllAnneeScolaires(callback) {
    $.get(getUrlWithContext("restapi/anneeScolaires"), {}, function (response) {
        addAnneesScolairesAsOptions(response._embedded.anneeScolaires);

        callbackAnotherCallback(callback);
    });
}

function findAllFillieres(callback) {
    $.get(getUrlWithContext("restapi/fillieres"), {}, function (response) {
        addFillieresAsOptions(response._embedded.fillieres);

        callbackAnotherCallback(callback);
    });
}

function findAllPeriodeEnseignements(callback) {
    $.get(getUrlWithContext("restapi/periodeEnseignements"), {}, function (response) {
        addPeriodesEnseignementsAsOptions(response._embedded.periodeEnseignements);

        callbackAnotherCallback(callback);
    });
}

function findAllRentreeScolaires(callback) {
    $.get(getUrlWithContext("restapi/rentreeScolaires"), {}, function (response) {
        addRentreesScolairesAsOptions(response._embedded.rentreeScolaires);

        callbackAnotherCallback(callback);
    });
}

function findAllModules(callback) {
    $.get(getUrlWithContext("restapi/modules"), {}, function (response) {
        addModulesAsOptions(response._embedded.modules);

        callbackAnotherCallback(callback);
    });
}

function findAllModulesEnseignes(classeLogiqueInputId, callback) {
    var classeLogiqueId = $("#" + classeLogiqueInputId).val();

    if (classeLogiqueId != null) {
        $.get(getUrlWithContext("enseignant/getModulesEnseignes/" + classeLogiqueId), {},
            function (response) {
                addModulesAsOptions(response);

                callbackAnotherCallback(callback);
            });
    }
}

function findAllModulesByAnneeScolaireAndFilliere(anneeScolaireInputId,
                                                  filliereInputId,
                                                  moduleInputId,
                                                  callback) {
    var anneeScolaireId = $("#" + anneeScolaireInputId).val();
    var filliereId = $("#" + filliereInputId).val();

    if (anneeScolaireId != null && filliereId != null) {
        $.get(getUrlWithContext("restapi/modules/search/findAllByAnneeScolaireAndFilliere"), {
                anneeScolaire: anneeScolaireId,
                filliere: filliereId
            },
            function (response) {
                addModulesAsOptions(response._embedded.modules, "#" + moduleInputId);

                callbackAnotherCallback(callback);
            });
    }
}

function findAllEnseignantsByModule(moduleInputId, enseignantInputId, callback) {
    var moduleId = $("#" + moduleInputId).val();

    if (moduleId != null) {
        $.get(getUrlWithContext("restapi/enseignants/search/findAllByModules"), {
            module: moduleId
        }, function (response) {
            addEnseignantsAsOptions(response._embedded.enseignants, "#" + enseignantInputId);

            callbackAnotherCallback(callback);
        });
    }
}

function findAllClassesLogiquesByAnneeScolaireAndFilliere(anneeScolaireInputId, filliereInputId,
                                                          classeLogiqueInputId, callback) {

    var anneeScolaireId = $("#" + anneeScolaireInputId).val();
    var filliereId = $("#" + filliereInputId).val();

    if (anneeScolaireId != null && filliereId != null) {
        $.get(getUrlWithContext("restapi/classeLogiques/search/findAllByAnneeScolaireAndFilliere"), {
            anneeScolaire: anneeScolaireId,
            filliere: filliereId
        }, function (response) {
            addClassesLogiquesAsOptions(response._embedded.classeLogiques, "#" + classeLogiqueInputId);

            callbackAnotherCallback(callback);
        });
    }
}

function findMyClassesLogiquesEnseignees(classeLogiqueInputId, callback) {
    $.get(getUrlWithContext("enseignant/getClassesEnseignees"), {}, function (response) {
        addClassesLogiquesAsOptions(response, "#" + classeLogiqueInputId);

        callbackAnotherCallback(callback);
    });
}