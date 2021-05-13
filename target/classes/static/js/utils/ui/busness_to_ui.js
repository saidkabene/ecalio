function addNotificationToDashboard(notification) {
    var textAlignment = $("meta[name = 'textAlignment']").attr("content");

    var notificationUI =
        $("<a>")
            .attr("href", getUrlWithContext(notification.url))
            .addClass("kt-notification__item")
            .append(
                $("<div>")
                    .addClass("kt-notification__item-icon")
                    .append(
                        $("<i>")
                            .addClass(notification.icon + ' ' + "kt-font-" + notification.type)
                    )
            ).append(
            $("<div>")
                .addClass("kt-notification__item-details")
                .append(
                    $("<div>")
                        .addClass("kt-notification__item-title " + textAlignment)
                        .text(notification.title)
                )
                .append(
                    $("<div>")
                        .addClass("kt-notification__item-time " + textAlignment)
                        .text(notification.date + ' --- ' + notification.time)
                )
        );

    if (notification.vu == true)
        $(notificationUI).addClass("kt-notification__item--read");

    $(".ms-notifications-holder").append(notificationUI);
}

function addNewNotificationCountToDashboard(value) {
    if (value > 0) {
        $("#newNotificationPoint").attr("style", "opacity: 1.0");
        $("#notificationCounter").text(value);
    }
}

// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------

function addEtudiantsToGroupedSelect(etudiants) {
    addEntitiesAsGroupedOptions(".etudiants-select", etudiants,
        "restapi/etudiants/", "designation", "classeLogiqueDesignation");
}

function addEtudiantsAsOptions(etudiants, parentSelector) {
    addEntitiesAsOptions(parentSelector, etudiants, 'restapi/etudiants/',
        'designation');
}

// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------

function addAnneesScolairesAsOptions(anneesScolaires) {
    addEntitiesAsOptions('.annee-scolaire-select', anneesScolaires,
        'restapi/anneeScolaires/', 'designation');
}

// -----------------------------------------------------------------------------------------------

function addFillieresAsOptions(fillieres) {
    addEntitiesAsOptions('.filliere-select', fillieres,
        'restapi/fillieres/', 'designation');
}

// -----------------------------------------------------------------------------------------------

function addPeriodesEnseignementsAsOptions(periodeEnseignements) {
    addEntitiesAsOptions('.periode-enseignement-select', periodeEnseignements,
        'restapi/periodeEnseignements/', 'designation');
}

// -----------------------------------------------------------------------------------------------

function addRentreesScolairesAsOptions(rentreeScolaires) {
    addEntitiesAsOptions('.rentree-scolaire-select', rentreeScolaires,
        'restapi/rentreeScolaires/', 'designation');
}

// -----------------------------------------------------------------------------------------------

function addModulesAsOptions(modules, parentSelector) {
    if(typeof parentSelector == 'undefined')
        parentSelector = '.module-select';

    addEntitiesAsOptions(parentSelector, modules,
        'restapi/modules/', 'designation');
}

// -----------------------------------------------------------------------------------------------

function addClassesLogiquesAsOptions(classesLogiques, parentSelector) {
    if(typeof parentSelector == 'undefined')
        parentSelector = '.classe-logique-select';

    addEntitiesAsOptions(parentSelector, classesLogiques, 'restapi/classeLogiques/',
        'designation');
}

// -----------------------------------------------------------------------------------------------

function addEnseignantsAsOptions(classesLogiques) {
    addEnseignantsAsOptions(classesLogiques, '.enseignant-select');
}

function addEnseignantsAsOptions(enseignants, parentSelector) {
    addEntitiesAsOptions(parentSelector, enseignants, 'restapi/enseignants/',
        'designation');
}