define([ 'exports', 'message', 'log', 'util', 'guiState.controller', 'program.controller', 'program.model', 'prettify', 'blocks', 'jquery', 'blocks-msg' ], function(exports, MSG,
        LOG, UTIL, GUISTATE_C, PROG_C, PROGRAM, Prettify, Blockly, $) {

    var blocklyWorkspace;
    /**
     * 
     */
    function init() {
        blocklyWorkspace = GUISTATE_C.getBlocklyWorkspace();
        initEvents();
    }
    exports.init = init;

    function initEvents() {
        $('#progCode').off('click touchend');
        $('#progCode').on('click touchend', function(event) {
            toggleCode();
            return false;
        });
        $('#codeDownload').onWrap('click', function(event) {
            var filename = GUISTATE_C.getProgramName() + '.' + GUISTATE_C.getProgramFileExtension();
            UTIL.download(filename, GUISTATE_C.getProgramSource());
            MSG.displayMessage("MENU_MESSAGE_DOWNLOAD", "TOAST", filename);
        }, 'codeDownload clicked');
        $('#codeRefresh').onWrap('click', function(event) {
            var dom = Blockly.Xml.workspaceToDom(blocklyWorkspace);
            var xmlProgram = Blockly.Xml.domToText(dom);
            var xmlConfiguration = GUISTATE_C.getConfigurationXML();

            var isNamedConfig = !GUISTATE_C.isConfigurationStandard() && !GUISTATE_C.isConfigurationAnonymous();
            var configName = isNamedConfig ? GUISTATE_C.getConfigurationName() : undefined;
            var xmlConfigText = GUISTATE_C.isConfigurationAnonymous() ? GUISTATE_C.getConfigurationXML() : undefined;

            var language = GUISTATE_C.getLanguage();

            PROGRAM.showSourceProgram(GUISTATE_C.getProgramName(), configName, xmlProgram, xmlConfigText, language, function(result) {
                GUISTATE_C.setState(result);
                $('#codeContent').html('<pre class="prettyprint linenums">' + prettyPrintOne(result.sourceCode.escapeHTML(), null, true) + '</pre>');
                // TODO change javaSource to source on server                   // TODO change javaSource to source on server
                GUISTATE_C.setProgramSource(result.sourceCode);
                GUISTATE_C.setProgramFileExtension(result.fileExtension);
                PROG_C.reloadProgram(result);
            });
        }, 'code refresh clicked');
    }

    function toggleCode() {
        Blockly.hideChaff();
        if ($('#codeDiv').hasClass('rightActive')) {
            $('.blocklyToolboxDiv').css('display', 'inherit');
            Blockly.svgResize(blocklyWorkspace);
            $('#progCode').animate({
                right : '0px',
            }, {
                duration : 750
            });
            $('#blocklyDiv').animate({
                width : '100%'
            }, {
                duration : 750,
                step : function() {
                    $(window).resize();
                    Blockly.svgResize(blocklyWorkspace);
                },
                done : function() {
                    $('#blocklyDiv').removeClass('rightActive');
                    $('#codeDiv').removeClass('rightActive');
                    $(window).resize();
                    Blockly.svgResize(blocklyWorkspace);
                    $('#codeContent').css({
                        "width" : 'inherit',
                        "height" : 'inherit',
                    });
                    $('#sliderDiv').hide();
                    $('#progCode').removeClass('shifted');
                }
            });
        } else {
            var dom = Blockly.Xml.workspaceToDom(blocklyWorkspace);
            var xmlProgram = Blockly.Xml.domToText(dom);

            var isNamedConfig = !GUISTATE_C.isConfigurationStandard() && !GUISTATE_C.isConfigurationAnonymous();
            var configName = isNamedConfig ? GUISTATE_C.getConfigurationName() : undefined;
            var xmlConfigText = GUISTATE_C.isConfigurationAnonymous() ? GUISTATE_C.getConfigurationXML() : undefined;

            var language = GUISTATE_C.getLanguage();

            PROGRAM.showSourceProgram(GUISTATE_C.getProgramName(), configName, xmlProgram, xmlConfigText, language, function(result) {
                GUISTATE_C.setState(result);
                $('#blocklyDiv').addClass('rightActive');
                $('#codeDiv').addClass('rightActive');
                var width;
                var smallScreen = $('#device-size').find('div:visible').first().attr('id') == 'xs';
                if (smallScreen) {
                    width = 52;
                } else {
                    width = $('#blocklyDiv').width() * 0.5;
                }
                $('#progCode').animate({
                    right : $('#blocklyDiv').width() - width + 4,
                }, {
                    duration : 750
                });
                $('#blocklyDiv').animate({
                    width : width
                }, {
                    duration : 750,
                    step : function() {
                        $(window).resize();
                        Blockly.svgResize(blocklyWorkspace);
                    },
                    done : function() {
                        if (smallScreen) {
                            $('.blocklyToolboxDiv').css('display', 'none');
                        }
                        $('#sliderDiv').css({
                            'left' : width - 10
                        });
                        $('#sliderDiv').show();
                        $('#progCode').addClass('shifted');
                        $(window).resize();
                        Blockly.svgResize(blocklyWorkspace);
                    }
                });
                $('#blocklyDiv').addClass('rightActive');
                $('#codeDiv').addClass('rightActive');
                $('#codeContent').html('<pre class="prettyprint linenums">' + prettyPrintOne(result.sourceCode.escapeHTML(), null, true) + '</pre>');
                // TODO change javaSource to source on server                   // TODO change javaSource to source on server
                GUISTATE_C.setProgramSource(result.sourceCode);
                GUISTATE_C.setProgramFileExtension(result.fileExtension);
                PROG_C.reloadProgram(result);
            });
        }
    }
});
