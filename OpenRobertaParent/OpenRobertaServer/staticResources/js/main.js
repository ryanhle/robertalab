/**
 * Initializations
 */
function init() {
    COMM.setErrorFn(handleServerErrors);
    $.when(languageController.init()).then(function(language) {
        return guiStateController.init(language);
    }).then(function() {
        return robotController.init();
    }).then(function() {
        return userController.init();
    }).then(function() {
        galleryListController.init();
        progListController.init();
        progDeleteController.init();
        confListController.init();
        confDeleteController.init();
        progShareController.init();
        logListController.init();
        configurationController.init();
        programController.init();
        progHelpController.init();
        progInfoController.init();
        progCodeController.init();
        progSimController.init();
        progRunController.init();
        menuController.init();
        cookieDisclaimer.init();
        $(".cover").fadeOut(100, function() {
            if (!guiStateController.getStartWithoutPopup()) {
                if (guiStateController.noCookie()) {
                    $("#show-startup-message").modal("show");
                } else {
                    userModel.getStatusText(function(result) {
                        if (result.statustext[0] !== "" && result.statustext[1] !== "") {
                            $('#modal-statustext').modal("show");
                        }
                    });
                }
            }
        });
        $(".pace").fadeOut(500);
    });
}

/**
 * Handle server errors
 */
function handleServerErrors() {
    // TODO more?        
    guiStateController.setPing(false);
    $('#message').attr('lkey', Blockly.Msg.SERVER_NOT_AVAILABLE);
    $('#message').html(Blockly.Msg.SERVER_NOT_AVAILABLE);
    $('#show-message').modal({
        backdrop : 'static',
        keyboard : false
    })
    $('#show-message :button').hide();
    $('#show-message').on('hidden.bs.modal', function(e) {
        // $("#show-message").modal("show");
        guiStateController.setPing(true);
    });
    $("#show-message").modal("show");
}
