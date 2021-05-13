function show_success_toast() {
    var lang = getLanguage();
    var title = "";
    var content = "";

    if (typeof lang == "undefined")
        lang = "en";

    if (lang == 'ar') {
        title = "نجاح";
        content = "تم تنفيذ العملية بنجاح";
    } else if (lang == "en") {
        title = "Success";
        content = "The operation was done successfully";
    } else if (lang == 'fr') {
        title = "Succès";
        content = "L'opération a été faite avec succès";
    }

    show_toast(title, content, "success", 3000);
}

function show_error_toast() {
    var lang = getLanguage();
    var title = "";
    var content = "";

    if (typeof lang == "undefined")
        lang = "en";

    if (lang == 'ar') {
        title = "خطأ";
        content = "الرجاء معاودة المحاولة في وقت لاحق";
    } else if (lang == "en") {
        title = "Error";
        content = "Please try again later";
    } else if (lang == 'fr') {
        title = "Erreur";
        content = "Veuillez réessayer plus tard";
    }

    show_toast(title, content, "error", 3000);
}

function show_generic_response_toast(genericResponse) {
    var type = "";
    var delay = 3000;

    if (typeof genericResponse.type != 'undefined')
        type = genericResponse.type;
    else {
        if (genericResponse.error)
            type = "error";
        else
            type = "success";
    }

    if (typeof genericResponse.notificationPeriod != 'undefined')
        delay = genericResponse.notificationPeriod;

    show_toast(genericResponse.title, genericResponse.message, type, delay);
}

// -------------------------------------------------------------------------

function show_toast(title, content, type, delay) {
    toastr.options = {
        "newestOnTop": true,
        "progressBar": true,
        "timeOut": delay,
        "extendedTimeOut": delay
    };

    toastr[type](content, title);
}
