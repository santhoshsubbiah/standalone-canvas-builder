(function () {
    zclayout.prototype.layouts.Button = new function () {

        var self_ = this;

        var template = '<div class="zclayout zcanvas zc-no-resize zcanvas-field zcanvas-no-img-default zc-ta-center zccbutton zc-button-code" data-layoutname="Button" fixed="true">' +
            '<span class="zcanvas zcanvas-value-container zcanvas-inner-component zcanvas-data-node">Button</span>' +
            '</div>';
        var basetemplate = '<div class="zclayout zcanvas zcanvas-field zcanvas-no-img-default zc-ta-center zccbutton" data-layoutname="Button">' +
            '<span class="zcanvas zcanvas-value-container zcanvas-inner-component zcanvas-data-node">Button</span>' +
            '</div>';



        this.gethtml = function () {
            return template;
        }

        this.getLabelHtml = function () {
            return '<div style="background: #404560;padding: 10px;text-align: center;">' + 'Button' + '</div>'
        }

        this.init = function (component, noconfig, undo, init, zid) {
            if (!noconfig) {

                var outercontainer = $('.zcanvas-editor-outer');

                var data = outercontainer.data('zcanvas'); // NO I18N


                component.draggable({
                    containment: '.zcanvas-editor-outer', // NO I18N
                    cancel: '',
                    scroll: true,
                    start: function (e) {
                        if (e.shiftKey) {
                            return false;
                        }
                    },
                    drag: function (e) {
                        if (e.shiftKey) {
                            return false;
                        }
                    },
                    disabled: data.config.alwaysdisabled
                });

                component.css({ 'position': 'absolute', 'width': 'auto' }); // NO I18N

                component.attr('id', zid || zutils.getRandomId()); // NO I18N

                component.click(function (e) {
                    if (!component.hasClass('zcanvas-selected-element')) {
                        data && data.config && data.config.toolsRef && data.config.toolsRef.selectfield(e);
                    } else if (self_.zchandlers && self_.zchandlers.onclick) {
                        self_.zchandlers.onclick(component);
                    }
                }).mouseover(function (e) {
                    data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e, true);
                }).mouseout(function (e) {
                    data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e);
                });


                !init && component.data('zcanvasdata', {
                    onclick: '',
                    name: '',
                    disablewhen: '',
                    hidewhen: '',
                    value: ''
                })
                !init && self_.new(component);
            }
            if (!init) {
                data && data.config && data.config.toolsRef && data.config.toolsRef.selectfield(component);
            }

        }


        this.toJson = function (component) {
            var json = {
                children: [],
                ui: {
                    value: jsonCreation.getValue(component)
                },
                _type: 'component', // NO I18N
                theme: 'Rating', // NO I18N
                zcanvasId: component.attr('id') // NO I18N
            }
            json.ui.value.style = jsonCreation.getstyles(component);
            json.ui.code = component.data('zcanvasdata');
            json.ui.value.value = component.attr('data-zcvalue');
            return json;
        }
        this.toView = function (json) {
            var base = $(basetemplate);
            var line = base.find('.zc-divider-line'); // NO I18N
            base.css({
                width: '100%',
                height: json.ui.value.position.height
            });
            createStruture.applystyle(line, json.ui.value.style);
            if (json.ui.value.vertical) {
                base.removeClass('zc-hr-line').addClass('zc-vr-line');
            }
            return base;
        }
        this.toDom = function (json, container, pl, pt) {
            var base = $(template);
            base.css({
                left: json.ui.value.position.startX + (pl || 0),
                top: json.ui.value.position.startY + (pt || 0),
                width: json.ui.value.position.width,
                height: json.ui.value.position.height
            });
            base.find('span').eq()
            container.append(base);
            if (json.ui.value.vertical) {
                base.removeClass('zc-hr-line').addClass('zc-vr-line');
            }
            self_.init(base, null, null, true, json.zcanvasId);
            base.zccss(json.ui.value.style, true);
            return base;
        }
        this.deletelayout = function (element, flag) {
            var $parent = element.parent();
            var parentdata = zutils.getdatabyelement($parent);
            var json = canvasOutput.createJson(element);
            var undoredoobj = {
                action: 'callback', // NO I18N
                node: '#' + element.attr('id'), // NO I18N
                parent: '#' + $parent.attr('id'), // NO I18N
                previous: json,
                parentstyle: { ui: { value: { style: jsonCreation.getstyles($parent) } } },
                callback: function (data, method, node) {
                    if (method == 'undo') {
                        var parentinst = zutils.getdatabyelement($(data.parent));
                        parentinst.addElement([data.previous], data.parentstyle);
                    } else {
                        node.zremove();
                    }
                }
            }
            element.zremove();
            if (!flag) {
                parentdata.savecanvasaction(element, null, null, null, null, null, undoredoobj);
            } else {
                return undoredoobj;
            }
        }
        this.clone = function (element) {
            var $layout = element.closest('.zclayout'); // NO I18N
            var $parent = $layout.parent();
            var pos = $layout.css(['left', 'top']); // NO I18N
            var newpos = { left: parseInt(pos.left) + 5, top: parseInt(pos.top) + 5 }; // NO I18N 
            var $clone = $layout.clone();
            $clone.find('.ui-resizable-handle').remove(); // NO I18N
            $parent.append($clone);
            $clone.css(newpos);
            var pdata = zutils.getParentData($layout);
            var tools = pdata.config.toolsRef;
            var style = tools.copystyle($layout);
            self_.init($clone);
            tools.pastestyle(style, $clone);
        }

        this.new = function (component) {
            var $parent = component.parent();
            var parentid = $parent.attr('id'); // NO I18N
            var parentdata = zutils.getdatabyelement($parent);
            var parentstyle = jsonCreation.getstyles($parent);
            var undoredoobj = {
                action: 'callback', // NO I18N
                node: '#' + component.attr('id'), // NO I18N
                parent: '#' + parentid, // NO I18N
                json: canvasOutput.createJson(component),
                parentstyle: parentstyle,
                callback: function (data, method, node) {
                    if (method == 'undo') {
                        node.zremove();
                    } else {
                        var pdata = zutils.getdatabyelement($(data.parent));
                        pdata.addElement([data.json], { ui: { value: { style: data.parentstyle } } });
                    }
                }
            }
            var undoref = parentdata.savecanvasaction(component, null, null, null, null, null, undoredoobj);
            zutils.overlapHandling(component, undoref);
        }
        this.rerender = function (component, previous, current) {
            var $parent = component.parent();
            var parentid = $parent.attr('id'); // NO I18N
            var parentdata = zutils.getdatabyelement($parent);
            var parentstyle = jsonCreation.getstyles($parent);
            var undoredoobj = {
                action: 'callback', // NO I18N
                node: '#' + component.attr('id'), // NO I18N
                parent: '#' + parentid, // NO I18N
                previous: previous,
                current: current,
                parentstyle: parentstyle,
                callback: function (data, method, node) {
                    node.zremove();
                    var json;
                    if (method == 'undo') {
                        json = data.previous;
                    } else {
                        json = data.current;
                    }
                    var pdata = zutils.getdatabyelement($(data.parent));
                    pdata.addElement([json], { ui: { value: { style: data.parentstyle } } });
                }
            }
            parentdata.savecanvasaction(component, null, null, null, null, null, undoredoobj);
        }

        this.applyvalue = function (component, index, nochange) {
            var comps = component.find('.zcanvas-value-container');
            comps.text(index);
        }

        this.zchandlers = {
            //onclick: zcanvascodedata.defaulthandler.onclick,
            // onchange: zcanvascodedata.defaulthandler.onchange,
            setValue: function (component, value) {
                self_.applyvalue(component, value);
            }
        }
        this.zcreceiver = {
            value: function (component, data) {
                self_.zchandlers.setValue(component, data.result);
            }
        }
        this.zcprocess = {
            //value: zcanvascodedata.defaulthandler.inputvalue
        }
    }();
})();