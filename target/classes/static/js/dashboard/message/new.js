(function () {
    $(document).ready(function () {
        $("#message-form").submit(function (e) {
            preventFormBehaviorAndClearErrors(e, $(this));

            var form = $(this);
            var formData = new FormData($(this)[0]);

            var buttons = $(this).find('input[type = "submit"], button[type = "submit"]');
            var buttonText = switchToLoadingButton(buttons);

            $.ajax({
                url: "messagerie/message",
                type: 'POST',
                data: formData,
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                success: function (param) {
                    switchUnLoadingButton(buttons, buttonText);

                    show_generic_response_toast(param);

                    form.trigger("reset");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    onFormFails(form, buttons, buttonText, XMLHttpRequest);
                }
            });

            return false;
        });
    });
})();