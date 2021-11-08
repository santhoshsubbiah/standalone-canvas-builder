(function () {
    debugger
    var currentViewname = localStorage.getItem("currentview");
    var currentViewJson = JSON.parse(localStorage.getItem(currentViewname));

    fetchParsedJson(currentViewJson, "canvasview", "web");

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
                button: { 'default': '.zccbutton.zcanvas-field' }, // NO I18N
                'Tab Layout': { // NO I18N
                    'default': '.zctabview .zc-tabs .tab:not(.active)', // NO I18N
                    hover: '.zctabview .zc-tabs .tab:not(.active):hover', // NO I18N
                    active: '.zctabview .zc-tabs .tab.active' // NO I18N
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
    var currentheme = JSON.parse(localStorage.getItem("currentheme"));
    //var currentheme = zutils.zcopyobj(canvasData.config.toolsRef.config.theme.currenttheme);
    //createStruture.singleshotrender = true;
    //canvashtml = $(canvasData.getHtml(_self, false, "fixed"));//NO I18N
    // canvashtml.addClass('fluidlayout');//NO I18N	
    //var classes = editorOuter.attr('data-zcanvasclass'); // NO I18N
    //canvashtml.addClass(classes).css('min-height', '100%'); // NO I18N
    //      	        var getEditorWidth = editorOuter.width();
    //prevEditor.html(canvashtml.outerHTML());
    //      	        prevEditor.children(".canvas-outer").css("width", getEditorWidth);//NO I18N
    createStruture.toolinst.config.theme.currenttheme = currentheme;
    createStruture.toolinst.compiletheme();

    // var html = createStruture.layoutHtml(undefined, currentViewJson);
    // console.log(html);

})();