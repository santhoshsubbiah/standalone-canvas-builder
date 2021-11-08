(function () { // eslint-disable-line zstandard/no-global-function-call
    var CanvasUndoRedoManager = function (config) {
        var undostack = [];
        var redostack = [];

        this.config = config;

        this.push = function (data, flag) {

            redostack = [];
            if (data.action === 'link') {
                var actionlen = data.actionarray.length;
                for (var i = 0; i < actionlen; i++) {
                    data.actionarray[i].node = this.getselectors(data.actionarray[i].node);
                }
            }
            data.node = data.node ? this.getselectors(data.node) : '';
            this.config && this.config.onChange && this.config.onChange.bind(this)(data);
            return flag ? data : undostack.push(data);
        }

        this.undo = function () {
            if (this.hasUndo()) {
                var data = undostack.pop();
                redostack.push(data);
                this.executeUndo(data);
                this.config && this.config.onUndo && this.config.onUndo.bind(this)(data);
                this.config && this.config.onChange && this.config.onChange.bind(this)(data);
            }
        }

        this.redo = function () {
            if (this.hasRedo()) {
                var data = redostack.pop();
                undostack.push(data);
                this.executeRedo(data);
                this.config && this.config.onRedo && this.config.onRedo.bind(this)(data);
                this.config && this.config.onChange && this.config.onChange.bind(this)(data);
            }
        }

        this.hasUndo = function () {
            return undostack.length > 0;
        }

        this.hasRedo = function () {
            return redostack.length > 0;
        }

        this.removePrev = function (action, node) {
            var data = undostack[undostack.length - 1];
            if (data && data.action === action && node.is(data.node)) {
                undostack.pop();
            }
        }

        this.clear = function () {
            undostack = [];
            redostack = [];
        }

        this.executeUndo = function (data) {
            //FIXME:
            if (!data) {
                return;
            }
            switch (data.action) {
                case 'new':
                    var node = this.getElements(data.node);
                    var zfieldData = $(node).zdata();
                    var fieldData = zfieldData ? zfieldData[0] : null;
                    if (fieldData) {
                        data.menu = fieldData;
                        var menuInstance = $(fieldData.fieldContainer).data('zcanvasMenu');
                        menuInstance && menuInstance.addElement(fieldData);
                    }
                    node.zremove();
                    break;
                case 'neweditor':
                    var node = this.getElements(data.node);
                    var zfieldData = data.previous;
                    if (zfieldData) {
                        data.menu = zfieldData;
                        var menuInstance = $(zfieldData.fieldContainer).data('zcanvasMenu');
                        menuInstance.addElement(zfieldData);
                    }
                    var inst = zutils.getParentData(node);
                    inst && zutils.changelayoutscope(inst, 'Section Layout'); // NO I18N
                    node.zremove();
                    break;
                case 'drag':
                    var node = this.getElements(data.node);
                    node.css(data.previous);
                    break;
                case 'cssaction':
                    var node = this.getElements(data.node);
                    node.css(data.previous);
                    break;
                case 'editordrag':
                    var node = this.getElements(data.node);
                    var container = this.getElements(data.previous.container);
                    container.append(node);
                    node.css(data.previous);
                    break;
                case 'mergefromeditor':
                    var instance = $(data.editor).data('zcanvas');
                    data.splitbase = instance.addsingleElement(data.previous);
                    data.splittarget = instance.addsingleElement(data.base);
                    data.node.zremove();
                    break;
                case 'mergefrommenu':
                    var instance = $(data.editor).data('zcanvas');
                    data.node = this.updatedNode(data.node);
                    data.node.zremove();
                    data.splitbase = instance.addsingleElement(data.previous);
                    var fieldData = data.base;
                    data.menu = fieldData;
                    break;
                case 'switchaction':
                    if (!this.toolsRef.zcstyles[data.node]) {
                        this.toolsRef.zcstyles[data.node] = { };
                    }
                    if (this.toolsRef.zcstyles[data.node] && !this.toolsRef.zcstyles[data.node][data.state]) {
                        this.toolsRef.zcstyles[data.node][data.state] = { }
                    }
                    this.toolsRef.zcstyles[data.node][data.state] = data.previous;
                    this.toolsRef.addrule(data.stylenode, this.toolsRef.zcstyles[data.node][data.state], data.noimportant);
                    var $node = this.getElements(data.node);
                    this.toolsRef.selectfield($node, null, true);
                    break;
                case 'action':
                    if (this.toolsRef.zcstyles[data.node] && !this.toolsRef.zcstyles[data.node][data.state]) {
                        this.toolsRef.zcstyles[data.node][data.state] = { }
                    }
                    canvasObjUtils._.extend(this.toolsRef.zcstyles[data.node][data.state] || { }, data.previous);
                    var selector = data.node;
                    var isState = false;
                    if (data.state && data.state === 'hover') {
                        selector += ':hover'; // NO I18N
                        isState = true;
                    } else if (data.state && data.state === 'active') { // NO I18N
                        selector += '.active'; // NO I18N
                        isState = true;
                    }
                    if (this.toolsRef.config.customstate) {
                        selector = this.toolsRef.config.customstate(data.state, selector, null);
                    }
                    this.toolsRef.addrule(selector, this.toolsRef.zcstyles[data.node][data.state], data.noimportant);

                    if (data.actualnode) {
                        var $node = $(data.actualnode);
                    } else {
                        var $node = this.getElements(data.node);
                        if (isState) {
                            $node = $node.eq(0);
                        }
                    }

                    this.toolsRef.selectfield($node, null, true, { state: data.state });
                    break;
                case 'replaceaction':
                    var node = this.getElements(data.node);
                    var el = node;
                    if (data.previous.replaceelement) {
                        el = node.find(data.previous.replaceelement);
                    }
                    el.html(data.previous.value);
                    break;
                case 'classaction':
                    var node = this.getElements(data.node);
                    var this_ = this.toolsRef;
                    if (data.classstate) {
                        if (!this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_) {
                            this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_ = []
                        }
                        if (!data.previous) {
                            node.removeClass(data.className + '_state_' + data.classstate); // NO I18N
                            var sloadindex = this_.zcstyles[data.selector][data.classstate]._classstyle_.indexOf(data.className + '_state_' + data.classstate); // NO I18N
                            if (sloadindex > -1) {
                                this_.zcstyles[data.selector][data.classstate]._classstyle_.splice(sloadindex, 1);
                            }
                            if (data.hasremove) {
                                var classloadindex = this_.zcstyles[data.selector][data.classstate]._classstyle_.indexOf(data.removeclass + '_state_' + data.classstate);
                                if (classloadindex > -1) {
                                    this_.zcstyles[data.selector][data.classstate]._classstyle_.splice(data.removeclass + '_state_' + data.classstate); // NO I18N
                                }
                                this_.zcstyles[data.selector][data.classstate]._classstyle_.push(data.removeclass + '_state_' + data.classstate);
                                node.addClass(data.removeclass + '_state_' + data.classstate); // NO I18N
                            }
                        } else {
                            if (data.hasaction) {
                                node.addClass(data.removeclass + '_state_' + data.classstate); // NO I18N
                                var sloadindex = this_.zcstyles[data.selector][data.classstate]._classstyle_.indexOf(data.removeclass + '_state_' + data.classstate); // NO I18N
                                if (sloadindex > -1) {
                                    this_.zcstyles[data.selector][data.classstate]._classstyle_.splice(sloadindex, 1);
                                }
                            }
                            var classloadindex = this_.zcstyles[data.selector][data.classstate]._classstyle_.indexOf(data.className + '_state_' + (data.classstate || this_.state));
                            if (classloadindex > -1) {
                                this_.zcstyles[data.selector][data.classstate]._classstyle_.splice(classloadindex, 1);
                            }
                            this_.zcstyles[data.selector][data.classstate]._classstyle_.push(data.className + '_state_' + (data.classstate || this_.state));
                            node.addClass(data.className + '_state_' + data.classstate); // NO I18N
                        }
                        this_.updatestyle({ }, data.styleselector, this_.zcstyles[data.selector][data.classstate], data.noimp);

                    } else if (data.previous) {
                        node.addClass(data.className).zaddClass(data.className);
                    } else {
                        node.removeClass(data.className).zremoveClass(data.className);
                    }

                    this.toolsRef.selectfield(node, null, true);
                    break;
                case 'actionclasslist':
                    var node = this.getElements(data.node);
                    var this_ = this.toolsRef;
                    if (data.classstate) {
                        if (!this_.zcstyles[data.selector][data.classstate]._classstyle_) {
                            this_.zcstyles[data.selector][data.classstate]._classstyle_ = []
                        }
                        var rclass = (data.hasremove || data.current.class) + '_state_' + data.classstate; // No I18N
                        this_.zcstyles[data.selector][data.classstate]._classstyle_.splice(this_.zcstyles[data.selector][data.classstate]._classstyle_.indexOf(rclass), 1);
                        node.removeClass(rclass); // NO I18N
                        if (data.previous.class) {
                            var classloadindex = this_.zcstyles[data.selector][data.classstate]._classstyle_.indexOf(rclass);
                            if (classloadindex > -1) {
                                this_.zcstyles[data.selector][data.classstate]._classstyle_.splice(classloadindex, 1);
                            }
                            this_.zcstyles[data.selector][data.classstate]._classstyle_.push(rclass);
                            node.addClass(rclass); // NO I18N
                        }
                        this_.updatestyle({ }, data.styleselector, this_.zcstyles[data.selector][data.classstate], data.noimp);
                    } else {
                        node.removeClass(data.current.class).zremoveClass(data.current.class);
                        if (data.previous.class) {
                            node.addClass(data.previous.class).zaddClass(data.previous.class);
                        }
                    }
                    this_.selectfield(node, null, true);
                    break;
                case 'unmerge':
                    var instance = $(data.editor).data('zcanvas');
                    data.node = this.updatedNode(data.node);
                    data.baseElement = this.updatedNode(data.baseElement);
                    data.node.zremove();
                    data.baseElement.zremove();
                    data.node = instance.addsingleElement(data.previous);
                    break;
                case 'delete':
                    var instance = $(data.editor).data('zcanvas');
                    var node = this.getElements(data.node);
                    node && node.zremove();
                    instance.addsingleElement(data.previous, data.prevstyle);
                    var menuinst = $(data.data.fieldContainer).data('zcanvasMenu');
                    menuinst && menuinst.reduceScope(data.data);
                    break;
                case 'resize':
                    var node = this.getElements(data.node);
                    //node.css({width: data.previous.width+'px', height: data.previous.height+'px'}); // NO I18N
                    node.css(data.previous);
                    if (data.previous && data.previous.class) {
                        node.addClass(data.previous.class);
                    }
                    break;
                case 'editorswitch':
                    var node = this.getElements(data.node);
                    $(data.previous.editor).append(node);
                    node.css(data.previous.position); // eslint-disable-line webperf/layout-thrashing
                    break;
                case 'link':
                    var dataobj = data.actionarray;
                    var actionlength = dataobj.length;
                    for (var i = 0; i < actionlength; i++) {
                        this.executeUndo(dataobj[i]);
                    }
                    break;
                case 'deleteeditor':
                    var editor = $(data.editor);
                    var instance = editor.data('zcanvas'); // NO I18N
                    instance.addElement([data.previous.json], data.previousstyle, { fieldscoping: true });
                    break;
                case 'deletestaticeditor':
                    var editor = $(data.editor);
                    var instance = editor.data('zcanvas'); // NO I18N
                    instance.renderrelatedList(data.previous.json, data.previous.json.template, undefined, undefined, instance.config, data.previous.style, data.previous.editor, data.previous.titledata, true);
                    if (data && data.previous && data.previous.json && data.previous.json.fieldContainer) {
                        var menuinst = $(data.previous.json.fieldContainer).data('zcanvasMenu'); // NO I18N
                        menuinst && menuinst.reduceScope(data.previous.json);
                    }
                    var depth = parseInt(data.previous.style && data.previous.style.depth) || 1;
                    $('#' + data.previous.editor).css('z-index', depth).data('zcanvasdata', data.previous.cdata);
                    break;
                case 'layout':
                    var inst = data.instance;
                    inst.executeUndo(data.json);
                    break;
                case 'callback':
                    var node = this.getElements(data.node);
                    data.callback && data.callback(data, 'undo', node); // NO I18N
                    break;
            }

            if (data.changedetection) {
                data.changedetection(data.action, this.getElements(data.node), data);
            }
        }

        this.executeRedo = function (data) {
            if (!data) {
                return;
            }
            switch (data.action) {
                case 'new':
                    var editorInstance = $(data.editor).data('zcanvas');
                    editorInstance.addsingleElement(data.current);
                    var fieldData = data.menu;
                    var menuInstance = $(fieldData.fieldContainer).data('zcanvasMenu');
                    menuInstance && menuInstance.reduceScope(fieldData);
                    break;
                case 'neweditor':
                    var $editor = $(data.editor);
                    editorInstance = $editor.data('zcanvas'); //NO I18N
                    var outercontainerstyle = { ui: { value: { style: jsonCreation.getstyles($editor) } } };
                    editorInstance.addElement([data.current], outercontainerstyle);
                    if (data.menu) {
                        var fieldData = data.menu;
                        var menuInstance = $(fieldData.fieldContainer).data('zcanvasMenu');
                        menuInstance && menuInstance.reduceScope(fieldData);
                    }
                    break;
                case 'drag':
                    var node = this.getElements(data.node);
                    node.css(data.current);
                    break;
                case 'cssaction':
                    var node = this.getElements(data.node);
                    node.css(data.current);
                    break;
                case 'editordrag':
                    var node = this.getElements(data.node);
                    var container = this.getElements(data.current.container);
                    container.append(node);
                    node.css(data.current);
                    break;
                case 'mergefromeditor':
                    data.splitbase.remove();
                    data.splittarget.remove();
                    var instance = $(data.editor).data('zcanvas');
                    data.node = instance.addsingleElement(data.current);
                    break;
                case 'mergefrommenu':
                    var instance = $(data.editor).data('zcanvas');
                    data.splitbase = this.updatedNode(data.splitbase);
                    data.splitbase.remove();
                    data.node = instance.addsingleElement(data.current);
                    if (data.menu) {
                        var fieldData = data.menu;
                        var menuInstance = $(fieldData.fieldContainer).data('zcanvasMenu');
                        menuInstance.reduceScope(fieldData);
                    }
                    break;
                case 'switchaction':
                    this.toolsRef.zcstyles[data.node][data.state] = data.current;
                    this.toolsRef.addrule(data.stylenode, this.toolsRef.zcstyles[data.node][data.state]);
                    var $node = this.getElements(data.node);
                    this.toolsRef.selectfield($node, null, true);
                    break;
                case 'action':
                    if (this.toolsRef.zcstyles[data.node] && !this.toolsRef.zcstyles[data.node][data.state]) {
                        this.toolsRef.zcstyles[data.node][data.state] = { }
                    }
                    canvasObjUtils._.extend(this.toolsRef.zcstyles[data.node][data.state], data.current);
                    var selector = data.node;
                    var isState = false;
                    if (data.state && data.state === 'hover') {
                        selector += ':hover'; // NO I18N
                        isState = true;
                    } else if (data.state && data.state === 'active') { // NO I18N
                        selector += '.active'; // NO I18N
                        isState = true;
                    }
                    if (this.toolsRef.config.customstate) {
                        selector = this.toolsRef.config.customstate(data.state, selector, null);
                    }
                    this.toolsRef.addrule(selector, this.toolsRef.zcstyles[data.node][data.state], data.noimportant);

                    if (data.actualnode) {
                        var $node = $(data.actualnode);
                    } else {
                        var $node = this.getElements(data.node);
                        if (isState) {
                            $node = $node.eq(0);
                        }
                    }

                    this.toolsRef.selectfield($node, null, true, { state: data.state });
                    break;
                case 'classaction':
                    var node = this.getElements(data.node);
                    var this_ = this.toolsRef;
                    if (data.classstate) {
                        if (!this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_) {
                            this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_ = [];
                        }
                        if (!data.current) {
                            node.removeClass(data.className + '_state_' + (data.classstate || this_.state)); // NO I18N
                            var sloadindex = this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_.indexOf(data.className + '_state_' + (data.classstate || this_.state)); // NO I18N
                            if (sloadindex > -1) {
                                this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_.splice(sloadindex, 1);
                            }
                            if (data.hasaction) {
                                var classloadindex = this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_.indexOf(data.removeclass + '_state_' + (data.classstate || this_.state)); // NO I18N
                                if (classloadindex > -1) {
                                    this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_.splice(classloadindex, 1);
                                }
                                this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_.push(data.removeclass + '_state_' + (data.classstate || this_.state));
                                node.addClass(data.removeclass + '_state_' + t(data.classstate || this_.state)); // NO I18N
                            }
                        } else {
                            if (data.hasremove) {
                                node.removeClass(data.removeclass + '_state_' + (data.classstate || this_.state)); // NO I18N
                                var sloadindex = this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_.indexOf(data.removeclass + '_state_' + (data.classstate || this_.state)); // NO I18N
                                if (sloadindex > -1) {
                                    this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_.splice(sloadindex, 1);
                                }
                            }
                            var classloadindex = data.className + '_state_' + (data.classstate || this_.state); // NO I18N
                            if (classloadindex > -1) {
                                this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_.splice(classloadindex, 1);
                            }
                            this_.zcstyles[data.selector][(data.classstate || this_.state)]._classstyle_.push(data.className + '_state_' + (data.classstate || this_.state));
                            node.addClass(data.className + '_state_' + (data.classstate || this_.state)); // NO I18N
                        }
                        this_.updatestyle({ }, data.styleselector, this_.zcstyles[data.selector][(data.classstate || this_.state)], data.noimp);
                    } else if (data.current) {
                        node.addClass(data.className).zaddClass(data.className);
                    } else {
                        node.removeClass(data.className).zremoveClass(data.className);
                    }

                    this.toolsRef.selectfield(node, null, true);
                    break;
                case 'actionclasslist':
                    var node = this.getElements(data.node);
                    var this_ = this.toolsRef;
                    if (data.classstate) {
                        if (!this_.zcstyles[data.selector][data.classstate]._classstyle_) {
                            this_.zcstyles[data.selector][data.classstate]._classstyle_ = []
                        }
                        var rclass = (data.hasremove || data.current.class) + '_state_' + data.classstate; // No I18N
                        this_.zcstyles[data.selector][data.classstate]._classstyle_.push(rclass);
                        node.addClass(rclass); // NO I18N
                        if (data.previous.class) {
                            var classloadindex = this_.zcstyles[data.selector][data.classstate]._classstyle_.indexOf(rclass);
                            if (classloadindex > -1) {
                                this_.zcstyles[data.selector][data.classstate]._classstyle_.splice(classloadindex, 1);
                            }
                            node.removeClass(rclass); // NO I18N
                        }
                        this_.updatestyle({ }, data.styleselector, this_.zcstyles[data.selector][data.classstate], data.noimp);
                    } else {
                        if (data.previous.class) {
                            node.removeClass(data.previous.class).zremoveClass(data.previous.class);
                        }
                        node.addClass(data.current.class).zaddClass(data.current.class);
                    }

                    this_.selectfield(node, null, true);
                    break;
                case 'replaceaction':
                    var node = this.getElements(data.node);
                    var el = node;
                    // FIXME: The single seperator will not consider , will always replace the first sep in list 
                    // MUSTFIX:
                    if (data.current.replaceelement) {
                        el = node.find(data.current.replaceelement);
                    }
                    el.html(data.current.value);
                    break;
                case 'unmerge':
                    var instance = $(data.editor).data('zcanvas');
                    data.node = this.updatedNode(data.node);
                    data.node.remove();
                    data.node = instance.addsingleElement(data.current);
                    data.baseElement = instance.addsingleElement(data.base);
                    break;
                case 'delete':
                    var instance = $(data.editor).data('zcanvas');
                    var node = this.getElements(data.node);
                    node && node.zremove();
                    if (data.current && !canvasObjUtils._.isEmpty(data.current)) {
                        instance.addsingleElement(data.current, data.prevstyle);
                    }
                    var menuinst = $(data.data.fieldContainer).data('zcanvasMenu');
                    menuinst && menuinst.addElement(data.data);
                    break;
                case 'resize':
                    var node = this.getElements(data.node);
                    //  node.css({width: data.current.width+'px', height: data.current.height+'px'}); // NO I18N
                    node.css(data.current);
                    if (data.previous && data.previous.class) {
                        node.removeClass(data.previous.class);
                    }
                    break;
                case 'editorswitch':
                    var node = this.getElements(data.node);
                    $(data.current.editor).append(node);
                    node.css(data.current.position); // eslint-disable-line webperf/layout-thrashing
                    break;
                case 'link':
                    var dataobj = data.actionarray;
                    var actionlength = dataobj.length;
                    for (var i = 0; i < actionlength; i++) {
                        this.executeRedo(dataobj[i]);
                    }
                    break;
                case 'deleteeditor':
                    var nodeid = '#' + data.previous.editor;
                    zutils.deleteEditor($(nodeid), true);
                    break;
                case 'deletestaticeditor':
                    var nodeid = '#' + data.previous.editor;
                    zutils.deletestaticeditor($(nodeid), true);
                    break;
                case 'layout':
                    var inst = data.instance;
                    inst.executeRedo(data.json);
                    break;
                case 'callback':
                    var node = this.getElements(data.node);
                    data.callback && data.callback(data, 'redo', node); // NO I18N
                    break;
            }
            if (data.changedetection) {
                data.changedetection(data.action, this.getElements(data.node), data);
            }
        }

        this.updatedNode = function (node, data) {
            var nodeElement;
            if (typeof node === 'string') {
                return $(node);
            }
            // If Node has prev object
            if (!node.length) {
                node = node.prevObject;
            }
            if (node.length > 1) {
                var resultantNode = [];
                var nodelen = node.length;
                for (var i = 0; i < nodelen; i++) {
                    resultantNode.push(this.updatedNode($(node[i]), data)[0]);
                }
                return $(resultantNode);
            }
            if (node.is('.zcanvas-editor') || node.is('.zcanvas-editor-outer') || node.is('.zcanvas-static-editor')) {
                var id = node.attr('id'); //NO I18N
                nodeElement = $('#' + id); //NO I18N
            } else if (node.is('.zcanvas-label') || node.is('.zcanvas-seperator') || node.is('.zcanvas-value-container')) { // NO I18N
                var nodeidentity = node.is('.zcanvas-seperator') ? '.zcanvas-seperator' : node.is('.zcanvas-value-container') ? '.zcanvas-value-container' : '.zcanvas-label'; // NO I18N
                var relevantid = node.zdata()[0];
                var zcanvasId = relevantid.zcanvasId;
                //  var mainel = $('[data-zcanvasid=' + zcanvasId + ']');  
                var mainel = $('.' + zcanvasId).find('.zcanvas-data-node'); // NO I18N
                if (data.nodedirection === 'prev') {
                    return mainel.next(nodeidentity);
                } else {
                    return mainel.find(nodeidentity);
                }
            } else if (node.is('.zcanvas-data-node')) { // NO I18N
                var relevantid = node.zdata()[0];
                var zcanvasId = relevantid.zcanvasId;
                nodeElement = $('.' + zcanvasId).find('.zcanvas-data-node'); // NO I18N
                // nodeElement = $('.zcanvas-data-node[data-zcanvasid=' + zcanvasId + ']'); // NO I18N
            } else {
                node.find('.zcanvas-data-node').each(function () { // NO I18N
                    var zcanvasId = $(this).attr('data-zcanvasid'); // NO I18N
                    var parentEl = $('.' + zcanvasId);
                    //var parentEl = $('[data-zcanvasid=' + zcanvasId + ']').parents('.zcanvas-field'); // NO I18N
                    if (parentEl.length) {
                        nodeElement = parentEl;
                    }
                })
            }

            return nodeElement || node;
        }
        this.getselectors = function (el) {
            if (typeof el === 'string') {
                return el;
            } else if (el instanceof jQuery) {
                var selectors = [];
                el.each(function () {
                    selectors.push(zutils.getSelectorByElement($(this)))
                })
                return selectors.join(',');
            }
        }

        this.getElements = function (selectors) {
            var result = $('');
            if (selectors.indexOf(',') > -1) {
                selectors = selectors.split(',');
            } else {
                selectors = [selectors];
            }
            var sellen = selectors.length
            for (var i = 0; i < sellen; i++) {
                var $el = zutils.getElementBySelector(selectors[i]);
                if ($el.hasClass('zc-no-selection')) {
                    $el = $el.parent();
                }
                result = result.add($el);
            }
            return result;
        }
    }
    window.CanvasUndoRedoManager = CanvasUndoRedoManager;
})();

// $Id$

/**
 * @namespace
*/
var thirdPartyUtils = { };

/**
 * This method is used to destroy Select2 on child Select2 of given element.
 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child select2 is to be destroyed.
 */

thirdPartyUtils.unbindChildSelect2 = function (parentObj) {
    var selectObjs = parentObj.find(".select2-hidden-accessible");
    if (selectObjs.length) {
        try {
            selectObjs.select2('destroy');//NO I18N
        }
        catch (e) {
            murphy.error(e)
        }
    }
}

/**
 * This method is used to destroy PerfectScroll on child PerfectScroll of given element.
 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child PerfectScroll is to be destroyed.
 */

thirdPartyUtils.unbindChildPerfectScroll = function (parentObj) {
    var psScrolls = parentObj.find(".ps-container");
    if (psScrolls.length) {
        try {
            psScrolls.perfectScrollbar('destroy');//NO I18N
        }
        catch (e) {
            murphy.error(e)
        }
    }
}

/**
 * This method is used to destroy Highcharts on child Highcharts of given element.
 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child Highcharts is to be destroyed.
 */

thirdPartyUtils.unbindHighcharts = function (parentObj) {
    var highChartsInnerDivs = parentObj.find('.highcharts-container');
    var len = highChartsInnerDivs.length;
    for (var i = 0; i < len; i++) {
        try {
            var chartDiv = highChartsInnerDivs.eq(i).parent().highcharts();
            chartDiv && chartDiv.destroy();
        }
        catch (e) {
            murphy.error(e)
        }
    }
}

/**
 * This method is used to destroy Zohocharts on child Highcharts of given element.
 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child Zohocharts is to be destroyed.
 */
thirdPartyUtils.unbindZohoCharts = function (parentObj) {
    var d3InnerDivs = parentObj.find('.d3container');
    var len = d3InnerDivs.length;
    for (var i = 0; i < len; i++) {
        try {
            var chartDiv = d3InnerDivs[i].__data__;
            chartDiv && chartDiv.destroy();
        }
        catch (e) {
            murphy.error(e)
        }
    }
}

/**
 * This method is used to destroy Gridstack on child Gridstack of given element.
 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child Gridstack is to be destroyed.
 */

thirdPartyUtils.unbindGridstack = function (parentObj) {
    var grid = parentObj.find(".grid-stack").data("gridstack");//No I18N
    if (grid) {
        try {
            grid.destroy();
        }
        catch (e) {
            murphy.error(e)
        }
    }
}

/**
 * This method is used to unbind all Fileuploader instances and its parent Dropzone instances in detailPage and it is also used to unbind all Dropzone instances sif any instances are available in Feedspage
 */

thirdPartyUtils.removeDropzoneInstances = function () {
    var _len = FileUploader.instances.length;
    if (FileUploader && _len) {
        while (_len) {
            try {
                var _instance = FileUploader.instances[_len - 1];
                _instance.instance.clean();
                _len--;
            }
            catch (e) {
                murphy.error(e)
            }
        }

    }
    // unbind all Dropzone instances  if any instances are available in Feedspage
    var _len = Dropzone.instances.length;
    if (Dropzone && _len) {
        for (var _i = 0; _i < _len; _i++) {
            try {
                var _instance = Dropzone.instances[_i];
                _instance.destroy();
            }
            catch (e) {
                murphy.error(e)
            }
        }
    }
};

/**
 * This method is used to destroy AutoComplete on child AutoComplete of given element.
 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child AutoComplete is to be destroyed.
 */

thirdPartyUtils.unbindAutoComplete = function (parentObj) {
    var autoCompleteDivs = parentObj.find(".ui-autocomplete-input");
    var len = autoCompleteDivs.length;

    for (var i = 0; i < len; i++) {
        try {
            autoCompleteDivs.eq(i).autocomplete('destroy');//NO I18N
        }
        catch (e) {
            murphy.error(e)
        }
    }
};


/**
 * This method is used to destroy Fullcalendar on child Fullcalendar of given element.
 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child Fullcalendar is to be destroyed.
 */

thirdPartyUtils.unbindFullcalendar = function (parentObj) {
    var calendarDiv = parentObj.find("#calendarBd");//eslint-disable-line webperf/directly-select-with-id
    if (calendarDiv.length) {
        try {
            calendarDiv.fullCalendar('destroy');//NO I18N
        }
        catch (e) {
            murphy.error(e)
        }
    }
}

/**
 * This method is used to check whether all the third party plugin events are removed or not  
 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child third party plugin is to be destroyed.
 */

thirdPartyUtils.unbindChildEvents = function (parentObj) {
    if (!(parentObj instanceof $)) { parentObj = $(parentObj) };
    if (parentObj.length === 0) { return; }
    try {
        thirdPartyUtils.unbindAutoComplete(parentObj);
        thirdPartyUtils.unbindChildPerfectScroll(parentObj);
        thirdPartyUtils.unbindChildSelect2(parentObj);
        thirdPartyUtils.unbindHighcharts(parentObj);
        thirdPartyUtils.unbindZohoCharts(parentObj);
        thirdPartyUtils.unbindGridstack(parentObj);
        thirdPartyUtils.unbindFullcalendar(parentObj);
        //eslint-disable-next-line webperf/no-attribute-selectors
        if (parentObj.find("[batchid]").length || parentObj.find('.dropzone').length) {//NO I18N 
            thirdPartyUtils.removeDropzoneInstances();
        }
    } catch (e) {
        return;
    }
}

/**
 * This method is used to destroy perfect scroll plugin on the given element.
 * @param {jQueryElement} JElem - This provides the jQueryElement from which perfect scroll plugin has to be destroyed. 
 */

thirdPartyUtils.unbindPerfectScroll = function (JElem) {
    if (!JElem || !$(JElem).length) { return; }
    JElem = $(JElem);
    JElem.perfectScrollbar('destroy');//No I18N
};

/**
 * This method is used to update the perfectscroll plugin when the size of the content changes.
 * @param {jQueryElement} JElem - This provides the jQueryElement on which the perfectScroll is to be updated.
 */

thirdPartyUtils.bindPerfectScrollUpdate = function (JElem) {
    if (!JElem || !$(JElem).length) { return; }
    JElem = $(JElem);
    JElem.perfectScrollbar('update');//No I18N
};

/**
 * This method is used to initiate the perfect scroll plugin
 * @property {jQueryElement} JElem - This provides the jQueryElement for which the perfect scroll plugin is initiated.
 * @property {Object} options - Refer {@link https://mdbootstrap.com/freebies/perfect-scrollbar/?utm_source=GitHub&utm_medium=PerfectScrollbar#options|here}
 * @property {JQueryELement} options.start - it is the child of the container element at which the scroll should be begin. 
 */

thirdPartyUtils.bindPerfectScroll = function (JElem, options) {
    if (!JElem || !$(JElem).length) { return; }
    JElem = $(JElem);
    options = options || { };
    if (options.start) {
        var startposition = $(options.start).position().top;
        delete options.start;
    }
    JElem.perfectScrollbar(options);
    if (startposition) {
        JElem.scrollTop(startposition);
        JElem.perfectScrollbar("update");//No I18N
    }
};

/**
 * This method is used to initiate the Lyte scroll plugin
 * @param {jQueryElement} JElem - This provides the jQueryElement in which the Lyte Scroll is defined
 * @param {Object} options - Refer {@link https://lyte.csez.zohocorpin.com/2.1.0/dom/scroll|Lyte Doc}
 */

thirdPartyUtils.bindLyteScroll = function (JElem, options) {
    if (!JElem || !$L(JElem).length) { return; }
    JElem = $L(JElem);
    options = options || { };
    JElem.scroll(options);

}


thirdPartyUtils.selectTempResult = function (data) {
    var selectEmptyText = data.text;
    var ele = data.element;
    if (ele !== undefined) {
        var pickMap = $(ele.parentElement).attr("data-picklistmap");
        if (pickMap !== undefined) {
            var validJson = Crm.isValidJSON(pickMap)
            if (validJson) {
                var index = $(ele).index();
                var pickObj = JSON.parse(pickMap)[index];
                if (pickObj && pickObj.hasOwnProperty('colorCode')) {
                    var colorCode = pickObj.colorCode;
                    if (colorCode) {
                        selectEmptyText = "<span class='disable" + data.disabled + "'><span class='dIB activitesColor' data-zcqa='option_" + selectEmptyText + "' style='background:" + colorCode + "'></span>" + $ESAPI.encoder().encodeForHTML(data.text) + "</span>";//No I18N
                        $('.select2-container').addClass('dropdown_eventcolor');
                        return selectEmptyText;
                    }
                }
            }
        }
    }
    return "<span class='disable" + data.disabled + "'>" + $ESAPI.encoder().encodeForHTML(selectEmptyText) + "</span>";
}


thirdPartyUtils.selectEmptyVal = function (data, container) {
    var selectEmptyText = data.text;
    var selectEmptyId = data.id;
    if (selectEmptyId === '' || selectEmptyId === '-None-' && !container) {
        if (container != undefined) {
            var containerId = container.attr('id'); //No I18N
            $('#' + containerId).parents('.select2-container').parent().addClass('selectEmptyVal');

        }
    }
    return "<span class='disable" + data.disabled + "'>" + $ESAPI.encoder().encodeForHTML(selectEmptyText) + "</span>";
}

/**
 * This method is used to initialize Select2 on a Select element
 * @property {JQueryElement} JElem - This provides the Select element for which Select2 has to be initiated. 
 * @property {Object} options - This provides 
 * @property {Number} options.disable_search_threshold - minimum number of results required to display the search box.
 * @property {JQueryElement} options.dropdownParent  - It allows you to customize the placement of dropdown.
 * @property {String} options.no_results_text - placeholder to be displayed when no resuts arer found.
 * @property {String} options.placeholder_text_multiple - placeholder text the select2.
 * @property {String} options.placeholder_text_single - placeholder text the select2.
 * @property {Number} options.maximumSelectionLength - Number of items that can be selected in Multi-select i.e if the value is less than 1 then unlimited multi selection can be done.
 * @property {String} options.maximum_result_text - placeholder to be shown when the user selects maximum number of options.
 * @property {Number} options.minimum_input_length - minimum number of characters to start a search.
 * @property {Function} options.input_too_short_func - This method will be called when search text is less than minimum and returns a string.
 * @property {String} options.searching_text - placeholder text to be displayed while searching.
 * @property {String} options.error_loading_func - placeholder text to be displayed when error occurs.
 * @property {'element'|'<value>(valid css)'|'resolve'|'style'} options.width_auto - Used to set the style 
 * @property {Boolean} options.closeOnSelect - controls whether the dropdown is closed after the selection is made. 
 * @property {CallBack} options.templateResult - Refer {@link https://select2.org/dropdown#templating|here}
 * @property {CallBack} options.onOpenCallback - will be called when dropdown opens.
 * @property {CallBack} options.afterOpenCallback -  will be called after opening dropdown.
 * @property {CallBack} options.onCloseCallback - will be called when dropdown closes.
 * @property {JQueryAjax} optoins.ajax - Refer {@link https://select2.org/data-sources/ajax|here}
 * @example
 * thirdPartyUtils.bindSelect2('select')
 */

thirdPartyUtils.bindSelect2 = function (JElem, options) {

    setTimeout(function () {
        if (!JElem || !$(JElem).length) { return; }
        JElem = $(JElem);
        options = options || { };
        var popElement = $('#commonActionPage');
        var popContent = popElement.find('.pp-content'); //No I18N
        var disable_search_threshold = options.disable_search_threshold || 0;//No I18N
        var dropdownParent = options.dropdownParent || '';//No I18N
        var no_results_text = options.no_results_text || I18n.getMsg("crm.label.no.options.found");//No I18N
        var placeholder = options.placeholder_text_multiple || options.placeholder_text_single || I18n.getMsg('crm.label.picklist.none');//No I18N
        var direction = Crm.userDetails.RTL_ENABLED ? "rtl" : "ltr";//No I18N
        var isApprovePage = $("#commonSummary").length;//No I18N
        var maximumSelectionLength = options.maximumSelectionLength || '';//No I18N
        var maximum_result_text = options.maximum_result_text || I18n.getMsg("crm.chosen.maximum.option");//No I18N
        var minimumInputLength = options.minimumInputLength || options.minimumInputLength === 0 ? options.minimumInputLength : 1;
        var input_too_short_func = options.input_too_short_func || function (args) {
            return I18n.getMsg("crm.chosen.minimum.input.text", args.minimum - args.input.length);
        };
        var searching_text = options.searching_text || I18n.getMsg("crm.chosen.searching.text"); //No I18N
        var error_loading_text = options.error_loading_func || I18n.getMsg("crm.chosen.error.loading.text"); //No I18N
        // var dropdownCssClass = options["dropdown_css_class"] || ""; //No I18N
        var widthAuto = options.width_auto || ""; //No I18N
        var closeOnSelect = options.closeOnSelect;
        var JElemClosest_wf_chosen_ui = JElem.closest(".wf_chosen_ui"); //No I18N
        var JElemClosest_wf_chosen_ui_sltSetVal = JElemClosest_wf_chosen_ui.find(".sltSetVal");
        var bindCondition = [];
        // var i=0;
        JElem.each(function (i) {
            bindCondition[i] = isApprovePage === 0 ? $(this).css('display') !== "none" : $(this).is(':visible');//No I18N
        });
        // i=0;
        JElem.each(function (i) {
            //if( $(this).css('display') !== "none"){//No I18N
            //if( $(this).is(':visible')){//No I18N
            /*if($(this).hasClass('select2-hidden-accessible')){//No I18N
                return;
            }*/

            //			var bindCondition = isApprovePage===0 ? $(this).css('display') !== "none" : $(this).is(':visible');//No I18N
            if (bindCondition[i]) {

                var obj = {
                    "minimumResultsForSearch": disable_search_threshold,//No I18N 
                    "dir": direction,//No I18N
                    "dropdownParent": dropdownParent,//No I18N
                    "maximumSelectionLength": maximumSelectionLength,//No I18N
                    "language": {//No I18N
                        "noResults": function () {//No I18N
                            return no_results_text;
                        },
                        "maximumSelected": function () {//No I18N
                            return maximum_result_text;
                        }
                    },
                    "width": widthAuto //No i18n
                }
                var isMultipleAttr = $(this).attr('multiple');
                if (isMultipleAttr) {
                    obj.placeholder = placeholder//No I18N

                }
                var $thisSelect = $(this);
                var elemId = $(this).attr("id");//No i18n
                if (elemId != undefined && elemId.indexOf("ATTACHMENTID") !== -1) {
                    $(this).on("focus", function () {
                        $(this).parent().trigger('mouseover');
                        // var id = $(this).next().attr("id");
                        //						$( '#'+id+ '> li').on("keypress",function(ev){
                        //							alert(ev.keyCode);
                        //						});
                    });
                    $(this).on("blur", function () {
                        $(this).parent().trigger('mouseleave');
                    });
                    return;
                }
                if (options.ajax) {
                    obj.ajax = options.ajax;
                    obj.minimumInputLength = minimumInputLength;
                    if (closeOnSelect != undefined) {
                        obj.closeOnSelect = closeOnSelect;
                    }
                    obj.language.searching = function () { return searching_text; };
                    obj.language.errorLoading = function () { return error_loading_text; };
                    obj.language.inputTooShort = input_too_short_func;
                }
                if (options.templateResult) {
                    obj.templateResult = options.templateResult;
                }
                else if (elemId && elemId === "userDateFormat") //No i18n
                {
                    obj.templateResult = function renderOptionText(state) {
                        var original = state.element;

                        var result = '<span class="color_3  crm-font-bold mR5 breakWord">';//NO I18N
                        result += state.text;
                        result += '</span><span class="color_6 f12 dIB">(';//NO I18N
                        result += $(original).data('desp');//NO I18N
                        result += ')</span>';//NO I18N
                        return $(result);
                    }
                }
                else {
                    obj.templateResult = thirdPartyUtils.selectTempResult;
                }
                obj.templateSelection = $thisSelect.hasClass('ccPhoneNumber') ? CrmPhoneNumberInput.countryCodeSelect : thirdPartyUtils.selectEmptyVal;	//NO I18n
                obj.matcher = renderingUtils.matchStart;

                obj.escapeMarkup = function (m) { return m; }
                var parentId = $(this).parent().parent().parent().parent().attr('id'); //No I18N
                if (parentId === "searchcriteria0") { //No I18N
                    return;
                }
                $(this).select2(obj);

                /*$(this).next(".select2").on("click",function(){//No I18N
                    setTimeout(function(){
                    $('#listViewTable').perfectScrollbar({wheelSpeed: 30,wheelPropagation: true});
                        $(".select2-results").addClass("oH pR").perfectScrollbar({wheelSpeed: 30,wheelPropagation: true,suppressScrollX: false});
                    },3000);
                });*/
                if (isMultipleAttr) {
                    var searchfieldElem = $(this).next(".select2").find(".select2-search__field");
                    searchfieldElem.on("focus", function () {//No I18N
                        var selTwo = $(this).closest(".select2");
                        var closestTd = selTwo.closest("td"); //No i18N
                        var selTwo_labelValCreate = selTwo.closest(".labelValCreate");//No I18N
                        if (selTwo_labelValCreate.length) {
                            selTwo_labelValCreate.addClass("focusEleField");//No I18N
                        }
                        else if (selTwo.closest(".labelValTwo").length) {
                            selTwo.closest(".tabDiv").addClass("focusEleField");//No I18N
                        } else if (closestTd.length) {//No I18N
                            $('.wf_setFocus').removeClass('wf_setFocus');
                            closestTd.addClass("wf_setFocus");//No I18N
                        }
                    });
                    searchfieldElem.on("blur", function () {//No I18N
                        var selTwo = $(this).closest(".select2");
                        var closestTd = selTwo.closest("td"); //No i18N
                        var selTwo_labelValCreate = selTwo.closest(".labelValCreate");//No I18N
                        if (selTwo_labelValCreate.length) {
                            selTwo_labelValCreate.removeClass("focusEleField");//No I18N
                        }
                        else if (selTwo.closest(".labelValTwo").length) {
                            selTwo.closest(".tabDiv").removeClass("focusEleField");//No I18N
                        } else if (closestTd.length) {//No I18N
                            var elementFocus = $('.select2-container--open').eq(0);
                            var focusEle = elementFocus;
                            if (focusEle.length === 0) {
                                closestTd.removeClass("wf_setFocus");//No I18N
                            }
                        }
                    });
                }
                else {
                    var selectionElem = $(this).next(".select2").find(".select2-selection");
                    selectionElem.on("focus", function () {//No I18N	
                        var el = $(this);
                        //$(this).keypress(Utils.select2keydownHandler);
                        var selTwo = el.closest(".select2"); //No i18N
                        var closestTd = selTwo.closest("td"); //No i18N
                        el.on("keydown", function (event) {
                            if (event.keyCode == 40) {
                                $(this).trigger("click");
                                event.preventDefault();
                            }
                        });

                        //$(this).on("keydown", openDD);
                        var selTwo_labelValCreate = selTwo.closest(".labelValCreate"); //No I18N
                        if (selTwo_labelValCreate.length) {
                            $('.labelValCreate').removeClass('focusEleField');
                            selTwo_labelValCreate.addClass("focusEleField");//No I18N
                        }
                        else if (selTwo.closest(".labelValTwo").length) {
                            selTwo.closest(".tabDiv").addClass("focusEleField");//No I18N
                        } else if (closestTd.length) {//No I18N
                            $('.wf_setFocus').removeClass('wf_setFocus');
                            closestTd.addClass("wf_setFocus");//No I18N
                        }
                        if (selTwo.closest("crm-phone-field").length > 0) {
                            selTwo.closest("tr.topband_dv_row").addClass('txtFldFocusedRow');	//NO I18n
                            selTwo.closest("crm-create-subformfields").length > 0 && selTwo.closest(".crm_phone_field").addClass('LyteSForm_focus') && selTwo.closest("lyte-tr").addClass('selectedSubformRow');	//NO I18n
                        }
                    });
                    selectionElem.on("blur", function () {//No I18N
                        var el = $(this);
                        var selTwo = el.closest(".select2");//No i18N
                        var closestTd = selTwo.closest("td"); //No i18N
                        el.off("keydown", function (event) {//No i18N
                            if (event.keyCode == 40) {
                                $(this).trigger("click");
                                event.preventDefault();
                            }
                        });
                        var selTwo_labelValCreate = selTwo.closest(".labelValCreate"); //No I18N
                        if (selTwo_labelValCreate.length) {
                            var dropdownOpenVisible = $('.select2-container--open').length;
                            if (dropdownOpenVisible <= 0) {
                                selTwo_labelValCreate.removeClass("focusEleField");//No I18N
                            }
                        }
                        else if (selTwo.closest(".labelValTwo").length) {
                            selTwo.closest(".tabDiv").removeClass("focusEleField");//No I18N
                        } else if (closestTd.length) {//No I18N
                            var elementFocus = $('.select2-container--open').eq(0);
                            var focusEle = elementFocus;
                            if (focusEle.length === 0) {
                                closestTd.removeClass("wf_setFocus");//No I18N
                            }
                        }
                        selTwo.closest("crm-phone-field").length > 0 && selTwo.closest("crm-create-subformfields").length > 0 && selTwo.closest(".crm_phone_field").removeClass('LyteSForm_focus') && selTwo.closest("lyte-tr").removeClass('selectedSubformRow'); 	//NO I18n

                    });
                    // function openDD(event){
                    // 	if(event.keyCode == 40){
                    // 		$(this).closest(".tabDivCreate").trigger("click");
                    // 		event.preventDefault();
                    // 	}
                    // }
                }
                //				$(".select2-selection__rendered").attr("title","");//No I18N
                $(this).next('span.select2.select2-container.select2-container--default').attr("data-zcqa", $(this).attr('data-zcqa'));//No I18N
                $(this).off('select2:opening');
                $(this).on('select2:opening', function (e) {
                    var selectObj = $(this);
                    if ($('#analyticalPageContainer').length === 1 || $('#createDashboardPanel').length === 1) {
                        AnalyticsChart.freezePopScroll(selectObj);
                    }
                    if ($('#commonActionPage').hasClass('showPpTop')) {
                        $('#commonActionPage .pp-content').css('overflow', 'hidden');
                    }
                    if (selectObj.hasClass('ccPhoneNumber')) {
                        var node = $L('crm-create-fields')[0]; //no i18n
                        if (node) {
                            node.component.processLayoutRules(node);
                        }
                        if (!selectObj.is(':visible')) {/* eslint-disable-line webperf/layout-thrashing */
                            return false;
                        }
                        // temp fix - added inorder to scroll to the selected value
                        selectObj.data('select2').dataAdapter.query('', function (data) { //No I18N
                            selectObj.data('select2').trigger('results:all', //No I18N
                                {
                                    data: data,
                                    query: ''
                                }
                            )
                        }
                        )
                    }
                    if (!selectObj.hasClass('dataPopulated') && selectObj.hasClass('ccPhoneNumber')) {
                        sE(e);
                        CrmPhoneNumberInput.populatePhoneNumberCountryCodes(selectObj);
                        return false;
                    }
                    if (!selectObj.hasClass('dataPopulated') && (selectObj.data('values') || selectObj.data('mapval'))) {
                        sE(e);
                        populatePicklist(selectObj);
                        return false;
                    }
                    //eslint-disable-next-line webperf/layout-thrashing 
                    else if ($(".select2-selection__rendered").height() < 300) {//No I18N
                        var layoutConvLanding = $('#layout_landing_right');
                        var getScrollBarWidthValue = renderingUtils.windowHeight >= $(document).height() ? 0 : renderingUtils.getScrollBarWidthValue;//eslint-disable-line webperf/layout-thrashing
                        $('html,#setup_new_ContentDiv').css({ "overflow": "hidden", "margin-right": getScrollBarWidthValue });//No I18N
                        var quickPopup = $('#searchCreateDiv').find('.popup-model-content');
                        if (quickPopup.is(':visible')) {//eslint-disable-line webperf/layout-thrashing
                            setTimeout(function () {
                                quickPopup.addClass('oHimp');
                            }, 200);
                        }
                        var mmCriteriaContainer = $('.mmCriteriaContainer');
                        if (mmCriteriaContainer.is(":visible")) {//eslint-disable-line webperf/layout-thrashing
                            mmCriteriaContainer.css({ "overflow": "hidden" });//No I18N
                        }
                        if (layoutConvLanding.is(":visible")) {//eslint-disable-line webperf/layout-thrashing
                            layoutConvLanding.addClass('oH');//No I18N	                                                  }
                        }
                    }

                    // var selObj = $(this);
                    setTimeout(function () {
                        // if( $('.select2-results__option').length < 10 ){//No I18N
                        // 		$('.select2-container--open').find('.select2-search--dropdown').css({"height":"0px","overflow":"hidden"});//No I18N
                        //   }
                        var openedSelect2Container = $('body > .select2-container--open');
                        openedSelect2Container.on('click', function () { sE(event) });//No I18N
                        var select2resultsWidth = $('body > .select2-container--open .select2-results').width(); //No I18N
                        if (openedSelect2Container.length && (openedSelect2Container.offset().left + select2resultsWidth) > renderingUtils.windowWidth) {
                            openedSelect2Container.css({ "left": "auto", "right": select2resultsWidth + 30 });//No I18N
                            // setTimeout(function(){
                            //  openedSelect2Container.css({"left":"auto"});//No I18N
                            //  },10);
                        }
                        if ($('.select2-results__option').length < 10) {//No I18N
                            $('.select2-container--open').find('.select2-search--dropdown').css({ "height": "0px", "overflow": "hidden" });//No I18N
                        }

                    }, 10);
                    //Customization starts
                    if (options.onOpenCallback) {
                        Lyte.registeredMixins["crm-utilities"].executeFunctionByName(options.onOpenCallback, window, selectObj);//No I18N
                        //					  options.onOpenCallback($(this));
                    }
                    setTimeout(function () {
                        var elementFocus = $('.select2-container--open').eq(0);
                        var focusEle = elementFocus;
                        focusEle.closest('td').addClass('wf_setFocus');//No i18N
                        focusEle.closest("crm-phone-field").length > 0 && focusEle.closest("crm-create-subformfields").length > 0 && focusEle.closest(".crm_phone_field").addClass('LyteSForm_focus') && focusEle.closest("lyte-tr").addClass('selectedSubformRow'); 	//NO I18n
                    }, 50);
                    //Customization ends
                });
                if (options.afterOpenCallback) {
                    $(this).off('select2:open').on('select2:open', function () {
                        Lyte.registeredMixins["crm-utilities"].executeFunctionByName(options.afterOpenCallback, window, $(this));//No I18N
                        //Set focus for select2
                        var elementFocus = $('.select2-container--open').eq(0);
                        var focusEle = elementFocus;
                        focusEle.closest('.labelValCreate').addClass('focusEleField');//No i18N
                        focusEle.closest('td').addClass('wf_setFocus');//No i18N
                    });
                }
                if (closeOnSelect !== false && isMultipleAttr) {
                    $(this).on("select2:select", function () {//No I18N
                        $(this).select2("open");//No I18N
                    });
                }
                //				$(this).off('select2:open').on('select2:open', function () {
                //				  //Set focus for select2 on td container only
                //				  if($(this).closest('td').length){
                //					  var elementFocus = $('.select2-container--open')[0];
                //					  var focusEle = $(elementFocus);
                //					  focusEle.closest('td').addClass('wf_setFocus');//No i18N
                //				  }
                //				});
                $(this).on('select2:close', function () {//No I18N
                    var layoutConvLanding = $('#layout_landing_right');
                    $('html,#setup_new_ContentDiv').css({ "overflow": "", "margin-right": "" });//No I18N
                    var quickPopup = $('#searchCreateDiv').find('.popup-model-content');
                    if (quickPopup.is(':visible')) {//eslint-disable-line webperf/layout-thrashing
                        quickPopup.removeClass('oHimp');
                    }
                    $('.select2-container--open').find('.select2-search--dropdown').css({ "height": "", "overflow": "" });//No I18N
                    // var divs=['#dvinner','.formcontainer','#setup_new_ContentDiv']; // No I18n
                    var mmCriteriaContainer = $('.mmCriteriaContainer');
                    if (mmCriteriaContainer.is(":visible")) {//eslint-disable-line webperf/layout-thrashing

                        mmCriteriaContainer.css({ "overflow": "auto" });//No I18N
                    }
                    if (layoutConvLanding.is(":visible")) {//eslint-disable-line webperf/layout-thrashing
                        layoutConvLanding.removeClass('oH');//No I18N 
                    }
                    //renderingUtils.checkOverflowInnerContainer(divs,0,0); // params divs for element list , 0 - > first index , 0/1 -> close/Open Flag
                    //Customization starts
                    if (options.onCloseCallback) {
                        //console.log("onclose" , e);
                        options.onCloseCallback($(this));
                    }
                    //Customization ends  
                });
                $(this).on('select2:closing', function () {
                    if ($('#analyticalPageContainer').length === 1 || $('#createDashboardPanel').length === 1) {
                        var selectObj = $(this);
                        AnalyticsChart.rm_freezePopScroll(selectObj);
                    }

                    var selectOpenElem = $('.select2-container--open');
                    var elementFocus = selectOpenElem.eq(0);
                    var selectOpenLength = selectOpenElem.length;
                    var popElement1 = popElement;
                    var popContent1 = popContent;
                    elementFocus.closest('.labelValCreate').removeClass('focusEleField'); //No i18N
                    elementFocus.closest('td').removeClass('wf_setFocus');//No i18N
                    if (popElement1.hasClass('showPpTop')) {
                        if (selectOpenLength > 2) {
                            popContent1.css('overflow', 'hidden'); //No I18N		
                        }
                        else {
                            popContent1.css('overflow', 'auto'); //No I18N		
                        }
                    }
                });
                if (JElemClosest_wf_chosen_ui && JElemClosest_wf_chosen_ui_sltSetVal.length > 0) {
                    JElemClosest_wf_chosen_ui_sltSetVal.on('click', function () {//No I18N
                        $(this).next("select").select2("open");//No I18N
                    })
                }
            }
            // i++;
        });

        var select2rendered = $(".select2-selection__rendered");
        select2rendered.attr("title", "");//No I18N

        var selectedOption = JElem.find('option:selected');
        if (selectedOption.length > 0) {
            select2rendered.attr("title", selectedOption.text());//No I18N
        }

        var reportingSelect = $('#reportingSelect');
        var addUserReporting = $('#addUserReporting');
        if (reportingSelect.length > 0 || addUserReporting.length > 0 || $('#roleChangePopUp').length > 0 || $('#branchChangePopup').length > 0) {
            $('#userDD,#userReportingDD,#subUserDD').add(reportingSelect).add(addUserReporting).select2({
                templateResult: formatState,
                templateSelection: formatState
            });
        }
        JElem = null;
    }, 1);
}
/**
 * This method is used to destroy Select2 plugin on the given element.
 * @param {jQueryElement} JElem - This provides the jQueryElement from which Select2 plugin has to be destroyed. 
 */
thirdPartyUtils.unbindSelect2 = function (JElem) {
    if (!JElem || !$(JElem).length) { return; }
    JElem = $(JElem);
    JElem.select2('destroy'); //No I18N
    JElem.closest(".wf_chosen_ui").find(".sltSetVal").off('click');//NO i18N
}

/**
 * This method is used to enable tooltip only when content is displayed with ellipsis.
 * @param {HTMLElement} obj - This provides the HTMLElement on which the toolTip is to be enabled. 
 */

thirdPartyUtils.titleForEllipsis = function (obj) {
    $(obj).off('mouseenter').on('mouseenter', function () {
        var $this = $(this);
        $this.removeAttr('title');//NO I18N
        if (this.offsetWidth < Math.floor(this.scrollWidth) && this.offsetWidth != Math.floor(this.scrollWidth)) {
            if ($this.prop("tagName") === "INPUT") {
                $this.attr('title', $.trim($this.val())); //NO i18N
            } else {
                $this.attr('title', $.trim($this.text())); //NO i18N
            }

        }
    });
}

/**
 * This method is used to  
 * @param {*} obj - 
 * @param {} showTooltip - 
 */

//thirdPartyUtils.setTitleforEllipsis = function(obj, showTooltip){
//	var $this = $(obj);
//    //$(obj).removeAttr('title');
//    $this.removeAttr('title');//NO I18N
//	if(obj.offsetWidth <  Math.floor(obj.scrollWidth) && obj.offsetWidth !== Math.floor(obj.scrollWidth)){
//		if(showTooltip)
//		{
//			$this.off('mouseenter').on('mouseenter', function(){//NO I18N
//				var $this = $(obj);
//				crmui.showTooltip($.trim($this.text()), false , 'center', this);//NO I18N
//			});
//		}
//		else
//		{
//		$this.attr('title', $.trim($this.text())); //NO i18N
//	}
//}
//}


thirdPartyUtils.bindTableScroll = function () {
    var orgTable = $('#listViewTable');
    var tabCont = orgTable.parent();
    thirdPartyUtils.tabContLeftPos = orgTable.outerWidth() - tabCont.outerWidth();
    if (tabCont.scrollLeft() == 0) {
        $('#fixedRowHeader').hide();
    }
    tabCont.scroll(function () {
        var orgTable = $('#listViewTable');
        var tabCont = orgTable.parent();
        var tabContTop = tabCont.scrollTop();
        var tabContLeft = tabCont.scrollLeft();
        var fixedHeaderColumn = $(".fixedheadercolumn");
        var fixedRowHeaderElem = $('#fixedRowHeader');
        var fixedRowHeaderTableElem = $('#fixedRowHeaderTable');
        var fixedHeaderTableElem = $('#fixedHeaderTable');
        var fixedHeaderElem = $('#fixedHeader');
        var listviewtablescrollElemscrollLeft = $('#listviewtablescroll').scrollLeft();
        if (Crm.userDetails.RTL_ENABLED) {
            thirdPartyUtils.scrollLeftpos = thirdPartyUtils.scrollLeftpos + renderingUtils.windowWidth - Utils.lvLeftFilterWidth.replace('px', '') + 1;
            if ($('.firefox').length > 0) {
                thirdPartyUtils.scrollLeftpos = Math.abs(listviewtablescrollElemscrollLeft);
                if (thirdPartyUtils.scrollLeftpos != 0) {
                    fixedHeaderColumn.show();
                    fixedRowHeaderElem.show();
                    fixedHeaderColumn.addClass('boxShadowFixedColunm');//No i18N
                    fixedRowHeaderTableElem.css({ 'top': -1 * tabContTop });//No i18N
                    //	        		fixedHeaderTableElem.css({'right': -1*Math.abs(thirdPartyUtils.tabContLeftPos-Math.abs(listviewtablescrollElem.scrollLeft()))});//No i18N
                    orgTable.addClass('ls');
                }
                else {
                    fixedRowHeaderElem.hide();
                    orgTable.removeClass('ls');
                    fixedHeaderColumn.removeClass('boxShadowFixedColunm');
                    //		            fixedHeaderTableElem.css({'right': -1*Math.abs(thirdPartyUtils.tabContLeftPos-Math.abs(listviewtablescrollElem.scrollLeft()))});//No i18N
                }
                fixedHeaderTableElem.css({ 'right': -Math.abs(listviewtablescrollElemscrollLeft) });//No i18N
            }
            else if (thirdPartyUtils.scrollLeftpos != fixedHeaderElem.outerWidth()) {
                fixedHeaderColumn.show();
                fixedRowHeaderElem.show();
                fixedHeaderColumn.addClass('boxShadowFixedColunm');
                fixedRowHeaderTableElem.css({ 'top': -1 * tabContTop });//No i18N
                fixedHeaderTableElem.css({ 'right': -1 * Math.abs(thirdPartyUtils.tabContLeftPos - Math.abs(listviewtablescrollElemscrollLeft)) });//No i18N
                orgTable.addClass('ls');
            }
            else {
                fixedRowHeaderElem.hide();
                orgTable.removeClass('ls');
                fixedHeaderColumn.removeClass('boxShadowFixedColunm');
                fixedHeaderTableElem.css({ 'right': -1 * Math.abs(thirdPartyUtils.tabContLeftPos - Math.abs(listviewtablescrollElemscrollLeft)) });//No i18N
            }
            if (tabContTop > 0) {
                fixedHeaderElem.show();
            }
        }
        else {
            if (tabContTop > 0) {
                fixedHeaderElem.show();
                fixedHeaderTableElem.css({ 'left': -1 * tabContLeft - 1 });//No i18N
            }
            else {
                fixedHeaderElem.hide();
            }
            if (tabContLeft > 0) {
                fixedHeaderColumn.show();
                fixedRowHeaderElem.show();
                fixedHeaderColumn.addClass('boxShadowFixedColunm');
                var topPos = -1 * tabContTop;
                fixedRowHeaderTableElem.css({ 'top': topPos });//No i18N
                orgTable.addClass('ls');
            }
            else {
                fixedRowHeaderElem.hide();
                orgTable.removeClass('ls');
                fixedHeaderColumn.removeClass('boxShadowFixedColunm');
            }
        }
        var sortDiv = $('#sort_div');
        if (sortDiv.length && sortDiv.css('display') === 'block') {//eslint-disable-line webperf/layout-thrashing
            sortDiv.hide();
        }
    });
}

/**
 * Select2 Hitting backspace on multi-select converts element to text Overwrite method
 */

thirdPartyUtils.select2HandleBackspace = function () {
    $.fn.select2.amd.require(['select2/selection/search'], function (Search) {//No I18N
        if (this.$element && this.$element.data('removeElement')) {
            this.trigger('unselect', {//No I18N
                data: arguments[1] //eslint-disable-line zstandard/no-reserved-words
            })
            return;
        }
        var oldRemoveChoice = Search.prototype.searchRemoveChoice;

        Search.prototype.searchRemoveChoice = function () {
            oldRemoveChoice.apply(this, arguments); //eslint-disable-line zstandard/no-reserved-words
            this.$search.val('');
            this.handleSearch();
        };
    });
}

/**
 * This method is used to remove the Hover in Select2 field 
 * @param {Event} event - This provides the event target happening in the HTMLElement`
 * @param {HTMLElement} element - This provides the HTMLElement in which the hover occurs 
 */

thirdPartyUtils.removeSelect2Hover = function (event, element) {
    var _this = $(element);
    _this.closest('.select2-results').find('li').removeClass('select2-results__option--highlighted'); //No i18n
}

/**
 * This method is used to close the Select2 field used for the dropdown 
 * @param {String} id - This provides the id of the Select2  
 */

thirdPartyUtils.closeSelect2 = function (id) {
    if (id) {
        $('#' + id).select2("close");
    }
};

/**
 * Function will load crazyEgg related js files.  
 *@example thirdPartyUtils.loadCrazyEgg()
 **/
/*
thirdPartyUtils.loadCrazyEgg = function(){//no i18n
    setTimeout(thirdPartyUtils.appendCrazy(), 1);
}*/

/**
 * Function will create a script node , will set the src for crazy egg js and append the same in dom. 
 *
 **/
/*
thirdPartyUtils.appendCrazy = function( ) { // eslint-disable-line no-empty-function	
}*/

// $Id$
/**
 * @namespace
 */
var objectUtils = { };


/**
  * Retrieve all the names of the **object** 's own and inherited (optional) properties.
 * @param {Object} jsonObj - This provides the Object from which keys are to be retrieved 
 * @returns {Array} - It returns all the keys of the Object's own and inherited (optional) properties as an array
 * @example
 * var stooges = {one: 1, two: 2, three: 3}
 * Object.prototype.name = "Moe"
 * objectUtils.getKeys(stooges);
 * => ["one", "two", "three"]
 */

objectUtils.getKeys = function (jsonObj) {
    var keys = [];
    if (!jsonObj) {
        return keys;
    }
    if (!Object.keys) {
        for (var i in jsonObj) {
            if (jsonObj.hasOwnProperty(i)) {
                keys.push(i);
            }
        }
    } else {
        keys = Object.keys(jsonObj);
    }

    return keys;
}

/**
 * Similar to `Array.prototype.findIndex` but for keys in objects. Returns the first *key* where the **predicate**  truth test passes or *undefined*. **predicate**  is transformed through **iteratee** to facilitate shorthand syntaxes.
 * @param {Object} object -  This provides the object from which the specified key has to be matched
 * @param {String|undefined} value - This provides the value whose corresponding key has to be searched within the passed in Object.
 * @returns {String} - This returns the first key of the object that passes the predicate function or returns the key of corresponding value passed.
 * @example
 * objectUtils.findKey({name:"moe",age:22},"moe");
 * => "name"
 */

objectUtils.findKey = function (object, value) {
    var key = Object.keys(object).filter(function (key) { return object[key] === value })[0];
    return key;
}
/**
 * This method is used to parse the query string and get the query params and its corresponding values.
 * @param {String} URLParamString - This provides the query string that is to be splitted based on its query params and returned as an object. 
 * @returns {Object} - It returns a key/value pair with query params and its corresponding values. 
 * @example
 * objectUtils.parseURLParamString("action=getAllData&module=Leads&id=3555310000000185247&fromIndex=1")
 * => {action : "getAllData", module : "Leads", id : "3555310000000185247", fromIndex : "1"}
 */

objectUtils.parseURLParamString = function (URLParamString) {
    var params = { }, queries, temp, i, l;
    queries = URLParamString.split('&');
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }
    return params;
}

/**
 * This Method is used to get the query param and its corresponding values from the passed-in URL
 * @param {String} url - This provides the whole URL from which the query params and its corresponding values are to be retrieved.
 * @returns {Object} - It returns a key/value pair with query params and its corresponding values.
 * @example
 * var obj = objectUtils.URL("https://google.com/org675566061/NewRelatedList.do?action=getAllData&module=Leads&id=3555310000000185247&fromIndex=1")
 * obj.getParams();
 * => {action : "getAllData", module : "Leads", id : "3555310000000185247", fromIndex : "1"}
 */// NO I18N

objectUtils.URL = function (url) {//No I18N
    var paramObj = { }, params = [];
    var paramsArr = (params = url.split("?")[1]) ? params.split("&") : [];
    return {
        getParams: function () {
            for (var param in paramsArr) {
                if (paramsArr.hasOwnProperty(param)) {
                    var sParam = paramsArr[param].split('=');
                    paramObj[sParam[0]] = decodeURIComponent((sParam[1] || "").replace(/\+/g, ' '));
                }
            }
            return paramObj;
        }
    };
}

/**
 * This method provides a deep copy of the given object i.e, all the properties of the passed-in object is duplicated rather than referencing over to a new object, and is returned. Any nested objects or arrays will also be duplicated. 
 * @param {Object} Obj - This provides the object that is to be duplicated
 * @returns {Object} - It returns an new object which is exact copy of the passed-in object.
 * @example
 * objectUtils.cloneObject({action : "getAllData", module : "Leads", id : "3555310000000185247", fromIndex : "1"})
 * => {action: "getAllData", module: "Leads", id: "3555310000000185247", fromIndex: "1"}
 */

objectUtils.cloneObject = function (Obj) {//No I18N
    /* Will do a deep copy of the given format Object.*/
    var newObj = { };
    for (var key in Obj) {
        var val = Obj[key];
        if (jQuery.isPlainObject(val)) {
            //if the value is one obj we have to clone that obj also.
            val = this.cloneObject(val);
        } else if (jQuery.isArray(val)) {
            var tempClone = [];
            var len = val.length;
            for (var j = 0; j < len; j++) {
                if (jQuery.isPlainObject(val[j])) {
                    tempClone.push(this.cloneObject(val[j]));
                } else {
                    tempClone.push(val[j]);
                }
            }
            val = tempClone;
        }
        newObj[key] = val;
    }
    return newObj;
}

/**
 * This method is used to clone the passed-in argument either using the object's own method or Using the deepClone method to clone it deeply that is cloning including the nested parameters.
 * @param {Object} value - This provides the object that has to be cloned either using the own method or deepClone method.
 * @returns {Object} - It returns the cloned object either a deep or shallow copy.
 * @example
 * //Refer examples of deepClone and cloneObject 
 */

objectUtils.cloneObject_new = function (value) { // NO I18N
    return value && typeof value.clone === 'function' ? value.clone() : objectUtils.deepClone(value, [], [], true); // NO I18N
}

/**
 * This method is used to remove the specified key from the object and return the object.
 * @param {Object} givenObj - This provides the Object from which the property has to be removed.
 * @param {String} key - This provides the property that is to be removed from the object.
 * @returns {Object} - It returns the same Object after removing the property from the Object.
 * @example
 * objectUtils.removeKeyFromGivenObj({ module : "Leads", id : "3555310000000185247"},"module")
 * =>  {id : "3555310000000185247"}
 */

objectUtils.removeKeyFromGivenObj = function (givenObj, key) {
    if (givenObj.hasOwnProperty(key)) {
        delete givenObj[key];
    }
    return givenObj;
}

/**
 * This method is used to add key/value pair to the Object and then return that Object
 * @param {Object} givenObj - This provides the Object to which the key/value pair has to be added.
 * @param {String} key- This provides the new key that has to be added to the Object.
 * @param {String} value - This provides the corresponding value that has to be added to the Object.
 * @returns {Object} - It returns the Object after adding the specified key/value pair.
 * @example
 * objectUtils.addKeyToGivenObj({id : "3555310000000185247"},"module","Leads")
 * => { module : "Leads", id : "3555310000000185247"}
 */

objectUtils.addKeyToGivenObj = function (givenObj, key, value) {
    if (!givenObj.hasOwnProperty(key)) {
        givenObj[key] = value;
    }
    return givenObj;
}

/**
 * This method is used to get the length of the passed-in object
 * @param {Object} obj - This provides the object whose length has to be determined
 * @returns {Number} - It returns the length of the passed-in Object.
 * @example
 * objectUtils.getLength({{one: 1, two: 2, three: 3}})
 * => 3
 */

objectUtils.getLength = function (obj) {
    return objectUtils.getKeys(obj).length;

};

/**
 * This method is used to convert an array to a map i.e, it is an object with unique properties.
 * @param {Array} array - This provides the array that is to be converted into a map. 
 * @returns {Object} - It returns a map with every value as true for every key in the array.
 * @example
 * objectUtils.convertArrayToMap([1,2,3,4])
 * => {1:true, 2:true, 3:true, 4:true} 
 */

objectUtils.convertArrayToMap = function (array) {
    var json = { };
    array.forEach(function (eachObj) { json[eachObj] = true; });
    return json;
}

/**
 * This method is used to change the value of one Object as the Key of another Object.
 * @param {Object} json - This provides the Object whose key has to be changed
 * @param {Object} keyMap - This provides the Object whose value is to be converted as key to another Object. 
 * @example
 * objectUtils.convertKeys({Id: "1766090000000335045", Name: "sa"},{Id: "id", Name: "name", Type: "type"})
 * => {id: "1766090000000335045", name: "sa"}
 */

objectUtils.convertKeys = function (json, keyMap) {
    for (var key in keyMap) {
        var alterKey = keyMap[key];
        var value = json[key];
        if (key != alterKey && typeof value != "undefined") {
            json[alterKey] = value;
            delete json[key];
        }
    }
}

/**
 * This method is used to get the value of the object on providing the keys or array of keys i.e, in case of array of keys it works only for nested structure. 
 * @param {Object} json - This provides the Object from which the Value has to be determined 
 * @param {Array} keys - This provides the Object's key to find its corresponding value.
 * @returns {String} - It returns the corresponding value of the passed-in object and key.
 * @example
 * objectUtils.getValueFromObj({ module : "Leads", id : "3555310000000185247"},"module")
 * => Leads
 * objectUtils.getValueFromObj({a:{b:{c:{d:"crm"}}}},["a","b","c"])
 * => {d:"crm"}
 */

objectUtils.getValueFromObj = function (json, keys) {
    if (json) {
        if (Array.isArray(keys)) {
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                if (json) {
                    json = json[keys[i]]
                }
                else {
                    return;
                }
            }
            return json;
        }
        else {
            return json[keys];
        }
    }
}

/**
 * This method is used to construct a query string from the passed-in object i.e, convert a json to query param with its corresponding value and constructing a query string. 
 * @param {Object} obj - This provides the json which is used to construct the query String.
 * @returns {String} - It returns a Query String from the passed-in key/value pairs.
 * @example
 * objectUtils.jsonToQueryParam({ module : "Leads", id : "3555310000000185247"})
 * => "module=Leads&id=3555310000000185247"  
 */

objectUtils.jsonToQueryParam = function (obj) {
    if (typeof obj === "object") {
        return Object.keys(obj).map(function (key) {
            return key + "=" + obj[key];
        }).join("&");
    }
    return "";
}


/**
 * This method will search for passed-in key/value pair in the passed-in jsonArray.
 * @param {Array} jsonArray- This provides a list of objects within an array from which the corresponding key/value pair is to be found.
 * @param {String} key - This provides the key that is to be searched within the jsonArray.
 * @param {String} value - This provides the value that is to be searched with in the jsonArray with the corresponding key.
 * @returns {Object} - It returns a JSON object that contains the key/value pair found within the passed-in jsonArray.
 * @example
 * var jsonArray = [{ name: 'value1', age: 10},{ name: 'value2', age: 11},{ name: 'value3', age: 12}]
 * objectUtils.getMatchedObject(jsonArray,"name","value2");
 * =>{name: 'value2', age: 11}
 */

objectUtils.getMatchedObject = function (jsonArray, key, value) {
    var matchedJSON;
    jsonArray.every(function (json) {
        if (json[key] === value) {
            matchedJSON = json;
            return false;
        }
        return true;
    })
    return matchedJSON;
}

/**
 * This method will return the key corresponding to the value that is passed-in.
 * @param {Object} json- This provides a object from which the corresponding key of passed in value hss to be found.
 * @param {String} value - This provides the value for which the corresponding key is to be searched.
 * @example
 * var json = {'key1' : 'value1','key2' : 'value2','key3' : 'value3','key4' : 'value4'}
 * var op = objectUtils.getMatchedKey(json, 'value2');
 * => key2
 * var op = objectUtils.getMatchedKey(json, 'value5');
 * => undefined
 */

objectUtils.getMatchedKey = function (json, value) {
    for (var key in json) {
        if (json[key] === value) {
            return key;
        }
    }
}
/**
 * This method is used to get a deep copy of the object that is been passed to this method. Any nested objects or arrays would also will be equally copied deeply. Note that this method would return a copy of the object rather than providing a reference.
 * @param {Object} value - This argument provides the object whose deep copy has to be returned.
 * @param {Array} refFrom - This provides the objects/nested value from which the data has to be copied.
 * @param {Array} refTo - This provides the destination object to which the object has to be copied. 
 * @param {Boolean} deep - This provides Whether or not to perform deep cloning.
 * @return {Object} - It returns the shallow copy or deep copy the passed in object.
 * @example
 * var obj = {"id": "0001","type": "donut","name": "Cake","ppu": 0.55,"batters":{"batter":[{ "id": "1001", "type": "Regular" },{ "id": "1002", "type": "Chocolate" },{ "id": "1003", "type": "Blueberry" },{"id": "1004", "type": "Devil's Food" }]}}
 * objectUtils.deepClone(obj,[],[],true)
 * => returns the exact copy
 */

objectUtils.deepClone = function (value, refFrom, refTo, deep) {
    if (value && typeof value.clone === 'function') {
        return value.clone();
    }
    var valueType = objectUtils.typeOf(value);
    var copy = function (copiedValue) {
        var len = refFrom.length;
        var idx = 0;
        while (idx < len) {
            if (value === refFrom[idx]) {
                return refTo[idx];
            }
            idx += 1;
        }
        refFrom[idx + 1] = value;
        refTo[idx + 1] = copiedValue;
        if (valueType === "Array") {
            value.forEach(function (eachValue) {
                copiedValue.push(deep ? objectUtils.deepClone(eachValue, refFrom, refTo, true) : eachValue);
            })
        } else {
            for (var key in value) {
                copiedValue[key] = deep ? objectUtils.deepClone(value[key], refFrom, refTo, true) : value[key];
            }
        }

        return copiedValue;
    }
    if (valueType === "Object") {
        return copy({ });
    } else if (valueType === "Array") {
        return copy([]);
    } else if (valueType === "Date") {
        return new Date(value.valueOf());
    } else if (valueType === "RegExp") {
        return objectUtils.cloneRegExp(value);
    } else if (/^HTML.*Element$/.test(valueType)) {
        return value.cloneNode();
    } else {
        return value;
    }
}

/**
 * This method is used to clone variable of type regular expression which is used in deepClone method
 * @param  {String} pattern - This provides the RegExp pattern from the object values which are copied and are returned back.
 * @return {Object} - It returns the pattern as RegExp. That is an exact copy.
 * @example
 * var pattern = new RegExp('(.*) are (.*?) .*')
 * objectUtils.cloneRegExp(pattern)
 * => /(.*) are (.*?) .* /
 */

objectUtils.cloneRegExp = function (pattern) {
    return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
}

/**
 * This method is used to find the type of the argument that is getting passed. Note that the type is returned with first Letter Capitalized.
 * @param {Any} val - This provides the variable whose type has to be determined.
 * @returns {String} It returns the type of the argument as a string. 
 * @example
 * objectUtils.typeOf({name:'Moe'})
 * => "Object"
 * objectUtils.typeOf("Moe")
 * => "String"
 */

objectUtils.typeOf = function (val) {
    return val == null ? 'Null' : val == undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1); // NO I18N
}

// $Id$

/**
 * @namespace
 */

var renderingUtils = {
    fieldsJSONArray: []
};
$(document).ready(function () {// eslint-disable-line 	zstandard/no-body-events
    renderingUtils.windowHeight = $(window).height(); // eslint-disable-line zohocrm/no-window-dimensions
    renderingUtils.windowWidth = $(window).width(); // eslint-disable-line zohocrm/no-window-dimensions
    renderingUtils.windowOuterHeight = $(window).outerHeight();// eslint-disable-line zohocrm/no-window-dimensions
    renderingUtils.windowOuterWidth = $(window).outerWidth();// eslint-disable-line zohocrm/no-window-dimensions
});

/**
 * This method is used to get the target Element in which the event has occured. Note that srcElement is a compatible code for IE.	
 * @param {Event} e - It provides the event that was fired by the user action
 * @returns {Boolean|undefined} returns true if event is fired else returns undefined 
 */

renderingUtils.getTargetElem = function (e) {//No I18n
    if (e) {
        return e.target || e.srcElement;
    }
    else {
        return undefined;
    }
}

/**
 * This method is used to position the mouse Arrow to construct the quick Create box according to the event target position and the view port dimensions.
 * @param {HTMLElement} currentElement - This provides the element at which the event or target is fired. 
 * @param {String} toId - This provides the event that is to be triggered. i.e, like quick create popup to be constucted.
 * @param {String} arrowElemId - This provides the arrow Element Id to which the popup has to be constructed accordingly.
 * @param {Object} posObj - This provides the mouse event that has occured to know the mouse position.
 */

renderingUtils.positionArrow = function (currentElement, toId, ev, arrowElemId, posObj) {//No I18N
    var totViewPortWidth = window.innerWidth ? window.innerWidth : document.body.clientWidth;
    var totViewPortHeight = window.innerHeight ? window.innerHeight : document.body.clientHeight;
    var elemToShow = $("#" + toId);
    var showElemWidth = elemToShow.outerWidth();
    var clientY = posObj.mouseclientY;
    var clientX = posObj.mouseclientX;
    var pageY = posObj.mousepageY;
    var pageX = posObj.mousepageX;
    var bottomSpc = totViewPortHeight - clientY;
    var topVal = 0;
    var left = 0;
    var arrowClass = "arrwLeft";  //No I18N
    var neededHeight = elemToShow.outerHeight();
    var eventDetailsPopup = $('#eventViewPopup');
    if (totViewPortWidth - clientX - 15 > showElemWidth) { //If true right side space available
        if (bottomSpc > neededHeight) {
            topVal = pageY - 60;
        } else {
            topVal = pageY - (neededHeight - bottomSpc + 30);
        }
        left = pageX + 20;
        arrowClass = "arrwRight";  //No I18N
    } else {// else left side available
        left = pageX - elemToShow.outerWidth() - 20;
        if (bottomSpc > neededHeight) {
            topVal = pageY - 60;
        } else {
            topVal = pageY - (neededHeight - bottomSpc + 30);
        }
        arrowClass = "arrwLeft";  //No I18N
    }
    topVal = topVal < 0 ? 0 : topVal;
    left = left < 0 ? 0 : left;
    elemToShow.css({ "top": topVal, "left": left });//No I18n
    arrowElemId = arrowElemId ? arrowElemId : "posArrow";//No I18n
    if (arrowElemId === "qcpopuparrow") {
        var arrElemId = $("." + arrowElemId);
        arrElemId.removeClass("qcRight");
        arrElemId.attr({ "class": arrowClass }).css({ "left": "", "top": pageY - topVal - 8 });  //No I18N
    } else {
        $("#" + arrowElemId).attr({ "class": arrowClass }).css({ "left": "", "top": pageY - topVal - 8 });  //No I18N
    }
    eventDetailsPopup.hide();
    elemToShow.show();
    var curElem = $(currentElement).parent();
    if (curElem.hasClass("eventActionsMenu") || curElem.hasClass("quickCreateLink")) {
        $(".eventActionsMenu a, .quickCreateLink a").removeClass("quickCreateLinkAct");
        $(currentElement).addClass("quickCreateLinkAct");
    }
}



/**
 * This method is used to trigger the jquery Event on the passed in jquery Element.
 * @param {String} eventType - This provides the type of event which is to be triggered on the jquery element.
 * @param {jQueryElement} Jelem - This provides the jquery Element to which the passed in event has to be triggered.
 * @example
 * renderingUtils.triggerEvent("click",$("#test"))
 * => //This method would trigger the event click on the element 'test' irrespective of the call type. i.e, even if it is onclick,Jquery(.click) etc..
 */

renderingUtils.triggerEvent = function (eventType, Jelem) {//No I18N
    if (Jelem[0]) {
        if (Jelem[0][eventType]) {
            Jelem[0][eventType]();
        }
        else {
            Jelem.eq(0).trigger(eventType);
        }
    }
}



/**
 * This method is used to make the list draggable and sortable. That is you can drag and drop the list using this method. 
 * @see Please refer the example of {@link commonUtils.setColumnValues1} to know where exactly this is used.
 * jquery ui sortable causes a bug when cancel is called from beforeStop. C1ancel is called at update as a workaround.
 */

renderingUtils.sectionSorting = function () {//No I18N
    var revertScroll = false;
    var sortable = $(".connectedSortable")
    sortable.multiselectable({
        selectedClass: "selectedElem",//No I18N
        cancel: ".nosort",//No I18N
        mousedown: function (event, item) {
            if (document.activeElement.id === "searchField") {
                $("#searchField").blur();
            }
            //Removing selected class for --no fields--
            if (item.hasClass("nosort")) {
                item.removeClass("selectedElem");
            }
        }
    });
    sortable.multisortable({
        selectedClass: "selectedElem",//No I18N
        cancel: ".nosort",//No I18N
        start: function (event, ui) {
            var parentNodeId = $(ui.item).parent().attr("id");
            var otherListId = parentNodeId === "availableList" ? "selectedColumns" : "availableList";//No I18N
            //Removing selection in available list while clicking on the elements in selectedColumns
            $("#" + otherListId).children(".selectedElem").removeClass("selectedElem");
            var items = $(".selectedElem");
            var selElem = items.first();
            var spanElem = document.createElement("span");
            $(spanElem).addClass("multiMove");
            selElem.append(spanElem);
            var parentId = selElem.parent().attr("id"); //No I18N
            parentId === "availableList" ? selElem.children(".addArrw").hide() : selElem.children(".lArrowIcon").hide();//No I18N
            items.addClass('cvSelected');
            revertScroll = false;
        },
        beforeStop: function (event, ui) {
            var targetId = event.target.getAttribute("data-cid");
            var placeholder = ui.placeholder.parents("li").eq(0);//No I18N
            var placeholderId = placeholder.attr("data-cid") ? placeholder.attr("data-cid") : ui.placeholder[0].parentNode.getAttribute("data-cid");//No I18N
            var items = $(".cvSelected");
            if (targetId === "availableList" && placeholderId === "availableList") {
                //Removing draggable image
                items.children(".multiMove").remove();//No I18n
                //eslint-disable-next-line webperf/directly-select-with-id
                items.children("#add").hide();//No I18N
                items.filter('.selectedElem').removeClass('cvSelected').removeClass('selectedElem');//No I18N
                items.stop(true, true).animate({ //eslint-disable-line webperf/no-animate
                    backgroundColor: '#fff3ad'//No I18N
                });
                items.stop(true, true).animate({//eslint-disable-line webperf/no-animate
                    backgroundColor: 'white'//No I18n
                }, {
                    duration: 500,
                    complete: function () { items.attr('style', "margin-left: 11px; margin-right: 11px;"); }//No I18n
                });
                revertScroll = true;
            }
            else if (targetId === "selectedColumns" && placeholderId === "availableList") {//No I18N
                var scrollToElem;
                if ($("#noRecords:visible").length > 0) {
                    renderingUtils.emptySearchBox();
                }
                items.removeClass("selectedElem").css({ "position": "", "left": "", top: "" });//No I18n
                items.children(".multiMove").remove();//No I18n
                var noFields = $("li.noFields");
                var selectedClm = $("#selectedColumns");
                var availableList = $("#availableList");
                var availableListFind = availableList.find("li");
                $.each(items, function (index) {
                    var itemIndex = $(items[index]);
                    itemIndex.removeClass("selectedElem");
                    if (itemIndex.attr("mandatory")) {
                        itemIndex.removeClass("cvSelected multiselectable-previous pR");
                    }
                    itemIndex.css({ "position": "", "left": "", top: "" }); //NO I18N
                    //Removing draggable image
                    var multiMove = itemIndex.children(".multiMove");//NO I18N
                    if (multiMove) {
                        multiMove.remove();
                    }
                    ;
                    if (itemIndex.attr("mandatory")) {
                        selectedClm.prepend(itemIndex);
                    }
                    else {

                        if (noFields.length > 0) {
                            noFields.remove();
                        }
                        var fieldName = itemIndex.children(".SelectedElement").text(); //NO I18N
                        renderingUtils.fieldsJSONArray.push(fieldName);
                        renderingUtils.fieldsJSONArray.sort();
                        var indexTmp = renderingUtils.fieldsJSONArray.indexOf(fieldName);
                        if (indexTmp !== 0) {
                            availableListFind.eq(indexTmp - 1).after(itemIndex)
                        }
                        else {
                            availableList.prepend(itemIndex[0])
                        }
                        //eslint-disable-next-line webperf/directly-select-with-id
                        itemIndex.children("#remove").hide();//NO I18N
                        scrollToElem = itemIndex;
                        itemIndex.attr("style", "margin-left : 11px; margin-right : 11px;"); //NO I18N
                    }
                    commonUtils.addToMandatory();
                });
                if (scrollToElem) { $(".availableCol").scrollTo(scrollToElem); }
            }
            else if (targetId === "availableList" && placeholderId === "selectedColumns") {

                $.each(items, function (index) {
                    var itemIndex = $(items[index]);
                    var selected = itemIndex.children().find(".selectionClass");
                    if (selected.length > 0) {
                        $.each(selected, function (index1) {
                            var selectIndex = $(selected[index1]);
                            var txt = selectIndex.text();
                            selectIndex.replaceWith(txt);
                        });
                    }
                });
                commonUtils.removeFromMandatory();
            }
            items.stop(true, true).animate({// eslint-disable-line webperf/no-animate
                backgroundColor: '#fff3ad'//No I18N
            });
            items.stop(true, true).animate({// eslint-disable-line webperf/no-animate
                backgroundColor: 'white'
            }, 500);//No I18N
        },
        update: function () { //eslint-disable-line zohocrm/no-unused-vars
            /** used to cancel the sort if sort occurs within availableList */
            if (revertScroll === true) { // No I18N
                $(this).sortable("cancel");
            }
        },
        stop: function (event, ui) {
            var targetId = event.target.getAttribute("data-cid");
            var items = $(".cvSelected");
            // removing sortable for mandatory field
            var sameDivDrag = false;
            var uiItem = $(ui.item);
            var availableList = $("#availableList");
            if (uiItem.hasClass("selectedElem")) {
                uiItem.removeClass('selectedElem');
                if (targetId === "selectedColumns") {
                    sameDivDrag = true;
                }
            }
            items.removeClass('cvSelected selectedElem').children(".multiMove").remove();//No I18n
            //eslint-disable-next-line webperf/directly-select-with-id
            items.children("#remove").hide();//No I18n
            //eslint-disable-next-line webperf/directly-select-with-id
            items.children("#add").hide();//No I18n
            if (availableList.children("li").length === 0) {
                var nonenode = document.createElement("li");
                nonenode.setAttribute("class", "nosort noFields");
                $(nonenode).html(I18n.getMsg("crm.customview.nofields"));
                availableList.append(nonenode);// NO OUTPUTENCODING
            }
            items.stop(true, true).animate({// eslint-disable-line webperf/no-animate
                backgroundColor: '#fff3ad'//No I18N
            });
            items.stop(true, true).animate({// eslint-disable-line webperf/no-animate
                backgroundColor: 'white'
            }, 1000);//No I18N
            if (!sameDivDrag) {
                items.removeClass("multiselectable-previous multiselectable-shift");
            }
        },
        receive: function (event, ui) {
            var targetID = event.target.getAttribute("data-cid");
            var liField = $("li.noFields");
            var availableList = $("#availableList")
            var uiItem = $(ui.item);
            if (targetID === 'selectedColumns' && $('#selectedColumns').find('li.sorl:not(.cvSelected)').length >= Search.MAX_COL_CNT) {
                $(ui.sender).sortable('cancel');

                if (liField.length > 0) {
                    liField.remove();
                }
                var fieldName = uiItem.children(".SelectedElement").text();//No I18N
                renderingUtils.fieldsJSONArray.push(fieldName);
                renderingUtils.fieldsJSONArray.sort();
                var indexTmp = renderingUtils.fieldsJSONArray.indexOf(fieldName);
                if (indexTmp !== 0) {
                    availableList.find("li").eq(indexTmp - 1).after(uiItem)
                }
                else {
                    availableList.prepend(ui.item)
                }
                //eslint-disable-next-line webperf/directly-select-with-id 
                uiItem.children("#remove").hide();//No I18N
                uiItem.attr("style", "margin-left : 11px; margin-right : 11px;");//No I18N
                //				  renderingUtils.showMaxColsReachedMsg();
            }
        }
    });
    sortable.sortable({
        connectWith: ".connectedSortable",//No I18N
        cancel: ".nosort"//No I18N
    });

}

/**
 * This method is used to render a Custom popup from the top which takes in a custom Message and custom buttons, which can be set as per the developers need.
 * <h3>Example</h3><br>
 * <img src="./images/showCustomConfirmMessageNewModel.png">
 * @param {String} msg  - This provides the Custom message that has to be rendered in the popup
 * @param {Object} confirmBtnObj - This provides the properties of the confirm Button and also the message that has to be rendered on the confirm button
 * @param {Object} cancelBtnObj - This provides the properties of the cancel Button and also the message that has to be rendered on the cancel button
 */

renderingUtils.showCustomConfirmMessageNewModel = function (msg, confirmBtnObj, cancelBtnObj) {
    var container = $("#customConfirmationPop");
    //showAnimatePopup( container.attr("id") );
    container.find(".confirmWarning").html(msg);
    var $confirmBtn = container.find(".confirmBtn").val(confirmBtnObj.val);
    var $cancelBtn = container.find(".cancelBtn").val(cancelBtnObj.val);
    $("#diNotificationDiv").css('z-index', 20);
    var resetAndClosePopup = function (btnObj, event) {
        if (btnObj.fn) {
            btnObj.fn();
        }
        $("#diNotificationDiv").css('z-index', '');
        renderingUtils.stopEvent(event);
        var container = $("#customConfirmationPop");
        hideAnimatePopup(container.attr("id")); // NO I18N
        setTimeout(function () {
            var $confirmCancelBtnClass = container.find("[data-zcqa='confirm_cancelbtn']"); // eslint-disable-line webperf/no-attribute-selectors
            var $confirmDeleteBtnClass = container.find("[data-zcqa='confirm_deletebtn']"); // eslint-disable-line webperf/no-attribute-selectors
            $confirmCancelBtnClass.attr("class", "newgraybtn cancelBtn"); //NO I18N
            $confirmDeleteBtnClass.attr("class", "primarybtn confirmBtn"); //NO I18N
            container.removeClass("bpLicenseErr"); //NO I18N
        }, 500);
    }
    $confirmBtn.off('click').click(function (event) { //No I18N
        resetAndClosePopup(confirmBtnObj, event);
    });
    $cancelBtn.off('click').click(function (event) { //No I18N
        resetAndClosePopup(cancelBtnObj, event);
    });
    showAnimatePopup(container.attr("id")); //NO I18N
}

/**
 * This method is used to render a Custom popup at the center position which takes in a custom Message and buttons, which can be set as per the developer needs.
 * <h3>Example</h3><br>
 * <img src="./images/showCustomConfirmMessage.png">
 * @param {String} id - This provides the id of the HTMLElement in which the Confirm Message has to be rendered along with the buttons. 
 * @param {String} msg - This provides the Custom message that has to be shown as a confirm message or as a error message 
 * @param {Array} button - This provides the no of buttons to be set as per the need of use cases.
 */

renderingUtils.showCustomConfirmMessage = function (id, msg, button) {
    $("#" + id).remove();//eslint-disable-next-line webperf/no-multipleDOMLookup
    if ($("#" + id).length === 0) {
        var div = $("#confirmMsg1")[0].cloneNode(true);
        div.id = id;
        var ln = msg.length
        for (var i = 0; i < ln; i++) {
            $(div).find("#confirmMessage" + i).html(msg[i]); //eslint-disable-line webperf/directly-select-with-id
        }
        ln = button.length
        for (var i = 0; i < ln; i++) {
            $(div).find("#confirmButton" + i).val(button[i].val); //eslint-disable-line webperf/directly-select-with-id
            if (button[i].fn) {
                //eslint-disable-next-line webperf/no-multipleDOMLookup
                $(div).find("#confirmButton" + i).click(button[i].fn); //eslint-disable-line webperf/directly-select-with-id 
            }
        }

        $(div).addClass("w100p");

        document.body.appendChild(div) // eslint-disable-line zstandard/no-body-events
    }
    else {
        div = $("#" + id)[0]; //eslint-disable-line webperf/no-multipleDOMLookup
    }
    renderingUtils.positionCenter(id);
    return div;
}


/**
 * This method is used to position the HTMLElement at the center of the Page
 * @see Please refer the Example of {@link renderingUtils.showCustomConfirmMessage} method. 
 * @param {String} id - This provides the id of the element which has to be set in centric position.
 */

renderingUtils.positionCenter = function (id) {
    var sTop = document.documentElement.scrollTop || document.body.scrollTop;
    var sLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    var givenId = $("#" + id);
    if (renderingUtils.windowHeight > givenId.height()) {
        givenId.css({ 'display': 'block', 'position': 'absolute', 'left': '50%', 'top': '50%', 'margin-left': -(givenId.width() / 2) + sLeft, 'margin-top': -(givenId.height() / 2) + sTop });//No I18N
    }
    else {
        var tP = sTop + 10;
        givenId.css({ 'display': 'block', 'position': 'absolute', 'left': '50%', 'top': tP, 'margin-left': -(givenId.width() / 2) + sLeft, 'margin-top': '0px' });//No I18N
    }
}

/**
 * This method is used to construct a unordered list with the passed-in listItemArray and if Array has got someother HTMLElement they are also created using CreateHTML method.
 * <h3>Example</h3><br>
 * <img src="./images/constructList.png">
 * @param {Array} listItemArray - This provides the array of elements that are to be rendered inside each li element. 
 * @param {Function} eachfunction - This provides a method which is used for Custom DOM manipulation with li elements.
 * @param {Function} callBack - This provides a callback methods which is invoked when the unordered list is being clicked.
 */

renderingUtils.constructList = function (listItemArray, eachfunction, callBack) {
    var div = $("<div>", { style: 'z-index:1000;#padding-right:20px;display:none' });
    var ul = $("<ul>", { "class": "timeList" });
    div.append(ul);
    var ln = listItemArray.length;
    for (var i = 0; i < ln; i++) {
        var cT = listItemArray[i];
        var li = $("<li>");
        ul.append(li);
        if (callBack) {
            li.click(function () { // eslint-disable-line no-loop-func
                callBack(this);
                div.hide();// eslint-disable-line webperf/no-closure
            });
        }
        if (cT.length) {
            var len = cT.length;
            for (var j = 0; j < len; j++) {
                li.append(renderingUtils.createHTML(cT[j]));
            }
        }
        else {
            li.append(renderingUtils.createHTML(cT));
        }
        if (eachfunction) {
            eachfunction(li);
        }
    }
    return div[0];
}

/**
 * This method is used to stop the event. Note that cancelBubble was used only for the purpose of serving IE browser.
 * @param {Event} e  - The event object is passed as an argument to the function
 * @example 
 * renderingUtils.stopEvent(EventObject)
 * => // stops the event from bubbling further. Note it would take window event if event object is not passed.
 */

renderingUtils.stopEvent = function (e) {//No I18N
    if (!e) {
        var e = window.event;
    }
    if ($("#isCFS").val() != "yes") {
        e.cancelBubble = true;
        if (e.stopPropagation) { e.stopPropagation(); }
    }
}

/**
 * This method is used to bind Events to the HTML elements being created using the createHTML method.
 * @see Please refer to the example of {@link renderingUtils.createHTML} method.
 * @param {Event} ev - This provides the type of event that is to be bind with corresponding HTML Element
 */

renderingUtils.bindEventForCreateHTML = function (ev) {//Removed from inside the loop and added out to avoid codecheck //No I18N
    var args = [];
    var el = $(this);
    if (el.data("args_" + ev.type)) {
        args = args.concat(el.data("args_" + ev.type));//Array reference is deleted if we get the value from the data. So we are using a new instance. //No I18N
    }
    var fn = el.data("fn_" + ev.type); //No I18N
    if (typeof fn === "function") {
        args.unshift(ev, this);
        fn.apply(window, args);
    } else {
        args.unshift(fn, window, ev, this);
        Lyte.registeredMixins["crm-utilities"].executeFunctionByName.apply("Utils", args);//No I18N
    }
}

/**
* This method is used to create the HTML Elements by simply providing the required HTML in Json Format
* @example  
* renderingUtils.createHTML({"name":"div", "attr":{"id":"NotFoundAlertDiv","class":'w100p pT30'},"onclick":"crmDeduplicate.hideMessagePopup(\"" + module + "\")"});
* => <div id="NotFoundAlertDiv" class="w100p pT30" onclick='crmDeduplicate.hideMessagePopup(\"" + module + "\")'></div>
* @param {Object} object - This provides the Json in which the HTML Element type , Context, attributes are been defined
* @returns {HTMLFragment} - This method returns the Constructed HTML frgament with the specified Context.
*/

renderingUtils.createHTML = function (object) {//No I18N
    if (!object.length) { object = [object] };
    var frag = document.createDocumentFragment();
    var ln = object.length;
    for (var i = 0; i < ln; i++) {
        var obj = object[i];
        if (obj.name !== "text") {
            var elem = document.createElement(obj.name);
        } else {
            var textContent = obj.content ? obj.content : obj.html ? obj.html : obj.textContent ? obj.textContent : "";//No I18N
            var elem = document.createTextNode(textContent);
        }
        for (var key in obj) {
            if (/events|child|name|content|textContent/.test(key)) { continue; }
            $(elem)[key](obj[key]);
        }
        var eventArr = obj.events;
        if (eventArr) {
            var len = eventArr.length;
            for (var j = 0; j < len; j++) {
                var eventObj = eventArr[j];
                var eventName = eventObj.name;
                var Jelem = $(elem);
                //eslint-disable-next-line zstandard/combine-properties 
                Jelem.data("args_" + eventName, eventObj.args);//No I18N
                //eslint-disable-next-line zstandard/combine-properties 
                Jelem.data("fn_" + eventName, eventObj.fn);//No I18N
                Jelem[eventName](renderingUtils.bindEventForCreateHTML);
            }
        }
        if (obj.child) {
            var childArr = obj.child;
            var len = childArr.length;
            for (var j = 0; j < len; j++) {
                elem.appendChild(this.createHTML(childArr[j]));
            }
        }
        if (object.length === 1) {
            return elem;
        }
        frag.appendChild(elem);
    }
    return frag;
}

/**
 * This method is used to set the Tooltip on the particular element in which the text is too long for which the tooltip is set.
 * @param {HTMLElement} node - This provides the HTMLElement in which the tooltip has to be set. 
 * @param {String} value - This provides the value that is to be rendered in the tooltip.
 * @example
 * renderingUtils.setTooltip($("#test")[0],"tooltippppp")
 * => //Note that it would calculate acceptable char count of that particular element and appends the element with a elippsis.
 */

renderingUtils.setTooltip = function (node, value) {
    var charCount = commonUtils.calculateAcceptableCharCount(node, value);
    var originalLab = value;
    if (value.length > charCount) {
        value = value.substring(0, charCount - 1) + "...";
    }
    $(node).empty();
    node.innerHTML = revertSplChrs(value);
    node.title = originalLab;
}

/**
 * This method is used to create a select Box with options 
 * <h3>Example</h3><br>
 * <img src="./images/createSelectBox.png">
 * @param {Array} optionsArray - This provides the list of options available inside the dropdown of the selecr box
 * @param {Boolean} isMultiSelect - This argument is set to be true only if the select Box can select multiple options that are available.
 * @param {Function} callBackFn (optional) - An optional argument that is bind with the select box. This method is triggered when the defualt option is changed.
 * @param {Object} selectAttrObj (optional) - This is also optional argument which is used to set an attribute to the select Box
 * @returns {HTMLElement} - It returns the select Box with the following options provided in the options Array.
 */

renderingUtils.createSelectBox = function (optionsArray, isMultiSelect, callBackFn, selectAttrObj) {
    var selectBox = document.createElement("select");
    $(selectBox).addClass("select");
    selectAttrObj ? $(selectBox).attr(selectAttrObj) : "";
    if (isMultiSelect) {
        $(selectBox).attr("multiple", "multiple");//No I18N
    }
    if (typeof optionsArray === "function") {
        var s = 0;
        while (true) {
            var option = document.createElement("option");
            var obj = optionsArray(s);
            if (!obj) {
                break;
            }
            else {
                var htmlContent = obj.content ? obj.content : obj.html;
                var setVal = obj.value ? obj.value : htmlContent;
                $(option).html(htmlContent).val(setVal);
                if (obj.defaultVal === "true") {
                    $(option).prop("selected", true);//No I18N
                }
                selectBox.appendChild(option);
            }
            s++;
        }
    }
    else {
        for (var s = 0, optionsArrLen = optionsArray.length; s < optionsArrLen; s++) {
            var option = document.createElement("option");
            var Joption = $(option);
            if (typeof optionsArray[s] === "object") {
                if (optionsArray[s].attr) {
                    Joption.attr(optionsArray[s]["attr"]);// eslint-disable-line dot-notation
                }
                if (optionsArray[s].default === "true") {
                    Joption.prop("selected", true);//No I18N
                }
                var htmlContent = optionsArray[s].content ? optionsArray[s].content : optionsArray[s].html;
                var setVal = optionsArray[s].value ? optionsArray[s].value : htmlContent;
                Joption.html(htmlContent).val(setVal);
            } else {
                Joption.html(I18n.getMsg(optionsArray[s])).val(optionsArray[s]);
            }
            selectBox.appendChild(option);
        }
    }
    if (callBackFn) {
        $(selectBox).change(function () {
            var selectedOption = this.getSelectedNode(this);
            callBackFn(selectedOption);
        });
    }
    return selectBox;
}

/**
 * This method is used to get the target Element. Note that srcElement is a compatible code for IE.	
 * @param {Event} e - It provides the event that was fired by the user action
 * @returns {HTMLElement|undefined} - It returns the Target position at which the event occured or Undefined if no event is fired. 
 */

renderingUtils.targetElement = function (e) {//No I18n
    if (e) {
        return e.target ? e.target : e.srcElement;
    } else {
        return undefined;
    }
}

/**
 * This method is used to animate the div element when a custom prompt / Any other popup is present on the screen.
 * @see Please refer to the example provided in {@link renderingUtils.shakeAnimation}. 
 * @param {String} divId - This provides the div which has to be animated 
 * @param {String} dir - This provides the direction in which the div has to be animated.
 * @param {Number} dist - This provides the distance/pixels upto which the animation has to be set
 * @param {Number} dur - This provides the duration for which the animation has to run.
 * @param {HTMLElement} $freezeLayerDiv  - This provides Freezelayer Div which acts as a layer to identify the user action.
 */

renderingUtils.ShakeDivInfreeze = function (divId, dir, dist, dur, $freezeLayerDiv) { //no i18n
    $freezeLayerDiv = $freezeLayerDiv ? $freezeLayerDiv : $("#FreezeLayer");
    var el = $("#sdiv")
    var elVisible = el.is(":visible"); //No I18N
    if ($freezeLayerDiv) {
        //$("#FreezeLayer").unbind('click'); //when freezeLayer is hidden
        $freezeLayerDiv.click(function () {
            var el = $("#" + divId)
            var $window = $(window);
            if (!QuickActionSelObj && ($window.scrollTop() + renderingUtils.windowHeight - parseInt(el.css("top")) < 0 || $window.scrollTop() - (parseInt(el.css("top")) + parseInt(el.height())) > 0)) {
                $.scrollTo("#" + divId, { axis: 'y', duration: 1000, offset: -80, onAfter: function () { renderingUtils.shakeAnimation(divId, dir, dist); } }); //No I18N
            } else {
                renderingUtils.shakeAnimation(divId, dir, dist);
            }
        });
        elVisible ? el.hide() : null; //No I18N
        if ($('.dItimesdiv').length) {
            $('.dItimesdiv #sdiv').hide();//eslint-disable-line webperf/directly-select-with-id
            $('.bestTimeListFilter').hide();
            $('.tA').removeClass('tA');
            crmBstTime.hideBestTimeSuggestion('QuickCreateTask');
        }
    }
}

/**
 * This method animates the div which is to be closed first inorder to access the page in the background
 * <h3> Example </h3><br/>
 * <img src="./images/shakeAnimation.png">
 * Note : When you click on the freeze layer the popup window would animate.
 * @param {String} divId - This provides the div which has to be animated 
 * @param {String} dir - This provides the direction in which the div has to be animated.
 * @param {Number} dist - This provides the distance/pixels upto which the animation has to be set
 */

renderingUtils.shakeAnimation = function (divId, dir, dist) { //no i18n
    var tem = dist;
    var doc = document.getElementById(divId);
    var el = $("#sdiv");
    var elVisible = el.is(":visible"); //No I18N
    for (var i = 0; i < 4; i++) {
        tem = parseInt(tem * -1);
        switch (dir) {
            case "left":
                if (doc.style.left.indexOf("%") !== -1) {
                    var at = parseInt(tem / 10);
                    //var leftVal = parseInt(document.getElementById(divId).style.left)+at+"%";
                    $("#" + divId).animate({ left: "+=" + at + "%" }, 100); //eslint-disable-line webperf/no-animate
                }
                else {
                    $("#" + divId).animate({ left: "+=" + tem }, 100);//eslint-disable-line webperf/no-animate
                }
                break;
            case "right":
                if (doc.style.right.indexOf("%") !== -1) {
                    var at = parseInt(tem / 10);
                    $("#" + divId).animate({ right: "+=" + at + "%" }, 100);//eslint-disable-line webperf/no-animate
                }
                else {
                    $("#" + divId).animate({ right: "+=" + tem }, 100);//eslint-disable-line webperf/no-animate
                }
                break;
            case "up":
                $("#" + divId).animate({ top: "+=" + tem }, 100);//eslint-disable-line webperf/no-animate
                break;
        }
    }
    //		if(dir === "left"){ //no i18n
    //			if(document.getElementById(divId).style.left.indexOf("%") !== -1){var at = parseInt(tem / 10);
    //			//var leftVal = parseInt(document.getElementById(divId).style.left)+at+"%";
    //			$("#" + divId).animate({left:"+=" + at + "%"},100);
    //		}
    //		else{
    //			$("#" + divId).animate({left:"+=" + tem},100);
    //		}
    //		} 
    //		else if(dir == "right"){ //no i18n
    //			if(document.getElementById(divId).style.right.indexOf("%") !== -1){
    //				var at = parseInt(tem / 10);
    //				$("#" + divId).animate({right:"+=" + at + "%"},100);
    //			}
    //			else{
    //				$("#" + divId).animate({right:"+=" + tem},100);
    //			}
    //		} 
    //		else if(dir == "up"){ //no i18n
    //			$("#" + divId).animate({top:"+=" + tem},100);
    //		}
    elVisible ? el.hide() : null;//No I18N
    if ($('.dItimesdiv').length) {
        el.hide();
        $('.bestTimeListFilter').hide();
        $('.tA').removeClass('tA');
        crmBstTime.hideBestTimeSuggestion('QuickCreateTask');
    }
}

/**
 * This method is used to handle the events when the dummy layer is present. i.e, Either to remove the dummy layer or to animate the popup which is present inorder to remove the dummy layer.
 * <h3> Example </h3><br/>
 * <img src="./images/dummyLayer.png">
 * Note : Dummy Layer is simply a freeze layer which below the popup.
 * @param {Boolean} hideOnClick - This Boolean value is set to true if you need to hide the dummy layer 
 * @param {String} elemIdToFocus - The Id of the element to which is to be animated when the prompt/popup is open.
 */

renderingUtils.handleDummyLayer = function (hideOnClick, elemIdToFocus) {//No I18n
    var calendar = $("#Calendar");
    if (hideOnClick) {
        hideMenu(event);
        renderingUtils.removeDummyBackground();
    }
    else if (!calendar.is(":visible")) {
        //	$("#eventCreatePopup").effect( "shake", {"direction": 'right', "times":2}, 100 );
        renderingUtils.shakeAnimation(elemIdToFocus, 'left', 30);//No I18n
    }
    if ($("#gotoDateContDiv").is(":visible") && calendar.is(":visible")) {
        calendar.hide();
    }
}

/**
 * This method is used to create a new dummy layer.
 * @see Please refer example of {@link renderingUtils.handleDummyLayer} method. There is a dummy layer over the calendar.
 * @param {Boolean} hideOnClick - This Boolean value is set to true if you need to hide the dummy layer 
 * @param {String} elemIdToFocus - The Id of the element to which is to be animated when the prompt/popup is open.
 */

renderingUtils.dummyBackground = function (hideOnClick, elemIdToFocus) {//No I18n
    var emptyLayer = $("#emptyLayer");
    if (emptyLayer[0]) { return true; }
    var scrlTop = $(window).scrollTop();
    var wHt = renderingUtils.windowHeight;
    var wWid = renderingUtils.windowWidth;
    document.documentElement.style.overflow = 'hidden';//No I18n
    var dummyLayer = document.createElement("DIV");
    dummyLayer.id = "emptyLayer";
    dummyLayer.className = "emptyLayer";
    dummyLayer.onclick = function () { renderingUtils.handleDummyLayer(hideOnClick, elemIdToFocus); };
    $(dummyLayer).css({ "width": wWid, "height": wHt, "top": scrlTop }).appendTo('body');//No I18n
    if (!Crm.isHeadless && crmNTC.isSignalDetailViewVisible()) {
        emptyLayer.css({ 'z-index': 32 });	//No I18n
        if ($(".temp_freezelayer").length > 0) {
            $('#duplicateEventMsg').css({ 'z-index': 34 });
        }
        else {
            $('#duplicateEventMsg').css({ 'z-index': 33 });
        }
    }
    $('#saveEventsBtn').attr('disabled', 'disabled');
}

/**
 * This method is used to remove the Dummy Layer/Freeze layer that is present.
 * @see Please refer to example of {@link renderingUtils.handleDummyLayer} and {@link renderingUtils.dummyBackground} methods. 
 */

renderingUtils.removeDummyBackground = function () {//No I18n
    var emptyLayer = $("#emptyLayer");
    $('#saveEventsBtn').removeAttr('disabled');
    //if (document.getElementById("emptyLayer")) {document.body.removeChild(document.getElementById("emptyLayer"));}//No I18n
    emptyLayer.remove();
    if (!$("#FreezeLayer")[0]) {
        document.documentElement.style.overflow = '';//No I18n
    }
    /* Z-Index removed to reset the zindex set for SalesSignals */
    emptyLayer.css({ 'z-index': '' });//No I18n
    $('#duplicateEventMsg').css({ 'z-index': '' });
}

/**
 * This method is to set a selection range for the input field or text area. Note that here the Selecetion range is set as length,length which obviously focuses at the end of the value in the input field.
 * @param {HTMLElement} inpObj - This provides the input Field or text area at which the end of the value in the input field has to be reached. 
 */

renderingUtils.setEndToInputBox = function (inpObj) {
    inpObj = $(inpObj).get(0);
    inpObj.focus();
    var len = inpObj.value.length;
    inpObj.setSelectionRange(len, len);
}

/**
 * This method is used to display an error message either when any validation of field fails or when some other validation fails.
 * <h3> Example </h3><br/>
 * <img src="./images/displayErrorDiv.png">
 * @param {String} fldName - This provides the name of the field which has to be validated and append the error div to corresponding element. 
 * @param {String} fldLabel - This provides the label of the field which has to be concatinated with the error message  
 * @param {String} message - This provide the error message that has to be displayed when validation fails.
 * @param {HTMLElement} fldObj - This provides the Element which is to be validated.
 */

renderingUtils.displayErrorDiv = function (fldName, fldLabel, message, fldObj) {
    var bulkUpdateFldsListForSchedulerVisible = $('#bulkUpdateFldsListForScheduler').is(':visible');//No I18N
    var depFieldVisible = $(".depField").is(':visible')//No I18N
    var sIlookupFieldAddNewVisible = $("#sIlookupFieldAddNew").is(':visible') || Crm.isFromSalesInbox;//No I18N
    var errorDivId = "displayContent_" + fldName;//No I18n

    //eslint-disable-next-line webperf/directly-select-with-id 
    var div = $("[id='" + errorDivId + "']").length > 0 ? document.getElementById(errorDivId) : document.createElement("div"); //No I18n
    div.id = errorDivId;
    div.className = "form_err_msg";
    var quick = $('#quickConfig');
    var imap = $('#imap_config_page');
    var quickConfig = quick.length > 0 && quick.val() === "true" ? true : false;
    var imapConfigpageID = imap.length > 0 && imap.val() === "true" ? true : false;


    if (!fldObj || $(fldObj).length === 0) {
        fldObj = getObj(fldName); //eslint-disable-line zohocrm/no-deprecated-fnc
    }
    if (bulkUpdateFldsListForSchedulerVisible && !depFieldVisible && !sIlookupFieldAddNewVisible) {
        var statusAlert = $('#error_status_alert');
        statusAlert.text(I18n.getValueForFields(message, fldLabel)); //No I18N
        statusAlert.removeClass('dN').addClass('top30').show();
        return false;
    }
    if (quickConfig || imapConfigpageID) {
        $(fldObj).closest('.tabDivCreate').addClass('errorFieldP');//No I18N
        div.className = "validateConfiguration form_err_msg";
        div.style.height = "5%";
    }
    else {
        div.style.height = "10%";
    }
    if ((imapConfigpageID || quickConfig) && (div.id === "displayContent_imapPort" || div.id === "displayContent_smtp_port")) {
        //eslint-disable-next-line webperf/layout-thrashing
        div.style.cssText = 'left:' + parseInt($("#" + fldName + "_cont").position().left) + 'px !important';//No I18N
        div.style.bottom = '-17px';	//No I18N
    }
    if (imapConfigpageID && div.id === "displayContent_imapServer") {
        div.style.top = '25px';
    }
    if (div.id === "displayContent_appCmntsArea") {
        div.style.top = '200px';
    }
    $(div).empty();
    div.innerHTML = I18n.getValueForFields(message, fldLabel); //No I18N
    if (div.id === "displayContent_days") {
        //eslint-disable-next-line webperf/layout-thrashing
        div.style.left = $("#ruleName").outerWidth() + $("#sign").outerWidth() + "px"; //No I18N
    }
    if (div.id === "displayContent_predictionCreationName" || div.id === "displayContent_recNameContri") {
        //eslint-disable-next-line webperf/no-multipleDOMLookup
        $(fldObj).parent().append(div);
        $(fldObj).find('input').focus();
        $(fldObj).addClass('errorFieldP specialCharExcep');
        $('#displayContent_predictionCreationName').show();
    }
    $(fldObj).addClass("err_fld");
    if (div.id === "displayContent_imapServer" || div.id === "displayContent_smtp_server" || div.id === "displayContent_smtp_emails" || div.id === "displayContent_roleName" || div.id === "displayContent_reportsTo" || div.id === "displayContent_taskSubject" || div.id === "displayContent_days" || div.id === "displayContent_assignTo") {
        //eslint-disable-next-line webperf/no-multipleDOMLookup
        $(fldObj).parent().append(div);//NO OUTPUTENCODING
    }
    else if (div.id === "displayContent_sharingSrc_G" || div.id === "displayContent_sharingTo_G" || div.id === "displayContent_sharingSrc_R" || div.id === "displayContent_sharingTo_R" || div.id === "displayContent_emailTemplateId" || div.id === "displayContent_fieldOption1" || div.id === "displayContent_fieldValue1") {
        if (div.id === "displayContent_fieldValue1") {
            div.style.left = $("#fieldOption1").outerWidth() + "px";
        }
        $(fldObj).closest("td").append(div);//No I18n //NO OUTPUTENCODING
        $(fldObj).closest(".newSelect,.wf_chosen_ui");
        //eslint-disable-next-line webperf/no-multipleDOMLookup
        $(fldObj).parent().css("display", "inline-block");//No I18n
    }
    else if (div.id === "displayContent_WFDateFieldsdd" || div.id === "displayContent_ruleName") {
        //eslint-disable-next-line webperf/no-multipleDOMLookup
        $(fldObj).closest("tr").addClass("form_err_fld");//No I18N
        //eslint-disable-next-line webperf/no-multipleDOMLookup
        $(fldObj).parent().append(div);//NO OUTPUTENCODING
    }
    else if (fldName.indexOf("noOfUnits") !== -1) {
        $(fldObj).closest(".wf_form_row").append(div);//No I18n //NO OUTPUTENCODING
    }
    else if (fldName === "WFTriggerFieldId0") {
        if (fldLabel === "SameFieldName") {
            // eslint-disable-next-line zstandard/no-commoncode-in-ifelse 
            $("#WFTriggerFieldsDIV").find(".noWrap").eq(0).append(div);//No I18N
        }
        else {
            // eslint-disable-next-line zstandard/no-commoncode-in-ifelse 
            $("#WFTriggerFieldsDIV").find(".noWrap").eq(0).append(div);//No I18N
            //eslint-disable-next-line webperf/no-multipleDOMLookup
            $("#displayContent_" + fldName).css({ "position": "static", "display": "" });//NO I18N
        }
    }
    else if (div.id === "displayContent_appname") {
        $(fldObj).closest("tr,.tabDivCreate").addClass("form_err_fld");//No I18N
        $("#authsubmit").after(div);
    }
    else if (div.id === "displayContent_selectedProfileIds") {
        $(fldObj).next(".newSelect,.wf_chosen_ui").prepend(div);
    }
    else if ($(fldObj).prop("tagName") === "SELECT") {
        $(fldObj).closest(".newSelect,.wf_chosen_ui").after(div);
    }
    else {
        $(fldObj).after(div);
    }

    if (fldName !== "ruleName" && fldName !== "ruleDesc_inp" && fldName !== "WFDateFieldsdd" && fldName !== "showOnDateTime" && fldName.indexOf("noOfUnits") === -1 && !(fldName === "WFTriggerFieldId0" && fldLabel === "SameFieldName")) {
        //eslint-disable-next-line webperf/no-multipleDOMLookup
        $(fldObj).closest("tr").addClass("form_err_fld");//No I18N
    }
    else {
        //eslint-disable-next-line webperf/no-multipleDOMLookup
        $("#displayContent_" + fldName).css({ "position": "static", "display": "" });//NO I18N
    }
    if (fldName.indexOf("modOpt") >= 0 && $("#wfDelugeEditorDIV").length > 0) {
        //eslint-disable-next-line webperf/no-multipleDOMLookup
        $("#displayContent_" + fldName).css({ "position": "relative" });
    }
    if (fldName === "pb_transitionName") {
        //eslint-disable-next-line webperf/no-multipleDOMLookup
        $("#displayContent_" + fldName).css({ "position": "relative" });
    }
    //eslint-disable-next-line webperf/no-multipleDOMLookup
    if ($(fldObj).parent().hasClass("newSelect")) {
        $(div).addClass("alter_err_pos");
    }
    //eslint-disable-next-line webperf/no-multipleDOMLookup
    if ($(fldObj).parent().hasClass("wf_chosen_ui")) {
        $(div).addClass("alter_err_pos");
    }
    if (fldLabel === "relatedField_Stage" || fldLabel === "relatedField_Pipeline") {
        $("#" + fldLabel).addClass("form_err_fld");
    }
}
/**
 * This method is used to display a custom alert box  
 * <h3> Example </h3><br/>
 * <img src="./images/displayAlert.png">
 * @see Please refer to example of {@link renderingUtils.displayErrorDiv} for inline alertTypes
  * @param {String} fldName - This provides the name of the field which has to be validated and append the error div to corresponding element. 
 * @param {String} fldLabel - This provides the label of the field which has to be concatinated with the error message  
 * @param {String} alertMsg - This provide the error message that has to be displayed when validation fails.
 * @param {HTMLElement} currObj - This provides the Element which is to be validated.
 * @param {String} alertType - This provides the type of alert whether it is inline or Custom Alert Message.
 */

renderingUtils.displayAlert = function (fldName, fldLabel, alertMsg, currObj, alertType) {
    if (alertType === "inline") {
        renderingUtils.displayErrorDiv(fldName, fldLabel, alertMsg, currObj);
    }
    else if (alertType === "custom") {
        setTimeout(function () {
            renderingUtils.showCustomAlert(alertMsg);
        }, 70);
    }
    else {
        renderingUtils.showCustomAlert(alertMsg);
    }
}

/**
 * This method is used to display permission denied 
 * <h3> Example </h3><br/>
 * <img src="./images/displayPermissionDenied.png">
 * @param {Object} Response - This is the repsonse from the server which provides an error message 
 * @param {Function} callBack - This provides a callBack method which is invoked once the permission denied Alert box is rendered.
 * @param {String} reason - It is a string that provides the reason for failure of the request.
 * @param {String|Number} zIndex - This provides the z-index css for positioning the Alert Box.
 */

renderingUtils.displayPermissionDenied = function (Response, callBack, reason, zIndex, icon, onCloseCallBack) {
    /*
    201-Transition started 
    102-Transition on process 
    307-Transition on pause 
    308-Transition redirected permanently (aborted)
    200-Transition success
        */
    var currentTransObj = Lyte.Router.getRouteInstance().transition, title, icon = icon == undefined && true;
    if (currentTransObj.state !== 200 && app.prevTransition.route && app.prevTransition.route.indexOf("crm.tab.module") > -1) {
        var arrLen = app.listViewLinkedRoutes.length;
        for (var i = 0; i < arrLen; i++) {
            if (currentTransObj.info.route.indexOf(app.listViewLinkedRoutes[i]) > -1) {
                if (currentTransObj.info.route.indexOf("crm.settings.section") == -1) {
                    crmHistory.doNotReload = true;
                }
                crmHistory.handleAjaxErrorLyte = true;
                break;
            }
        }
    }
    if (typeof Response !== "undefined") {
        try {//eslint-disable-next-line webperf/directly-select-with-id
            reason = $(Response.responseText).filter("#errorMsg").html();//NO I18N
        } catch (e) { murphy.error(e); }
    }
    commonUtils.showHideLoadingDiv();
    if (reason) {
        if (I18n.getMsg("error.database.problem") === reason) {
            reason = I18n.getMsg("error.database.problem");
            title = I18n.getMsg("error.unknown.problem");
            icon = false;
        }
    }
    var comp = $L("crux-permission-denied-alert")[0];
    if (comp) {
        if (comp.eventLis) {
            Lyte.removeEventListener(comp.eventLis);//NO I18N
        }
        comp.remove();
    }
    var component = Lyte.Component.render("crux-permission-denied-alert", { "cxPropReason": reason, "cxPropTitle": title, "cxPropIcon": icon, "cxPropZindex": zIndex }, "body");
    component.setMethods({
        "onShow": function () { //NO I18N
            if (callBack) {
                callBack.call(this.$node);
            }
        },
        "onAccept": function () { //NO I18N
            //					renderingUtils.removeFreezeLayerPD();
            renderingUtils.ajaxErrorBackForLyte();
        },
        "onClose": function () { //NO I18N
            var comp = $L("crux-permission-denied-alert")[0];
            if (comp) {
                if (comp.eventLis) {
                    Lyte.removeEventListener(comp.eventLis);//NO I18N
                }
                comp.remove();
                if (onCloseCallBack) {
                    onCloseCallBack.call(this.$node);
                }
            }
            var freezelayer = $L('#FreezeLayer')[0];
            if (freezelayer) {
                renderingUtils.removeFreezeLayerPD();
            }
        }
    })
    component.setData("cxPropShow", true); //NO I18N
    component.eventLis = Lyte.addEventListener("beforeRouteTransition", function (item) {
        var comp = $L("crux-permission-denied-alert")[0];
        if (comp && comp.getData('cxPropShow')) {
            var viewRoutes = ["crm.tab.module.custom-view.list", "crm.tab.module.custom-view.zia", "crm.tab.module.custom-view.kanban", "crm.tab.module.custom-view.canvas"];//no i18n
            if (item && item.history && item.history.fromHistory && item.prevTrans && viewRoutes.contains(item.prevTrans.target)) {
                comp.setData('cxPropShow', false); //no i18n
                return;
            }
            var preservePopup = !$L('.commonRightPanel').length && Lyte.Router.getRouteInstance() ? Lyte.Router.getRouteInstance().transition.preservePopup : false;
            var kanbanviewEle = document.getElementById("iskanbanview");
            if (!preservePopup && !(kanbanviewEle && kanbanviewEle.value === "true")) { //eslint-disable-line webperf/layout-thrashing
                comp.setData('cxPropShow', false); //no i18n
            }
        }
    })
    $L("#Warningdiv").hide();	//To hide when we delete a contact
    if ($L('#appointmentCreate').is(':visible') || $L('#serviceAjaxEdit').is(':visible') || $L('#appointmentRescheduleDiv').is(':visible') || $L('#appointmentCancelDiv').is(':visible') || $L('#appointmentCompletePopup').is(':visible')) {//eslint-disable-line webperf/layout-thrashing
        $L('#freezeBackGround').show();
    }
    else {
        $L('#freezeBackGround').hide();
    }
    if ($L('#topBandPopup:visible').length || $L('#layoutPreview:visible').length) {
        var freezelayer = $L('#FreezeLayer')[0];
        if (freezelayer) {
            freezelayer.style.zIndex = '250';
        }
    }
    //	reason= (!reason) ? I18n.getMsg("crm.security.error") :  reason; //NO I18N
    //	if(typeof Response !== "undefined"){
    //		try{
    //			reason=$(Response.responseText).filter("#errorMsg").html();//NO I18N
    //		}catch(e){}
    //	}
    //	commonUtils.showHideLoadingDiv();
    //	if(I18n.getMsg("error.database.problem") === reason)
    //	{
    //		var dum='<div onclick="sE()" data-zcqa="crm_error_page" data-errormessage="Internal Server problem. Please try again later" class="w500 p20"><div class="floatL "></div><div class="floatL pL20 w430"><div class="f18">'+I18n.getMsg("error.unknown.problem")+'</div><div class="mT10">'+reason+'</div></div><br class="clearB"><div class="alignright mT20"><input type="button" class="newgraybtn" value="'+I18n.getMsg("crm.button.ok")+'"';//NO I18N
    //	}
    //	else
    //	{
    //		var dum='<div onclick="sE()" data-zcqa="crm_error_page" data-errormessage="Insufficient Privileges to perform this operation" class="w500 p20"><div class="floatL "><img class="iconDenied" src="/crm/images/spacer.gif" alt=""></div><div class="floatL pL20 w430"><div class="f18">'+I18n.getMsg("crm.label.creator.noPermission")+'</div><div class="mT10">'+reason+'</div></div><br class="clearB"><div class="alignright mT20"><input type="button" class="newgraybtn" value="'+I18n.getMsg("crm.button.ok")+'"';//NO I18N
    //	}
    ///*	if(document.getElementById("invNewProductForm") && document.getElementById("invNewProductForm").value === "true"){
    //		dum=dum+'onclick="hide(\'popupnew\');productDetails.showProductPopFromFreeze();document.getElementById(\'popupnew\').style.zIndex=30"></div></div>';//NO I18N
    //	} else*/
    //	if(!(document.getElementById("iskanbanview") && document.getElementById("iskanbanview").value === "true")){
    //		dum=dum+'onclick="hide(\'popupnew\',true);renderingUtils.removeFreezeLayerPD();document.getElementById(\'popupnew\').style.zIndex=30;renderingUtils.ajaxErrorBackForLyte()"></div></div>';//NO I18N
    //	}else{
    //		dum=dum+'onclick="hide(\'popupnew\',true);renderingUtils.removeFreezeLayerPD();document.getElementById(\'popupnew\').style.zIndex=30;$(\'#FreezeLayer2\').remove();renderingUtils.ajaxErrorBackForLyte()"></div></div>';//NO I18N
    //	}
    //	var popupnew=$("#popupnew")
    //	popupnew.removeClass('ppTop p0');
    //	if(zIndex){
    //		popupnew.html(dum).css("z-index",zIndex);//NO I18N
    //	}else{
    //		popupnew.html(dum).css("z-index","1600");//NO I18N
    //	}
    //	
    //	mailsetCenter("popupnew");
    //	$("#Warningdiv").hide();	//To hide when we delete a contact
    //	if($('#appointmentCreate').is(':visible') || $('#serviceAjaxEdit').is(':visible') || $('#appointmentRescheduleDiv').is(':visible') || $('#appointmentCancelDiv').is(':visible') || $('#appointmentCompletePopup').is(':visible')){//eslint-disable-line webperf/layout-thrashing
    //		$('#freezeBackGround').show();
    //	}
    //	else {
    //		$('#freezeBackGround').hide();
    //	}
    //	freezeBackground();
    //	if($('#topBandPopup:visible').length || $('#layoutPreview:visible').length){
    //		$('#FreezeLayer').css('z-index','250'); //eslint-disable-line zohocrm/no-freezeLayer	
    //	}
    //	if(callBack) {
    //		callBack.call(window);
    //	}

}


/**
 * This method is used to remove the freeze background once the permission denied Alert box is removed from the page.
 * @see Please refer the example of {@link renderingUtils.displayPermissionDenied} for the freezeLayer that is displayed.
 */

renderingUtils.removeFreezeLayerPD = function () {
    if ($L('#topBandPopup').is(':visible') || $L('#appointmentCreate').is(':visible') || $L('#serviceAjaxEdit').is(':visible') || $L('#appointmentRescheduleDiv').is(':visible') || $L('#appointmentCancelDiv').is(':visible') || $L('#appointmentCompletePopup').is(':visible')) {
        $L('#freezeBackGround').hide();
        if ($L('#topBandPopup:visible').length) {
            //$('#FreezeLayer').css('z-index',''); //eslint-disable-line zohocrm/no-freezeLayer
            var freezelayer = $L('#FreezeLayer')[0];
            if (freezelayer) {
                freezelayer.style.zIndex = '';
            }
        }
    }
    else {
        removeFreezeLayer();
    }
    //	if($('#topBandPopup').is(':visible') || $('#appointmentCreate').is(':visible') || $('#serviceAjaxEdit').is(':visible') || $('#appointmentRescheduleDiv').is(':visible') || $('#appointmentCancelDiv').is(':visible') || $('#appointmentCompletePopup').is(':visible')){
    //		$('#freezeBackGround').hide();
    //		if($('#topBandPopup:visible').length){
    //			$('#FreezeLayer').css('z-index',''); //eslint-disable-line zohocrm/no-freezeLayer
    //		}
    //	}
    //	else {
    //		removeFreezeLayer();
    //	}
}

/**
 * This method is used to handle the Ajax Error in Lyte framework
 */

renderingUtils.ajaxErrorBackForLyte = function () {
    if (!Lyte.Router.getRouteInstance().transition.preservePopup && crmHistory.loaded && crmHistory.handleAjaxErrorLyte) {
        crmHistory.handleAjaxErrorLyte = false;
        Lyte.Router.getRouteInstance().transition.abort();
        if (!app.prevTransition.route || app.historyLength <= 1) {
            Lyte.Router.getRouteInstance().replaceWith("crm.tab.module.begin", "Home");//NO I18N
        }
        else {
            history.go(-1);
        }
    }
    $('#popupnew').removeClass('mxnPermDeniedCheck');
}
/**
 * This method is used to render the popup with some error message and freeze the background.
 * <h3> Example </h3><br/>
 * <img src="./images/popUpWithFreeze.png">
 * @param {HTMLElement} htmlContent - This provides the method with the popup div and necessary buttons and messages.
 */

renderingUtils.popUpWithFreeze = function (htmlContent) {
    var dum = htmlContent;
    var popupnew = $("#popupnew");
    popupnew.html(dum).css("z-index", "250");//NO I18N
    mailsetCenter("popupnew");
    $("#Warningdiv").hide();	//To hide when we delete a contact
    freezeBackground();
    commonUtils.showHideLoadingDiv();
    if ($("#popupok").length > 0) {
        document.getElementById("popupok").focus();
    }
    popupnew.click(function () {
        sE(event);
    });
}

/**
 * This method is used to get Height between the navigation tab and wms bar.
 * @returns {Number} - It returns the height available in the viewport i.e, From the navigation bar to wms bar 
 */

renderingUtils.getHeightFromTabLayer = function () {
    var height = renderingUtils.windowHeight - $("#tabLayer:visible").outerHeight();
    isChatEnabled ? height -= 26 : "";
    var announcement = $('#annoncement'); //$('body').find('#annoncement')
    height = announcement.length ? height - announcement.outerHeight() : height;
    return height;
}

/**
 * This method is used to match the options in the select2 box.
 * <h3> Example </h3><br/>
 * <img src="./images/matchStart.png">
 * @param {Object} params - This provides the value inside the search box of select2 search field.
 * @param {Object} data - This provides the options available in the select2 Box . This object usually tend to properties like Selected,disabled,text,id,title and children etc..
 */

renderingUtils.matchStart = function (params, data) {
    data.parentText = data.parentText || "";
    if ($.trim(params.term) === '') {
        return data;
    }
    var dataChild = data.children;
    if (dataChild && dataChild.length > 0) {
        var match = $.extend(true, { }, data);
        var matchChild = match.children;
        var ln = dataChild.length - 1;
        for (var c = ln; c >= 0; c--) {
            var child = dataChild[c];
            child.parentText += data.parentText + " " + data.text;
            var matches = renderingUtils.matchStart(params, child);
            if (matches == null) {
                matchChild.splice(c, 1);
            }
        }
        if (matchChild.length > 0) {
            return match;
        }
        return renderingUtils.matchStart(params, match);
    }
    var original = (data.parentText + ' ' + data.text).toUpperCase();
    var term = params.term.toUpperCase();
    if (original.indexOf(term) > -1) {
        return data;
    }
    return null;
}

/**
 * This method is used to get the width of the scroll Bar.
 */

renderingUtils.getScrollBarWidth = function () {
    var inner = document.createElement('p');//No I18N
    inner.style.width = "100%";//No I18N
    inner.style.height = "200px";//No I18N  
    var outer = document.createElement('div');//No I18N
    outer.style.position = "absolute";//No I18N
    outer.style.top = "0px";//No I18N
    outer.style.left = "0px";//No I18N
    outer.style.visibility = "hidden";//No I18N
    outer.style.width = "200px";//No I18N
    outer.style.height = "150px";//No I18N
    outer.style.overflow = "hidden";//No I18N
    outer.appendChild(inner);
    document.body.appendChild(outer);// eslint-disable-line zstandard/no-body-events
    var w1 = inner.offsetWidth;// eslint-disable-line webperf/layout-thrashing
    outer.style.overflow = 'scroll';//No I18N
    var w2 = inner.offsetWidth;// eslint-disable-line webperf/layout-thrashing
    if (w1 == w2) {
        w2 = outer.clientWidth;// eslint-disable-line webperf/layout-thrashing
    }
    document.body.removeChild(outer);
    renderingUtils.getScrollBarWidthValue = w1 - w2;
}

$(document).ready(function () {// eslint-disable-line zstandard/no-body-events
    renderingUtils.getScrollBarWidth();
});


/*
 * This method is used to destroy the list view Table 
 */

//renderingUtils.listviewTableDestroy = function(){ /* eslint-disable-line no-empty */
//	if($('#listviewtablescroll').length){	
//		return;
//	}
//}

/**
 * This method is used to resize the window's Height,Width,OuterHeight and Outerwidth
 */

renderingUtils.resizeWindowHW = function () {
    renderingUtils.windowHeight = $(window).height();//eslint-disable-line zohocrm/no-window-dimensions
    renderingUtils.windowWidth = $(window).width();//eslint-disable-line zohocrm/no-window-dimensions
    renderingUtils.windowOuterHeight = $(window).outerHeight();//eslint-disable-line zohocrm/no-window-dimensions
    renderingUtils.windowOuterWidth = $(window).outerWidth();//eslint-disable-line zohocrm/no-window-dimensions
}

/**
 * This method is used to construct header Row in list view as per browser.
 * @see Please refer the example of {@link renderingUtils.listviewFixedTable}. This method would fix the header row at a fixed position depending on the viewPort and browser window.
 */

renderingUtils.listviewFixedColumn = function () {
    var route = Lyte.Router.getRouteInstance().transition.info.route;
    var windowHeight = renderingUtils.windowOuterHeight;
    if (route === "crm.tab.module.custom-view.list") {
        var cvheight = $(".cvpadding");
        renderingUtils.listviewTable = cvheight.offset().top + cvheight.outerHeight();
    } else {
        var cvpadding = $("#cvpadding");
        renderingUtils.listviewTable = cvpadding.offset().top + cvpadding.outerHeight();
        var fixedheadercolumnObj = $('.fixedheadercolumn');
    }
    renderingUtils.listviewTableHeightVal = windowHeight - (renderingUtils.listviewTable + 88);
    getElemById("listviewtablescroll").style.maxHeight = renderingUtils.listviewTableHeightVal + "px";//No I18N
    var listViewTableHig = $("#listviewtablescroll").height();	//eslint-disable-line webperf/layout-thrashing
    var fixedRowHeaderTop = 41;
    if ($('.mac.chrome,.mac.safari,.safari').length > 0) {
        fixedRowHeaderTop = 42;
    }
    if (route !== "crm.tab.module.custom-view.list") {
        var fixedRowHeaderElem = getElemById("fixedRowHeader");
        fixedRowHeaderElem.style.left = renderingUtils.lvLeftFilterWidth + "px";
        fixedRowHeaderElem.style.top = renderingUtils.listviewTable + fixedRowHeaderTop + "px";
        fixedRowHeaderElem.style.height = listViewTableHig - 44 + "px";
    }
    if (typeof CrmPlusImpl !== "undefined" && CrmPlusImpl.isLoadedInCrmplus()) {
        fixedheadercolumnObj.css({ 'left': renderingUtils.lvLeftFilterWidth, 'top': renderingUtils.listviewTable });//No I18N
        if (customViewObject.isPrivacyListView) {
            fixedheadercolumnObj.css({ 'left': renderingUtils.lvLeftFilterWidth, 'top': '61px' });//No I18N
        }
    }
    else if (route !== "crm.tab.module.custom-view.list") {
        fixedheadercolumnObj.css({ 'left': renderingUtils.lvLeftFilterWidth, 'top': renderingUtils.listviewTable });//No I18N
        //		 else{
        //			 $('#listviewHeaderRow .lyteFixedColumn').css({'left':renderingUtils.lvLeftFilterWidth,'top':renderingUtils.listviewTable});
        //		 }
    }
}

/**
 * This method is used to construct header Row in list view as per browser when RTL is enabled. i.e, When locale is set to Arabic or Hebrew
 * @see Please refer the example of {@link renderingUtils.listviewFixedTable}. This method would fix the header row at a fixed position depending on the viewPort and browser window (Note only for RTL enabled locale).
 */

renderingUtils.listviewFixedColumnRTL = function () {

    var windowHeight = renderingUtils.windowOuterHeight;
    var fixedRowHeaderObj = $("#fixedRowHeader");
    var cvPaddinVar = $("#cvpadding");
    renderingUtils.listviewTable = cvPaddinVar.offset().top + cvPaddinVar.outerHeight();
    renderingUtils.listviewTableHeightVal = windowHeight - (renderingUtils.listviewTable + 88);
    var listviewtableScr = $("#listviewtablescroll");
    var fixedheadercolumnObj = $('.fixedheadercolumn');
    var fixedheadercolumnht = $('#fixedheadercolumn').outerHeight();
    renderingUtils.fixedRowHeaderTableTD = $('#fixedRowHeaderTable > .tr > .td').height();
    listviewtableScr.css({ 'max-height': renderingUtils.listviewTableHeightVal }); //No I18N
    var fixedRowHeaderTop = 42;
    if ($('.chrome,.safari').length > 0) {
        $('.fixedrowTd').find('td').css('display', 'inline-table');
    }
    else {
        fixedRowHeaderTop = 42;
    }
    //eslint-disable-next-line webperf/layout-thrashing 
    fixedRowHeaderObj.css({ 'top': renderingUtils.listviewTable + fixedRowHeaderTop, 'height': listviewtableScr.height() - 44 }); //No I18N
    fixedheadercolumnObj.css({ 'top': renderingUtils.listviewTable });//No I18N
    //eslint-disable-next-line webperf/layout-thrashing
    if (customViewObject.isPrivacyListView) {
        var topCalc = renderingUtils.listviewTable + fixedRowHeaderTop + 2;
        fixedheadercolumnObj.css({ 'top': topCalc + 3 });//No I18N
        fixedRowHeaderObj.css({ 'top': topCalc + fixedheadercolumnht }); //No I18N
    }
}

/**
 * This method is used to construct Customization table in Canvas view as per browser.
 */

renderingUtils.listviewCustomizationtable = function () {
    var listviewtableScr = $("#canvasview-tablescroll");
    var countbarEle = $('#bottomTotalCountBar').outerHeight();
    if (listviewtableScr.length) {
        var offSetTop = listviewtableScr.offset().top
        var windowHeight = renderingUtils.windowOuterHeight;
        if (listviewnewenable) {
            renderingUtils.listviewTable = offSetTop + countbarEle + 28;
            renderingUtils.listviewTableHeightVal = windowHeight - renderingUtils.listviewTable;
            listviewtableScr.css({ 'max-height': renderingUtils.listviewTableHeightVal }); //No I18N
        } else {
            renderingUtils.listviewTable = document.getElementsByClassName("cvpadding")[0].offsetTop + 67;
            renderingUtils.listviewTableHeightVal = windowHeight - renderingUtils.listviewTable - 130;
            listviewtableScr.css({ 'max-height': renderingUtils.listviewTableHeightVal }); //No I18N
        }
    }

}

/**
 * This method is used to Construct the old list view table when clicked on the list of leads,contacts in detail view page.
 * <h3> Example </h3><br/>
 * <img src="./images/listViewCommon.png">
 */

renderingUtils.listviewFixedTable = function () {
    var listviewtablescroll = $('#listviewtablescroll');
    var scrollLeftListview = listviewtablescroll.scrollLeft();
    var fixedHeaderTable = $("#fixedHeaderTable");
    var scrollRightListview = fixedHeaderTable.css('right');//No I18N
    var LVFirstCol = $('#lvTred .LVFirstCol');
    var LVSecondCol = $('#lvTred .LVSecondCol');
    var fixedColumnLVFWidth = LVFirstCol.length === 0 ? undefined : LVFirstCol.eq(0).outerWidth();
    var fixedColumnLVLWidth = LVSecondCol.length === 0 ? undefined : LVSecondCol.eq(0).outerWidth();
    var fixhead_h = $('#listviewHeaderRow').height();
    var fixedHeaderDOM = $('#fixedHeader');
    var fixedHeaderDOMWidth = fixedHeaderDOM.outerWidth()
    var fixedHeaderDOMHeight = fixedHeaderDOM.height()
    var fixedRowHeader = $("#fixedRowHeader");
    //No I18N
    $('body').css('overflow', '');
    if ($('.listviewtablescroll').length) {
        renderingUtils.lvLeftFilterWidth = customViewObject.isPrivacyListView || customViewObject.isCampaignAddMemberListView ? '260px' : '0px';//No I18N
        var lvLeftFilterStatus = document.getElementById("lv_left_filter").style.display;
        if (lvLeftFilterStatus === 'block' || lvLeftFilterStatus === '') {
            renderingUtils.lvLeftFilterWidth = customViewObject.isPrivacyListView || customViewObject.isCampaignAddMemberListView ? '560px' : '300px';//No I18N
        }
        var fhc = $('.fixedheadercolumn');
        fhc.show();
        fixedHeaderDOM.hide();
        if ($("#lvNoRecordsFound").length === 0) {
            //				fixedHeaderDOM.hide();
            if (Crm.userDetails.RTL_ENABLED) {
                renderingUtils.listviewFixedColumnRTL();
                fixedHeaderTable.css('right', '-' + scrollRightListview + "px");//No I18N
            }
            else {
                renderingUtils.listviewFixedColumn();
                fixedHeaderTable.css('left', '-' + scrollLeftListview + "px");//No I18N
            }
            fixedHeaderDOM.show();
            renderingUtils.generateColumnHeader();
            getElemById("fixedRowHeader").style.width = fixedColumnLVFWidth + fixedColumnLVLWidth + "px";
            var fhc_w = fixedColumnLVFWidth + fixedColumnLVLWidth;
            //				var fhc = $('.fixedheadercolumn');
            //				fhc.show();
            fhc.css('width', fhc_w);//No I18N
            $('.LVFirstFixedHeaderCol').css('width', fixedColumnLVFWidth);
            $('.LVSecondFixedHeaderCol').css('width', fixedColumnLVLWidth);
            fixedRowHeader.removeClass('fixedRowHeaderHide');
            renderingUtils.setRowH(fixedColumnLVFWidth);
            renderingUtils.setColW();
            renderingUtils.setColumnHeaderPosition();
            thirdPartyUtils.bindTableScroll();
            renderingUtils.fixedRowHeaderWheelBind();
            renderingUtils.freezeBody();
            if (Crm.userDetails.RTL_ENABLED) {
                scrollLeftListview = 10;
                if (thirdPartyUtils.scrollLeftpos != fixedHeaderDOMWidth) {
                    fhc.show();
                }
            }
            else if (scrollLeftListview > 0) {
                fixedRowHeader.show();
            }
            if (Crm.userDetails.RTL_ENABLED) {
                fixhead_h = fixedHeaderDOMHeight - 1;
                fixhead_h = fixhead_h - 20;
            }
            $('#fixedheadercolumn').find('td').css('height', fixhead_h);
            fixedHeaderDOM.find('td').css('height', fixhead_h - 2);//No I18N
        }
        else {
            //				var fhc = $('.fixedheadercolumn');
            renderingUtils.lvLeftFilterWidth = 0;
            if (lvLeftFilterStatus === 'block' || lvLeftFilterStatus === '') {
                renderingUtils.lvLeftFilterWidth = '300px';//No I18N
            }
            //				fhc.show();
            if (Crm.userDetails.RTL_ENABLED) {
                renderingUtils.listviewFixedColumnRTL();
            }
            else {
                renderingUtils.listviewFixedColumn();
            }
            fixedRowHeader.addClass('fixedRowHeaderHide');
            fhc.hide();
            //				fixedHeaderDOM.hide();
            if (!Crm.userDetails.RTL_ENABLED) {
                listviewtablescroll.scrollLeft(0);
            }
        }
        listviewtablescroll.scrollTop(0);
    }
}

/**
 * This method is used to construct different List view table based on its route configured.
 * @see Please refer the example of {@link renderingUtils.listviewFixedTable}. This method would render this table if the routeName is not list.
 */

renderingUtils.tableSorter = function () {
    var routeName = Lyte.Router.getRouteInstance().routeName;
    if (customViewObject.isCustomizedView == true) {
        renderingUtils.listviewCustomizationtable();
    } else if (routeName !== "list") { //No I18N
        renderingUtils.listviewFixedTable();
    }
}

/**
 * This method is used to construct the Header of the list view table.
 * @see Please refer the example of {@link renderingUtils.listviewFixedTable}. This method would construct the column headers.
 */

renderingUtils.generateColumnHeader = function () {
    var originalTable = $('#listViewTable');
    var th = originalTable.find('#listviewHeaderRow td');//eslint-disable-line webperf/directly-select-with-id
    var fixedHeaderTr = $('#fixedHeader .tr');
    var docfragCol = document.createDocumentFragment();
    fixedHeaderTr.empty();
    var td;
    for (var i = 0; i < th.length; i++) { //eslint-disable-line zstandard/proper-usage-of-loop
        td = $(th[i]).clone();
        td.removeClass('th').addClass('td fixedHeaderTd');
        $(docfragCol).append(td);

    }
    fixedHeaderTr.append(docfragCol);//eslint-disable-line zohocrm/check-html-usage
}

/**
 * This method is used to set the Row Height of the list view table.
 * @see Please refer the example of {@link renderingUtils.listviewFixedTable}. Row height of this table is calculated depending on the viewPort and browser window.
 */

renderingUtils.setRowH = function (fixedColumnLVFWidth) {
    var snoParent = $('#lvTred').find('tr');
    var row = $('.fixedrowTd').find('tr');
    var rowHeights = [];
    var rowDOMs = [];
    var noOfParents = snoParent.length;
    for (var i = 0; i < noOfParents; i++) {
        var rowObject = snoParent.eq(i);
        rowHeights[i] = { };
        rowHeights[i].height = rowObject[0].getBoundingClientRect().height;
        rowHeights[i].maxHeight = rowObject.outerHeight();
        rowDOMs[i] = { };
        var rowDOM = row.eq(i);
        rowDOMs[i].dom = rowDOM;
        rowDOMs[i].td = rowDOM.find('td');
        rowDOMs[i].LVFirstFixedCol = rowDOM.find('.LVFirstFixedCol > div');
    }
    for (var i = 0; i < noOfParents; i++) {
        rowDOMs[i].dom.css({ 'max-height': rowHeights[i].maxHeight, 'height': rowHeights[i].height });
        rowDOMs[i].td.css({ 'height': rowHeights[i].height - 23 });
        rowDOMs[i].LVFirstFixedCol.css({ 'width': fixedColumnLVFWidth - 13 });
    }
}

/**
 * This method is used to set the Column Width of the list view table.
 * @see Please refer the example of {@link renderingUtils.listviewFixedTable}. Column Width of this table is calculated depending on the viewPort and browser window.
 */

renderingUtils.setColW = function () {
    var row = $('#fixedHeader').find('td');
    var rowWidths = [];
    var td_first_row = $('#listviewHeaderRow').find('td');
    var ln = row.length;
    if (Crm.userDetails.RTL_ENABLED) {
        var ln = row.length;
        for (var i = 0; i < ln; i++) {
            rowWidths[i] = td_first_row.eq(i).width() - 10;
        }
    }
    else {
        for (var i = 0; i < ln; i++) {
            rowWidths[i] = td_first_row.eq(i).width();
        }
    }
    var fixedHeaderTd = document.getElementsByClassName("fixedHeaderTd"); // No I18N
    for (var i = 0; i < ln; i++) {
        fixedHeaderTd[i].style.minWidth = rowWidths[i] + "px";
        fixedHeaderTd[i].style.maxWidth = rowWidths[i] + "px";
    }

}

/**
 * This method is used to position the list view table's header (column) according to the viewport size.
 * @see Please refer the example of {@link renderingUtils.listviewFixedTable}. To position the column header depending on the viewPort and browser window. 
 */

renderingUtils.setColumnHeaderPosition = function () {
    if ($('#listviewtablescroll').length) {
        var fixedHeader = $('#fixedHeader');
        var listViewTable = $('#listViewTable');
        var originalTable = listViewTable.parent();
        var pos = originalTable.offset();
        var l = pos.left;
        var t = pos.top;
        if (l == 0) {
            l = 2;
        }
        var w = listViewTable.width();
        if (!Crm.userDetails.RTL_ENABLED) {
            fixedHeader.css({ 'top': t, 'left': l + 1, 'width': w });//No I18N
        } else {
            fixedHeader.css({ 'top': t, 'width': w });//No I18N
        }
    }
}


/*
 *  Checking InnerscrollDiv For scroll issue while opening select 2 
 */
/*
renderingUtils.checkOverflowInnerContainer = function(divs,i,flag){
    var divIndex = $(divs[i]);
    if(i < divs.length){
        if(divIndex.is(':visible')){
            if(flag){
                divIndex.css('overflow','hidden');//No I18N
            }
            else{
                divIndex.css('overflow','');//No I18N
            }
        }
        i++;
        renderingUtils.checkOverflowInnerContainer(divs,i,flag)
    }
}
*/
/**
 * This method is used to freeze the body when the list view table is rendered from related list
 * @see Please refer to the example provided in {@link renderingUtils.listviewFixedTable}. Note that the background is freezed.
 */

renderingUtils.freezeBody = function () {
    var fixedRowHeaderTable = $('#fixedRowHeaderTable');
    var firefoxCheck = $('html').hasClass('firefox');	//No i18N
    if (!firefoxCheck) {
        fixedRowHeaderTable.on('mouseover', function () {
            $('body').css({ 'overflow': 'hidden' });
        })
        fixedRowHeaderTable.on('mouseout', function () {
            $('body').css({ 'overflow': '' });
        })
    }
}

/**
 * This method is used to Bind the scroll event for the list view table.This method would fix the checkbox header at the top during scroll on either sides.
 * @see Please refer to the example of {@link renderingUtils.listviewFixedTable}. Note the scroll bar on the right side and bottom.
 */

renderingUtils.fixedRowHeaderWheelBind = function () {
    var fixRHead = $('#fixedRowHeader');
    var fixedRowHeaderDOM = $('#fixedRowHeaderTable');
    var fixedRowH = fixedRowHeaderDOM.height();
    fixRHead.show();
    var fixContainerHeight = renderingUtils.listviewTableHeightVal - 44;

    fixRHead.hide();
    var negRowH = -1 * fixedRowH + fixContainerHeight;
    fixRHead.off('wheel');//No i18N
    if (negRowH < 0) {
        fixRHead.on('wheel', function (e) {
            var fixedRowHeaderDOM = $('#fixedRowHeaderTable');
            var origTableCont = $('#listviewtablescroll');
            e.stopPropagation();
            var curTop = fixedRowHeaderDOM.position().top;
            var deltaY = e.originalEvent.deltaY;
            var newPos = curTop - deltaY;
            if (newPos > 0) {
                newPos = 0;
            }
            else if (newPos < negRowH) {
                newPos = negRowH;
            }
            fixedRowHeaderDOM.css({ 'top': newPos });//No I18N
            origTableCont.scrollTop(-1 * newPos);
        });
    }
}

/**
 * This method is used to prevent the parent element from scrolling and the child is bind with scroll event.
 * @param {HTMLElement} id - This provides the Element whose parent element has to be prevented from scrolling.
 */

renderingUtils.scrollPrevent = function (obj) {
    $(obj).on('mousewheel DOMMouseScroll', function (e) {//No I18N
        if ($(obj).width() < $(obj).closest(".zcrm-modal").width()) {//No I18N
            var event = e.originalEvent,
                d = event.wheelDelta || -event.detail;
            this.scrollTop += (d < 0 ? 1 : -1) * 10;
            e.preventDefault();
        }
    });
}

/**
 * This method is used to show an custom Alert message 
 * <h3> Example </h3><br/>
 * <img src="./images/showCustomAlert.png">	 
 * @param {String} msg - This provides the custom alert message to be shown as provided in the example.
 * @param {String} titleMsg - This provides the alert title message to be shown. 
 * @param {Boolean} isHtml - It is set to True if the message is to be rendered as a HTML and false if to be printed as string
 * @param {Function} callbackFunc - This provides a callback Function which is called once the Custom alert Popup is shown.
 * @param {Object} params - This provides the param that has to be set when the callBack is being called.
 * @param {String} buttonText - This provides the custom button name that has to be shown.Note that by default 'Ok,got it!' will be the button text.
 */

renderingUtils.showCustomAlert = function (msg, titleMsg, isHtml, callbackFunc, params, buttonText) {
    var customAlertObj = $('#custom_alert_popup');
    customAlertObj.attr('data-show', true);//No I18N
    if (isHtml) {
        $('#custom_alert_msg').html(msg);
    }
    else {
        $('#custom_alert_msg').text(msg);
    }
    if (titleMsg) {
        $('#alert_title').text(titleMsg).show();
    }
    else {
        $('#alert_title').hide();
    }
    showAnimatePopup('custom_alert_popup');//No I18N
    var alertButtonObj = $('#custom_alert_button');
    alertButtonObj.val(buttonText || I18n.getMsg("crm.nsocial.onboard.got.it"));
    setTimeout(function () {
        [0]
        customAlertObj.removeAttr('data-show');//No I18N
        var lenthObj = $('#custom_alert_button');
        if (lenthObj.length > 0) {
            lenthObj.eq(0).focus();
        }
    }, 100);
    $("#custom_alert_button").unbind("click");//eslint-disable-line webperf/no-multipleDOMLookup
    if (callbackFunc) {
        if (params) {
            alertButtonObj.unbind("click").click({ params: params }, callbackFunc);//No I18N
        } else {
            alertButtonObj.unbind("click").click(callbackFunc);//No I18N
        }
    }
    else if (!customAlertObj.attr('data-show')) {
        if (callbackFunc) {
            callbackFunc();
        }
    }
}

/**
 * This method is used to create a input box and select box in crmEvents in the participant reminder input box. Note the seperate input box for providing custom time unit and select box with default values.
 * <h3> Example </h3><br/>
 * <img src="./images/saveValtoopt.png">	 
 * @param {String} id - This provides the id of the select box in which the event is occurring.
 * @param {String|Number} val - This provides the time that is set for the reminder.
 * @param {String} dataVal - This provides the time with the its unit set for the reminder.
 * @returns {HTMLElement} - It returns the new input field with the time input field and select box.
 */

renderingUtils.saveValtoopt = function (id, val, dataVal) {
    var temp = $($("#" + id).html());
    temp.eq(0).attr('data-value', dataVal);//no i18n
    if (val !== "") {
        temp.eq(0).attr('value', val);//no i18n
        temp.eq(0).show();
    }
    else {
        temp.eq(0).hide();
    }
    var input = $('<div>').append(temp[0]).html() + "<div class='selectOpt dIB vam' onmouseenter='$(this).parent(&#39;.selectBoxInput&#39;).css(&#39;border&#39;,&#39;1px solid #ddd&#39;);' onmouseleave='$(this).parent(&#39;.selectBoxInput&#39;).css(&#39;border&#39;,&#39;&#39;);sE(event);'>";
    input = input + "<span class='slctOptVal'";//no i18n
    if (Events.setPadding(val) == true) {
        input = input + "style='padding-left:10px'";//no i18n
    }
    input = input + ">";//no i18n
    return input;
}

/**
 * This method is used to check whether the element is present in View port  
 * @param {jQueryElement} el - This provides the jQueryElement that is to be checked
 * @returns {Boolean} - It returns True if the element is present in the ViewPort and False if not  
 */

renderingUtils.isElementInViewport = function (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

/**
 * This method is used to freeze the property of the Object i.e, it cannot be rewritten and cannot be configured
 * @param {Object} obj - This provides the Object whose property has to be freezed.
 * @param {String} property - This provides the propert name which has to be freezed.
 * @example
 * var obj = {name:"Moe",age:30}
 * renderingUtils.freezeProperty(obj,"name")
 * obj.name = "test" //This wont change the obj.name as test.
 */

renderingUtils.freezeProperty = function (obj, property) {
    Object.defineProperty(obj, property, { enumerable: false, configurable: false, writable: false });
}

/**
 * This method is used to forcibly move to another route or refresh the current route in case of updating any new data. 
 * @property {Object} transInfo - This provides the object which contains  
 * @property {String} transInfo.route -This provides the route to which the page has to transition
 * @property {Object} transInfo.queryParams - This provides the query params and dynamic params required for the transition to occur.
 * @example
 * renderingUtils.forceTransitionTo(Lyte.Router.getRouteInstance('crm.settings.section.webform').transition.info);
 * => // When the present route is webform this method would simply refreshes the route.
 */

renderingUtils.forceTransitionTo = function (transInfo) {
    var doRefresh = false;
    var curInfo = Lyte.Router.getRouteInstance().transition.info;
    if (transInfo.route == curInfo.route) {
        doRefresh = true;
        if (!transInfo.queryParams) { transInfo.queryParams = { }; }
        if (!transInfo.dynamicParams) { transInfo.dynamicParams = []; }
        //		var queryParam_same = objectUtils.compareObjects(transInfo.queryParams,curInfo.queryParams);
        //		var dynamicParam_same = objectUtils.compareObjects(transInfo.dynamicParams,curInfo.dynamicParams);
        var queryParam_same = $u.isEqual(transInfo.queryParams, curInfo.queryParams);
        var dynamicParam_same = $u.isEqual(transInfo.dynamicParams, curInfo.dynamicParams);
        if (queryParam_same && dynamicParam_same) {
            doRefresh = true;
        }
        else {
            doRefresh = false;
        }
    }
    if (doRefresh) {
        Lyte.Router.getRouteInstance().refresh();
    }
    else {
        Lyte.Router.transitionTo({ "route": transInfo.route, "dynamicParams": transInfo.dynamicParams, "queryParams": transInfo.queryParams });
    }
}

/**
 * This method is used to get the Singular name/Label of the Module 
 * @param {String} module - This provides the Module whose label is to be returned 
 * @returns {String} - It returns the Singular Name/Label of the module that is provided
 * @example
 * renderingUtils.getSingularLabel("Leads")
 * => "Lead"
 */

renderingUtils.getSingularLabel = function (module) {
    return I18n.getMsg(Crm.moduleInfo[module].singularLabel);
}

/**
 * This method is used to get the Plural name/Label of the Module 
 * @param {String} module - This provides the Module whose label is to be returned 
 * @returns {String} - It returns the Plural Name/Label of the module that is provided
 * @example
 * renderingUtils.getPluralLabel("Leads")
 * => "Leads"
 */

renderingUtils.getPluralLabel = function (module) {
    return I18n.getMsg(Crm.moduleInfo[module].pluralLabel);
}

/**
 * This method is used to show Error Messages in lyte Fields.
 * <h3> Example </h3><br/>
 * <img src="./images/showLyteErrorMessage.png">
 * @param {String} message - This provides the Custom message that is to be displayed under the fields.
 * @param {HTMLElement} borderElem - This provides the field which is validated and to which the Error Message has to be displayed.
 * @param {String} id - id of the Element, it  is used to remove/add messages, some lyte elements don't have id(ex:lytefield),so need id explicitly.
 */

renderingUtils.showLyteErrorMessage = function (message, borderElem, id) {
    if (id) {
        id = id.replace('#', '');
    }
    var elemId = borderElem.attr("id");//No I18n
    elemId = elemId != undefined ? elemId : id;
    $("#lyteerrorMsg_" + elemId).remove();
    var errSpn = document.createElement("span");
    var $errSpn = $(errSpn);
    if (elemId) {
        $errSpn.html(message).attr({ "class": "lyteErrorMsg", "id": "lyteerrorMsg_" + elemId }); // No I18N
    }
    else {
        $errSpn.html(message).attr({ "class": "lyteErrorMsg" }); // No I18N
    }
    borderElem.addClass('lyteErrorBorder');
    borderElem.append(errSpn);//no i18n
    /* special handle for small input boxes */
    if (borderElem.outerWidth() < 200) { //eslint-disable-line webperf/layout-thrashing
        $errSpn.css('whiteSpace', 'nowrap');//NO I18n
    }
}

/**
 * This method is used to Hide the Lyte Error Messages. Note that this method would be invoked as soon as the value in the field is changed.
 * @see Please refer to the example of {@link renderingUtils.showLyteErrorMessage}.  
 * @param {HTMLElement} container - This provides the HTMLElement from which the Error message has to be removed
 */

renderingUtils.hideLyteErrorMessages = function (container) {
    $(container).find('.lyteErrorMsg').remove(); //No I18n
    $(container).find('.lyteErrorBorder').removeClass('lyteErrorBorder');
}

/**
 * This method is used to get the Data transfer object. i.e, the data that is taken when paste event occurs.In this method they 
 * @param {ClipboardEvent} event - This provides the events that occur when the clipboard is modified, belongs to the ClipboardEvent Object.
 * @returns {String} - It returns the data in the clipboard as a string.
 */

renderingUtils.getClipBoardData = function (event) {
    var clipboardData;
    if (event.clipboardData && event.clipboardData.getData("text/plain")) {
        clipboardData = event.clipboardData.getData("text/plain"); // NO I18N
    } else if (window.clipboardData && window.clipboardData.getData("text")) {
        clipboardData = window.clipboardData.getData("text"); // NO I18N
    } else {
        clipboardData = event.originalEvent.clipboardData.getData("text/plain"); // NO I18N
    }
    return clipboardData;
}

/**
 * This method will get element from clipboardEvent and sets a limit for the text-area if provided, It would extract plain-text from the clipboard event and paste it in the text-area.
 * @param {HTMLElement} elem - This provides the HTML Element in which the paste event occurs.
 * @param {ClipboardEvent} event - This provides the events that occur when the clipboard is modified, belongs to the ClipboardEvent Object.
 * @param {Number} limit - This provides the limited number of characters that can be pasted on that particular field.
 */

renderingUtils.restrictPaste = function (elem, event, limit) {
    event.preventDefault();
    var pasteText = renderingUtils.getClipBoardData(event);
    var currentText = $(elem).text();

    if (limit && currentText.length + pasteText.length > limit) {
        var remLen = limit - currentText.length;
        pasteText = pasteText.substring(0, remLen);
    }

    if (pasteText.length > 0) {
        document.execCommand("insertHTML", false, $ESAPI.encoder().encodeForHTML(pasteText));//No I18N
    }
}

/**
 * This method is used to show an Custom Alert Message box with an accept message.
 * <h3> Example </h3><br/>
 * <img src="./images/showAlertMsg.png">
 * @param {String} alertMsg - This provides the custom alert message that has to be dispalyed in the alert box.
 * @param {String} type - This provides type of alert Message. i.e, whether it is a success message or an error message.
 * @param {Object|Boolean} button - This provides whether it is a custom button or not. If it is a custom button, then the button properties are passed as an object. If not needed simply a false boolean value is passed.
 * @param {Object} callback - This provides an object with the properties needed for the Alert message box which passed to the cruxUtils.showAlertMsg method.
 */

renderingUtils.showAlertMsg = function (alertMsg, type, button, callback) {
    if (!button) {
        button = [{ "type": "accept", "text": I18n.getMsg('crm.mb.newversion.msg4'), "appearance": "primary" }];//no i18n
    }
    if (!callback) {
        callback = { };
    }
    callback.params = { ltPropPrimaryMessage: "", ltPropContentAlign: "center", ltPropWrapperClass: "utilsAlertMsg", ltPropSecondaryMessage: "X", ltPropButtons: button }
    if (type) {
        callback.params.ltPropType = type;
    }
    callback.show = function (a) {
        $L(".utilsAlertMsg").find("lyte-button").focus();//No I18N
        var msgNode = a.childComp.querySelector('.alertSecondaryMsg') //no i18n
        msgNode.innerHTML = alertMsg;
        msgNode.classList.add("crm-font-regular");//no i18n
    }
    _cruxUtils.showCustomAlert(callback)

}

/**
 * This method is used to show a message box when an success or event occurs
 * <h3> Example </h3><br/>
 * <img src="./images/showMsgBox.png">
 * Note : The small message box is shown with a success type.	
 * @param {String} alertMsg - This provides the custom Message that is to be shown in the message box.
 * @param {String} type - This provides type of Message. i.e, whether it is a success message or an error message.
 * @param {Object} properties(optional) - This provides the custom property that are to be shown in the Message box.If the properties argument is not passed the object is constructed inside the method with available arguments.
 */

renderingUtils.showMsgBox = function (alertMsg, type, properties) {
    var ele = document.getElementById("lyteMsgBox");
    if (!properties) {
        properties = { };
    }
    properties.ltPropType = type;
    properties.ltPropMessage = alertMsg;
    properties.ltPropDuration = properties.ltPropDuration ? properties.ltPropDuration : "3000";
    properties.id = "lyteMsgBox";
    if (ele) {
        ele.ltProp({ message: properties.ltPropMessage, type: properties.ltPropType, duration: properties.ltPropDuration });
    } else {
        ele = Lyte.Component.render("lyte-messagebox", properties, "body");//No I18n
    }

    //	ele.setMethods( 'onClose', function(arg){ //no i18n
    //		 document.body.removeChild( arg.$node );
    //	 })
    //	ele.ltProp({"message" : alertMsg,"type" : type});//No I18n
    ele.ltProp("show", true);//No I18n
}

/**
 * This method is used to remove the Cache data in local setup
 */
/*--------- removeFromCache(Wrapper function) for local setup starts-----------*/

renderingUtils.RemoveFromCache = function () {
    var oldRemoveFromCacheAssign = Lyte.removeFromCache.assign;
    Lyte.removeFromCache.assign = function (arr) {
        if (typeof arr !== "undefined") {
            arr = commonUtils.getArrayList(arr);
            return oldRemoveFromCacheAssign(arr[0]);
        } else {
            return;
        }
    }
}

/**
 * This method is used to empty the search box and trigger the keyup event.
 * @see Please refer the example of {@link renderingUtils.searchKey} in which there is a 'X' symbol for emptying search Box.
 */

renderingUtils.emptySearchBox = function () {//No I18N		  
    $("#searchField").val("").trigger('keyup');
}

/**
 * This method is used to get the value from the search box of the available lists in kanbanView settings or in Custom view.
 * <h3> Example </h3><br/>
 * <img src="./images/searchKey.png">
 * @param {HTMLElement} obj - This provides the HTML Element at which the event is occuring.
 * @param {Event} event -This provides the keyboard event from which the searched Key can be determined.
 */

renderingUtils.searchKey = function (obj, event) {//No I18N
    if (event) {
        $("#emptySearch").css("display", obj.value ? "block" : "none");
        showMacroSuggest(obj, event, 'availableList', 'li', 'noRecords', '', '', '', undefined, undefined, 'false', true);//No I18n
    }
    else {
        $("#emptySearch").css("display", obj ? "block" : "none");
        commonUtils.searchedFields(moduleJSON, obj);
    }
}

/**
 * This method is used to remove the multiple spaces and replace them with a single space 
 * @param {String} val - This provides the string from which the multiple spaces are to be removed.
 * @example
 * renderingUtils.removeMultiSpacestoSingleSpace("test   test")
 * => "test test"
 */

renderingUtils.removeMultiSpacestoSingleSpace = function (val) {
    return typeof val === 'string' ? val.replace(/  +/g, ' ') : val; //No i18n
}


//Use only for firefox and chrome. Don't use for IE  
/**
 * This method is used to get the First Child of the HTMLElement by skipping the textnodes
 * @param {HTMLElement} el - The HTMLElement whose First child has to be found.
 * @returns By skipping all the Textnodes which were the child of the HTMLElement and returns the First Child
 */

renderingUtils.getFirstChild = function (el) {//No I18N
    var firstChild = el.firstChild;
    while (firstChild != null && firstChild.nodeType === 3) { // skip TextNodes
        firstChild = firstChild.nextSibling;
    }
    return firstChild;
}

/**
 * This method is used to get the pick list value present in the DOM and check whether it matches the system Value. If it matches it is returned.
 * @param {String} elemID - This provides the ID of the pick list whose Chosen value has to be taken.
 * @param {String} systemVal - This provides the default system value which has to match inorder to return the DOM Value else null is returned.
 */

renderingUtils.getPickListDisplayValuebyDomAndSysValue = function (elemID, systemVal) {//No I18n
    var pickMap = $("#" + elemID).data().picklistmap;
    var pickLen = pickMap.length;
    for (var i = 0; i < pickLen; i++) {
        if (pickMap[i].systemvalue == systemVal) {
            return pickMap[i].uservalue;
        }
    }
    return null;
}

/**
 * This method is used to get the pick list value present in the DOM and check whether it matches the default Value. If it matches it is returned.
 * @param {Object} columnData - This provides pick list data which consists of the pick list map and default value which are to be compared.
 */

//To get picklist SystemValue by columnData
renderingUtils.getPickListDefaultValToActualValDetailView = function (columnData) {//No I18n
    var defaultVal = columnData.defaultvalue;
    var pickListArr = columnData.picklistmap;
    var lenPickArr = pickListArr.length;
    for (var i = 0; i < lenPickArr; i++) {
        if (pickListArr[i].uservalue == defaultVal) {
            return pickListArr[i].systemvalue;
        }
    }
    return;
}

/**
 * This method is used to construct an anchor tag for the provided URL with rel attribute and target attribute set to Blank. Note that the Text for anchor tag will be exactly the same as the URL provided.
 * @param {String} content - This provides the URL as a string which may or may not be encoded without query params.
 */

renderingUtils.highlightUrlInText = function (content) {//No i18n
    if (content) {
        var urlRegex = /((https?|ftp)(:|&#x3a;)(\/\/|&#x2f;&#x2f;))((www\.){0,1}[a-zA-Z0-9-_]+(\.[a-z0-9]+)+)((:|&#x3a;)[0-9]*(\.[a-z0-9]+)*)*(((\/|&#x2f;)[^\s]*)*)|www\.([a-zA-Z0-9-_]+(\.[a-z0-9]+)+)((:|&#x3a;)[0-9]*(\.[a-z0-9]+)*)*(((\/|&#x2f;)[^\s]*)*)/g;
        return content.replace(urlRegex, function (url) {
            var preceding = "";
            if (url.indexOf("http") === -1 && url.indexOf("ftp") === -1) {
                preceding = "//"
            }
            return '<a class="link" rel="noopener noreferrer" href="' + preceding + url + '" target="_blank">' + url + '</a>';
        });
    }
    return "";
}

/**
 * Only for dropdown
 * This method is used for showing validation error message on lyte input components.
 * @see Please refer the example of {@link renderingUtils.showLyteErrorMessage}.Note that this method is only for dropdown lyte components.
 * @param {HTMLElement} parentScopeElement - This provides the parent element to find the exact scope of element at which validation happens.
 * @param {String} message - This provides the custom error message that has to be displayed.
 * @param {String} id- This provides the id of the Element, it  is used to remove/add messages, some lyte elements don't have id(ex:lytefield),so need id explicitly  
 */

renderingUtils.showLyteErrorMessageWithParentScope = function (message, id, parentScopeElement) {
    if (id) {
        id = id.replace('#', '');
    }
    var elemId = id;
    var $parentScopeElement = $(parentScopeElement).find('#' + id);//eslint-disable-line webperf/directly-select-with-id
    var borderElem = $parentScopeElement.find('lyte-drop-button');
    if (!borderElem.length) {
        var borderElem = $parentScopeElement.find('.lyteField');
    }
    if (parentScopeElement) {
        $("#lyteerrorMsg_" + elemId, parentScopeElement).remove();
    }
    else {
        $("#lyteerrorMsg_" + elemId).remove();
    }
    var errSpn = document.createElement("span");
    var $errSpn = $(errSpn);
    if (elemId) {
        $errSpn.html(message).attr({ "class": "lyteErrorMsg", "id": "lyteerrorMsg_" + elemId }); // No I18N
    }
    else {
        $errSpn.html(message).attr({ "class": "lyteErrorMsg" }); // No I18N
    }
    borderElem.addClass('lyteErrorBorder');
    borderElem.append(errSpn);//no i18n
    /* special handle for small input boxes */
    if (borderElem.outerWidth() < 200) { //eslint-disable-line  webperf/layout-thrashing
        $errSpn.css('whiteSpace', 'nowrap');//NO I18n
    }
}

