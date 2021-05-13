(function () {
    $(document).ready(function () {
        $("input[type='file']").change(function (e) {
            $("#" + $(this).attr("id") + '-text-holder').text($(this).val());
        });

        $(".file-input-icon").click(function (e) {
            $("#" + $(this).attr("for")).trigger('click', e);
        });

        $('.summernote').summernote({
            height: '200px',
            lang: getLanguage()
        });

        $(".consulting-summernote").summernote({
            height: '500px',
            toolbar: []
        });

        $(".html-kt-select2").select2({
            width: "100%"
        });

        $(".ms-switch-toggles").each(function (index, toggle) {
            $(toggle).click(function () {
                var input = $(this).attr("for");
                var value = $("#" + input).val();

                if (value == 'true')
                    value = 'false';
                else value = 'true';

                $("#" + input).val(value);
            });
        });

        $("*[ms-onchange]").each(function (index, element) {
            $(this).attr("onchange", $(this).attr("ms-onchange"));
            $(this).attr("ms-onchange", "");
        });

        $('.input-time-range').find('input').timepicker({
            minuteStep: 1,
            showMeridian: false,
            explicitMode: true
        });

        $('.no-year-date-picker').datepicker({
            format: "dd/mm",
            maxViewMode: 1,
            language: getLanguage(),
            autoclose: true,
            todayHighlight: true
        });

        $('.full-date-picker').datepicker({
            format: "dd/mm/yyyy",
            language: getLanguage(),
            autoclose: true,
            todayHighlight: true
        });

        var oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        $('.one-month-ago-date-picker').datepicker('setDate', oneMonthAgo);

        var oneMonthAfter = new Date();
        oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);
        $('.one-month-after-date-picker').datepicker('setDate', oneMonthAfter);

        var oneYearAfter = new Date();
        oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);
        $(".one-year-after-date-picker").datepicker('setDate', oneYearAfter);

        $(".custom-date-value").each(function (index, element) {
            var value = $(element).attr("custom-date-value");

            if (typeof value != 'undefined')
                $(element).datepicker('setDate', new Date(value));
        });

        $('input[ms-twin-input]').each(function (index, master) {
            $(master).keyup(function (e) {
                var validator = $("#" + $(this).attr("ms-twin-input-validator"));

                var slave = $("#" + $(this).attr("ms-twin-input"));

                var masterValue = $(master).val();
                var slaveValue = $(slave).val();

                if (masterValue == slaveValue) {
                    $(master).removeClass("is-invalid");
                    $(slave).removeClass(("is-invalid"));

                    $(master).addClass("is-valid");
                    $(slave).addClass(("is-valid"));

                    $(validator).removeAttr("disabled");
                } else {
                    $(master).removeClass("is-valid");
                    $(slave).removeClass(("is-valid"));

                    $(master).addClass("is-invalid");
                    $(slave).addClass(("is-invalid"));

                    $(validator).attr("disabled", "disabled");
                }
            });
        });

        $('.reseting-form-modal').on('hidden.bs.modal', function () {
            $(this).find("form")[0].reset();
            $(this).find("input").attr("value", "");
        });

        $('.post-json-form').each(function (index, form) {
            $(form).submit(function (e) {
                e.preventDefault();

                $(form).find(".invalid-feedback").remove();
                $(form).find(".is-invalid").removeClass("is-invalid");

                var buttonSelector = $(form).find(
                    'input[type = "submit"], button[type = "submit"]');

                var url = $(this).attr("action");
                var json = formatFormAsJson(form);
                var method = $(this).attr("method");
                var callback = $(this).attr("ms-success-callback");
                var notifyOnSuccess = $(this).attr("ms-notify-on-success");
                var notifyOnFail = $(this).attr("ms-notify-on-fail");
                var simpleNotifyOnSuccess = $(this).attr("ms-simple-notify-on-success");
                var clearOnSuccess = $(this).attr("ms-clear-on-success");
                var buttonText = switchToLoadingButton(buttonSelector);

                $.ajax({
                    type: method,
                    url: url,
                    data: json,
                    headers: {'accept-language': getCookieByName("lang")},
                    success: function (param) {
                        switchUnLoadingButton(buttonSelector, buttonText);

                        if (simpleNotifyOnSuccess) {
                            show_success_toast();
                        }

                        if (notifyOnSuccess) {
                            show_generic_response_toast(param);
                        }

                        if (callback) {
                            if (typeof window[callback] == "function") {

                                window[callback](param);
                            }
                        }

                        if (clearOnSuccess) {
                            form.reset();

                            $(form).find("input[type!='checkbox']").attr("value", "");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        switchUnLoadingButton(buttonSelector, buttonText);

                        try {
                            var response = JSON.parse(XMLHttpRequest.responseText);

                            if (notifyOnFail)
                                show_generic_response_toast(response);

                            var fieldName = response.fieldName;
                            var message = response.message;

                            var input = $(form).find($(
                                "input[name='" + fieldName + "'], " +
                                "select[name='" + fieldName + "']"));

                            $(input).addClass("is-invalid");
                            $(input).parent().append("<div class='invalid-feedback'>"
                                + message + "</div>");

                        } catch (e) {
                        }
                    },

                    dataType: "json",
                    contentType: "application/json"
                });
            });
        });
    });
})();

function switchToLoadingButton(buttons) {
    var text = $(buttons).find('span').text();

    $(buttons).attr("disabled", "");
    $(buttons).find('span').text("");
    $(buttons).find('span').addClass("mr-5 ml-5");
    $(buttons).addClass("kt-spinner kt-spinner--center kt-spinner--md kt-spinner--warning");

    return text;
}

function switchUnLoadingButton(buttons, text) {
    $(buttons).removeAttr("disabled");

    $(buttons).find('span').text(text);
    $(buttons).find('span').removeClass("mr-5 ml-5");
    $(buttons).removeClass("kt-spinner kt-spinner--center kt-spinner--md kt-spinner--warning");
}

// ----------------------------------------------------------------------------------------

function addEntitiesAsGroupedOptions(parentSelector, entities, serviceUri, designationKey, groupDesignationKey) {
    var groups = {};
    var results = [];

    $.each(entities, function (index, entity) {
        var group = groups[entity[groupDesignationKey]];

        if (typeof group == 'undefined') {
            group = {
                text: entity[groupDesignationKey],
                children: []
            };

            groups[entity[groupDesignationKey]] = group;
        }

        group.children.push({
            id: entity.id,
            text: entity[designationKey]
        });
    });

    $.each(groups, function (key, group) {
        results.push(group);
    });

    $(parentSelector).empty();
    $(parentSelector).select2({
        data: results,
        width: "100%"
    });

    $(parentSelector).trigger('change');
}

function addEntitiesAsOptions(parentSelector, entities, serviceUri, designationKey) {
    $(parentSelector).each(function (index, parent) {
        var prefix = $(parent).hasClass("no-service-url") ?
            '' : getUrlWithContext(serviceUri);

        var data = [];

        if($(parent).hasClass("allow-empty-combobox-value")) {
            data.push({
               id: prefix + -1,
               text: ''
            });
        }

        $.each(entities, function (index, entity) {
            data.push({
                id: prefix + entity.id,
                text: entity[designationKey]
            });
        });

        $(parent).empty();
        $(parent).select2({
            data: data,
            width: "100%"
        });

        $(parent).trigger('change');
    });
}

// ----------------------------------------------------------------------------------------

function getLanguage() {
    return getCookieByName("lang");
}

function getLanguageName() {
    return getCookieByName("langName");
}

function getContext() {
    return $("meta[name='contextPath']").attr("content");
}

function getUrlRequestId() {
    return $("meta[name='requestUrlId']").attr("content");
}

function getUrlWithContext(url) {
    return getContext() + "/" + url;
}

function addUrlRequestIdToUrlFromDocument(url) {
    var urlRequestId = getUrlRequestId();

    if (typeof urlRequestId != 'undefined')
        return url + "/" + urlRequestId;

    else return url;
}

function redirect(url) {
    var contextPath = $("meta[name='contextPath']").attr("content");

    window.location.href = contextPath + "/" + url;
}

// ----------------------------------------------------------------------------------------

function getCookieByName(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));

    if (match)
        return match[2];
}

// ----------------------------------------------------------------------------------------

function formatFormAsJson(form) {
    var unindexed_array = $(form).serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        var key = n['name'].replace('[]', '');
        var value = n['value'];

        var isArray = n['name'].endsWith('[]');
        var isTime = n['name'].startsWith('heure');

        if (isTime) {
            var isNotWellFormatted = value.indexOf(':') == 1;

            if (isNotWellFormatted)
                value = '0' + value;
        }

        if (isArray) {
            var array = indexed_array[key];

            if (typeof array == 'undefined')
                array = [];

            array.push(value);

            indexed_array[key] = array;
        } else {
            indexed_array[key] = value;
        }
    });

    return JSON.stringify(indexed_array);
}

function formatFormAsUrl(form) {
    return $(form).serialize();
}

function callbackAnotherCallback(callback) {
    if (typeof callback == "function")
        callback();
    else if (typeof window[callback] == "function")
        window[callback]();
}

function selectOptionUsingDesignation(holderSelector, designation) {
    $(holderSelector).each(function (index, holder) {
        $(holder).find("option").each(function (index, option) {
            if ($(option).text() == designation) {
                $(holder).val($(option).val());
                $(holder).trigger('change');
            }
        });
    });
}

// -------------------------------------------------------------------------------------

function preventFormBehaviorAndClearErrors(event, form) {
    event.preventDefault();

    $(form).find(".invalid-feedback").remove();
    $(form).find(".is-invalid").removeClass("is-invalid");
}

function onFormFails(form, buttons, buttonText, XMLHttpRequest) {
    switchUnLoadingButton(buttons, buttonText);

    try {
        var response = JSON.parse(XMLHttpRequest.responseText);

        show_generic_response_toast(response);

        var fieldName = response.fieldName;
        var message = response.message;

        var input = $(form).find($(
            "input[name='" + fieldName + "'], " +
            "select[name='" + fieldName + "']"));

        $(input).addClass("is-invalid");
        $(input).parent().append("<div class='invalid-feedback'>"
            + message + "</div>");

    } catch (e) {
    }
}