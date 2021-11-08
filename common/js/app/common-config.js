function switchsidebar($class, el) {
    var $sidebar = $('.canvas-selected-sidebar');
    $sidebar.addClass('canvas-selected-sidebar');
    $('.zc-selected-sidebar').removeClass('zc-selected-sidebar');
    el.classList.add('zc-selected-sidebar'); // NO I18N
    var $current = document.querySelector('.canvas-selected-sidebar'); // NO I18N
    if ($current) {
        $current.classList.remove('canvas-selected-sidebar'); // NO I18N
    }
    document.querySelector("." + $class).classList.add('canvas-selected-sidebar'); // NO I18N
    var $search = $('#sidemenuSearchInput');
    if ($class == 'canvas-menu-container') { // NO I18N
        $search.focus();
    } else {
        $search.focusout();
    }
}

function forcestateapply(state, toolref, forceselect) {
    var forcedel = $('.zcforce-style-selection');
    if (forcedel) {
        var fellen = forcedel.length;
        for (var i = 0; i < fellen; i++) {
            var forcestate = forcedel.eq(i).attr('zcforce'); // NO I18N
            forcedel.eq(i).removeClass('zcforce-style-selection').removeClass(forcestate).removeAttr('zcforce'); // NO I18N
        }
    }
    if (forceselect) {
        var selectedel = toolref.config.toolsRef.selectedfields;
        if (selectedel) {
            // if (this.getData('selectedcriteriamodule')) {
            // 	var steditor = selectedel.closest('.zcanvas-static-editor');  // NO I18N
            // 	var $editors = steditor.find('.zcanvas-non-delete'); // NO I18N
            // 	$editors.addClass(state).addClass('zcforce-style-selection').attr('zcforce', state) // NO I18N
            // } else {
            // 	$('.canvas-container').addClass(state).addClass('zcforce-style-selection').attr('zcforce', state) // NO I18N
            // }
        }
    }
}

function switchstate(state, forceselect, substate, nochange) {
    // eslint-disable-next-line no-complex-selector
    var _mousestateel = $('.zc_mouse_states li');
    if (!substate) {
        // eslint-disable-next-line no-complex-selector
        $('.zc_state_tool li').removeClass('zcanvas-tools-list-selected');
        document.getElementById('zc_state_' + state).classList.add('zcanvas-tools-list-selected'); // NO I18N
    } else {
        _mousestateel.removeClass('zcanvas-tools-list-selected');
        var stateselector = state === 'default' ? 'zc_substate_default' : 'zc_state_' + state; // NO I18N
        document.getElementById(stateselector).classList.add('zcanvas-tools-list-selected'); // NO I18N
    }

    var toolref = $('#zcanvas-editor-outer').data('zcanvas');
    !substate && forcestateapply(state, toolref, forceselect);

    if (state !== 'default' && !substate && toolref.config.toolsRef.selectedfields.is('.tab')) {
        state = state + '_mousestate_active'; // NO I18N
        _mousestateel.removeClass('zcanvas-tools-list-selected'); // NO I18N
        document.getElementById('zc_state_active').classList.add('zcanvas-tools-list-selected'); // NO I18N
    }
    if (state !== 'default' && !substate && toolref.config.toolsRef.selectedfields.is('.zccbutton')) {
        _mousestateel.removeClass('zcanvas-tools-list-selected'); // NO I18N
        document.getElementById('zc_substate_default').classList.add('zcanvas-tools-list-selected'); // NO I18N
    }


    if ((state === 'default' && substate || state === 'active' || state === 'hover') && toolref.config.toolsRef.state !== 'default' && toolref.config.toolsRef.state !== 'active' && toolref.config.toolsRef.state !== 'hover') {
        var existstate = toolref.config.toolsRef.state.split('_mousestate_')[0]; // No I18N
        if (existstate !== 'default') {
            if (state === 'default') {
                state = existstate;
                forcestateapply(state, toolref, true);
            } else {
                state = existstate + '_mousestate_' + state; // NO I18N
            }

        }

    }
    !nochange && toolref.config.toolsRef.changestate(state, false, true);
}

function enableSelection(flag) {
    if (jsonCreation.toolinst && jsonCreation.toolinst.config) {
        if (flag) {
            jsonCreation.toolinst.config.toolonfocus();
        } else {
            jsonCreation.toolinst.config.toolonblur();
        }
    }
}

function renametab(flag) {
    var $el = $('#zctabname'); // NO I18N
    var data = $el.data();
    if (!flag && $el.val().trim() == "") {
        $el.val(data.zcOldText);
    }
    zclayout.prototype.layouts["Tab Layout"].renametab($('#' + data.parent), data.current, $el, flag, function (name) {
        //name = $ESAPI.encoder().encodeForHTML(name);
        var _currenttab = data.current.replace('#', ''); // NO I18N
        var el = $('#' + data.parent).find('.zc-tabs li.zctablist' + _currenttab); // NO I18N
        el.attr('data-zcqa', 'canvas-detail-tab-' + name); // NO I18N
        return name;
    });
    enableSelection(false);
}
function saveCanvas(type) {
    var editorOuter = $("#zcanvas-editor-outer");//NO I18N
    var canvasData = editorOuter.data("zcanvas");//NO I18N
    var currentheme = zutils.zcopyobj(canvasData.config.toolsRef.config.theme.currenttheme);
    localStorage.setItem("currentheme", JSON.stringify(currentheme));
    var saveJson = canvasOutput.createJson($("#zcanvas-editor-outer"));
    saveJson.ui.theme = currentheme;
    var viewName = $("#canvasname").val();
    var allViewsName = JSON.parse(localStorage.getItem("canvasviews")) || [];
    var isThere = allViewsName.findIndex((rank) => rank === viewName);
    if (isThere > -1) {
        var delKey = allViewsName[isThere];
        localStorage.removeItem(delKey);
        // allViewsName.splice(isThere, 1);
    } else {
        allViewsName.push(viewName);
    }
    localStorage.currentview = viewName;
    localStorage.setItem("canvasviews", JSON.stringify(allViewsName));
    localStorage.setItem(viewName, JSON.stringify(saveJson));

    // $("#canvasContainer").hide();
    // $("#zcOutputContainer").show();


    var newTab = window.open(`${type}-output.html`, '_blank');
    // newTab.viewJson = saveJson;
    // fetchParsedJson(saveJson, "zcOutputContainer");

}

// function themeProcess(builderType) {
//     if (builderType === 'web') {
//         var toolinst = new zcanvastools({
//             baseeditor: 'body', // NO I18N
//             tools: {},
//             nodeattr: {
//                 key: 'zcqaval', // NO I18N
//                 key2: 'label', // NO I18N
//                 attr: {
//                     'data-zcqa': 'canvas-detail-' // NO I18N
//                 }
//             },
//             viewcallback: function (element, json) {
//                 if (json && json.ui && json.ui.value && json.ui.value.zcode && json.ui.value.zcode.name) {
//                     element.attr('data-zcqa', 'canvas-detail-' + json.ui.value.zcode.name); // NO I18N
//                 }
//             },
//             compressionmap: zutils.stylecompressionmap,
//             classstyles: zutils.classstyles,
//             classselector: function (sel) {
//                 if (sel.indexOf('zcanvas-holder') > -1) {
//                     sel = sel.replace('.zcanvas-holder', '').trim();
//                 }
//                 return sel;
//             },
//             // customstate: Lyte.registeredMixins["crm-detailcanvas-utils"].customstateview, // NO I18N
//             stylepriority: function (selector, result) {
//                 if (selector && selector.endsWith('.zc-tabs li.tab')) {
//                     result = true;
//                 }
//                 return result;
//             },
//             poststylecreate: function (selector, obj, noimportant) {
//                 if (selector && selector.indexOf('.zcanvas-field') >= 0 && selector.indexOf(':hover') > -1) { // NO I18N
//                     selector = selector + ' .zcanvas-inner-component'; // NO I18N
//                     var propoattr = ['font-family', 'font-size', 'color', 'background-color']; // NO I18N
//                     var newstyle = {};
//                     var proplen = propoattr.length;
//                     for (var i = 0; i < proplen; i++) {
//                         if (obj[propoattr[i]]) {
//                             newstyle[propoattr[i]] = obj[propoattr[i]];
//                         }
//                     }
//                     this.addrule(selector, newstyle, noimportant, true);
//                 }
//                 if (selector && selector.indexOf('.zcanvas-holder') > -1 && obj && obj['flex-direction'] && obj['flex-direction'].indexOf('column') > -1) { // NO I18N
//                     var props = {
//                         'white-space': 'normal;'//No I18N
//                     }
//                     this.addrule(selector + '> .zcanvas-label', props, noimportant, true); // NO I18N
//                 }
//                 if (selector && selector.indexOf('.zc-tablist-container .zc-tabs') > -1) {
//                     var marginstyle = zutils.getSpacingProperties('margin', obj); // NO I18N
//                     var paddingstyle = zutils.getSpacingProperties('padding', obj); // NO I18N
//                     var newselector = selector.replace('.zc-tabs', '.zc-tabs-nav'); // NO I18N
//                     var newstyle = {
//                         'padding-top': paddingstyle['padding-top'] + 'px', // NO I18N
//                         'padding-bottom': paddingstyle['padding-bottom'] + 'px', // NO I18N
//                         'margin-top': marginstyle['margin-top'] + 'px', // NO I18N
//                         'margin-bottom': marginstyle['margin-bottom'] + 'px' // NO I18N
//                     }
//                     this.addrule(newselector, newstyle, noimportant, true); // NO I18N
//                 }
//             },
//             theme: {
//                 selector: {
//                     field: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink)' }, // NO I18N
//                     label: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink) .zcanvas-label' }, // NO I18N
//                     value: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink) .zcanvas-value-container' }, // NO I18N
//                     textarea: { 'default': '.zcanvas-field.zctextarea:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' }, // NO I18N
//                     tag: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container crm-tag ul li' }, // NO I18N
//                     section: { 'default': '.zcanvassection:not(.zcanvas-non-delete):not(.zcanvas-title-editor):not(.zcanvas-static-content-container):not(.zc-no-theme):not(.zc-tab-section)' }, // NO I18N
//                     'relatedlist section': { 'default': '.zcanvassection.zcanvas-non-delete' }, // NO I18N
//                     'relatedlist title': { 'default': '.zcanvassection.zcanvas-title-editor' }, // NO I18N
//                     title: { 'default': '.zcstatictext.zc_disabled' }, // NO I18N
//                     button: { 'default': '.zccbutton.zcanvas-field' }, // NO I18N
//                     'Tab Layout': { // NO I18N
//                         'default': '.zctabview .zc-tabs .tab:not(.active)', // NO I18N
//                         hover: '.zctabview .zc-tabs .tab:not(.active):hover', // NO I18N
//                         active: '.zctabview .zc-tabs .tab.active' // NO I18N
//                     },
//                     page: {
//                         'default': '.zc-page-component' // NO I18N
//                     },
//                     relatedlist: {
//                         'default': '.zc-list-component' // NO I18N
//                     },
//                     'Static Text': { // NO I18N
//                         'default': '.zcstatictext:not(.zc_disabled)' // NO I18N
//                     },
//                     'Line': { // NO I18N
//                         'default': '.zclayout.zcdivider .zc-divider-line' // NO I18N
//                     },
//                     'Table Layout': { // NO I18N
//                         'default': '.zclayout-table > .canvas-outer' // NO I18N
//                     },
//                     textarea: { 'default': '.zcanvas-field.zctextarea:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' } // NO I18N
//                 }
//             },
//             nocompile: true
//         });
//     } else if(builderType === 'mobile') {
//         var toolinst = new zcanvastools({
//             baseeditor: 'body', // NO I18N
//             tools: {},
//             nodeattr: {
//                 key: 'zcqaval', // NO I18N
//                 key2: 'label', // NO I18N
//                 attr: {
//                     'data-zcqa': 'canvas-detail-' // NO I18N
//                 }
//             },
//             viewcallback: function (element, json) {
//                 if (json && json.ui && json.ui.value && json.ui.value.zcode && json.ui.value.zcode.name) {
//                     element.attr('data-zcqa', 'canvas-detail-' + json.ui.value.zcode.name); // NO I18N
//                 }
//             },
//             compressionmap: zutils.stylecompressionmap,
//             classstyles: zutils.classstyles,
//             classselector: function (sel) {
//                 if (sel.indexOf('zcanvas-holder') > -1) {
//                     sel = sel.replace('.zcanvas-holder', '').trim();
//                 }
//                 return sel;
//             },
//             // customstate: Lyte.registeredMixins["crm-detailcanvas-utils"].customstateview, // NO I18N
//             stylepriority: function (selector, result) {
//                 if (selector && selector.endsWith('.zc-tabs li.tab')) {
//                     result = true;
//                 }
//                 return result;
//             },
//             poststylecreate: function (selector, obj, noimportant) {
//                 if (selector && selector.indexOf('.zcanvas-field') >= 0 && selector.indexOf(':hover') > -1) { // NO I18N
//                     selector = selector + ' .zcanvas-inner-component'; // NO I18N
//                     var propoattr = ['font-family', 'font-size', 'color', 'background-color']; // NO I18N
//                     var newstyle = {};
//                     var proplen = propoattr.length;
//                     for (var i = 0; i < proplen; i++) {
//                         if (obj[propoattr[i]]) {
//                             newstyle[propoattr[i]] = obj[propoattr[i]];
//                         }
//                     }
//                     this.addrule(selector, newstyle, noimportant, true);
//                 }
//                 if (selector && selector.indexOf('.zcanvas-holder') > -1 && obj && obj['flex-direction'] && obj['flex-direction'].indexOf('column') > -1) { // NO I18N
//                     var props = {
//                         'white-space': 'normal;'//No I18N
//                     }
//                     this.addrule(selector + '> .zcanvas-label', props, noimportant, true); // NO I18N
//                 }
//                 if (selector && selector.indexOf('.zc-tablist-container .zc-tabs') > -1) {
//                     var marginstyle = zutils.getSpacingProperties('margin', obj); // NO I18N
//                     var paddingstyle = zutils.getSpacingProperties('padding', obj); // NO I18N
//                     var newselector = selector.replace('.zc-tabs', '.zc-tabs-nav'); // NO I18N
//                     var newstyle = {
//                         'padding-top': paddingstyle['padding-top'] + 'px', // NO I18N
//                         'padding-bottom': paddingstyle['padding-bottom'] + 'px', // NO I18N
//                         'margin-top': marginstyle['margin-top'] + 'px', // NO I18N
//                         'margin-bottom': marginstyle['margin-bottom'] + 'px' // NO I18N
//                     }
//                     this.addrule(newselector, newstyle, noimportant, true); // NO I18N
//                 }
//             },
//             theme: {
//                 selector: {
//                     field: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink)' }, // NO I18N
//                     label: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink) .zcanvas-label' }, // NO I18N
//                     value: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink) .zcanvas-value-container' }, // NO I18N
//                     textarea: { 'default': '.zcanvas-field.zctextarea:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' }, // NO I18N
//                     tag: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container crm-tag ul li' }, // NO I18N
//                     section: { 'default': '.zcanvassection:not(.zcanvas-non-delete):not(.zcanvas-title-editor):not(.zcanvas-static-content-container):not(.zc-no-theme):not(.zc-tab-section)' }, // NO I18N
//                     'relatedlist section': { 'default': '.zcanvassection.zcanvas-non-delete' }, // NO I18N
//                     'relatedlist title': { 'default': '.zcanvassection.zcanvas-title-editor' }, // NO I18N
//                     title: { 'default': '.zcstatictext.zc_disabled' }, // NO I18N
//                     button: { 'default': '.zccbutton.zcanvas-field' }, // NO I18N
//                     'Tab Layout': { // NO I18N
//                         'default': '.zctabview .zc-tabs .tab:not(.active)', // NO I18N
//                         hover: '.zctabview .zc-tabs .tab:not(.active):hover', // NO I18N
//                         active: '.zctabview .zc-tabs .tab.active' // NO I18N
//                     },
//                     page: {
//                         'default': '.zc-page-component' // NO I18N
//                     },
//                     relatedlist: {
//                         'default': '.zc-list-component' // NO I18N
//                     },
//                     'Static Text': { // NO I18N
//                         'default': '.zcstatictext:not(.zc_disabled)' // NO I18N
//                     },
//                     'Line': { // NO I18N
//                         'default': '.zclayout.zcdivider .zc-divider-line' // NO I18N
//                     },
//                     'Table Layout': { // NO I18N
//                         'default': '.zclayout-table > .canvas-outer' // NO I18N
//                     },
//                     textarea: { 'default': '.zcanvas-field.zctextarea:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' } // NO I18N
//                 }
//             },
//             nocompile: true
//         });
//     }

//     createStruture.toolinst = toolinst;
//     createStruture.singleshotrender = false;
// }

function previewview(builderType) {
    var editorOuter = $("#zcanvas-editor-outer");//NO I18N
    var rawJson = canvasOutput.createJson(editorOuter[0]);
    fetchParsedJson(rawJson, "previewcanvas", builderType);
    //var prevEditor = $('#previewcanvas');//NO I18N

    var canvasData = editorOuter.data("zcanvas");//NO I18N
    var toolinst = new zcanvastools({
        baseeditor: 'body', // NO I18N
        tools: {},
        nodeattr: {
            key: 'zcqaval', // NO I18N
            key2: 'label', // NO I18N
            attr: {
                'data-zcqa': 'canvas-detail-' // NO I18N
            }
        },
        viewcallback: function (element, json) {
            if (json && json.ui && json.ui.value && json.ui.value.zcode && json.ui.value.zcode.name) {
                element.attr('data-zcqa', 'canvas-detail-' + json.ui.value.zcode.name); // NO I18N
            }
        },
        compressionmap: zutils.stylecompressionmap,
        classstyles: zutils.classstyles,
        classselector: function (sel) {
            if (sel.indexOf('zcanvas-holder') > -1) {
                sel = sel.replace('.zcanvas-holder', '').trim();
            }
            return sel;
        },
        // customstate: Lyte.registeredMixins["crm-detailcanvas-utils"].customstateview, // NO I18N
        stylepriority: function (selector, result) {
            if (selector && selector.endsWith('.zc-tabs li.tab')) {
                result = true;
            }
            return result;
        },
        poststylecreate: function (selector, obj, noimportant) {
            if (selector && selector.indexOf('.zcanvas-field') >= 0 && selector.indexOf(':hover') > -1) { // NO I18N
                selector = selector + ' .zcanvas-inner-component'; // NO I18N
                var propoattr = ['font-family', 'font-size', 'color', 'background-color']; // NO I18N
                var newstyle = {};
                var proplen = propoattr.length;
                for (var i = 0; i < proplen; i++) {
                    if (obj[propoattr[i]]) {
                        newstyle[propoattr[i]] = obj[propoattr[i]];
                    }
                }
                this.addrule(selector, newstyle, noimportant, true);
            }
            if (selector && selector.indexOf('.zcanvas-holder') > -1 && obj && obj['flex-direction'] && obj['flex-direction'].indexOf('column') > -1) { // NO I18N
                var props = {
                    'white-space': 'normal;'//No I18N
                }
                this.addrule(selector + '> .zcanvas-label', props, noimportant, true); // NO I18N
            }
            if (selector && selector.indexOf('.zc-tablist-container .zc-tabs') > -1) {
                var marginstyle = zutils.getSpacingProperties('margin', obj); // NO I18N
                var paddingstyle = zutils.getSpacingProperties('padding', obj); // NO I18N
                var newselector = selector.replace('.zc-tabs', '.zc-tabs-nav'); // NO I18N
                var newstyle = {
                    'padding-top': paddingstyle['padding-top'] + 'px', // NO I18N
                    'padding-bottom': paddingstyle['padding-bottom'] + 'px', // NO I18N
                    'margin-top': marginstyle['margin-top'] + 'px', // NO I18N
                    'margin-bottom': marginstyle['margin-bottom'] + 'px' // NO I18N
                }
                this.addrule(newselector, newstyle, noimportant, true); // NO I18N
            }
        },
        theme: {
            selector: {
                field: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink)' }, // NO I18N
                label: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink) .zcanvas-label' }, // NO I18N
                value: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink) .zcanvas-value-container' }, // NO I18N
                textarea: { 'default': '.zcanvas-field.zctextarea:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' }, // NO I18N
                tag: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container crm-tag ul li' }, // NO I18N
                section: { 'default': '.zcanvassection:not(.zcanvas-non-delete):not(.zcanvas-title-editor):not(.zcanvas-static-content-container):not(.zc-no-theme):not(.zc-tab-section)' }, // NO I18N
                'relatedlist section': { 'default': '.zcanvassection.zcanvas-non-delete' }, // NO I18N
                'relatedlist title': { 'default': '.zcanvassection.zcanvas-title-editor' }, // NO I18N
                title: { 'default': '.zcstatictext.zc_disabled' }, // NO I18N
                button: {
                    'default': '.zccbutton.zcanvas-field', // NO I18N
                    'hover': '.zccbutton.zcanvas-field:hover' // NO I18N
                },
                'Tab Layout': { // NO I18N
                    'default': '.zctabview .zc-tabs .tab:not(.active)', // NO I18N
                    hover: '.zctabview .zc-tabs .tab:not(.active):hover', // NO I18N
                    active: '.zctabview .zc-tabs .tab.active' // NO I18N
                },
                'Tab': {
                    'default': '.zctablayout .zc-tab-container' // NO I18N
                },
                page: {
                    'default': '.zc-page-component' // NO I18N
                },
                relatedlist: {
                    'default': '.zc-list-component' // NO I18N
                },
                'Static Text': { // NO I18N
                    'default': '.zcstatictext:not(.zc_disabled)' // NO I18N
                },
                'Line': { // NO I18N
                    'default': '.zclayout.zcdivider .zc-divider-line' // NO I18N
                },
                'Table Layout': { // NO I18N
                    'default': '.zclayout-table > .canvas-outer' // NO I18N
                },
                textarea: { 'default': '.zcanvas-field.zctextarea:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' } // NO I18N
            }
        },
        nocompile: true
    });
    createStruture.toolinst = toolinst;
    createStruture.singleshotrender = false;
    var currentheme = zutils.zcopyobj(canvasData.config.toolsRef.config.theme.currenttheme);
    createStruture.toolinst.config.theme.currenttheme = currentheme;
    createStruture.toolinst.compiletheme();
}
function fetchParsedJson(rawJson, id, builderType) {
    if (!rawJson) {
        rawJson = canvasOutput.createJson($("#zcanvas-editor-outer")) || {};
    }
    var data = "json=" + encodeURIComponent(JSON.stringify(rawJson));
    fetch("https://crmedge.localzoho.com/zcanvas/execute", {
        method: "POST", body: data, headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
        }),
    }).then((response) => response.text()).then((parsedJSON) => {
        var toolinst = new zcanvastools({
            baseeditor: 'body', // NO I18N
            tools: {},
            nodeattr: {
                key: 'zcqaval', // NO I18N
                key2: 'label', // NO I18N
                attr: {
                    'data-zcqa': 'canvas-detail-' // NO I18N
                }
            },
            viewcallback: function (element, json) {
                if (json && json.ui && json.ui.value && json.ui.value.zcode && json.ui.value.zcode.name) {
                    element.attr('data-zcqa', 'canvas-detail-' + json.ui.value.zcode.name); // NO I18N
                }
            },
            compressionmap: zutils.stylecompressionmap,
            classstyles: zutils.classstyles,
            classselector: function (sel) {
                if (sel.indexOf('zcanvas-holder') > -1) {
                    sel = sel.replace('.zcanvas-holder', '').trim();
                }
                return sel;
            },
            // customstate: Lyte.registeredMixins["crm-detailcanvas-utils"].customstateview, // NO I18N
            stylepriority: function (selector, result) {
                if (selector && selector.endsWith('.zc-tabs li.tab')) {
                    result = true;
                }
                return result;
            },
            poststylecreate: function (selector, obj, noimportant) {
                if (selector && selector.indexOf('.zcanvas-field') >= 0 && selector.indexOf(':hover') > -1) { // NO I18N
                    selector = selector + ' .zcanvas-inner-component'; // NO I18N
                    var propoattr = ['font-family', 'font-size', 'color', 'background-color']; // NO I18N
                    var newstyle = {};
                    var proplen = propoattr.length;
                    for (var i = 0; i < proplen; i++) {
                        if (obj[propoattr[i]]) {
                            newstyle[propoattr[i]] = obj[propoattr[i]];
                        }
                    }
                    this.addrule(selector, newstyle, noimportant, true);
                }
                if (selector && selector.indexOf('.zcanvas-holder') > -1 && obj && obj['flex-direction'] && obj['flex-direction'].indexOf('column') > -1) { // NO I18N
                    var props = {
                        'white-space': 'normal;'//No I18N
                    }
                    this.addrule(selector + '> .zcanvas-label', props, noimportant, true); // NO I18N
                }
                if (selector && selector.indexOf('.zc-tablist-container .zc-tabs') > -1) {
                    var marginstyle = zutils.getSpacingProperties('margin', obj); // NO I18N
                    var paddingstyle = zutils.getSpacingProperties('padding', obj); // NO I18N
                    var newselector = selector.replace('.zc-tabs', '.zc-tabs-nav'); // NO I18N
                    var newstyle = {
                        'padding-top': paddingstyle['padding-top'] + 'px', // NO I18N
                        'padding-bottom': paddingstyle['padding-bottom'] + 'px', // NO I18N
                        'margin-top': marginstyle['margin-top'] + 'px', // NO I18N
                        'margin-bottom': marginstyle['margin-bottom'] + 'px' // NO I18N
                    }
                    this.addrule(newselector, newstyle, noimportant, true); // NO I18N
                }
            },
            theme: {
                selector: {
                    field: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink)' }, // NO I18N
                    label: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink) .zcanvas-label' }, // NO I18N
                    value: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink) .zcanvas-value-container' }, // NO I18N
                    textarea: { 'default': '.zcanvas-field.zctextarea:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' }, // NO I18N
                    tag: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container crm-tag ul li' }, // NO I18N
                    section: { 'default': '.zcanvassection:not(.zcanvas-non-delete):not(.zcanvas-title-editor):not(.zcanvas-static-content-container):not(.zc-no-theme):not(.zc-tab-section)' }, // NO I18N
                    'relatedlist section': { 'default': '.zcanvassection.zcanvas-non-delete' }, // NO I18N
                    'relatedlist title': { 'default': '.zcanvassection.zcanvas-title-editor' }, // NO I18N
                    title: { 'default': '.zcstatictext.zc_disabled' }, // NO I18N
                    button: {
                        'default': '.zccbutton.zcanvas-field', // NO I18N
                        'hover': '.zccbutton.zcanvas-field:hover' // NO I18N
                    },
                    'Tab Layout': { // NO I18N
                        'default': '.zctabview .zc-tabs .tab:not(.active)', // NO I18N
                        hover: '.zctabview .zc-tabs .tab:not(.active):hover', // NO I18N
                        active: '.zctabview .zc-tabs .tab.active' // NO I18N
                    },
                    'Tab': {
                        'default': '.zctablayout .zc-tab-container' // NO I18N
                    },
                    page: {
                        'default': '.zc-page-component' // NO I18N
                    },
                    relatedlist: {
                        'default': '.zc-list-component' // NO I18N
                    },
                    'Static Text': { // NO I18N
                        'default': '.zcstatictext:not(.zc_disabled)' // NO I18N
                    },
                    'Line': { // NO I18N
                        'default': '.zclayout.zcdivider .zc-divider-line' // NO I18N
                    },
                    'Table Layout': { // NO I18N
                        'default': '.zclayout-table > .canvas-outer' // NO I18N
                    },
                    textarea: { 'default': '.zcanvas-field.zctextarea:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' } // NO I18N
                }
            },
            nocompile: true
        });
        createStruture.toolinst = toolinst;
        createStruture.singleshotrender = false;
        var parsedResponse = JSON.parse(parsedJSON);
        window.outputHTML = canvasOutput.html(undefined, parsedResponse, undefined, "fixed");
        $("#" + id).html(window.outputHTML);
    }).then(() => afterPreview());
    return window.outputHTML;
}

function undoRedo(type) {
    type === '1' ? undoredomanager.undo() : undoredomanager.redo();
}

function fullscreen() {
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.documentElement;

    if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    //this._track('Editor Full Screen Switch'); // NO I18N
}

function afterPreview() {
    var zclayouts = $('#canvasview .zclayout.zctabview');
    var inst = zclayout.prototype.layouts['Tab Layout']; // NO I18N
    zclayouts.each(function () {
        inst.refreshlayout($(this), function () {
            $('#previewcanvas').find('crm-stage-history').each(function () {
                var $stage = $(this);
                if ($stage.length) {
                    $stage[0].component.setWidthForStagesParent();
                }
            });
        });
    });
}