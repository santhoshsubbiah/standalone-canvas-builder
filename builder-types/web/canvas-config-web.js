
function horizontalaligntool(value) {
    var selectedlist = $('.zcanvas-selected-element,.zcanvas-multiselect'); // NO I18N

    var dimension = {};

    dimension.startY = _.min(selectedlist, function (item) { return item.offsetLeft; }).offsetLeft;

    var endyel = _.max(selectedlist, function (item) { return item.offsetLeft + item.offsetWidth; })

    dimension.endY = endyel.offsetLeft + endyel.offsetWidth;

    var undoobj = {
        action: 'link', // NO I18N
        actionarray: [],
        node: selectedlist
    }
    var _obj = { action: 'drag', current: {}, previous: {}, node: {} } // NO I18N

    if (value == 'zc-va-left') { // NO I18N
        selectedlist.each(function () {
            var $el = $(this);
            var obj = JSON.parse(JSON.stringify(_obj));
            obj.node = $el;
            var isField = $.map(selectedlist, function (e) { return $(e).is('.zcanvas-field'); }).indexOf(false) === -1;
            if (isField) {
                var obj2 = JSON.parse(JSON.stringify(_obj));
                obj2.node = $el;
                obj2.action = 'actionclasslist'; // NO I18N
                // eslint-disable-next-line layout-thrashing
                obj2.previous.class = $el.attr('data-zcanvasclass') || ''; // NO I18N
                if (obj2.previous.class.indexOf('zc-ta') > -1) {
                    $el.removeClass("zc-ta-right zc-ta-center").zremoveClass("zc-ta-right"); // NO I18N 
                    $el.zremoveClass("zc-ta-center");  // NO I18N
                    // eslint-disable-next-line layout-thrashing
                    obj2.previous.class = $el.attr('data-zcanvasclass') || ''; // NO I18N
                }
                $el.addClass('zc-ta-left').zaddClass('zc-ta-left'); // NO I18N
                // eslint-disable-next-line layout-thrashing
                obj2.current.class = obj2.previous.class + ' zc-ta-left'; // NO I18N
                undoobj.actionarray.push(obj2);
            }
            // eslint-disable-next-line layout-thrashing
            obj.previous.left = $el.position().left;
            // eslint-disable-next-line layout-thrashing
            $el.css('left', dimension.startY); // NO I18N
            // eslint-disable-next-line layout-thrashing
            obj.current.left = dimension.startY;
            undoobj.actionarray.push(obj);
        })
    } else if (value == 'zc-va-center') { // NO I18N
        var _width = dimension.endY - dimension.startY;
        var _mwidth = dimension.startY + parseInt(_width / 2);
        var isField = $.map(selectedlist, function (e) { return $(e).is('.zcanvas-field:not(.zcbdrbox)'); }).indexOf(false) === -1;
        selectedlist.each(function () {
            var $el = $(this);
            var obj = JSON.parse(JSON.stringify(_obj));
            obj.node = $el;
            // eslint-disable-next-line layout-thrashing
            obj.previous.left = $el.position().left;
            if (isField) {
                var obj2 = JSON.parse(JSON.stringify(_obj));
                obj2.node = $el;
                obj2.action = 'actionclasslist'; // NO I18N
                // eslint-disable-next-line layout-thrashing
                obj2.previous.class = $el.attr('data-zcanvasclass') || ''; // NO I18N
                if (obj2.previous.class.indexOf('zc-ta') > -1) {
                    // eslint-disable-next-line layout-thrashing
                    $el.removeClass("zc-ta-left zc-ta-right").zremoveClass("zc-ta-left"); // NO I18N 
                    $el.zremoveClass("zc-ta-right");  // NO I18N
                    obj2.previous.class = $el.attr('data-zcanvasclass') || ''; // NO I18N
                }
                // eslint-disable-next-line layout-thrashing
                $el.addClass('zc-ta-center').zaddClass('zc-ta-center'); // NO I18N
                // eslint-disable-next-line layout-thrashing
                obj2.current.class = obj2.previous.class + ' zc-ta-center'; // NO I18N
                undoobj.actionarray.push(obj2);
                // eslint-disable-next-line layout-thrashing
                obj.previous.width = $el.width();
                // eslint-disable-next-line layout-thrashing
                //    var newwidth =  _width - parseInt($el.css('padding-left')) - parseInt($el.css('padding-right')) - parseInt($el.css('border-right-width')) - parseInt($el.css('border-left-width')); // NO I18N
                // eslint-disable-next-line layout-thrashing
                $el.css({
                    width: _width /*newwidth*/,
                    left: dimension.startY
                });
                // eslint-disable-next-line layout-thrashing
                obj.current.width = _width;
                // eslint-disable-next-line layout-thrashing
                obj.current.left = dimension.startY;
            } else {
                // eslint-disable-next-line layout-thrashing
                value = _mwidth - this.offsetWidth / 2;
                // eslint-disable-next-line layout-thrashing
                $el.css('left', value); // NO I18N
                // eslint-disable-next-line layout-thrashing
                obj.current.left = value;
            }


            undoobj.actionarray.push(obj);
        })
    } else if (value == 'zc-va-right') { // NO I18N
        var isField = $.map(selectedlist, function (e) { return $(e).is('.zcanvas-field'); }).indexOf(false) === -1;
        selectedlist.each(function () {
            var $el = $(this);
            var obj = JSON.parse(JSON.stringify(_obj));
            obj.node = $el;
            if (isField) {
                var obj2 = JSON.parse(JSON.stringify(_obj));
                obj2.node = $el;
                obj2.action = 'actionclasslist'; // NO I18N
                // eslint-disable-next-line layout-thrashing
                obj2.previous.class = $el.attr('data-zcanvasclass') || ''; // NO I18N
                if (obj2.previous.class.indexOf('zc-ta') > -1) {
                    $el.removeClass("zc-ta-left zc-ta-center").zremoveClass("zc-ta-left"); // NO I18N 
                    $el.zremoveClass("zc-ta-center");  // NO I18N
                    // eslint-disable-next-line layout-thrashing
                    obj2.previous.class = $el.attr('data-zcanvasclass') || ''; // NO I18N
                }
                $el.addClass('zc-ta-right').zaddClass('zc-ta-right'); // NO I18N
                // eslint-disable-next-line layout-thrashing
                obj2.current.class = obj2.previous.class + ' zc-ta-right'; // NO I18N
                undoobj.actionarray.push(obj2);
            }
            // eslint-disable-next-line layout-thrashing
            obj.previous.left = $el.position().left;
            // eslint-disable-next-line layout-thrashing
            var _left = this.offsetLeft;
            // eslint-disable-next-line layout-thrashing
            var _width = this.offsetWidth;
            var _diff = dimension.endY - (_left + _width);
            // eslint-disable-next-line layout-thrashing
            $el.css('left', _left + _diff); // NO I18N
            // eslint-disable-next-line layout-thrashing
            obj.current.left = _left + _diff;
            undoobj.actionarray.push(obj);
        })
    } else if (value == 'zc-va-distribute') { // NO I18N
        var $selectbox = $('.zcanvas-selectbox'); // NO I18N
        var $selectDim = $selectbox.position(); // NO I18N
        $selectDim.width = $selectbox.outerWidth();
        var $selected = $(_.sortBy(selectedlist, function (item) { return item.offsetLeft; }));
        var dimension = {};
        var startel = _.min($selected, function (item) { return item.offsetLeft });
        dimension.top = startel.offsetLeft + startel.offsetWidth;
        var endel = _.max($selected, function (item) { return item.offsetLeft + item.offsetWidth });
        dimension.bottom = endel.offsetLeft;
        dimension.distance = dimension.bottom - dimension.top;
        _.map($selected.not(startel).not(endel), function (item) { dimension.distance = dimension.distance - $(item).outerWidth() }); // NO I18N
        dimension.vdist = dimension.distance / ($selected.length - 1);

        var validtop = dimension.activetop = startel.offsetLeft;

        var validMove = true;

        _.map($selected, function (item) {
            var $el = $(item);
            var outwidth = $el.outerWidth();
            if ($selectDim && $selectDim.left && !($selectDim.left <= validtop && ($selectDim.left + $selectDim.width) >= validtop)) {
                validMove = false;
            }
            validtop = validtop + outwidth + dimension.vdist;
        })

        if (!validMove) {
            return;
        }


        _.map($selected, function (item) {
            var $el = $(item);
            var outwidth = $el.outerWidth();
            var obj = JSON.parse(JSON.stringify(_obj));
            obj.node = $el;
            obj.previous.left = $el.position().left;
            obj.current.left = dimension.activetop;
            $el.css('left', dimension.activetop); // NO I18N
            undoobj.actionarray.push(obj);
            dimension.activetop = dimension.activetop + outwidth + dimension.vdist;

        })
    }

    if (selectedlist.is('.zcanvas-field')) {
        var parentVal = selectedlist.parent('.zcanvas-editor'); // NO I18N
        var parentinst = parentVal.data('zcanvas'); // NO I18N
        parentinst && parentinst.config.onChange('drag', selectedlist); // NO I18N
    }
    undoredomanager.push(undoobj);
}

function verticalaligntool(value, undoredomanager) {

    var selectedlist = $('.zcanvas-selected-element,.zcanvas-multiselect'); // NO I18N

    var dimension = {};

    dimension.startY = _.min(selectedlist, function (item) { return item.offsetTop; }).offsetTop;

    var endyel = _.max(selectedlist, function (item) { return item.offsetTop + item.offsetHeight; })

    dimension.endY = endyel.offsetTop + endyel.offsetHeight;

    var undoobj = {
        action: 'link', // NO I18N
        actionarray: [],
        node: selectedlist
    }
    var _obj = { action: 'drag', current: {}, previous: {}, node: {} } // NO I18N
    if (value == 'zc-va-top') { // NO I18N
        selectedlist.each(function () {
            var $el = $(this);
            var obj = JSON.parse(JSON.stringify(_obj));
            obj.node = $el;
            // eslint-disable-next-line layout-thrashing
            obj.previous.top = $el.position().top;
            // eslint-disable-next-line layout-thrashing
            $el.css('top', dimension.startY); // NO I18N
            // eslint-disable-next-line layout-thrashing
            obj.current.top = dimension.startY;
            undoobj.actionarray.push(obj);
        })
    } else if (value == 'zc-va-center') { // NO I18N
        var _width = dimension.endY - dimension.startY;
        var _mh = dimension.startY + parseInt(_width / 2);
        selectedlist.each(function () {
            var $el = $(this);
            var obj = JSON.parse(JSON.stringify(_obj));
            obj.node = $el;
            // eslint-disable-next-line layout-thrashing
            obj.previous.top = $el.position().top;
            // eslint-disable-next-line layout-thrashing
            value = _mh - this.offsetHeight / 2;
            // eslint-disable-next-line layout-thrashing
            $el.css('top', value); // NO I18N
            // eslint-disable-next-line layout-thrashing
            obj.current.top = value;
            undoobj.actionarray.push(obj);
        })
    } else if (value == 'zc-va-bottom') { // NO I18N
        selectedlist.each(function () {
            var $el = $(this);
            var obj = JSON.parse(JSON.stringify(_obj));
            obj.node = $el;
            // eslint-disable-next-line layout-thrashing
            obj.previous.top = $el.position().top;
            // eslint-disable-next-line layout-thrashing
            var _top = this.offsetTop;
            // eslint-disable-next-line layout-thrashing
            var _height = this.offsetHeight;
            var _diff = dimension.endY - (_top + _height);
            // eslint-disable-next-line layout-thrashing
            $el.css('top', _top + _diff); // NO I18N
            // eslint-disable-next-line layout-thrashing
            obj.current.top = _top + _diff;
            undoobj.actionarray.push(obj);
        })
    } else if (value == 'zc-va-distribute') { // NO I18N
        var $selectbox = $('.zcanvas-selectbox'); // NO I18N
        var $selectDim = $selectbox.position(); // NO I18N
        $selectDim.height = $selectbox.outerHeight();
        var $selected = $(_.sortBy(selectedlist, function (item) { return item.offsetTop; }));
        var dimension = {};
        var startel = _.min($selected, function (item) { return item.offsetTop });
        dimension.top = startel.offsetTop + startel.offsetHeight;
        var endel = _.max($selected, function (item) { return item.offsetTop + item.offsetHeight });
        dimension.bottom = endel.offsetTop;
        dimension.distance = dimension.bottom - dimension.top;
        _.map($selected.not(startel).not(endel), function (item) { dimension.distance = dimension.distance - $(item).outerHeight() }); // NO I18N
        dimension.vdist = dimension.distance / ($selected.length - 1);

        var validtop = dimension.activetop = startel.offsetTop;

        var validMove = true;

        _.map($selected, function (item) {
            var $el = $(item);
            var outwidth = $el.outerHeight();
            if ($selectDim && $selectDim.top && !($selectDim.top <= validtop && ($selectDim.top + $selectDim.height) >= validtop)) {
                validMove = false;
            }
            validtop = validtop + outwidth + dimension.vdist;
        })

        if (!validMove) {
            return;
        }

        _.map($selected, function (item) {
            var $el = $(item);
            var obj = JSON.parse(JSON.stringify(_obj));
            obj.node = $el;
            // eslint-disable-next-line layout-thrashing
            obj.previous.top = $el.position().top;
            // eslint-disable-next-line layout-thrashing
            $el.css('top', dimension.activetop); // NO I18N
            // eslint-disable-next-line layout-thrashing
            obj.current.top = dimension.activetop;
            // eslint-disable-next-line layout-thrashing
            dimension.activetop = dimension.activetop + $el.outerHeight() + dimension.vdist;
            undoobj.actionarray.push(obj);
        })
    }

    if (selectedlist.is('.zcanvas-field')) {
        var parentVal = selectedlist.parent('.zcanvas-editor'); // NO I18N
        var parentinst = parentVal.data('zcanvas'); // NO I18N
        parentinst && parentinst.config.onChange('drag', selectedlist); // NO I18N
    }

    undoredomanager.push(undoobj);
}

function processRelListObj(components, rellistdata, module, relfieldids, zcrefidflag, dataObj) {
    var relListId = dataObj ? dataObj.id : null;
    var relListModule = null;
    if (relListId) {
        var related_list = store.peekRecord("related_list", relListId);//No I18N
        var relListModuleId = related_list.module.id;
        relListModule = store.peekRecord("module", relListModuleId).module_name;//NO I18N
    }
    var connectedModName = null;
    if (related_list && related_list.connectedmodule && module != related_list.connectedmodule) {
        connectedModName = this.getConnectedModuleApiName(related_list.api_name);
    }
    // if (Lyte.Router.getRouteInstance().routeName === "clone" || Lyte.Router.getRouteInstance().routeName === "create") {
    //     rellistdata = rellistdata === undefined ? {} : rellistdata;
    // }
    var childrenNodes = components.children || [];
    var childrenLength = childrenNodes.length;
    for (var j = 0; j < childrenLength; j++) {

        var type = childrenNodes[j]._type;

        if (type === "dummyDiv") {
            this.processRelListObj(childrenNodes[j], rellistdata, module, relfieldids, zcrefidflag, dataObj);
            continue;
        }

        var fieldrecord = {};
        if (type === "field") {
            var id;
            if (childrenNodes[j].id) {
                id = childrenNodes[j].id
            } else if (relfieldids) {
                id = relfieldids.shift();
            }
            if (!id) {
                return components;
            }
            fieldrecord = store.peekRecord("field", id); //NO I18N
            if (!fieldrecord) {
                childrenNodes.splice(j, 1);
                j--;
                childrenLength = childrenNodes.length;
                continue;
            }
            var relatedListObj = {
                "relatedListModule": relListModule,//No I18N
                "connectedModName": connectedModName //No I18N
            }
            var fieldVal = this.constructCruxComponentForCanvas(id, module, rellistdata, true, relatedListObj, true);
            childrenNodes[j].value = fieldVal == null ? ' N/A ' : fieldVal; //No i18N
            childrenNodes[j].label = $ESAPI.encoder().encodeForHTMLAttribute(fieldrecord.field_label);
            childrenNodes[j].id = id;
            childrenNodes[j].zcvalue = childrenNodes[j].value;
            childrenNodes[j].zclabel = childrenNodes[j].label;
            childrenNodes[j].zcqaval = fieldrecord.field_label;
            childrenNodes[j].zcanvasId = zcrefidflag && childrenNodes[j].zcanvasId ? childrenNodes[j].zcanvasId : zutils.getRandomId();
            childrenNodes[j].dataHolder = true;
            childrenNodes[j].connectedModName = connectedModName;
        } else if (type == 'component') { // NO I18N
            childrenNodes[j].zcanvasId = zcrefidflag && childrenNodes[j].zcanvasId ? childrenNodes[j].zcanvasId : zutils.getRandomId();
        }

        childrenNodes[j].zctype = fieldrecord.data_type || type;

        if ((childrenNodes[j].zctype == 'text-area' || childrenNodes[j].zctype == 'textarea') &&
            childrenNodes[j].ui.value && typeof childrenNodes[j].ui.value.class === 'string') {

            childrenNodes[j].ui.value.class += ' zctextarea'; // NO I18N
        }
        this.processRelListObj(childrenNodes[j], rellistdata, module, relfieldids, connectedModName);
    }
    return components;
}

function processRelListObj(components, rellistdata, module, relfieldids, zcrefidflag, dataObj) {
    var relListId = dataObj ? dataObj.id : null;
    var relListModule = null;
    if (relListId) {
        var related_list = store.peekRecord("related_list", relListId);//No I18N
        var relListModuleId = related_list.module.id;
        relListModule = store.peekRecord("module", relListModuleId).module_name;//NO I18N
    }
    var connectedModName = null;
    if (related_list && related_list.connectedmodule && module != related_list.connectedmodule) {
        connectedModName = this.getConnectedModuleApiName(related_list.api_name);
    }
    // if (Lyte.Router.getRouteInstance().routeName === "clone" || Lyte.Router.getRouteInstance().routeName === "create") {
    //     rellistdata = rellistdata === undefined ? {} : rellistdata;
    // }
    var childrenNodes = components.children || [];
    var childrenLength = childrenNodes.length;
    for (var j = 0; j < childrenLength; j++) {

        var type = childrenNodes[j]._type;

        if (type === "dummyDiv") {
            this.processRelListObj(childrenNodes[j], rellistdata, module, relfieldids, zcrefidflag, dataObj);
            continue;
        }

        var fieldrecord = {};
        if (type === "field") {
            var id;
            if (childrenNodes[j].id) {
                id = childrenNodes[j].id
            } else if (relfieldids) {
                id = relfieldids.shift();
            }
            if (!id) {
                return components;
            }
            fieldrecord = store.peekRecord("field", id); //NO I18N
            if (!fieldrecord) {
                childrenNodes.splice(j, 1);
                j--;
                childrenLength = childrenNodes.length;
                continue;
            }
            var relatedListObj = {
                "relatedListModule": relListModule,//No I18N
                "connectedModName": connectedModName //No I18N
            }
            var fieldVal = this.constructCruxComponentForCanvas(id, module, rellistdata, true, relatedListObj, true);
            childrenNodes[j].value = fieldVal == null ? ' N/A ' : fieldVal; //No i18N
            childrenNodes[j].label = $ESAPI.encoder().encodeForHTMLAttribute(fieldrecord.field_label);
            childrenNodes[j].id = id;
            childrenNodes[j].zcvalue = childrenNodes[j].value;
            childrenNodes[j].zclabel = childrenNodes[j].label;
            childrenNodes[j].zcqaval = fieldrecord.field_label;
            childrenNodes[j].zcanvasId = zcrefidflag && childrenNodes[j].zcanvasId ? childrenNodes[j].zcanvasId : zutils.getRandomId();
            childrenNodes[j].dataHolder = true;
            childrenNodes[j].connectedModName = connectedModName;
        } else if (type == 'component') { // NO I18N
            childrenNodes[j].zcanvasId = zcrefidflag && childrenNodes[j].zcanvasId ? childrenNodes[j].zcanvasId : zutils.getRandomId();
        }

        childrenNodes[j].zctype = fieldrecord.data_type || type;

        if ((childrenNodes[j].zctype == 'text-area' || childrenNodes[j].zctype == 'textarea') &&
            childrenNodes[j].ui.value && typeof childrenNodes[j].ui.value.class === 'string') {

            childrenNodes[j].ui.value.class += ' zctextarea'; // NO I18N
        }
        this.processRelListObj(childrenNodes[j], rellistdata, module, relfieldids, connectedModName);
    }
    return components;
}

function colorPersistance() {
    if (Crm.canvasUsedColors) {
        Crm.canvasUsedColors = _.unique(Crm.canvasUsedColors);
        var colorpickerElement = document.getElementById('zcanvascolorpicker'); // NO I18N
        if (colorpickerElement) {
            var usedcolors = colorpickerElement.getData('usedColors'); // NO I18N
            var usedcollen = usedcolors ? usedcolors.length : 0;
            var usedcanvaslen = Crm.canvasUsedColors.length - 1;
            for (var i = 0; i < usedcollen; i++) {
                var _color = Crm.canvasUsedColors[usedcanvaslen - i];
                if (_color) {
                    usedcolors[i] = _color;
                }
            }
            // colorpickerElement.setData('usedColors', usedcolors); // NO I18N
        }
        delete Crm.canvasUsedColors;
    }
}

function selectionchange(elements) {
    var ellen = elements.length;
    for (var i = 0; i < ellen; i++) {
        var element = elements.eq(i);
        if (element.hasClass('zc-tab-container')) {
            element = element.closest('.zctablayout'); // NO I18N
        }
        if (!element.hasClass('ui-resizable')) {
            continue;
        }
        var border = element.css(['border-left', 'border-right', 'border-top', 'border-bottom']); // NO I18N
        var handles = element.children('.ui-resizable-handle'); // NO I18N
        var handlelen = handles.length;
        var height = element.outerHeight();
        for (var j = 0; j < handlelen; j++) {
            var css = {};
            if (handles.eq(j).hasClass('ui-resizable-e')) { // NO I18N
                css.height = 'inherit'; // NO I18N
                css.top = - (parseInt(border['border-top']) + 5); // NO I18N
                css.right = - (parseInt(border['border-right']) + 5); // NO I18N
            } else if (handles.eq(j).hasClass('ui-resizable-w')) { // NO I18N
                css.height = 'inherit'; // NO I18N
                css.top = - (parseInt(border['border-top']) + 5); // NO I18N
                css.left = - (parseInt(border['border-left']) + 5); // NO I18N
            } else if (handles.eq(j).hasClass('ui-resizable-n')) { // NO I18N
                css.width = 'inherit'; // NO I18N
                css.top = - (parseInt(border['border-top']) + 5); // NO I18N
                css.left = - (parseInt(border['border-left']) + 5); // NO I18N
            } else if (handles.eq(j).hasClass('ui-resizable-s')) { // NO I18N
                if (element.get(0).style.height == 'auto' || element.get(0).style.height == '') { // NO I18N
                    element.height(height);
                }
                css.width = 'inherit'; // NO I18N
                css.bottom = - (parseInt(border['border-bottom']) + 5); // NO I18N
                css.left = - (parseInt(border['border-left']) + 5); // NO I18N
            } else if (handles.eq(j).hasClass('ui-resizable-nw')) { // NO I18N
                css.left = - (parseInt(border['border-left']) + 5); // NO I18N
                css.top = - (parseInt(border['border-top']) + 5); // NO I18N
            } else if (handles.eq(j).hasClass('ui-resizable-ne')) { // NO I18N
                css.top = - (parseInt(border['border-top']) + 5); // NO I18N
                css.right = - (parseInt(border['border-right']) + 5); // NO I18N
            } else if (handles.eq(j).hasClass('ui-resizable-sw')) { // NO I18N
                css.left = - (parseInt(border['border-left']) + 5); // NO I18N
                css.bottom = - (parseInt(border['border-bottom']) + 5); // NO I18N
            } else if (handles.eq(j).hasClass('ui-resizable-se')) { // NO I18N
                css.right = - (parseInt(border['border-right']) + 5); // NO I18N
                css.bottom = - (parseInt(border['border-bottom']) + 5); // NO I18N
            }
            handles.eq(j).css(css);
        }
    }
}

window.undoredomanager = new CanvasUndoRedoManager({
    onUndo: function (data) {
        if (data.action == 'resize') { // NO I18N
            var node = this.getElements(data.node);
            if (node.hasClass('zcanvas-field') && !node.hasClass('zcbdrbox') && !node.hasClass('zctextarea')) { // NO I18N
                node.css('height', ''); // NO I18N
            }
        }
    },
    onRedo: function (data) {
        if (data.action == 'resize') { // NO I18N
            var node = this.getElements(data.node);
            if (node.hasClass('zcanvas-field') && !node.hasClass('zcbdrbox') && !node.hasClass('zctextarea')) { // NO I18N
                node.css('height', ''); // NO I18N
            }
        }
    },
    onChange: function (data) {
        //Lyte.registeredMixins['canvas-builder-settings'].colorPersistance(); // NO I18N
        //colorPersistance();
        setTimeout(function () {
            var builder = document.getElementsByTagName('canvas-builder'); // NO I18N
            if (builder && builder.length) {
                // builder[0].setData('changed', true); // NO I18N
                // builder[0].setData('hasUndo', undoredomanager.hasUndo()); // NO I18N
                // builder[0].setData('hasRedo', undoredomanager.hasRedo()); // NO I18N
            }
        }, 0)

        if (data && data.json && data.json.relatedList) {
            var $node = $(data.node);
            var $stage = $node.find('crm-stage-history'); // NO I18N
            if ($stage.length) {
                $stage[0].component.setBoundaryStage();
            }
        }

        if (data && data.json && data.json.action && data.json.action == "newtab" && data.json.previous && data.json.previous.isList) {
            var _node = $('#' + data.json.previous.tabid);
            var $stage = _node.find('crm-stage-history'); // NO I18N
            if ($stage.length) {
                $stage[0].component.setBoundaryStage();
            }
        }



        if (data.action == 'editordrag') {
            var $node = this.getElements(data.node);
            if ($node.hasClass('ui-droppable')) { // NO I18N
                var dinst = $node.data('uiDroppable'); // NO I18N
                dinst._rearrangescopes(dinst.options.scope || 'default'); // NO I18N
            } else {
                var $dds = $node.find('.ui-droppable'); // NO I18N
                if ($dds.length) {
                    var ddinst = $dds.eq(0).data('uiDroppable'); // NO I18N
                    ddinst._rearrangescopes(ddinst.options.scope || 'default'); // NO I18N
                }
            }
        }


        if (data.action == 'new' || data.action == 'editorswitch' || data.action == 'editordrag') {
            var $node = this.getElements(data.node);
            zutils.blinkelement($node);

            if (data.action === 'editorswitch' && typeof data.node === 'string' && data.current && data.current.editor && data.previous && data.previous.editor) {
                var oldnode = $(data.previous.editor + ' ' + data.node);
                var oldstates = oldnode.data('zccustomstate') || []; // NO I18N
                var oldinnerstates;
                if (oldnode.hasClass('zcanvas-field')) {
                    oldinnerstates = {
                        holder: oldnode.find('.zcanvas-holder').data('zccustomstate'), // NO I18N
                        label: oldnode.find('.zcanvas-label').data('zccustomstate'), // NO I18N
                        value: oldnode.find('.zcanvas-value-container').data('zccustomstate')  // NO I18N
                    }
                }
                var newnode = $(data.current.editor + ' ' + data.node);
                newnode.data('zccustomstate', oldstates); // NO I18N
                if (oldinnerstates) {
                    newnode.find('.zcanvas-holder').data('zccustomstate', oldinnerstates.holder);  // NO I18N
                    newnode.find('.zcanvas-label').data('zccustomstate', oldinnerstates.label);  // NO I18N
                    newnode.find('.zcanvas-value-container').data('zccustomstate', oldinnerstates.value);  // NO I18N
                }

            }
        }

        if (data && data.action == "switchaction") { // NO I18N
            setTimeout(function () {
                // FIXME: quick fix for all style enable scroll issue
                // thirdPartyUtils.bindPerfectScrollUpdate($('#canvas_scroll_menu'));
                // disablePerfectScroll('canvas-available-tools'); // NO I18N
                // enablePerfectScroll('canvas-available-tools');  // NO I18N
            }, 500);
        }

        if (data && data.node && data.node.length > 1) {
            var $node = this.getElements(data.node);
            // eslint-disable-next-line no-attribute-selectors
            var lazycomp = $node.find('[zcflag]'); // NO I18N
            var lazylen = lazycomp.length;
            for (var i = 0; i < lazylen; i++) {
                var lcomp = lazycomp.eq(i);
                var html = lcomp.removeAttr('lyte-rendered zcflag').outerHTML(); // NO I18N
                var $parent = lcomp.parent();
                lcomp.remove();
                $parent.append(html);
            }

        }
    }
})

var elementCount = { section: 0, tab: 0, text: 0, icon: 0, table: 0, line: 0 };
var builderheight = $('.canvas-builder-area').height();

// Clone object replace for canvas
zutils.zcopyobjExternal = objectUtils.cloneObject_new;
zutils.externalwindowWidth = function () { return renderingUtils.windowWidth; }
zutils.externalwindowHeight = function () { return renderingUtils.windowHeight; }
zutils.canvasI18n = {
    fields: I18n.getMsg('crm.label.customize.fields'), // NO I18N
    relatedlist: I18n.getMsg('crm.label.customize.relatedList'), // NO I18N
    action: I18n.getMsg('crm.setup.system.actions'), // NO I18N
    link: I18n.getMsg('crm.customlink'), // NO I18N
    button: I18n.getMsg('crm.customize.custombutton.label'), // NO I18N
    Line: I18n.getMsg('crm.report.line'), // NO I18N
    'image': I18n.getMsg('crm.image.header'),  // NO I18N
    'image value': I18n.getMsg('crm.image.header'),  // NO I18N
    MERGEFIELD: I18n.getMsg('crm.canvas.builder.mergefield'), // NO I18N
    'Static Icon': I18n.getMsg('crm.canvas.editor.icon'), // NO I18N
    'Static Text': I18n.getMsg('crm.label.text'), // NO I18N
    'Tab Bar': I18n.getMsg('crm.canvas.builder.tabbar'), // NO I18N
    'Tab Container': I18n.getMsg('crm.canvas.builder.tabcontainer'), // NO I18N
    'label': I18n.getMsg('crm.label.label'), // NO I18N
    'field': I18n.getMsg('crm.canvas.builder.field'), // NO I18N
    'holder': I18n.getMsg('crm.canvas.builder.holder'), // NO I18N
    'value': I18n.getMsg('crm.massmail.value'), // NO I18N
    'button holder': I18n.getMsg('crm.canvas.builder.holder'), // NO I18N
    'button label': I18n.getMsg('crm.label.label'), // NO I18N
    'button value': I18n.getMsg('crm.massmail.value'), // NO I18N
    'link': I18n.getMsg('crm.label.link'), // NO I18N
    'link holder': I18n.getMsg('crm.canvas.builder.holder'), // NO I18N
    'link label': I18n.getMsg('crm.label.label'), // NO I18N
    'link value': I18n.getMsg('crm.massmail.value'), // NO I18N
    'textarea': I18n.getMsg('crm.label.textarea'), // NO I18N
    'tag': I18n.getMsg('crm.label.small.tags'), // NO I18N
    'section': I18n.getMsg('crm.section.label'), // NO I18N
    'button': I18n.getMsg('zc.editor.button'), // NO I18N
    'Tab Layout': I18n.getMsg('crm.canvas.builder.tabitem'), // NO I18N
    'Table Layout': I18n.getMsg('crm.dashboard.label.table'), // NO I18N
    page: I18n.getMsg('crm.social.integ.type.page'), // NO I18N
    'row': I18n.getMsg('crm.module.subform.row'), // NO I18N
    'icon': I18n.getMsg('crm.canvas.editor.icon'), // NO I18N
    'relatedlist section': I18n.getMsg('crm.section.label'), // NO I18N
    'relatedlist title': I18n.getMsg('crm.html.subject'), // NO I18N
    'seperator': I18n.getMsg('crm.canvas.builder.seperator'), // NO I18N
    'field row': I18n.getMsg('crm.module.subform.row'), // NO I18N
    Text: I18n.getMsg('crm.label.text') // NO I18N

}

zutils.getExternali18n = function (key) {
    if (zutils.canvasI18n && zutils.canvasI18n[key]) {
        return zutils.canvasI18n[key];
    }
    return key;
}
// Builder Menu config - Start

var menuOptions = {
    fieldContainer: '#zcanvas_menu',//NO I18N
    layoutContainer: '#zcanvas_menu_insert', // NO I18N
    editorcontainer: '#zcanvas_editor', //NO I18N
    mapping: { label: 'label', value: 'value', type: 'datatype' }, //NO I18N
    nonMergableTypes: ["text-area", "profileimage", "Owner_photo", "button", "tag"], //No i18N
    hiddenLableType: ["profileimage", "Owner_photo", "relatedlist", "link", "button", "system", "static_rel", "subform", "zia"], //NO i18N
    hiddenLableExclude: ["morebutton", "canvas_button_group"], // NO I18N
    groups: {},
    // default style "text-area":{"width":"400px","height":"40px"} removed
    defaultstyle: { "text-area": { "height": "40px" }, "profileimage": { "width": "120px", "height": "120px" }, "Owner_photo": { "padding-right": "17px" }, "timeline": { "height": "300px" }, "image": { "width": "400px", "height": "50px" }, "fileupload": { "width": "400px", "height": "50px" } }, // NO I18N
    stylebyid: { 'followers': { 'padding': '0' } }, // NO i18N
    defaultclass: { 'button': 'zcanvas-no-img-default zc-ta-center zccbutton', 'timeline': 'zcanvas-timeline', 'profileimage': 'zcbdrbox', 'text-area': 'zctextarea', 'link': 'zcanvas-no-img-default zcclink', 'fileupload': 'zcfilefield', 'image': 'zcimagefield' }, //NO I18N
    classbyid: { 'navigate': 'zcanvas-nav zc-restricted-icon', 'morebutton': 'zc-only-icon zccbuttonicon', 'canvas_button_group': 'zc-only-icon zccbuttonicon', 'back': 'zc-restricted-icon' }, // NO i18N
    classforall: '',
    defaulticons: { 'morebutton': 'icon-Icon_dot_three', 'canvas_button_group': 'icon-Icon_dot_three' }, // NO I18N
    nonremovalclass: { 'morebutton': 'zccbuttonicon', 'canvas_button_group': 'zccbuttonicon' }, // NO I18N
    removeclassbyid: { 'notes': 'zc-ta-center', 'followers': 'zc-ta-center' }, // NO I18N
    uniqueId: 'id', //NO I18N
    defaultscope: 5,
    scopepertype: {
        'relatedlist': 2, 'static_rel': 1, 'system': 1, 'zia': 1, 'image': 1 // NO I18N
    },
    scopebyid: {
        'blueprint': 1, 'data_privacy': 1 // NO I18N
    },
    preform: false,
    preformhtml: function (data) {
        return data.value;
    },
    zcGuide: "#zcanvas-editor-outer > .zcanvas:not('.ui-draggable-dragging,.zcanvas-multiselect')",//NO I18N
    preformattr: {
        key: 'zcqaval', // NO I18N
        key2: 'zclabel', // NO I18N
        attr: {
            'data-zcqa': 'canvas-detail-' // NO I18N
        }
    },
    submenuattr: {
        key: 'data-zcqa', // NO I18N
        prefix: 'canvas-detail-' // NO I18N
    },
    nosearch: true,
    manualconfig: false,
    zmenurevert: function (e) {
        var node = $(e.target);
        if (node.hasClass('zcanvas-submenu-heading')) {
            var key = node.attr('data-uniquekey'); // NO I18N
            // eslint-disable-next-line no-attribute-selectors
            var $helper = $('#zcanvas_menu [data-uniquekey="' + key + '"]'); // NO I18N
            var data = node.data('zcanvas')['zcanvas-afterdrop']; // NO I18N
            $helper.data('zcanvas', objectUtils.cloneObject_new(data)); // NO I18N
            delete node.data('zcanvas')['zcanvas-afterdrop']; // NO I18N

        }
        // if(node.attr('data-uniquekey') == "stage_navigator" && model.module === "Potentials") {
        // 	// eslint-disable-next-line no-attribute-selectors
        // 	var element = $('#zcanvas_menu [data-uniquekey="' + node.attr('data-uniquekey') + '"]'); // NO I18N
        // 	element[0].innerText =  I18n.getMsg("Stage") + "/" + I18n.getMsg("crm.label.cf.blueprint");
        // }
    },
    zmenustart: function (data, el, e, external) {
        // if (data && data.datatype === 'relatedlist' && !data.data) {
        //     Lyte.registeredMixins["canvas-builder-settings"].relatedListDataProcessing(data); //NO I18N
        // }
        // else if (data && data.datatype === "static_rel") {//No I18N
        //     Lyte.registeredMixins["canvas-builder-settings"].fetchActionsForStaticRel(data, model.module);//No I18N
        // }
        // if (data.async) {
        //     Lyte.registeredMixins["canvas-builder-settings"].loadResourceOnDemand(data); // NO I18N
        // }
        if (data && data.datatype === "system" && data.id === "stage_navigator") {
            if (model.module == "Potentials" && model.renameStage) {
                data.zclabel = I18n.getMsg("crm.label.cf.blueprint");
                data.zcvalue = I18n.getMsg("crm.label.cf.blueprint");
            } else if (model.module == "Potentials" && !model.renameStage) {// NO I18N
                data.zclabel = I18n.getMsg("Stage");
                data.zcvalue = I18n.getMsg("Stage");
            }
        }
        if (data && data.zcsubtype === 'submenu') {
            if (data.menudata) {
                data.data = objectUtils.cloneObject_new(data.menudata);
            }

            var isImageSection = data.data && data.data.length == 1 && (data.data[0].datatype.indexOf('image') > -1 || data.data[0].datatype.indexOf('subform') > -1);

            if (!isImageSection) {
                var sectionbase = { "ui": { "value": { "style": {}, "class": "zc-fieldsection", "position": { "startX": 0, "startY": 0, "endX": 1640, "width": 1620, "height": 943, "minTop": 37, "minLeft": 24 }, "tagname": "DIV" } }, "children": [], "_type": "component", "theme": "Custom Layout", "zcanvasId": "zcanvas_hcw8rjbwfbd", "zcMinWidth": "500" }; // NO I18N
                var titlesectionbase = { "ui": { "value": { "style": { "default": { "border-radius": "0", "box-shadow": "none", "border": "none", "background-color": "rgba(243, 242, 242, 1)" } }, "position": { "startX": 0, "startY": 0, "endX": 1640, "width": '100%', "height": 38, "minTop": 37, "minLeft": 24 }, "tagname": "DIV" } }, "children": [], "_type": "component", "theme": "Custom Layout", "zcanvasId": "zcanvas_hcw8rjbwfbd" }; // NO I18N
                var titlebase = { "zcanvasId": "zcanvas_4si4xy5gemp", "_type": "component", "ui": { "value": { "style": {}, "position": { "startX": 10, "startY": 7, "endX": 174, "width": 164, "height": 27 }, "class": "zc_disabled", "value": "Products" } }, "theme": "Static Text", "children": [] }; // NO I18N
                var tablebase = { "zcanvasId": "#zcanvas_us58qoeplr", "_type": "component", "ui": { "value": { "position": { "startX": 30, "startY": 52, "endX": 1278, "width": 'calc(100% - 60px)', "height": 480, "minTop": 5 }, "style": {}, "class": "zclayout-table zcrestricttable", "layoutstyle": { "row": { "height": "50px" }, "field": { "width": "50%" }, "inner": [{ "percent": 34.80194017784964 }, { "percent": 35.12530315278901 }] } } }, "theme": "Table Layout", "children": [] }; // NO I18N
                tablebase.zcanvasId = zutils.getRandomId();
                var rowbase = { "_type": "row", "ui": { "value": { "position": { "startX": 0, "startY": 5, "endX": 1259, "width": 1259, "height": 50 }, "style": {}, "class": "zcanvas-row" } }, "children": [] }; // NO I18N
                var fieldbase = { "zcanvasId": "zcanvas_3kga5lwc3z4", "datatype": "user", "type": "field", "_type": "field", "ui": { "value": { "style": {}, "position": { "startX": 0, "startY": 0, "endX": 625, "width": 625, "height": 50 }, "tagname": "DIV", "class": "zcanvas-field" }, "holder": { "style": {}, "tagname": "SPAN", "class": "" }, "field": { "style": {}, "tagname": "SPAN", "class": "" }, "label": { "style": {}, "tagname": "SPAN", "class": "" } }, "fieldContainer": "#zcanvas_menu", "group": "field", "children": [] }; // NO I18N
                var tabledata = tablebase;
                var fieldlen = Math.round(data.data.length / 2);
                titlesectionbase.zcanvasId = zutils.getRandomId();
                sectionbase.zcanvasId = zutils.getRandomId();
                titlebase.zcanvasId = zutils.getRandomId();
                titlebase.ui.value.value = data.zclabel;
                titlesectionbase.children.push(titlebase);
                var tableheight = 0;
                for (var i = 0; i < fieldlen; i++) {
                    var row = JSON.parse(JSON.stringify(rowbase));
                    var field = objectUtils.cloneObject_new(fieldbase);
                    field.zcanvasId = zutils.getRandomId();
                    // eslint-disable-next-line no-multipleDOMLookup
                    row.children.push(field);
                    if ((i + 1) * 2 <= data.data.length) {
                        var field2 = objectUtils.cloneObject_new(fieldbase);
                        field.zcanvasId = zutils.getRandomId();
                        // eslint-disable-next-line no-multipleDOMLookup
                        row.children.push(field2);
                    }
                    // eslint-disable-next-line no-multipleDOMLookup
                    tabledata.children.push(row);
                    tableheight += 50;
                }
                // eslint-disable-next-line layout-thrashing
                tabledata.ui.value.position.height = tableheight;
                // eslint-disable-next-line layout-thrashing
                sectionbase.ui.value.position.height = tableheight + 100;
                var fieldids = data.data.map(function (item) { return item.id });
                //var processeddata = Lyte.registeredMixins["canvas-builder-settings"].processRelListObj(tabledata, model.record, model.module, fieldids); // NO I18N
                var processeddata = processRelListObj(tabledata, model.record, model.module, fieldids); // NO I18N
                sectionbase.children.push(titlesectionbase);
                // eslint-disable-next-line no-multipleDOMLookup
                sectionbase.children.push(processeddata)
                data.zctype === 'component'; // NO I18N
                data.value = '';
                data.menudata = objectUtils.cloneObject_new(data.data);
                sectionbase.zccompmeta = { sectionId: data.sectionid };
                data.data = sectionbase;
                data.containment = 'parent'; // NO I18N
                data.condition = function (cdata) {
                    // eslint-disable-next-line no-attribute-selectors
                    var len = $('.zc-fieldsection:not(.zc-fieldsectionallfield)[data-sectionid=' + cdata.sectionid + ']')
                    if (len.length > 1) {
                        return false;
                    }
                    return true;
                }
                data.callback = function (el, cdata) {
                    el.attr('data-sectionid', cdata.sectionid); // NO I18N
                    var zscope = el.attr('id'); // NO I18N
                    el.addClass('zc-non-insertable');
                    var $drag = el.find('.ui-draggable'); // NO I18N
                    //                            	 var $dragchild = el.children('.ui-draggable'); // NO I18N
                    $drag.draggable('option', 'containment', 'parent'); // NO I18N
                    $drag.draggable('option', 'scope', zscope); // NO I18N
                    el.find('.ui-droppable').add(el).droppable('option', 'scope', zscope); // NO I18N
                    el.find('.zctable-sortable').addClass('zctable-disabled');
                }
                if (external) {
                    return data;
                }
            } else if (isImageSection && !external) {
                var inst = $('#zcanvas_menu').data('zcanvasMenu'); // NO I18N
                el.helper.addClass('zcanvas-field zcanvas-afterdrop').removeClass('zcanvas-submenu-heading'); // NO I18N
                var rdata = objectUtils.cloneObject_new(data.data[0]);
                var zid = el.helper.attr('data-uniquekey'); // NO I18N
                // eslint-disable-next-line no-attribute-selectors
                var $helper = $('#zcanvas_menu [data-uniquekey="' + zid + '"]'); // NO I18N
                rdata['zcanvas-afterdrop'] = data; // NO I18N
                $helper.data('zcanvas', rdata); // NO I18N
                inst.dragstarthandler(null, el, rdata);
            }

        }
    }
}

var menu_container = $("#zcanvas_menu");
menuOptions.groups = zcdata;

menu_container.zcanvasMenu(menuOptions); // Side menu

// Builder Menu config - End

var outereditor = $("#zcanvas-editor-outer");
outereditor.height(builderheight);

/**
  * Color Picker Start
  */
var ColorPicker_Util = {
    getRgbCodeByRgbColors: function (t, e, o) {
        t = ColorPicker_Util.baseConverter(t, 10, 16),
            e = ColorPicker_Util.baseConverter(e, 10, 16),
            o = ColorPicker_Util.baseConverter(o, 10, 16);
        for (t += "", e += "", o += ""; t.length < 2;) {
            t = "0" + t;

        }
        for (; e.length < 2;) {
            e = "0" + e;

        }
        for (; o.length < 2;) {
            o = "0" + o;

        }
        return rgbColor = t + "" + e + o,
            rgbColor.toUpperCase()
    },
    baseConverter: function (t, e, o) {
        if (10 == o) {
            return parseInt(t, 16);
        }
        if (16 == o) {
            return parseInt(t).toString(16);
        }
        t = (t += "").toUpperCase();
        for (var n = 0, i = 0; i <= t.length; i++) {
            n += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(t.charAt(i)) * Math.pow(e, t.length - i - 1); // NO I18N
        }
        t = "";
        for (i = Math.floor(Math.log(n) / Math.log(o)); i >= 0; i--) {
            var l = Math.floor(n / Math.pow(o, i));
            t += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(l), // NO I18N
                n -= l * Math.pow(o, i)
        }
        return 0 == t.length && (numberToConvertToConvert = 0),
            t || (t = 0),
            t
    }

}


var getcurrentrgb = function (color) {
    if (color == 'transparent' || !color || typeof color != 'string') { // NO I18N
        color = 'rgba(255, 255, 255, 0)'; // NO I18N
    }
    var selectedcolor = { hex: '', 'hex-alpha': '', rgb: '', rgba: '' };
    var extract = color.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
    if (extract.length) {
        var c = ColorPicker_Util.getRgbCodeByRgbColors(extract[0], extract[1], extract[2]);
        selectedcolor.hex = '#' + c;
        selectedcolor.rgb = 'rgb(' + extract[0] + ',' + extract[1] + ',' + extract[2] + ')'; // NO I18N
        if (extract[3] && extract[3] < 1) {
            var a = parseFloat(extract[3]); // alpha
            a = (a * 255 | 1 << 8).toString(16).slice(1);
            c += a;
            selectedcolor['hex-alpha'] = c; // NO I18N
            selectedcolor.rgba = 'rgba(' + extract[0] + ',' + extract[1] + ',' + extract[2] + ',' + extract[3] + ')'; // NO I18N
            selectedcolor.opacity = parseFloat(parseFloat(parseFloat(extract[3]) * 100).toFixed(2));
        } else {
            selectedcolor['hex-alpha'] = c + 'FF'; // NO I18N
            selectedcolor.rgba = 'rgba(' + extract[0] + ',' + extract[1] + ',' + extract[2] + ',1)'; // NO I18N
            selectedcolor.opacity = 100;
        }
    }
    return selectedcolor;
}

function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")"; // NO I18N
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")"; // NO I18N
    }
}

var layoutoptions = {
    fieldContainer: '#zcanvas_menu_insert',//NO I18N
    editorcontainer: '#zcanvas_editor_outer', //NO I18N
    mapping: { label: 'label', value: 'value', type: 'datatype' }, //NO I18N
    nosearch: true,
    groups: {
        'layouts': { data: new zclayout('id', ["Section Layout", "Tab Layout", "Static Text", "Static Icon", "Line", "Button", "Table Layout"]) } // NO I18N
    },
    uniqueId: 'id', //NO I18N
    mainmenucontainer: '#zcanvas_menu', // NO I18N
    preformattr: {
        key: 'layoutname', // NO I18N
        attr: {
            'data-zcqa': 'canvas-detail-' // NO I18N
        }

    }

}
layoutoptions.scopebyid = {};
layoutoptions.groups.layouts.data.map(function (i) {
    var scope = 0;

    switch (i.layoutname) {
        case "Section Layout":
            scope = 200; break;
        case "Tab Layout":
            scope = 25; break;
        case "Table Layout":
            scope = 50; break;
        case "Static Text":
            scope = 200; break;
        case "Static Icon":
            scope = 200; break;
        case "Line":
            scope = 200; break;
        default:
            scope = 25; break;
    }
    layoutoptions.scopebyid[i.id] = scope;
})
var layout_container = $("#zcanvas_menu_insert");
layout_container.zcanvasMenu(layoutoptions);


// Menu Sections hide / show

var toolsheadings = $('.zcrm-canvas-tools-heading');

toolsheadings.click(function (event) {
    var $head = $(event.target).closest('.zcrm-canvas-tools-heading');
    $head.next().toggle();
})



var verticalnode = function (allElm, currentNode, allOrMin) {
    if (!allElm) {
        allElm = $('#zcanvas-editor-outer').children('.zcanvas');
    }
    var currentNodeStartY = $(currentNode).position().top;
    var currentNodeStartX = $(currentNode).position().left;
    //		    	var currentNodeEndY = currentNodeStartY + currentNode.ui.position.height;
    var currentNodeEndX = $(currentNode).position().left + $(currentNode).outerWidth();
    var distrubedNodeArray = [];
    var allelemntlen = allElm.length;
    for (var i = 0; i < allelemntlen; i++) {
        var checkingNode = allElm[i];
        var chekingNodeStartY = $(checkingNode).position().top;
        // id = avoid same node return,, startY = bottom space join
        if (chekingNodeStartY !== currentNodeStartY && currentNodeStartY < chekingNodeStartY) {
            var checkingNodeStartX = $(checkingNode).position().left;
            var checkingNodeEndX = $(checkingNode).position().left + $(checkingNode).outerWidth();

            if (currentNodeStartX <= checkingNodeStartX && currentNodeEndX > checkingNodeStartX ||
                currentNodeStartX >= checkingNodeStartX && currentNodeStartX < checkingNodeEndX) {
                distrubedNodeArray.push(allElm[i]);
            }
        }
    }
    if (distrubedNodeArray.length !== 0) {
        if (allOrMin === true) {
            return distrubedNodeArray;
        } else {
            var closestNode = _.min(distrubedNodeArray, function (num) { return $(num).position().top });
            return closestNode;
        }
    }

}
var resultnodes = [];

var nodedisturb = function (node) {
    var temp = [];
    node.each(function (e) {
        var a = verticalnode(null, $(e), true);
        if (a) {
            temp = temp.concat(a);
        }

    })

    if (!temp || !temp.length) {
        return _.uniq(resultnodes);
    } else {
        resultnodes = resultnodes.concat(temp);
        return nodedisturb(temp);
    }
}


var addImmediateElement = function (target) {
    var menuinst = $('#zcanvas_menu_insert').data('zcanvasMenu'); // NO I18N
    if (menuinst) {
        var el = menuinst.getElementByKey('layoutname', 'Section Layout'); // NO I18N
        var elinst = el.data('zcanvas'); // NO I18N
        var scope = menuinst.getCurrentScope(elinst);
        if (!scope) {
            return;
        } else {
            menuinst.reduceScope(elinst);
        }
    }
    resultnodes = [];
    var outereditor = $("#zcanvas-editor-outer"); // NO I18N
    var undoredoobj = { action: 'link', actionarray: [], node: outereditor }; // NO I18N
    var $target = $(target);
    var disturbnode = nodedisturb([$target]);
    var newnode = $target.clone().html('');
    var $newnode = $(newnode);
    var $parentcontainer = $target.parents('.zcanvas-editor'); // NO I18N
    if (!$parentcontainer.length) {
        $parentcontainer = outereditor;
    }
    $parentcontainer.append($newnode);
    var instance = $parentcontainer.data('zcanvas'); // NO I18N
    var $cstyle = instance.config.toolsRef.copystyle($target);
    var height = $newnode.outerHeight(); // eslint-disable-line layout-thrashing
    var generateId = zutils.getRandomId();
    $newnode.attr('id', generateId); // NO I18N
    var newoptions = zutils.zcopyobj(options);
    newoptions.editorcontainer = '#' + generateId;
    newoptions.draggable = true;
    newoptions.handles = "all";//NO I18N
    $newnode.zcanvas(newoptions);
    // eslint-disable-next-line layout-thrashing
    $newnode.css({ 'max-width': 'none', 'max-height': 'none', 'min-width': 'auto', 'min-height': 'auto', 'top': $target.position().top + $target.outerHeight() + 10 }); // NO I18N
    // $newnode.click();
    instance.config.toolsRef.pastestyle($cstyle, $newnode);
    disturbnode.each(function (e) {
        var $el = $(e);
        var prevtop = $el.position().top;
        var topVal = prevtop + height + 10;
        $(e).css('top', topVal);  // eslint-disable-line layout-thrashing
        var actionobj = { action: "drag", current: { top: topVal }, previous: { top: prevtop }, node: $el }; // NO i18n
        undoredoobj.actionarray.push(actionobj);
    });

    outereditor.data('zcanvas').resetheight(); // NO I18N
    var actionobj = { action: 'neweditor', current: canvasOutput.createJson($newnode), node: $newnode, editor: '#zcanvas-editor-outer' }; //NO i18N
    undoredoobj.actionarray.push(actionobj);
    undoredomanager.push(undoredoobj);
    zutils.reinitarrange($newnode);
    $newnode.click();
}


// Builder Working Area configuration

var options = {
    editorcontainer: '#zcanvas-editor-outer', //NO I18N
    toolbarContainer: '.toolbar',//NO I18N
    actionsContainer: '.canvas-actions',//NO I18N
    contextmenu: true,
    // User Custom Icon
    customIconSet: ["icon-Icon_Customerprofile", "icon-Icon_Fastag", "icon-Icon_Goldloan", "icon-Icon_Insurance", "icon-Icon_Investment", "icon-Icon_Loan", "icon-Icon_Netbanking", "icon-Icon_Premiumservice", "icon-Icon_Reward", "icon-Icon_Secure"],
    contextmenucontainer: '.canvas-builder-area', // NO I18N
    contextclass: 'zccontextclose', // NO I18N
    alwaysdisabled: true,
    zclayoutcontainer: '#zcanvas_menu_insert', // NO I18N
    tools: {
        // 'profileimage': ['imageradius'], //NO I18N
        //  "Owner_Photo":['imageradius'],//NO I18N
        'zcdefault': ['fontsize', 'fontweight'] //NO i18N
        // 'seperator':['fontsize','fontweight','color','bgcolor','seperator','seperatorcolor','margin','marginleft','marginright','margintop','marginbottom','paddingright','paddingleft','paddingbottom','paddingtop','padding','copypaste'], // NO I18N
        // "Tab Layout":['bgcolor','paddingright','paddingleft','paddingbottom','paddingtop','padding','margin','marginleft','marginright','margintop','marginbottom','borderside','borderstyle','borderwidth','borderradius','bgcolor','zctabbuttontype','defaulttabborderside','defaulttabborderwidth','defaulttabbordercolor','defaulttabbgtool','defaulttabcolortool','lefttopradiustool','righttopradiustool','leftbottomradiustool','rightbottomradiustool','defaulttabpaddingtoptool','defaulttabpaddingrighttool','defaulttabpaddingbottomtool','defaulttabpaddinglefttool','defaulttabmargintoptool','defaulttabmarginrighttool','defaulttabmarginbottomtool','defaulttabmarginlefttool','defaulttabsizetool'] // NO I18N
    },
    isPage: true,
    //TODO: textarea to be removed by checking RL API
    multiresize: ["text-area", "profileimage", "Owner_Photo", "timeline", "textarea", "image", "fileupload"], // NO I18N
    style: {
        'zcdefault': ['textstyles'] //NO I18N
    },
    listtypes: ['relatedlist', 'static_rel', 'system', 'zia', 'subform'], // NO I18N
    undoredomanager: undoredomanager,
    //  toolsRef : new zcanvastools('.toolbar',undefined,['.zcanvas-field:not(.zccbutton)','.zcanvas-holder','.zctoolpostprocess']), // NO I18N
    postStyleApplyConditions: ['.zcanvas-field:not(.zccbutton)', '.zcanvas-holder', ''], // NO I18N
    staticelement: $('<div class="svgIcons ico-plus-circle-blue zc-add-canvas" lt-prop-title="' + I18n.getMsg('crm.button.clone') + '"></div>').click(function (e) {
        addImmediateElement(e.target.parentElement);
    }),
    lockhandler: function (appendcontainer, closedrag, flag, unlockflag) {
        if (!appendcontainer) {
            appendcontainer = closedrag;
        }
        if (closedrag.is('.zctablayout')) { // NO I18N
            appendcontainer = closedrag.children('.zc-tab-container'); // NO I18N
        }
        var _lockel = $('<div class="zcanvas-lock-icon' + (unlockflag ? ' zcanvas-limited-lock' : '') + '" lt-prop-title="' + I18n.getMsg('crm.data.subject.request.unlock') + '"></div>'); // NO I18N
        appendcontainer.append(_lockel);
        closedrag.addClass('zcanvas-locked-element').draggable('option', 'disabled', true); // NO I18N
        !unlockflag && _lockel.on('click', function (e) {
            var target = $(e.target);
            var closestdrag = target.closest('.ui-draggable'); // NO I18N
            var zinst = $('#zcanvas-editor-outer').data('zcanvas'); // NO I18N
            zinst && zinst.config && zinst.config.unlockhandler(null, closestdrag);
        });
        $('.dimentiontool').addClass('zc-disabled-tool'); // NO I18N
        if (!flag) {
            var zinst = $('#zcanvas-editor-outer').data('zcanvas'); // NO I18N
            var toolsref = zinst.config.toolsRef;
            var selector = toolsref.getSelectorByElement(closedrag);

            var obj = {
                action: 'callback', // NO I18N
                node: selector,
                lock: true,
                callback: function (data, operation, node) {
                    var zinst = $('#zcanvas-editor-outer').data('zcanvas'); // NO I18N
                    if (operation === 'undo') {
                        zinst && zinst.config && zinst.config.unlockhandler(null, node, true);
                    } else {
                        zinst && zinst.config && zinst.config.lockhandler(null, node, true);
                    }
                }
            }
            zinst.savecanvasaction(closedrag, obj.action, null, null, null, null, obj);
        }


    },
    unlockhandler: function (appendcontainer, closedrag, flag) {
        if (!appendcontainer) {
            appendcontainer = closedrag;
        }
        if (closedrag.is('.zctablayout')) { // NO I18N
            appendcontainer = closedrag.children('.zc-tab-container'); // NO I18N
        }
        closedrag.removeClass('zcanvas-locked-element'); // NO I18N
        var _lockel = appendcontainer.children('.zcanvas-lock-icon'); // NO I18N
        _lockel.zremove();
        closedrag.draggable('option', 'disabled', false); // NO I18N
        $('.dimentiontool').removeClass('zc-disabled-tool'); // NO I18N
        if (!flag) {
            var zinst = $('#zcanvas-editor-outer').data('zcanvas'); // NO I18N
            var toolsref = zinst.config.toolsRef;
            var selector = toolsref.getSelectorByElement(closedrag);

            var obj = {
                action: 'callback', // NO I18N
                node: selector,
                lock: false,
                callback: function (data, operation, node) {
                    var zinst = $('#zcanvas-editor-outer').data('zcanvas'); // NO I18N
                    if (operation === 'undo') {
                        zinst && zinst.config && zinst.config.lockhandler(null, node, true);
                    } else {
                        zinst && zinst.config && zinst.config.unlockhandler(null, node, true);
                    }
                }
            }
            zinst.savecanvasaction(closedrag, obj.action, null, null, null, null, obj);
        }
    },
    zccontainment: '#zcanvas-editor-outer', // NO i18N
    relatedlistcompile: function (json, data, zrefflag) {
        var template = ''; // Lyte.registeredMixins["canvas-builder-settings"].getRelListHtml(json,data.rellistdata,data.module,data.fieldid,null,zrefflag , data); //NO I18N
        return template;
    },
    relatedlistdata: function (json, data, record, zrefflag) {
        if (json.noMapAvail) {
            return json;
        }
        var listdata = zcanvasrelatedList.processcanvasfields(json, record, zrefflag, data);
        //	var listdata = Lyte.registeredMixins["canvas-builder-settings"].processRelListObj(json,record,data.module,JSON.parse(JSON.stringify(data.fieldid)) , zrefflag, data); // NO I18N
        return listdata;
    },
    afterrelatedlistplace: function (json, node) {
        if (json.api_name == "stage_navigator") {
            var $stage = node.find('crm-stage-history'); // NO I18N
            if ($stage.length) {
                $stage[0].component.setBoundaryStage();
            }
        }
    },
    onTabSwitch: function (node) {
        var $stage = node.find('crm-stage-history'); // NO I18N
        if ($stage.length) {
            $stage[0].component.setBoundaryStage();
        }
    },
    relatedlistmenu: function (id, data, record) {
        //	var fieldrecord = store.peekRecord("field",id); //NO I18N
        var record = record ? record : {};
        var relatedListModuleId = data.relListModId;
        var relatedListModule = store.peekRecord("module", relatedListModuleId).module_name//NO I18N
        var relatedListObj = {
            "relatedListModule": relatedListModule //No I18N
        }
        if (data.connectedModName) {
            var relConnectedModApiName = ''; // Lyte.registeredMixins["canvas-builder-settings"].getConnectedModuleApiName(data.connectedModName);//No I18N
            relatedListObj.connectedModName = relConnectedModApiName;
        }
        var fieldVal = data.value; //Lyte.registeredMixins["canvas-builder-settings"].constructCruxComponentForCanvas(id,data.module,record,true,relatedListObj,true); // NO I18N
        return fieldVal == null ? 'N/A' : fieldVal; //No i18N
    },
    relatedlistcreate: function (json) {
        var menudata = $('#zcanvas_menu').data('zcdatamap');
        var data = menudata[json.id];
        if (json.theme === 'Table Layout' && data) { // NO I18N
            var menuinst = $(data.fieldContainer).data('zcanvasMenu'); // NO I18N
            if (menuinst && menuinst.config && menuinst.config.zmenustart) {
                menuinst.config.zmenustart(data);
            }
        }
        if (data && (data.template && _.isEmpty(data.data))) {
            menudata[json.id].data = new Promise(function (resolve) {
                if (data.async) {
                    //Lyte.registeredMixins["canvas-builder-settings"].loadResourceOnDemand(data); // NO I18N
                }
                var actions_ = data.actions;
                //eslint-disable-next-line no-async-false
                resolve({ 'data': {}, template: data.template, async: data.async, asyncloader: data.asyncloader, actions: actions_ }); // NO i18N
            })
            return data;
        }
        json.children = json.components;
        var isViewable = true;
        var isVisible = true;
        var isLinkingModViewable = true;
        var isLinkingModVisible = true;
        if (data && !data.noAction) {
            var relId = data.action.url_params[2];
            var relRec = store.peekRecord("related_list", relId); // NO I18N
            if (relRec && relRec.type === "multiselectlookup") {
                var connectedModName = relRec.connectedmodule;
                isViewable = moduleRecordMapping[connectedModName].viewable;
                isVisible = moduleRecordMapping[connectedModName].visible;
                isLinkingModViewable = relRec.linkingmodule ? moduleRecordMapping[relRec.linkingmodule].viewable : false;
                isLinkingModVisible = relRec.linkingmodule ? moduleRecordMapping[relRec.linkingmodule].visible : false;
            }
        }


        /*if(relRec && ((relRec.personality_name == "INVITEDEVENTSPERSONALITY" && !Crm.userDetails.permissions.Crm_Implied_View_Events) || (relRec.personality_name == "CONTACTSROLESPERSONALITY" && !Crm.userDetails.permissions.Crm_Implied_View_Contacts)) ){
                data = {};
                data.data = new Promise(function(resolve){
                    resolve({data:json, template : "", actions:[], rellistdata:[],module:""});
                });
        } else */
        if ((Lyte.Router.getRouteInstance().routeName === "create" || Lyte.Router.getRouteInstance().routeName === "clone") && data/*|| Lyte.Router.getRouteInstance().transition.info.dynamicParams[0] !== module*/) {
            // Lyte.registeredMixins["canvas-builder-settings"].relatedListDataProcessing(data, json); //NO I18N
        } else {
            if (data && isViewable && isVisible && isLinkingModViewable && isLinkingModVisible && !data.noAction) {
                // Lyte.registeredMixins["canvas-builder-settings"].relatedListDataProcessing(data, json); //NO I18N
            } else {
                data = {};
                var template = "";
                var module = Lyte.Router.getRouteInstance().parent.currentModel.module;
                var currstaticComponents = ['timeline', 'sales_summary', 'data_privacy', 'stage_navigator', 'followers', 'blueprint', 'subform', 'score_summary', 'campaign_integ_analytics', 'campaign_analytics', 'backstage_analytics', 'backstage_status', 'zfinance_stock_info', 'zfinance_business_info', 'upcoming_action', 'orchestrations', 'segmentation', 'best_time', 'prediction', 'recommendation'];//No I18N
                if ((Lyte.Router.getRouteInstance().routeName === "create" || Lyte.Router.getRouteInstance().routeName === "clone") && json.theme === "Table Layout") {
                    var crmDetailViewHandler;
                    var compHtml;
                    var compResources;
                    if (currstaticComponents.indexOf(json.id) > -1) {
                        crmDetailViewHandler = new CrmDetailViewHandler(module, {}, json.id, json.id, null, "", json.personalityName); //NO I18N
                    } else {
                        crmDetailViewHandler = new CrmDetailViewHandler(module, {}, json.id, "static_rel", null, "", json.personalityName); //NO I18N
                    }
                    compHtml = crmDetailViewHandler.getHTML();
                    compResources = crmDetailViewHandler.getResources();
                    data.asyncresources = compResources;//No I18N
                    data.async = true;
                    template = compHtml;
                }
                data.data = new Promise(function (resolve) {
                    //Lyte.registeredMixins["canvas-builder-settings"].loadResourceOnDemand(data);//No I18N
                    //eslint-disable-next-line no-async-false
                    resolve({ data: json, template: template, actions: [], rellistdata: [], module: "", asyncloader: data.asyncloader, async: data.async });
                });

            }
        }
        return data;
    },
    contextcallback: function (zkey) {
        if (zkey === 'conditionalstyle') {
            $('.zcstylesideebar').click();
            $('.zcaddstate').click();
        }
    },
    onBeforeChange: function (action, node) {
        if (action == 'new' && typeof node == 'object' && (node.hasClass('zctextarea') || node.hasClass('zcimagefield'))) {
            var uioffset = node.offset();
            var inst = zutils.getParentData(node);
            var tpos = zutils.findpositionAndWidth(inst.container, uioffset, inst.container, node, false);
            node.css({ 'width': tpos.targetwidth > 400 ? 400 : tpos.targetwidth }); // NO I18N
        }
    },
    onChange: function (action, node, undodata) {
        if (undodata && action == 'link') {
            var actionlen = undodata.actionarray.length;
            for (var i = 0; i < actionlen; i++) {
                var actiondata = undodata.actionarray[i];
                undodata.changedetection && undodata.changedetection(actiondata.action, undoredomanager.getElements(actiondata.node), actiondata);
            }
        }
        if (action === 'new' && node.is('.zcanvas-nav') || action === 'neweditor' && node.has('.zcanvas-nav').length) {
            var nav = node.find(".navigateRecord");
            if (nav.length) {
                var nav_comp = nav[0];
                nav_comp.setMethods({
                    onNext: function () { //eslint-disable-line  no-empty-function
                    },
                    onPrevious: function () { //eslint-disable-line  no-empty-function
                    }
                });
                nav_comp.component.buttonDisable.call(nav_comp.component)
                return;
            }

        }
        /*if(action === 'new' && node.has('crm-custom-rl iframe').length && (!node[0].hasAttribute('fixed') &&  !node[0].hasAttribute('data-fixed') &&  !node[0].hasAttribute('data-fixed-y') && !node[0].hasAttribute('data-fixed-x'))) // NO I18N
        {
                   node.attr('fixed',true); // NO I18N
        } */

        if (action == 'resize' && node.has('crm-stage-history').length) {
            var $stage = node.find('crm-stage-history'); // NO I18N
            if ($stage.length) {
                $stage[0].component.setBoundaryStage();
            }
        }

        if ((undodata && action == 'resize' && node.hasClass('zcbdrbox')) || (undodata && (action == 'action' || action == 'switchaction') && node.is('img'))) {
            this.adjustimagetooriginal(node);
        }

        if ((undodata && node.hasClass('zccbuttonicon'))) { // NO I18N
            this.bindlabelresize && this.bindlabelresize(node);
        }

        if (undodata && action == 'resize' && undodata.node == '#zcanvas-editor-outer') {
            var outwidth = node.css('width'); // NO I18N
            node.parent().width(outwidth);
        }

        if (node.hasClass('zcanvas-afterdrop')) {
            var key = node.attr('data-uniquekey'); // NO I18N
            // eslint-disable-next-line no-attribute-selectors
            var $helper = $('#zcanvas_menu [data-uniquekey="' + key + '"]'); // NO I18N
            var data = node.data('zcanvas')['zcanvas-afterdrop']; // NO I18N
            $helper.data('zcanvas', objectUtils.cloneObject_new(data)); // NO I18N
            delete node.data('zcanvas')['zcanvas-afterdrop']; // NO I18N
        }

        var haszcqa = node.attr('data-zcqa'); // NO I18N
        var isrlchange = node.hasClass('zcanvas-rl-change'); // NO I18N
        var compname;
        if (action == 'neweditor') {
            node.attr('data-zcqa', 'canvas-detail-section' + ++elementCount.section); // No I18N
            compname = 'section' + elementCount.section; // NO I18N
        } else if (action == 'new' && node.hasClass('zctablayout')) { // NO I18N
            node.attr('data-zcqa', 'canvas-detail-tab' + ++elementCount.tab); // No I18N
            compname = 'tab' + elementCount.tab; // NO I18N
            node.find('.zcaddtab').attr('data-zcqa', 'canvas-detail-tab' + elementCount.tab + '-add'); // NO I18N
            node.find('.tab').attr('data-zcqa', 'canvas-detail-tab-Unnamed Tab'); // NO I18N
        } else if (action == 'new' && node.hasClass('zclayout-table')) { // NO I18N
            node.attr('data-zcqa', 'canvas-detail-table' + ++elementCount.table); // No I18N
            compname = 'table' + elementCount.table; // NO I18N
        } else if (node.hasClass('zcstatictext') && !haszcqa) { // NO I18N
            node.attr('data-zcqa', 'canvas-detail-text' + ++elementCount.text); // No I18N
            compname = 'text' + elementCount.text; // NO I18N
        } else if (!haszcqa && node.hasClass('zcstaticicon')) { // NO I18N
            node.attr('data-zcqa', 'canvas-detail-icon' + ++elementCount.icon); // No I18N
            compname = 'icon' + elementCount.icon; // NO I18N
        } else if (!haszcqa && node.hasClass('zcdivider')) { // NO I18N
            node.attr('data-zcqa', 'canvas-detail-line' + ++elementCount.line); // No I18N
            compname = 'line' + elementCount.line; // NO I18N
        } else if (!haszcqa && node.hasClass('zc-rating')) { // NO I18N
            node.attr('data-zcqa', 'canvas-detail-rating' + ++elementCount.rating); // No I18N
            compname = 'rating' + elementCount.rating; // NO I18N
        } else if (!haszcqa && node.hasClass('zc-button-code')) { // NO I18N
            node.attr('data-zcqa', 'canvas-detail-button' + ++elementCount.button); // No I18N
            compname = 'button' + elementCount.button; // NO I18N
        } else if ((isrlchange || !haszcqa) && node.hasClass('zcanvas-static-editor')) { // NO I18N
            var labl = node.data('zcanvas').zcqaval || node.data('zcanvas').label; // NO I18N
            compname = 'RL-' + labl; // NO I18N
            node.attr('data-zcqa', 'canvas-detail-RL-' + labl); // NO I18N
            node.removeClass('zcanvas-rl-change'); // NO I18N
        }
        if (compname) {
            var zcd = node.data('zcanvasdata'); // NO I18N
            if (!zcd) {
                zcd = {};
            }
            if (zcd && !zcd.name) {
                zcd.name = compname;
                node.data('zcanvasdata', zcd); // NO I18N
            }
        }


        if (action && action != null && this && this.editorcontainer == "#zcanvas-editor-outer" && (action.indexOf('new') > -1 || action.indexOf('resize') > -1 || action.indexOf('drag') > -1 || action.indexOf('editorswitch') > -1)) {
            var outinst = $(this.editorcontainer).data('zcanvas'); // NO I18N
            outinst && outinst.resetheight && outinst.resetheight();
        }





    },
    statictypecallback: function (element, config) {
        var data = element.data('zcanvas'); // NO I18N
        var isStatic = element.has('.zc-noneditable-rl').length; // NO I18N
        if (isStatic) {
            //Lyte.registeredMixins["canvas-builder-settings"].contextualstyles(data, element, config); //NO I18N
        } else {
            return;
        }
    },
    onmenuswitch: function (zmenu, el) {
        var menuheadings = $(zmenu).find('.zcanvas-menu-heading , .zcanvas-submenu-heading'); // NO I18N

        menuheadings.click(function (event) {
            var $target = $(event.target);
            $target.toggleClass('zcnotransform'); // NO I18N
            $target.next().slideToggle();
            var _targetps = $target.closest('.ps-container'); // NO I18N
            setTimeout(function () {
                if (_targetps.length) {
                    var _tid = _targetps.attr('id'); // NO I18N
                    // disablePerfectScroll(_tid); // NO I18N
                    // enablePerfectScroll(_tid);  // NO I18N
                }

            }, 500);
        })
        // setTimeout(function () {
        //     thirdPartyUtils.bindPerfectScrollUpdate($('#canvas_scroll_menu'));
        // }, 500);
        //var zsdata = el.data('zcanvas'); // NO I18N
        /*	if(  moduleRecordMapping[zsdata.api_name]){
                var fields = moduleRecordMapping[zsdata.api_name].fields;
                var menuinst = $(zmenu).data('zcanvasMenu');
                if(menuinst){
                    menuinst.config.metafields = Lyte.registeredMixins["canvas-builder-settings"].transformdatatocriteria(fields); // NO I18N
                }                 	
            } */

        //canvas rules starts on selecting the component request is fired and data is added to criteria
        //    var comp = $("canvas-builder")[0].component; // NO I18N
        //    var moduleName = Lyte.registeredMixins["canvas-builder-settings"].getModuleNameFromRelatedlistId(zsdata.id);// NO I18N
        //    var moduleAPiName = moduleApiMapping[ moduleName ];
        //    Lyte.registeredMixins["canvas-builder-settings"].RequestingcanvasruleinBuilder(moduleAPiName);// NO I18N

        //    if(comp.data.selectedModuleapiname === moduleAPiName){
        // 	   comp.setData('selectedModuleapiname',null); // NO I18N
        //    }
        //    comp.setData('selectedModuleapiname',moduleAPiName); // NO I18N

        //canvas rules end


    },
    preformattr: {
        key: 'zcqaval', // NO I18N
        key2: 'zclabel', // NO I18N
        attr: {
            'data-zcqa': 'canvas-detail-' // NO I18N
        }

    },
    fieldrerender: function (node) {
        // eslint-disable-next-line no-attribute-selectors
        var _afterflag = node.find('[zcflag]'); // NO I18N
        var lazylen = _afterflag.length;
        if (lazylen) {
            for (var i = 0; i < lazylen; i++) {
                var lcomp = _afterflag.eq(i);
                var html = lcomp.removeAttr('lyte-rendered zcflag').outerHTML(); // NO I18N
                var $parent = lcomp.parent();
                lcomp.remove();
                $parent.append(html);
            }
        }

    },
    onaddelement: function (node, json) {
        if (node && json.noMapAvail) {
            node.addClass('zcanvas-ignore'); // NO I18N
        }
        if (json && json.ui && json.ui.value && json.ui.value.zcode) {
            node.attr('data-zcqa', 'canvas-detail-' + json.ui.value.zcode.name); // NO I18N
            node.data('zcanvasdata', json.ui.value.zcode); // NO I18N
            if (node.hasClass('zctablayout')) {
                node.find('.zcaddtab').attr('data-zcqa', 'canvas-detail-' + json.ui.value.zcode.name + '-add'); // NO I18N
            }
        }
        if (json && json.ui && json.ui.value && json.ui.value.class && json.ui.value.class.indexOf("zc_disabled") > -1) { // NO I18N
            node.attr('data-zcqa', 'canvas-detail-' + json.ui.value.value + '-title'); // NO I18N
        }

        if (json && json.sectionId && node && node.zhasClass('zc-fieldsection')) { // NO I18N
            //	if(json && json.sectionId){
            node.data('zccompmeta', { sectionId: json.sectionId }); // NO I18N
            node.attr('data-sectionid', json.sectionId); // NO I18N
            var zscope = node.attr('id'); // NO I18N
            node.addClass('zc-non-insertable');
            var $drag = node.find('.ui-draggable'); // NO I18N
            //								var $dragchild = node.children('.ui-draggable'); // NO I18N
            $drag.draggable('option', 'containment', 'parent'); // NO I18N
            $drag.draggable('option', 'scope', zscope); // NO I18N
            node.find('.ui-droppable').add(node).droppable('option', 'scope', zscope); // NO I18N
            node.find('.zctable-sortable').addClass('zctable-disabled');
            //	}

        }

        if (json && json.ui && json.ui.value && json.ui.value && json.ui.value.class && json.ui.value.class.indexOf('zcimagefield') > -1) {
            var $node = node;
            // eslint-disable-next-line no-attribute-selectors
            var lazycomp = $node.find('[zcflag]'); // NO I18N
            var lazylen = lazycomp.length;
            for (var i = 0; i < lazylen; i++) {
                var lcomp = lazycomp.eq(i);
                var html = lcomp.removeAttr('lyte-rendered zcflag').outerHTML(); // NO I18N
                var $parent = lcomp.parent();
                lcomp.remove();
                $parent.append(html);
            }

        }

        if (json && json.ui && json.ui.icon) {
            var parentdata = zutils.getParentData(node);
            parentdata && parentdata.bindlabelresize && parentdata.bindlabelresize(node);
        }

    },
    listjson: function (json) {
        // var rlid = json.id;
        // var el = document.querySelector('canvas-builder'); // NO I18N
        // var criterias = el.getData('criterias'); // NO I18N
        // var associated = [];
        // function processStyles(_json) {
        //     zutils.compressioncallback && zutils.compressioncallback(_json, associated);
        //     // eslint-disable-next-line no-multipleDOMLookup
        //     var chlen = _json.children && _json.children.length;
        //     if (chlen) {
        //         for (var i = 0; i < chlen; i++) {
        //             // eslint-disable-next-line no-multipleDOMLookup
        //             processStyles(_json.children[i], associated)
        //         }
        //     }
        //     return;
        // }
        // processStyles(json);
        // associated = _.unique(associated);

        // var moduleName = ''; // Lyte.registeredMixins["canvas-builder-settings"].getModuleNameFromRelatedlistId(json.id);// NO I18N
        // var moduleAPiName = moduleApiMapping[moduleName];

        // var conditons = _.filter(criterias, function (r) { return r.module.api_name === moduleAPiName && associated.indexOf(r.zcid) > -1 });
        // json.ui.canvas_rules = conditons.map(function (r) { return { id: r.id } });
        return json;
    },
    listinterceptor: function (json) {
        if (json.noMapAvail) {
            var editor = $(this.editorcontainer);
            editor.addClass('zcanvas-ignore'); // NO I18N
            var $overlay = $.parseHTML('<div class="zcanvas_overlay_component"><div class="zcanvas_overlay_action_container"><div class="zcanvas_overlay_action zcchangerl">' + I18n.getMsg("crm.canvas.builder.changerelatedlist") + '</div> <div class="zcanvas_overlay_action zcdeleterl">' + I18n.getMsg('crm.button.delete') + '</div> </div> </div>') // NO I18N
            editor.append($overlay[0]);
            var $change = editor.find('.zcchangerl'); // NO I18N
            var $delete = editor.find('.zcdeleterl'); // NO I18N
            var _$editor = $(editor[0]);
            var _data = _$editor.data('zcanvas'); // NO I18N
            if (_data) {
                _data.data = json;
                _data.group = "relatedlist"; // NO I18N
                _data.fieldContainer = "#zcanvas_menu"; // NO I18N
            }
            $delete.click(function (e) {
                var elementedit = $(e.target).closest('.zcanvas-static-editor'); // NO I18N
                zutils.deleteElement(elementedit, true);
            })
            $change.click(function (e) {
                var pagecomp = document.querySelector('.canvas-page-container'); // NO I18N
                pagecomp && pagecomp.classList.add('zccontextclose'); // NO I18N
                zutils.changelistutil(e, null, e.currentTarget.parentElement, null, function (el, data, ref) {
                    el.find('.zcanvas_overlay_component').remove(); // NO I18N
                    ref.changelist(el, data, true);
                    setTimeout(function () {
                        ref.selectfieldonEditor && ref.selectfieldonEditor(el, true);
                        el.removeClass('zcanvas-ignore'); // NO I18N
                    }, 10);
                }); // NO I18N
                e.stopImmediatePropagation();
            });
            return false;
        }
        return true;
    }
}

/**
 * Select Outer as Default Selected element
 */
options.toolsRef = new zcanvastools({
    baseeditor: '#zcanvas-editor-outer', // NO I18N
    toolcommon: '.zc-tool', // NO I18N
    contexttools: {
        'timeline': [{ "field": I18n.getMsg('crm.events.date'), "selector": ".timeLineHistDate" }, { "field": I18n.getMsg('crm.events.time'), "selector": ".timeLineHistTime" }, { "field": I18n.getMsg('crm.email.search.content'), "selector": [".timeLineHistCont", ".timeline_added.Notes span pre"] }, { "field": I18n.getMsg('zc.editor.link'), "selector": ["link-to a", '.TimeLineHighTxt'] }, { "field": I18n.getMsg('crm.functions.oldvalue'), "selector": ".tl_from" }, { "field": I18n.getMsg('crm.functions.newvalue'), "selector": ".tl_to" }, { "field": I18n.getMsg('crm.owner.field.label'), "selector": "span[purpose=\"showUserBC\"]" }, { "field": I18n.getMsg('crm.canvas.builder.footer'), "selector": [".tl_dat", ".tl_by"] }], // NO I18N
        'Notes': [{ "field": I18n.getMsg('crm.label.title'), "selector": ".cruxNotesList .cxNoteTitleSpan" }, { "field": I18n.getMsg('crm.email.search.content'), "selector": ".cruxNotesList .notesAddedContent" }, { "field": I18n.getMsg('crm.canvas.builder.footer'), "selector": ".cruxNotesList .notesOtherActionDetails .notesgray" }, { "field": I18n.getMsg('zc.editor.link'), "selector": ".cruxNotesList .moduleRecordName" }, { "field": I18n.getMsg('crm.canvas.builder.seperator'), "selector": ".cruxNotesLi", "titleclass": "canvas-tool-name bold uppercase", "nobasictools": true, "requiredtools": { "bgcolor": false, "fsize": false, "color": false, "fweight": false, 'bordercolor': true } }], // NO I18N
        'Table': [{ "field": I18n.getMsg('crm.module.subform.row'), "subtools": [{ "field": I18n.getMsg('zc.editor.link'), "selector": "lyte-td a", "titleclass": "canvas-tool-name bold uppercase" }], "texttitle": true, "titleclass": "zcanvas-menu-heading", "selector": "lyte-tr", "selectorformuladefault": "lyte-tr lyte-td", "selectorformula": function (type) { if (type != 'bgcolor') { return 'lyte-tr lyte-td' } else { return 'lyte-tr' } }, "requiredtools": { "bgcolor": true, "fsize": true, "color": true, "fweight": true, 'bordercolor': true } }, { "field": I18n.getMsg('zc.editor.header'), "titleclass": "zcanvas-menu-heading", "selector": "lyte-th", "requiredtools": { "bgcolor": true, "fsize": true, "color": true, "fweight": true, 'bordercolor': true } }] // NO I18N
    },
    preformattr: {
        key: 'toolname', attr: { 'data-zcqa': 'canvas-detail-tool-' }  // NO I18N
    },
    nodeattr: {
        key: 'zcqaval', // NO I18N
        key2: 'label', // NO I18N
        attr: {
            'data-zcqa': 'canvas-detail-' // NO I18N
        }
    },
    // stylecreationcallback: function (stylekey, stylevalue) {
    //     if (Crm.canvasUsedColors && stylevalue && typeof stylevalue === 'string' && stylevalue.indexOf('rgba') === 0 && stylevalue !== "rgba(255, 255, 255, 0)") {
    //         Crm.canvasUsedColors.push(stylevalue);
    //     }
    // },
    stylecompressioncallback: function (styles) {
        if (styles && styles.opacity) {
            if (styles.opacity === "0.5") {
                styles._hide_ = 'true';
            } else {
                styles._show_ = 'true';
            }
            delete styles.opacity;

        }
    },
    mousestateprefix: '_mousestate_', // NO I18N
    styledecompressioncallback: function (styles) {
        if (styles && (styles._hide_ || styles._show_)) {
            if (styles._hide_ === 'true') {
                styles.opacity = '0.5';
            } else if (styles._show_ === 'true') {
                styles.opacity = '1';
            }
            delete styles._hide_;
            delete styles._show_;

        }
    },
    errorcallback: function () {
        crmui.showMsgBand("error", I18n.getMsg('zc.editor.unable.to.download.images'), 1000);//No I18N
    },
    tooldropdownopen: function (listel, flag) {
        if (flag) {
            //disablePerfectScroll('canvas-available-tools'); // NO I18N
        } else {
            //enablePerfectScroll('canvas-available-tools');  // NO I18N
        }
    },
    toolonfocus: function () {
        $('.canvas-tools-container').enableSelection();
    },
    toolonblur: function () {
        $('.canvas-tools-container').disableSelection();
    },
    validationerror: function (msg, limit, ikey, measurement) {
        var errormsg = '';
        switch (msg) {
            case 'minerror':
                errormsg = I18n.getMsg('crm.canvas.validation.minlimit', [I18n.getMsg(ikey), limit, measurement || '']);
                break;
            case 'maxerror':
                switch (ikey) {
                    case '_row_':
                        errormsg = I18n.getMsg('crm.canvas.validation.rowlimit', [limit]);
                        break;
                    case '_column_':
                        errormsg = I18n.getMsg('crm.canvas.validation.columnlimit', [limit]);
                        break;
                    case '_textlength_':
                        errormsg = I18n.getMsg('crm.canvas.validation.textlimit', [limit]);
                        break;
                    default:
                        errormsg = I18n.getMsg('crm.canvas.validation.maxlimit', [I18n.getMsg(ikey), limit, measurement || '']);
                        break;
                }
                break;
            case "empty":
                errormsg = I18n.getMsg('crm.replace.picklist.value.none');
                break;
            case "badinput":
                errormsg = I18n.getMsg('crm.canvas.validation.incorrect');
                break;
        }
        crmui.showMsgBand("error", errormsg, 1000);//No I18N
    },
    toolcreatecallback: function (config, el, obj) {
        if (obj.i18n) {
            el.attr('lt-prop-title', I18n.getMsg(obj.i18n)).attr('lt-prop-tooltip-config', '{"position" : "top"}'); // NO I18N
        }
    },
    onstatechange: function (state) {
        if (state.indexOf('hover') > -1 || state.indexOf('active') > -1) { // NO I18N
            $('#zcvisibilitycontainer').hide(); // NO I18N
        }
        if (state !== 'default' && state !== 'active' && state !== 'hover') {
            $('.zc_rules_list').show();
            var mainel = document.querySelector('canvas-builder'); // NO I18N
            var selectedstaterules = [];
            var mainstates = state.split('_mousestate_'); // NO I18N
            if (mainstates.length) {
                var _andstates = mainstates[0].split('_and_'); // NO I18N
                var _andlen = _andstates.length;
                for (var i = 0; i < _andlen; i++) {
                    var _state = _andstates[i].split('_child_'); // NO I18N
                    var _stlen = _state.length;
                    for (var j = 0; j < _stlen; j++) {
                        selectedstaterules.push(mainel.component.getCriteriabyzid(_state[j]));
                    }
                }
            }
            //mainel.setData('selectedstaterules', selectedstaterules); // NO I18N 
            thirdPartyUtils.titleForEllipsis(document.querySelectorAll('.canvas_rulelist_item_name')); // NO I18N
        } else {
            $('.zc_rules_list').hide();
        }

    },
    onBeforeSelection: function (selectedtype, dragflag, meta) {
        if (typeof selectedtype === 'object') {
            selectedtype = selectedtype[0];
        }
        var dimensiontool = $('.dimentiontool'); // NO I18N
        if (selectedtype == 'image') {
            this.selectedfields.removeClass('zcanvas-selected-element'); // NO I18N
            this.selectedfields = this.selectedfields.closest('.zcanvas-field'); // NO I18N
            this.selectedfields.addClass('zcanvas-selected-element'); // NO I18N
            dimensiontool.addClass('zctool-nohelper');
        } else {
            dimensiontool.removeClass('zctool-nohelper');
        }
        var statediv = $('.zc_mouse_states');
        var statec = $('#zc_state_hover');
        var stylestate = false;
        var $active = $('#zc_state_active');
        var $cstates = $('.zc-custom-states');
        var styleactive = false;
        // eslint-disable-next-line no-complex-selector
        $('.zc_state_tool li').removeClass('zcanvas-tools-list-selected'); // NO I18N
        // eslint-disable-next-line no-complex-selector
        $('.zc_mouse_states li').removeClass('zcanvas-tools-list-selected'); // NO I18N

        if (selectedtype == 'Tab Layout' || selectedtype == 'button') {
            stylestate = true;
        }
        var stateswitch = false;
        if (meta && meta.state !== 'default') { // NO I18N
            stateswitch = true;
            this.changestate(meta.state, true); // NO I18N
        } else {
            document.getElementById('zc_state_default').classList.add('zcanvas-tools-list-selected'); // NO I18N
        }

        if (selectedtype == 'Tab Layout') {
            styleactive = true;
            // $active.click();
            document.getElementById('zc_state_active').classList.add('zcanvas-tools-list-selected'); // NO I18N
            this.changestate('active', true); // NO I18N
        } else {
            document.getElementById('zc_substate_default').classList.add('zcanvas-tools-list-selected'); // NO I18N
            !stateswitch && this.changestate('default', true); // NO I18N
        }

        if (selectedtype == 'Tab Layout' || (this.selectedfields && !this.selectedfields.closest('.zc-table-cell').length && (selectedtype == 'label' || selectedtype == 'value')) || selectedtype == 'Text') {
            $('#aligntool').addClass('zc-disabled-tool'); // NO I18N
        } else {
            $('#aligntool').removeClass('zc-disabled-tool'); // NO I18N
        }
        var uppercase_elem = '#uppercasetool'; // NO I18N
        var $textformattools = $('#linethroughtool , #weightselect, ' + uppercase_elem);
        var isupperdisabled;
        if (this.selectedfields && selectedtype == 'value') {
            // eslint-disable-next-line no-multipleDOMLookup
            var fielddata = zutils.getdatafromelement(this.selectedfields.closest('.zcanvas-field')); // NO I18N
            if (fielddata && fielddata.datatype && fielddata.datatype == 'boolean') {
                $textformattools.addClass('zc-disabled-tool'); // NO I18N
                isupperdisabled = true;
            } else {
                $textformattools.removeClass('zc-disabled-tool'); // NO I18N
            }

        } else {
            $textformattools.removeClass('zc-disabled-tool'); // NO I18N
        }

        if (selectedtype == 'Text') {
            $(uppercase_elem).addClass('zc-disabled-tool'); // NO I18N
        } else if (!isupperdisabled) {
            $(uppercase_elem).removeClass('zc-disabled-tool'); // NO I18N
        }


        if (!dragflag) {
            // Enable Draggable
            var otherdisables = $('.zcanvas-editor-outer').find('.ui-draggable:not(.ui-draggable-disabled):not(.zcanvas-non-selectable):not(.zc-strict-hide):not(.zcanvas-menuhidden)'); // NO I18N
            otherdisables.length && otherdisables.draggable('option', 'disabled', true); // NO I18N
            var $selected = this.selectedfields;
            var hasLocked = $selected.hasClass('zcanvas-locked-element'); // NO I18N

            if (hasLocked) {
                dimensiontool.addClass('zc-disabled-tool'); // NO I18N
            } else {
                dimensiontool.removeClass('zc-disabled-tool'); // NO I18N
            }

            $selected = $selected.not('.zcanvas-locked-element'); // NO I18N
            if ($selected.hasClass('ui-draggable:not(.zc-tab-content)')) { // NO I18N
                $selected.draggable('option', 'disabled', false); // NO I18N
            } else if ($selected.hasClass('zcanvas-non-delete') || $selected.hasClass('zcanvas-title-editor')) { // NO I18N
                var nondeletedrag = $selected.draggable('instance'); // NO I18N
                if (nondeletedrag) {
                    $selected.draggable('option', 'disabled', false); // NO I18N
                }
            } else {
                var parentselect = $selected.closest('.ui-draggable'); // NO I18N
                if (parentselect.length) {
                    parentselect.draggable('option', 'disabled', false); // NO I18N
                }
            }


        }

        statec.hide();
        $active.hide();
        $cstates.show();
        statediv.hide();
        if (stylestate) {
            statec.show();
            statediv.show();
        }
        if (styleactive) {
            $active.show();
            $cstates.show();
        }
        //if(selectedtype !== 'subtype'){ // NO I18N
        // $('.zc_state_container').show(); // NO I18N
        //}
        $(".zc-fit-screen").hide();

        var editorel = document.querySelector('canvas-builder'); // NO I18N
        editorel && editorel.component && editorel.component.forcestateapply(this.state, this);

    },
    onSelection: function (selectedtype, meta, basenodes) {
        if (typeof selectedtype === 'object') {
            selectedtype = selectedtype[0];
        }
        var editorcomp = document.querySelector('canvas-builder'); //NO I18N
        //editorcomp.setData('selectedelementtype', selectedtype); // NO I18N
        //$('#canvas-available-tools').scrollTo(0);
        $('.canvas-tool-typetext').html(zutils.getExternali18n ? zutils.getExternali18n(selectedtype) : selectedtype);
        var gallerycont = $('#gallerycontainer')
        gallerycont.find('.canvas-gallery').hide();

        // Gallery rendering
        var isGalleryAvailable = zcanvasgallery.isAvailableByType(selectedtype);

        if (isGalleryAvailable) {
            if (gallerycont.find('.canvas-gallery-' + selectedtype).length) {
                $('.canvas-gallery-' + selectedtype).show();
            } else {
                gallerycont.append('<div class="canvas-gallery-' + selectedtype + ' canvas-gallery"></div>');
                var galelement = zcanvasgallery.getstaticgallerylist.bind(this)(selectedtype);
                gallerycont.find('.canvas-gallery-' + selectedtype).html(galelement); // NO I18N
                zcanvasgallery.postprocess[selectedtype].bind(this)(galelement);
            }

        } else {
            $('.canvas-no-gallery').show();
        }

        if (selectedtype == 'Tab Layout' && this.selectedfields.hasClass('tab')) { // NO I18N
            var $tab = this.selectedfields.find('.tabname');
            if (!$tab.hasClass('zc-tab-noedit')) {
                var tabname = $tab.text(); // NO I18N
                $('.canvas-tabname-container').show(); // NO I18N
                var parenttab = this.selectedfields.closest('.zctablayout'); // NO I18N
                var $input = $('#zctabname');
                $input.val(tabname).data({ 'zc-old-text': tabname, 'parent': parenttab.attr('id'), current: this.selectedfields.attr('data-tab') }); // NO I18N
                $input.focus();
            }

            if (basenodes && (this.state.indexOf('hover') > -1 || this.state.indexOf('active') > -1)) { // NO I18N
                basenodes.splice(basenodes.indexOf('#zcvisibilitycontainer'), 1);  // NO I18N
            }

        }
        if (selectedtype === 'page') {
            $(".zc-fit-screen").show();
        }
        var _aligntools = $('.canvas-align-tool');
        //	       				var stateselection = document.querySelector('.zcaddstate'); // NO I18N
        var isstateneeded = true;
        if (selectedtype === 'multiple') {
            _aligntools.show();
            isstateneeded = false;
        }

        if (selectedtype === 'subtype') {
            var element = this.selectedfields.closest('.zcanvas-static-editor'); // NO I18N
            var options = zutils.getParentData(element);
            var data = element.data('zcanvas'); // NO I18N
            //Lyte.registeredMixins["canvas-builder-settings"].contextselection.bind({ data: data, element: element, options: options.config })(); // NO I18N
            isstateneeded = false;
        }

        //	       				if(isstateneeded){
        //	       					stateselection && stateselection.classList.remove('dNImp'); // NO I18N
        //	       				}else{
        //	       					stateselection && stateselection.classList.add('dNImp'); // NO I18N
        //	       				}
        //editorcomp.setData('hideaddstate', isstateneeded); // NO I18N
        if (selectedtype !== 'page') {
            // $('.zc_tools_icon').click();
            var $class = 'canvas-tools-container'; // NO I18N
            $('.zc-selected-sidebar').removeClass('zc-selected-sidebar');
            var $current = document.getElementsByClassName('canvas-selected-sidebar'); // NO I18N
            if ($current[0]) {
                $current[0].classList.remove('canvas-selected-sidebar'); // NO I18N
            }
            document.getElementsByClassName($class)[0].classList.add('canvas-selected-sidebar'); // NO I18N
            $('.canvas-sidebar-item-style').addClass('zc-selected-sidebar'); // NO I18N
            //var compinst = editorcomp.component; // NO I18N
            // compinst.actions.switchsidebar.bind(compinst)($class, document.querySelector('.canvas-sidebar-item-style')); // NO I18N

        }

        if (selectedtype == 'multiple') { // NO I18N
            var $sbox = $('.zcanvas-selectbox'); // NO I18N
            if ($sbox.hasClass('zcanvas-locked-element')) { // NO I18N
                _aligntools.addClass('zc-disabled-tool'); // NO I18N
            } else {
                _aligntools.removeClass('zc-disabled-tool'); // NO I18N
            }
            if ($sbox.length) {
                var sdata = zutils.getParentData($sbox); // NO I18N
            } else {
                var selement = $('.zcanvas-selected-element'); // NO I18N
                var sdata = zutils.getdatabyelement(zutils.getClosestEditor(selement));
            }
            if (!sdata) {
                return;
            }
            var toolsinst = sdata.config.toolsRef;
            var selected = toolsinst.selectedfields;
            var sellen = selected.length;
            var availtools;
            for (var i = 0; i < sellen; i++) {
                var type = toolsinst.config.gettype(selected.eq(i));
                var tools = toolsinst.config.tools[type.zctype];
                if (!availtools) {
                    availtools = tools;
                } else {
                    availtools = _.intersection(availtools, tools);
                }
            }
            if (availtools) {
                var toollistlen = availtools.length;
                var basenodes = [];
                for (var i = 0; i < toollistlen; i++) {
                    var toolconfig = this.availabletools[availtools[i]];
                    var base = toolsinst.showtools(toolconfig);
                    base && basenodes.push(base);
                }
                $(basenodes.join(',')).show();
            }

        }

        if (selectedtype == 'label' || selectedtype == 'value') {
            // eslint-disable-next-line no-multipleDOMLookup
            if (this.selectedfields && this.selectedfields.closest('.zcanvas-field').parent().is('.zc-table-cell')) { // NO I18N
                $('.zc-labelalign-tool').hide();
            }
        }

        // Selection Area Changes
        //Lyte.registeredMixins["canvas-builder-settings"].selectionchange(this.selectedfields); // NO I18N
        selectionchange(this.selectedfields);
        // eslint-disable-next-line no-multipleDOMLookup
        var comp = document.querySelector('canvas-builder'); // NO I18N
        if (this.selectedfields) {

            var cdata = this.selectedfields.data('zccustomstate'); // NO I18N
            if (!cdata && this.selectedfields.is('.zcanvas-field:not(.zccbutton)')) {
                cdata = this.selectedfields.find('.zcanvas-data-node').data('zccustomstate'); // NO I18N
            } else if (this.selectedfields.is('.tab')) { // NO I18N
                if (this.config && this.config.stateelement) {
                    var _selel = this.config && this.config.stateelement && this.config.stateelement(this.selectedfields);
                    if (_selel) {
                        cdata = _selel.data('zccustomstate'); // NO I18N
                    }

                }
            }
            cdata = cdata ? zutils.zcopyobj2(cdata) : [];
            //comp.setData('toolcriterias', cdata); // NO I18N
        }
        if (meta && meta.state !== 'default') {
            var stateel = document.getElementById('zc_state_' + meta.state); // NO I18N
            if (stateel) {
                stateel.classList.add('zcanvas-tools-list-selected'); // NO I18N
                comp.component.actions.switchstate.bind(comp.component)(meta.state, true, false, true);
            }
        }

        if (zcanvasrelatedList && zcanvasrelatedList.currentmenu && zcanvasrelatedList.currentmenu.opened === '#zcanvas_menu') {

            //canvas rules switching in the left tab
            // comp.setData('selectedcriteriamodule', null); // NO I18N
            // comp.setData('selectedModuleapiname', comp.getData("defaultModuleapiname")); // NO I18N	 

        } else {
            var selout = $('#zcanvas-editor-outer').data('zcanvas');
            if (selout && selout.config && selout.config.toolsRef) {
                var selectedcontainer = $(selout.config.toolsRef.selectedfields).closest('.zcanvas-non-delete');
                if (selectedcontainer && selectedcontainer.length) {
                    var selectedel = selectedcontainer.closest('.zcanvas-static-editor'); // NO I18N
                    var selecteddata = selectedel.data('zcanvas'); // NO I18N
                    var rlid = selecteddata.id; // NO I18N
                    // comp.setData('selectedcriteriamodule', rlid); // NO I18N
                    //  var module_name = '';  // Lyte.registeredMixins["canvas-builder-settings"].getModuleNameFromRelatedlistId(rlid);// NO I18N
                    //  if( comp.getData("selectedModuleapiname") === moduleApiMapping[ module_name] ){
                    // 	 comp.setData('selectedModuleapiname',null ); // NO I18N
                    //  }
                    //  comp.setData('selectedModuleapiname', moduleApiMapping[ module_name] ); // NO I18N
                } else {
                    // comp.setData('selectedcriteriamodule' , null); // NO I18N
                    // comp.setData('selectedModuleapiname',comp.getData("defaultModuleapiname") ); // NO I18N	 
                }
            }
        }
        // setTimeout(function () {
        //     // thirdPartyUtils.bindPerfectScrollUpdate($('#canvas-available-tools'));
        //     disablePerfectScroll('canvas-available-tools'); // NO I18N
        //     enablePerfectScroll('canvas-available-tools');  // NO I18N
        // }, 500);




    },
    integritycheck: function (el, toolconf) {
        if (el.is('.zcanvas-editor-outer') && this.config.tools.page && !(this.config.tools.page.includes(toolconf.toolname) || this.config.tools.page.includes(toolconf.parent))) {
            return false;
        }
        return true;
    },
    gettype: function (selectedfields) {
        var selecteddata = {};
        var staticparent = selectedfields.parents('.zcanvas-static-editor'); // NO I18N

        var isImage = selectedfields.closest('.zcbdrbox').length; // NO I18N
        var isTextArea = selectedfields.children('crux-text-area-component').length; // NO I18N
        // add condition below staticparent.length
        if (selectedfields.hasClass('zcanvas-static-editor')) { // NO I18N 
            selectedfields = staticparent.length ? staticparent : selectedfields;
            selecteddata = { zctype: 'relatedlist' }; // NO I18N
        } else if (selectedfields.hasClass('zc-rl-sub-selectable')) { // NO I18N
            selecteddata = { zctype: 'subtype' }; // NO I18N
        } else if (selectedfields.hasClass('tab')) { // NO I18N
            selecteddata = { zctype: 'Tab Layout' }; // NO I18N
        } else if (selectedfields.hasClass('zctablayout')) { // NO I18N
            selecteddata = { zctype: 'Tab' }; // NO I18N
        } else if (isImage) {
            selecteddata = { zctype: 'image' }; // NO I18N
        } else if (isTextArea) {
            selecteddata = { zctype: 'textarea' }; // NO I18N
        } else if (selectedfields.hasClass('zclayout')) { // NO I18N    
            var layoutname = selectedfields.attr('data-layoutname'); // NO i18N
            selecteddata = { zctype: layoutname }
        } else if (selectedfields.hasClass('zclayoutselectable')) { // NO i18N
            selecteddata = { zctype: selectedfields.attr('data-layout-selctabletype') }; // NO i18N
        } else if (selectedfields.hasClass('zcanvas-non-delete')) { //NO I18N
            selecteddata = { zctype: 'relatedlist section' }; // NO I18N
        } else if (selectedfields.hasClass('zcanvas-title-editor')) { //NO I18N
            selecteddata = { zctype: 'relatedlist title' }; // NO I18N
        } else if (selectedfields.hasClass('zcanvas-editor')) { //NO I18N
            selecteddata = { zctype: 'section' }; // NO I18N
        } else if (selectedfields.hasClass('zcanvas-editor-outer')) { //NO I18N
            selecteddata = { zctype: 'page' }; // NO I18N
        } else if (selectedfields.hasClass('zcanvas-holder')) { // NO I18N
            var stype = 'holder'; // NO I18N
            var isbtn = selectedfields.closest('.zccbutton').length; // NO I18N
            if (isbtn) {
                stype = 'button holder'; // NO I18N
            } else if (selectedfields.closest('.zcclink').length) { // NO I18N
                stype = 'link holder'; // NO I18N
            }
            selecteddata = { zctype: stype }; // NO I18N
        } else if (selectedfields.attr('zc-icon')) { // NO I18N
            selecteddata = { zctype: 'icon' }; // NO I18N
        } else if (selectedfields.hasClass('zcanvas-label')) { // NO I18N
            var stype = 'label'; // NO I18N
            var isbtn = selectedfields.closest('.zccbutton').length; // NO I18N
            if (isbtn) {
                stype = 'button label'; // NO I18N
            } else if (selectedfields.closest('.zcclink').length) { // NO I18N
                stype = 'link label'; // NO I18N
            }
            selecteddata = { zctype: stype }; // NO I18
        } else if (selectedfields.hasClass('zcanvas-value-container')) { // NO I18N
            var stype = 'value'; // NO I18N
            var isbtn = selectedfields.closest('.zccbutton').length; // NO I18N
            if (isbtn) {
                stype = 'button value'; // NO I18N
            } else if (selectedfields.closest('.zcclink').length) { // NO I18N
                stype = 'link value'; // NO I18N
            } else if (selectedfields.closest('.zcimagefield').length) { // NO I18N
                stype = 'image value'; // NO I18N
            }
            selecteddata = { zctype: stype }; // NO I18
            if (selectedfields.find('crm-tag').length) {
                selecteddata = { zctype: 'tag' }; // NO I18N
            }
        } else if (selectedfields.hasClass('zccbutton')) { // NO I18N
            selecteddata = { zctype: 'button' }; // NO I18N
        } else if (selectedfields.hasClass('zcclink')) { // NO I18N
            selecteddata = { zctype: 'link' }; // NO I18N
        } else if (selectedfields.hasClass('zcbdrbox')) { // NO I18N
            selecteddata = { zctype: 'image' }; // NO I18N
        } else if (selectedfields.hasClass('zcanvas-field')) { // NO I18N
            selecteddata = { zctype: 'field' }; // NO I18N
        } else if (selectedfields.hasClass('zcanvas-seperator')) { // NO I18N
            selecteddata = { zctype: 'seperator' }; // NO I18N
        } else if (selectedfields.hasClass('zcanvas-row-seperator')) { // NO I18N
            selecteddata = { zctype: 'field row' }; // NO I18N
        } else if (selectedfields.hasClass('zcanvas-selectable')) { // NO I18N
            selecteddata = { zctype: selectedfields.attr('data-zcanvastooltype') } // NO i18N
        }
        return selecteddata;
    },
    preprocess: function (element, config, result) {
        var property = config.actionproperty;
        if (element.is('.zctoolpostprocess') && element.find('') && element.is('.zclayout')) {
            var instname = element.attr('data-layoutname'); // NO I18N
            var inst = zclayout.prototype.layouts[instname];
            if (inst) {
                var flag = inst.postprocessapply(element, config, result);
                return flag;
            }
        }
        if ((element.hasClass('zc-tabs') || element.hasClass('tab') || element.hasClass('zc-tab-container')) && property && (property.indexOf('margin') > -1 || property.indexOf('padding') > -1)) {
            var $ayout = element.closest('.zctablayout'); // NO I18N
            var $cont = $ayout.children('.zc-tab-container'); // NO I18N
            var outwidth = $cont.outerHeight();
            var oldheight = $ayout.outerHeight();
            var outcss = $cont.css(['margin-top', 'margin-bottom']); // NO I18N
            if (!$cont.hasClass('zc-tab-processing')) {
                $cont.css('min-height', outwidth + parseInt(outcss['margin-top'] + parseInt(outcss['margin-bottom']))); // NO I18N
                $cont.addClass('zc-tab-processing');
                $cont.attr('data-height', oldheight); // NO I18N
            }
        }
    },
    stateelement: function (element) {
        if (element.is('.zcanvas-field:not(.zccbutton)')) { // NO I18N
            return element.find('.zcanvas-data-node'); // NO I18N
        }
        if (element.is('.tab')) { // NO I18N
            return element.parent('ul').find('.zcaddtab'); // NO I18N
        }
        return element;
    },
    postprocess: function (selectedfield, style, config, undoobj, flag, currentundo, parentstyles) {
        var property = config.actionproperty;
        if (selectedfield.is('.zcanvas-field') || selectedfield.is('.zcanvas-holder')) {
            var $selectedEl = selectedfield.find('.zcanvas-inner-component');
            var sellen = $selectedEl.length;
            if (!selectedfield.hasClass('zccbutton') && (property == 'font-size' || property == 'font-family' || property == 'color' || property == 'background-color')) { // NO I18N
                for (var i = 0; i < sellen; i++) {
                    var undo = {}
                    var e = $selectedEl.eq(i);
                    var selector = this.getSelectorByElement(e, 'default'); // NO I18N
                    var originalselector = this.getSelectorByElement(e);
                    var styles = this.getstylebyselector(selector, true);
                    if (!styles[this.state]) {
                        this.zcstyles[selector][this.state] = {};
                        var parentorder = 0;
                        if (parentstyles && parentstyles[this.state]) {
                            parentorder = parentstyles[this.state]._order;
                        }
                        this.zcstyles[selector][this.state]._order = parentorder;
                        this.zcstyles[selector][this.state]._inherited = true;
                    }
                    undo.action = 'action'; // NO I18N
                    undo.node = selector;
                    var previous = {};
                    for (var key in style) {
                        previous[key] = this.zcstyles[selector][this.state][key];
                    }
                    _.extend(this.zcstyles[selector][this.state], style);
                    this.updatestyle(config, originalselector, this.zcstyles[selector][this.state]);
                    undo.state = this.state;
                    undo.previous = previous;
                    undo.current = style;
                    undoobj.push(undo);
                }
            } else if (config.toolname == 'uppercase') { // NO I18N
                /*var getactionclass = function(item){
                    if(this.el.hasClass(item)){
                        $selectedEl.eq(i).removeClass(item).zremoveClass(item);
                        this.previous.class = item;
                    }
                }
                if(sellen){
                    selectedfield.removeClass(style.class).zremoveClass(style.class);
                    currentundo.current = currentundo.previous;
                } */
                for (var i = 0; i < sellen; i++) {
                    // eslint-disable-next-line no-attribute-selectors
                    if ($selectedEl.eq(i).is('[zc-icon]')) {
                        continue;
                    }
                    var undo = this.changehandler(config, style, true, null, null, $selectedEl.eq(i));
                    if (undo && undo.actionarray && undo.actionarray[0]) {
                        undoobj.push(undo.actionarray[0]);
                    }
                    /*	var undo = {}
                        undo.node = $selectedEl.eq(i);
                undo.action = 'actionclasslist'; // NO I18N
                undo.current = style;
                var previous = { class: '' };
                config.availableclass.map(getactionclass.bind({el: $selectedEl.eq(i) , previous: previous}))
                undo.previous = previous;
                $selectedEl.eq(i).addClass(style.class).zaddClass(style.class);
                undoobj.push(undo); */
                }
            } else if (config.toolname == 'linethrough') { // NO I18N
                /*if(sellen){
                    selectedfield.removeClass(config.actionclass).zremoveClass(config.actionclass);
                    currentundo.current =false;
                } */
                for (var i = 0; i < sellen; i++) {
                    // eslint-disable-next-line no-attribute-selectors
                    if ($selectedEl.eq(i).is('[zc-icon]')) {
                        continue;
                    }
                    var undo = this.changehandler(config, style, true, null, null, $selectedEl.eq(i));
                    /*var undo = {};
                    undo.node = $selectedEl.eq(i);
            undo.action = 'classaction'; // NO I18N
            undo.className = config.actionclass;
            if(style){
                undo.previous = false;
                undo.current = true;
                $selectedEl.eq(i).addClass(config.actionclass).zaddClass(config.actionclass);
            }else{
                undo.previous = true;
                undo.current = false;
                $selectedEl.eq(i).removeClass(config.actionclass).zremoveClass(config.actionclass);
            }
            undoobj.push(undo); */
                    if (undo && undo.actionarray && undo.actionarray[0]) {
                        undoobj.push(undo.actionarray[0]);
                    }

                }
            }
        }

        if (selectedfield && selectedfield.hasClass('zcbdrbox')) { // NO I18N
            var pinst = zutils.getParentData(selectedfield);
            pinst.adjustimagetooriginal(selectedfield);
        }

        if (property && property == 'font-size') { // NO I18N
            var closestfield = selectedfield.closest('.zcanvas-field'); // NO I18N
            if (closestfield.length) {
                var fwidth = closestfield.outerWidth();
                var fdiff = fwidth - closestfield.width();
                var scrollwidth = closestfield.find('.zcanvas-data-node').outerWidth(); // NO I18N
                var newwidth = fwidth;
                if (fwidth < scrollwidth) {
                    newwidth = scrollwidth + fdiff;
                    var position = closestfield.position();
                    position.width = fwidth;
                    position.height = 'auto';
                    var cpos = zutils.zcopyobj(position);
                    cpos.width = newwidth;
                    closestfield.width(newwidth);
                    undoobj.push({
                        action: "resize", // NO I18N
                        node: zutils.getSelectorByElement(closestfield),
                        current: cpos,
                        previous: position
                    })
                }
            }
        }

        if (property && property.indexOf('bwidth') > -1) {
            // Selection Area Changes
            //Lyte.registeredMixins["canvas-builder-settings"].selectionchange(selectedfield); // NO I18N
            selectionchange(selectedfield);
        }

        if (property && (property.indexOf('padding') > -1 || property.indexOf('width') > -1) && selectedfield.is('.zcstaticicon')) {
            var selectedicon = selectedfield.children('.zciconcontainer'); // NO I18N
            var icon = selectedicon.children('span'); // NO I18N
            // eslint-disable-next-line layout-thrashing
            var scrollwidth = icon[0].scrollHeight;
            // eslint-disable-next-line layout-thrashing
            // var outwidth = selectedicon.outerHeight();
            var padding = selectedicon.css(['padding-left', 'padding-right', 'border-left-width', 'border-right-width']); // NO I18N
            var newwidth = scrollwidth + parseInt(padding['padding-left']) + parseInt(padding['padding-right']) + parseInt(padding['border-left-width']) + parseInt(padding['border-right-width']); // NO I18N
            //	if(outwidth < newwidth){
            selectedfield.css({ width: newwidth, height: newwidth });
            //	}
            if (!flag) {
                var inst = selectedfield.data('uiResizable'); // NO I18N
                var size = { height: newwidth, width: newwidth }
                undoobj.push({
                    action: "resize", // NO I18N
                    node: zutils.getSelectorByElement(selectedfield),
                    current: size,
                    previous: inst.size
                })
                inst.size = size;
            }
        }



        if (property && (property.indexOf('margin') > -1 || property.indexOf('padding') > -1) && (selectedfield.hasClass('zc-tabs') || selectedfield.hasClass('tab') || selectedfield.hasClass('zc-tab-container'))) {
            var $tab = selectedfield.closest('.zc-tabs'); // NO I18N
            if (!$tab.length) {
                var $tabcontainer = selectedfield;
                var $tablayout = $tabcontainer.closest('.zctablayout'); // NO I18N
                var $tab = $tablayout.children('.zc-tablist-container').children('.zc-tabs'); // NO I18N
            } else {
                var $tablayout = $tab.closest('.zctablayout'); // NO I18N
                var $tabcontainer = $tablayout.children('.zc-tab-container'); // NO I18N
            }
            // eslint-disable-next-line layout-thrashing
            var outHeight = $tab.outerHeight();
            var margincss = $tab.css(['margin-top', 'margin-bottom']); // NO I18N
            if ($tabcontainer.hasClass('zc-tab-processing')) {
                var conmargin = $tabcontainer.css(['min-height', 'margin-top', 'margin-bottom']); // NO I18N
                var newHeight = outHeight + parseInt(margincss['margin-top']) + parseInt(margincss['margin-bottom']) + parseInt(conmargin['min-height']) + parseInt(conmargin['margin-top']) + parseInt(conmargin['margin-bottom']); // NO I18N
                if (!flag) {
                    var oldheight = $tabcontainer.attr('data-height'); // NO I18N
                    var undo = {
                        action: 'resize', // NO I18N
                        previous: { height: oldheight },
                        current: { height: newHeight },
                        node: '#' + $tablayout.attr('id'),
                        editor: '#' + zutils.getParentEditor($tablayout).attr('id')
                    }
                    undoobj.push(undo);
                    $tabcontainer.removeClass('zc-tab-processing').css('min-height', ''); // NO I18N
                }
                $tablayout.css('height', newHeight); // NO I18N
            }

        }


        if (property && property.indexOf('bwidth') > -1 && selectedfield.hasClass('tab') && !flag) {
            var tabel = selectedfield.find('.icon , .deletetabicon'); // NO I18N
            tabel.css('position', 'relative'); // NO I18N
            setTimeout(function () {
                tabel.css('position', 'absolute'); // NO I18N
            }, 0);
        }
    },
    tools: {
        'Button': ['width', 'height', 'radiussliderp', 'radiusphideswt', 'radiusinputp', 'radiusleftinputp', 'radiustopinputp', 'radiusrightinputp', 'radiusbottominputp', 'radiusswitchp', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'depthforward', 'depthbackward', 'visibility'],
        'image': ['width', 'height', 'radiussliderp', 'radiusphideswt', 'radiusinputp', 'radiusleftinputp', 'radiustopinputp', 'radiusrightinputp', 'radiusbottominputp', 'radiusswitchp', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'depthforward', 'depthbackward', 'visibility'], // NO I18N
        'field': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'depthforward', 'depthbackward', 'labelalign', 'visibility'],  // NO I18N
        'holder': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt',  // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'label': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt',  // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'value': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N 
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'image value': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'bgcolor', 'bgcolorinput', // NO I18N 
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'button holder': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt',  // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'button label': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt',  // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'button value': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N 
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign', 'visibility'], // NO I18N
        'link': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'depthforward', 'depthbackward', 'visibility'],  // NO I18N
        'link holder': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt',  // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'link label': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt',  // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'link value': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N 
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'textarea': ['lhslider', 'lhinput', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N 
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'tag': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'bgcolor', 'bgcolorinput', // NO I18N 
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'labelalign'], // NO I18N
        'section': ['width', 'height', 'widthswitch', 'heightswitch', 'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolor', 'bgcolorinput', 'depthforward', 'depthbackward', 'visibility'], // NO I18N
        'button': ['radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', 'paddinghideswt', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', 'fontsize', 'fontcolor', 'bgcolor', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolorinput', 'depthforward', 'depthbackward', 'visibility'], // NO I18N
        'Tab Layout': ['radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', // NO I18N
            'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', 'fontsize', 'fontcolor', 'align', 'bgcolor', 'fontweight', 'uppercasetab', 'italic', 'linethroughtab', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolorinput'], // NO I18N
        'Table Layout': ['radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolor', 'bgcolorinput', 'depthforward', 'depthbackward', 'visibility'], // NO I18N
        'Static Text': ['radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', 'fontsize', 'fontcolor', 'bgcolor', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolorinput', 'depthforward', 'depthbackward', 'visibility'], // NO I18N
        'Static Icon': ['radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', 'bgcolor', 'iconcolorhex', 'iconcolor', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolorinput', 'depthforward', 'depthbackward', 'visibility'], // NO I18N
        'relatedlist': ['width', 'height', 'widthswitch', 'heightswitch', 'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolor', 'bgcolorinput', 'depthforward', 'depthbackward', 'visibility'], // NO I18N
        'Tab Bar': ['radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolor', 'bgcolorinput', 'depthforward', 'depthbackward'], // NO I18N
        'Tab Container': ['radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt',  // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolor', 'bgcolorinput', 'depthforward', 'depthbackward', 'visibility'], // NO I18N
        'page': ['width', 'height', 'widthswitch', 'heightswitch', 'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolor', 'bgcolorinput'], // NO I18N
        'Line': ['thickslide', 'thickwidth', 'thickstyle', 'thickcolor', 'thickhex', 'depthforward', 'depthbackward', 'linemodeswitch', 'visibility'], // NO I18N
        'row': ['radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolor', 'bgcolorinput'],  // NO I18N
        'icon': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'iconcolorhex', 'iconcolor', 'bgcolor', 'bgcolorinput',// NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt'], // NO I18N
        'relatedlist section': ['width', 'height', 'widthswitch', 'heightswitch', 'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolor', 'bgcolorinput'], // NO I18N
        'relatedlist title': ['width', 'height', 'widthswitch', 'heightswitch', 'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt', // NO I18N
            'boxshadow', 'shadowhideswt', 'border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt', // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'marginslider', 'margininput', 'marginleftinput', 'margintopinput', 'marginrightinput', 'marginbottominput', 'marginswitch', 'marginhideswt', // NO I18N
            'bgadvanced', 'bgimagecontd', 'bggradcontd', 'bgimagecover', 'bgimagerepeat', 'bgcolor', 'bgcolorinput'], // NO I18N
        'seperator': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt'],  // NO I18N
        'field row': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'bgcolor', 'bgcolorinput', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt'], // NO I18N
        'MERGEFIELD': ['border', 'bordert', 'borderr', 'borderb', 'borderl', 'borderswitch', 'borderhideswt',  // NO I18N
            'paddingslider', 'paddinginput', 'paddingleftinput', 'paddingtopinput', 'paddingrightinput', 'paddingbottominput', 'paddingswitch', 'paddinghideswt', // NO I18N
            'bgcolor', 'bgcolorinput', // NO I18N
            'radiusslider', 'radiusinput', 'radiusleftinput', 'radiustopinput', 'radiusrightinput', 'radiusbottominput', 'radiusswitch', 'radiushideswt'], // NO I18N
        'Text': ['fontsize', 'fontcolor', 'bgcolor', 'bgcolorinput', 'fontweight', 'align', 'uppercase', 'italic', 'linethrough'], // NO I18N
        'Tab': [] // NO I18N

    },
    theme: {
        currenttheme: {
            field: {
                'default': { // NO I18N
                }
            },
            label: {
                'default': { // NO I18N
                    "color": "rgba(62, 62, 60, 1)", // NO I18N
                    "font-size": "15px", // NO I18N
                    "font-family": "LatoRegular", // NO I18N
                    "margin-right": "10px" // NO I18N
                }
            },
            value: {
                'default': { // NO I18N
                    "color": "rgba(8, 7, 7, 1)", // NO I18N
                    "font-size": "15px", // NO I18N
                    "font-family": "LatoRegular", // NO I18N
                }
            },
            textarea: {
                'default': { // NO I18N
                    "color": "rgba(8, 7, 7, 1)", // NO I18N
                    "font-size": "15px", // NO I18N
                    "font-family": "LatoRegular", // NO I18N
                    "line-height": "1" // NO I18N
                }
            },
            section: {
                'default': { // NO I18N
                    "background-color": "rgba(255, 255, 255, 1)", // NO I18N
                    "border-radius": "4px", // NO I18N
                    "border": "1px solid rgba(221, 219, 218, 1)", // NO I18N
                    "box-shadow": "0px 2px 2px 0px rgba(0,0,0, 0.12)" // NO I18N
                }
            },
            'relatedlist section': { // NO I18N
                'default': { // NO I18N
                    "background-color": "rgba(255, 255, 255, 0)" // NO I18N
                }
            },
            'relatedlist title': { // NO I18N
                'default': { // NO I18N
                    "background-color": "rgba(255, 255, 255, 0)" // NO I18N
                }
            },
            title: {
                'default': { // NO I18N
                    "color": "rgba(0, 0, 0, 1)", // NO I18N
                    "font-size": "18px", // NO I18N
                    "font-family": "LatoRegular", // NO I18N
                }
            },
            button: {
                'default': { // NO I18N
                    "font-size": "15px", // NO I18N
                    "color": "rgba(34, 40, 51, 1)", // NO I18N
                    "border-radius": "6px", // NO I18N
                    "padding-top": "6px", // NO I18N
                    "padding-right": "20px", // NO I18N
                    "padding-bottom": "6px", // NO I18N
                    "padding-left": "20px", // NO I18N
                    "background-color": "rgba(234, 238, 245, 1)", // NO I18N
                    "border": "1px solid rgba(208, 212, 223, 1)", // NO I18N
                    "font-family": "LatoRegular", // NO I18N
                }
            },
            'Tab Layout': { // NO I18N
                "default": { // NO I18N
                    "color": "rgba(62, 62, 60, 1)", // NO I18N
                    "font-size": "15px",  // NO I18N
                    "font-family": "LatoRegular", // NO I18N
                    "padding-left": "20px", // NO I18N
                    "padding-right": "20px", // NO I18N
                    "padding-top": "10px", // NO I18N
                    "padding-bottom": "10px", // NO I18N
                    "background-color": "transparent", // NO I18N
                    "border-bottom": "3px solid transparent" // NO I18N
                },
                "hover": { // NO I18N
                    "color": "rgba(62, 62, 60, 1)", // NO I18N
                    "border-bottom": "3px solid rgba(0, 112, 210, 1)" // NO I18N
                },
                "active": { // NO I18N
                    "color": "rgba(62, 62, 60, 1)", // NO I18N
                    "font-size": "15px", // NO I18N
                    "font-family": "LatoRegular", // NO I18N
                    "border-bottom": "3px solid rgba(0, 112, 210, 1)", // NO I18N
                    "padding-left": "20px", // NO I18N
                    "padding-right": "20px", // NO I18N
                    "padding-top": "10px", // NO I18N
                    "padding-bottom": "10px", // NO I18N
                    "background-color": "transparent" // NO I18N
                }
            },
            page: {
                "default": { // NO I18N
                    "background-color": "rgba(233, 235, 238, 1)", // NO I18N
                    "padding-bottom": "100px", // NO I18N
                    "padding-top": "0px", // NO I18N
                    "padding-left": "0px", // NO I18N
                    "padding-right": "0px" // NO I18N
                }
            },
            relatedlist: {
                'default': { // NO I18N
                    "background-color": "rgba(255, 255, 255, 1)", // NO I18N
                    "border-radius": "4px", // NO I18N
                    "border": "1px solid rgba(221, 219, 218, 1)", // NO I18N
                    "box-shadow": "0px 2px 2px 0px rgba(0,0,0, 0.12)", // NO I18N
                    "padding": "30px" // NO I18N
                }
            },
            'Static Text': { // NO I18N
                'default': { // NO I18N
                    'padding': '10px' // NO I18N
                }
            },
            'Line': { // NO I18N 
                'default': { // NO I18N
                    'border-width': '1px', // NO I18N
                    'border-style': 'solid' // NO I18N
                }
            },
            'Table Layout': { // NO I18N
                'default': { // NO I18N
                    "background-color": "rgba(255, 255, 255, 1)" // NO I18N
                }
            }

        },
        selector: {
            field: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink)' }, // NO I18N
            label: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink) .zcanvas-label' }, // NO I18N
            value: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field):not(.zcclink) .zcanvas-value-container' }, // NO I18N
            tag: { 'default': '.zcanvas-field:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container crm-tag ul li' }, // NO I18N
            section: { 'default': '.zcanvas-editor:not(.zcanvas-non-delete):not(.zcanvas-title-editor):not(.zc-no-theme):not(.zclayout-table):not(.zc-tab-content)' }, // NO I18N
            'relatedlist section': { 'default': '.zcanvas-editor.zcanvas-non-delete' }, // NO I18N
            'relatedlist title': { 'default': '.zcanvas-editor.zcanvas-title-editor' }, // NO I18N
            title: { 'default': '.zcstatictext.zc_disabled' }, // NO I18N
            button: { 'default': '.zccbutton.zcanvas-field' }, // NO I18N
            'Tab Layout': { // NO I18N
                'default': '.zctablayout .zc-tabs .tab:not(.active)', // NO I18N
                hover: '.zctablayout .zc-tabs .tab:not(.active):hover', // NO I18N
                active: '.zctablayout .zc-tabs .tab.active' // NO I18N
            },
            page: {
                'default': '.zcanvas-editor-outer' // NO I18N
            },
            relatedlist: {
                'default': '.zcanvas-static-editor' // NO I18N
            },
            'Static Text': { // NO I18N
                'default': '.zcstatictext:not(.zc_disabled)' // NO I18N
            },
            'Line': { // NO I18N
                'default': '.zclayout.zcdivider .zc-divider-line' // NO I18N
            },
            'Table Layout': { // NO I18N
                'default': 'body > .zcanvas-field .zcanvas-editor.zclayout-table , .zcanvas-editor-outer .zcanvas-editor.zclayout-table' // NO I18N
            },
            textarea: { 'default': '.zcanvas-field.zctextarea:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' } // NO I18N
        }

    },
    customstate: function (state, selector, element) {
        if (!state || state.indexOf('zcanvas') !== 0) {
            return selector;
        }
        var mstatekey = '_mousestate_'; // NO I18N
        var stateindex = state.indexOf(mstatekey);
        if (stateindex > -1) {
            var stlen = state.length;
            var mouselen = mstatekey.length;
            var st = state.slice(0, stateindex);
            var originalstate = state.slice(stateindex + mouselen, stlen);

            if (originalstate && st) {
                state = st;
                if (originalstate === 'hover') {
                    selector += ':hover'; // NO I18N
                } else if (originalstate === 'active') { // NO I18N
                    selector += '.active'; // NO I18N
                }
            }
        }

        if (element && element.hasClass('zcanvas-non-delete')) {
            return '.' + state + selector;
        }

        return '.' + state + ' ' + selector;
    },
    compressionmap: zutils.stylecompressionmap,
    classstyles: zutils.classstyles,
    classselector: function (sel) {
        if (sel.indexOf('zcanvas-holder') > -1) {
            sel = sel.replace('.zcanvas-holder', '').trim();
        }
        return sel;
    },
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
    }
});

// Width Height Tool
options.toolsRef.addtool({
    toolname: 'width',  // NO I18N
    container: '#widthtool', // NO I18N
    type: 'input', // NO I18N
    actiontype: 'action', // NO I18N
    actionproperty: 'width', // NO I18N
    measurement: "px", //NO I18N
    basecontainer: '.dimentiontool', // NO I18N
    actualmin: 1,
    actualmax: 3000,
    i18n: 'zc.editor.width', // NO I18N
    min: 1,
    max: 3000,
    populate: function (config) {
        var $el = this.selectedfields;
        var width = parseInt($el.width());
        // eslint-disable-next-line no-complex-selector
        var input = $(config.container + ' input');
        var $inputcontainer = $(config.container + ' .zcanvas-tools-input');
        input.val(width);
        input.data('zcprev', width); // NO I18N
        $inputcontainer.removeClass('zc-non-valid-input');
    },
    onChange: function (config, item) {
        var $el = this.main.selectedfields;
        var actwidth = $el.width();
        var input = $(config.container + ' .zcanvastoolinput');
        var prewidth = input.data('zcprev'); // NO I18N

        if (parseInt(item.style.width) > 0) {
            if (parseInt(item.style.width) != actwidth) {
                $el.width(item.style.width);
                undoredomanager.push({
                    action: 'resize', // NO I18N
                    node: $el,
                    previous: { width: prewidth },
                    current: { width: item.style.width },
                    changedetection: $('#zcanvas-editor-outer').data('zcanvas').config.onChange // NO I18N
                });
                input.data('zcprev', item.style.width); // NO I18N
                if ($el && $el.hasClass('zcanvas-editor-outer')) { // NO I18N
                    $el.parent().width(item.style.width);
                }
            }
        } else {
            input.val(prewidth);
        }

        if ($el && $el.hasClass('zcbdrbox')) { // NO I18N
            var pinst = zutils.getParentData($el);
            pinst.adjustimagetooriginal($el);
        }


    }
});
options.toolsRef.addtool({
    toolname: 'height',  // NO I18N
    container: '#heighttool', // NO I18N
    type: 'input', // NO I18N
    actiontype: 'action', // NO I18N
    actionproperty: 'height', // NO I18N
    measurement: "px", //NO I18N
    actualmin: 1,
    actualmax: 21000,
    i18n: 'ze.editor.height', // NO I18N
    min: 1,
    max: 21000,
    populate: function (config) {
        var $el = this.selectedfields;
        var height = parseInt($el.height());
        // eslint-disable-next-line no-complex-selector
        var input = $(config.container + ' input');
        var $inputcontainer = $(config.container + ' .zcanvas-tools-input');
        input.val(height);
        input.data('zcprev', height); // NO I18N
        $inputcontainer.removeClass('zc-non-valid-input');
    },
    onChange: function (config, item) {
        var $el = this.main.selectedfields;
        var actheight = $el.height();
        var input = $(config.container + ' .zcanvastoolinput');
        var prewidth = input.data('zcprev'); // NO I18N
        if (parseInt(item.style.height) > 0) {
            if (actheight != parseInt(item.style.height)) {
                $el.height(item.style.height);
                undoredomanager.push({
                    action: 'resize', // NO I18N
                    node: $el,
                    previous: { height: prewidth },
                    current: { height: item.style.height }
                });
                input.data('zcprev', item.style.height); // NO I18N
            }
        } else {
            input.val(prewidth);
        }

    }
});
options.toolsRef.addtool({
    toolname: 'widthswitch', // NO I18N
    container: '#widthswitch', // NO I18N
    type: 'toggle', // NO I18N
    displayvalue: '<span class="zc_checkbox"></span>', // NO I18N
    actiontype: 'condition', // NO I18N
    actioncondition: function (element) {
        if (element.attr('data-fixed') == "true" || element.attr('data-fixed-x') == "true" || element.attr('fixed') == "true") {
            return false;
        }
        return true;
    },
    onChange: function (flag) {
        var element = this.main.selectedfields;
        if (!flag == false && element.attr('fixed')) {
            element.removeAttr('fixed'); // NO I18N
            element.attr('data-fixed-y', true); // NO I18N
        }
        element.attr('data-fixed-x', !flag); // NO I18N
    }
});
options.toolsRef.addtool({
    toolname: 'heightswitch', // NO I18N
    container: '#heightswitch', // NO I18N
    type: 'toggle', // NO I18N
    displayvalue: '<span class="zc_checkbox"></span>', // NO I18N
    actiontype: 'condition', // NO I18N
    actioncondition: function (element) {
        if (element.attr('data-fixed') == "true" || element.attr('data-fixed-y') == "true" || element.attr('fixed') == "true") {
            return false;
        }
        return true;
    },
    onChange: function (flag) {
        var element = this.main.selectedfields;
        if (!flag == false && element.attr('fixed')) {
            element.removeAttr('fixed'); // NO I18N
            element.attr('data-fixed-x', true); // NO I18N
        }
        element.attr('data-fixed-y', !flag); // NO I18N
    }
});

// LH TOOL

options.toolsRef.addtool({
    toolname: 'lhslider', // NO I18N
    container: '#lhslider',  // NO I18N
    type: 'slider', // NO I18N
    selected: '0', // NO I18N
    actiontype: 'action', // NO I18N
    actionproperty: 'line-height', // NO I18N
    basecontainer: '.zc-lh-tool', // No I18N
    measurement: "", //NO I18N
    min: '1', // NO I18N
    max: '2', // NO I18N
    step: '.1', // NO I18N
    i18n: 'zc.editor.lineheight', // NO I18N
    actualmin: 1,
    actualmax: 2,
    mousewheel: true,
    nomeasurement: true,
    format: 'float', // No I18N
    sync: '#lhinput' // NO I18N
});

options.toolsRef.addtool({
    toolname: 'lhinput', // NO I18N
    container: '#lhinput', // NO I18N
    type: 'input', // NO I18N
    selected: '0', // NO I18N
    actiontype: 'action', // NO I18N
    actionproperty: 'line-height', // NO I18N
    measurement: "", //NO I18N
    i18n: 'zc.editor.lineheight', // NO I18N
    min: '1', // NO I18N
    max: '2', // NO I18N
    step: '.1', // NO I18N
    actualmin: 0,
    actualmax: 2,
    mousewheel: true,
    nomeasurement: true,
    fixedpos: 1,
    format: 'float', // No I18N
    sync: '#lhslider' // NO I18N
})

// Visibility tool
options.toolsRef.addtool({
    toolname: 'visibility', // NO I18N
    container: '#visibilitytool', // NO I18N
    actiontype: 'action', // NO I18N
    actionproperty: 'opacity', // NO I18N
    type: 'list', // NO I18N
    basecontainer: '#zcvisibilitycontainer', // NO I18N
    list: [
        {
            selectvalue: 'Show', // NO I18N
            displayvalue: 'Show', // NO I18N
            style: {
                'opacity': '1' // NO I18N
            }
        },
        {
            selectvalue: 'Hide', // NO I18N
            displayvalue: 'Hide', // NO I18N
            style: {
                'opacity': '0.5' // NO I18N
            }
        }
    ]
});

var pickerContainer = '<div id="colorPickerId" data-default-color-button="false" data-title="Choose Color" class="zcolorpicker" style="display: none; width: 19%"></div>'; // NO I18N
// eslint-disable-next-line no-body-events
$('body').append(pickerContainer); // NO I18N

// Color picker - Start

function rgbtohex(rgba) {
    rgba = rgba.substr(5).split(")")[0].split(",");
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    function hexa(x) {
        if (x == 0) {
            return "00";
        }
        return Math.round(x * 255).toString(16);
    }
    return "#" + hex(rgba[0]) + hex(rgba[1]) + hex(rgba[2]) + hexa(rgba[3]);
}
var showpicker = function (origin, prop, el, callback, ref) {

    var picker = $('#colorPickerId');
    var bgColor = $(origin).css("background-color");
    //var bgColor = $(ref.config.sync).find('input').val();
    if (picker.is(':visible')) {
        ZComponents.colorpicker(picker).close();
    } else {
        picker.off('zcolorpickerchange').on('zcolorpickerchange', function (origEvent) {
            var data = origEvent.detail;
            var value = { style: {} };
            value.style[prop] = data.color; //No I18N
            $(origin).css("background-color", data.color); //No I18N
            bgColor = data.color;
            if (ref && ref.main && ref.main.tools.preprocesshandler) {
                value = ref.main.tools.preprocesshandler.bind(ref)(value);
            }
            if (callback) {
                callback(value, true);
            } else {
                if (ref.config.onChange) {
                    ref.config.onChange.bind(ref)(ref.config, value);
                } else {
                    ref.main.changehandler(ref.config, value);
                }

            }
            if (ref && ref.config.sync) {
                var hex = data.color ? rgbtohex(data.color).replace('#', '') : '000000'; // NO I18N
                $(ref.config.sync).find('input').val(hex);
            }

        });
        ZComponents.colorpicker(picker).setAttribute('value', bgColor);
        ZComponents.colorpicker(picker).open();
    }
}

// Color picker - End


// Color Picker Tool
options.toolsRef.tools.handler.colorpicker = function (config) {
    var template = '<div class="canvascolorcontainer" id="' + config.el + '">' +
        '<div class="zcanvascolor"></div>' +
        '</div>';
    var el = $($.parseHTML(template));
    var toolel = $(config.container);
    toolel.append(el);
    // toolel.click(function () {
    //     showJqColorpicker('#' + this.config.el, this.config.actionproperty, this.config.container, null, this, this.config.preprocess);
    // }.bind({ main: this, config: config }));
    toolel.click(function () {
        showpicker('#' + this.config.el, this.config.actionproperty, this.config.container, null, this, this.config.preprocess);
    }.bind({ main: this, config: config }));
}
options.toolsRef.tools.populate.colorpicker = function (config, obj) {
    if (obj.length) {
        var multi = this.multiobject(config, obj);
        if (!multi) {
            obj = {}
            if (config.availableclass) {
                obj.class = '';
            } else {
                obj[config.actionproperty] = '';
            }
        } else {
            obj = obj[0];
        }
    }
    var pickersource = $(config.container).find('.canvascolorcontainer');
    var style = obj[config.actionproperty];
    if (style || style == '') {
        pickersource.css('background-color', style); //No I18N
    }
}
options.toolsRef.tools.getvalue.colorpicker = function (config) {
    var pickersource = $(config.container).find('.canvascolorcontainer');
    // eslint-disable-next-line layout-thrashing
    return pickersource.css('background-color'); // NO I18N
}

// Color Picker input

options.toolsRef.tools.handler.hexinput = function (config) {

    var template = '<span class="zcanvas-tools-input">\
                                   <span class="zcanvas-tool-input-param">#</span>\
                                <input type="text" maxlength="6" class="zcanvastoolinput"/>\
                            </span>';
    var el = $($.parseHTML(template));
    var toolel = $(config.container);
    toolel.append(el);
    var $inputel = el.find('.zcanvastoolinput');

    var preprocessinput = function (value) {
        var r = hexToRGB('#' + value, 1);
        return r;
    }

    var inputhandler = function (e) {
        var result = { style: {} };
        var color = preprocessinput(e.target.value);
        result.style[this.config.actionproperty] = color;
        if (this.config.sync) {
            $(this.config.sync).find('.canvascolorcontainer').css('background-color', color); // NO I18N
        }

        result = this.main.tools.preprocesshandler.bind(this)(result);

        if (this.config.onChange) {
            this.config.onChange.bind(this)(this.config, result);
        } else {
            this.main.changehandler(this.config, result, this.nocatch);
        }

        e.stopImmediatePropagation();

        return result;
    }

    var pastehandler = function (e) {
        var pastedData = e.originalEvent.clipboardData.getData('text'); // NO I18N
        e.target.value = pastedData.replace('#', '').trim(); // NO I18N
        inputhandler.bind(this)(e);
    }

    $inputel.change(inputhandler.bind({ main: this, config: config, el: $inputel }));

    $inputel.on('paste', pastehandler.bind({ main: this, config: config, el: $inputel }));

    this.tools.metaformation.bind({ main: this, config: config })(el);
}

options.toolsRef.tools.populate.hexinput = function (config, obj) {
    if (obj.length) {
        var multi = this.multiobject(config, obj);
        if (!multi) {
            obj = {}
            if (config.availableclass) {
                obj.class = '';
            } else {
                obj[config.actionproperty] = '';
            }
        } else {
            obj = obj[0];
        }
    }
    var styleproperty = config.actionproperty
    var val;
    var value = obj;
    var $el = $(config.container).find('.zcanvas-tools-input'); // NO I18N
    var $inputel = $el.find('.zcanvastoolinput');
    val = getcurrentrgb(value[styleproperty] || '');
    val = val.hex.replace('#', '');
    if (val.indexOf('NAN') > -1) { // NO I18N
        val = '';
    }
    $inputel.val(val);
}


// Color Gradient tool
options.toolsRef.tools.handler.gradient = function (config) {
    var toolel = $(config.container);
    var changehandler = function (res, flag) { // NO I18N
        // var inst =  $("#bggradient").data('zgradient');
        // var style = inst.getvalue();
        if (flag) {
            var $colorel = $('#zcgradientpicker'); // NO I18N
            var bgselected = $colorel.css('background-color'); // NO I18N
            $colorel.attr('data-bgcolor', bgselected); // NO I18N
            toolel.data('zgradient').setbg(); // NO I18N
        }

        var value = { style: {} };
        if (this.config.preprocess) {
            value = this.config.preprocess.bind(this)(value);
        }
        var datac = $(config.datacontainer);
        this.main.changehandler(this.config, value, this.nocatch, !this.nocatch ? zutils.zcopyobj(datac.data('zcprev')) : undefined); // NO I18N
        if (!this.nocatch) {
            datac.data('zcprev', value.style);  // NO I18N
        }
        return value;

    };
    var newcolor = function (element) {
        $('#zcgradientpicker').removeAttr('id'); // NO I18N
        $(element).attr('id', 'zcgradientpicker'); // NO I18N
        showpicker('#zcgradientpicker', 'gradient', '#bggradient', changehandler.bind(this)); //NO I18N
    }
    var sortmethod = function (elements) {
        var sort = _.sortBy(elements, function (item) { return item.offsetLeft });
        return sort;
    }
    var inst = new ZGradientBuilder({
        container: config.container, // NO I18N
        onChange: changehandler.bind({ main: this, config: config, nocatch: true }),
        onClick: newcolor.bind({ main: this, config: config }),
        sortmethod: sortmethod,
        onStop: changehandler.bind({ main: this, config: config }),
        onRemove: function (st) {
            var colorpickerEle = document.getElementById('zcanvascolorpicker'); // NO I18N
            // colorpickerEle.setData('ltPropShow', false) // NO I18N
            changehandler.bind(this)(st);
        }.bind({ main: this, config: config })
    });
    toolel.data('zgradient', inst); // NO I18N
    this.tools.metaformation.bind({ main: this, config: config })(toolel);
}

options.toolsRef.tools.populate.gradient = function (config, obj) {
    if (obj.length) {
        var multi = this.multiobject(config, obj, true);
        if (!multi) {
            obj = {
                bggradient: []
            }
        } else {
            obj = obj[0];
        }
    }
    var container = $(config.container);
    var inst = container.data('zgradient'); // NO I18N
    inst.setvalue(obj[config.actionproperty]);
}

options.toolsRef.tools.getvalue.gradient = function (config) {
    var container = $(config.container);
    var inst = container.data('zgradient'); // NO I18N
    return inst.getvalue();
}


undoredomanager.toolsRef = options.toolsRef;

var viewtools = new zcanvastools({
    baseeditor: '#previewstyles', // NO I18N
    tools: {},
    nocompile: true,
    compressionmap: zutils.stylecompressionmap,
    classstyles: zutils.classstyles,
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
    },
    nodeattr: {
        key: 'zcqaval', // NO I18N
        key2: 'label', // NO I18N
        attr: {
            'data-zcqa': 'canvas-detail-' // NO I18N
        }
    },
    //customstate: Lyte.registeredMixins["canvas-builder-settings"].customstateview, // NO I18N
    theme: {
        selector: {
            field: { 'default': '#previewcanvas .zcanvas-field:not(.zccbutton):not(.zc-rl-field)' }, // NO I18N
            label: { 'default': '#previewcanvas .zcanvas-field:not(.zccbutton):not(.zc-rl-field) .zcanvas-label' }, // NO I18N
            value: { 'default': '#previewcanvas .zcanvas-field:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' }, // NO I18N
            textarea: { 'default': '#previewcanvas .zcanvas-field.zctextarea:not(.zccbutton):not(.zc-rl-field) .zcanvas-value-container' }, // NO I18N
            section: { 'default': '#previewcanvas .zcanvassection:not(.zcanvas-non-delete):not(.zcanvas-title-editor):not(.zcanvas-static-content-container):not(.zc-no-theme):not(.zc-tab-section)' }, // NO I18N
            'relatedlist section': { 'default': '#previewcanvas .zcanvassection.zcanvas-non-delete' }, // NO I18N
            'relatedlist title': { 'default': '#previewcanvas .zcanvassection.zcanvas-title-editor' }, // NO I18N
            title: { 'default': '#previewcanvas .zcstatictext.zc_disabled, .zcanvas-field.zctextarea' }, // NO I18N
            button: { 'default': '#previewcanvas .zccbutton.zcanvas-field' }, // NO I18N
            'Tab Layout': { // NO I18N
                'default': '.zctabview .zc-tabs .tab:not(.active)', // NO I18N
                hover: '.zctabview .zc-tabs .tab:not(.active):hover', // NO I18N
                active: '.zctabview .zc-tabs .tab.active' // NO I18N
            },
            page: {
                'default': '#previewcanvas > div' // NO I18N
            },
            relatedlist: {
                'default': '#previewcanvas .zc-list-component' // NO I18N
            },
            'Static Text': { // NO I18N
                'default': '.zcstatictext:not(.zc_disabled)' // NO I18N
            },
            'Line': { // NO I18N
                'default': '.zclayout.zcdivider .zc-divider-line' // NO I18N
            },
            'Table Layout': { // NO I18N
                'default': '.zclayout-table > .canvas-outer' // NO I18N
            }
        }
    }
});

jsonCreation.toolinst = options.toolsRef;
createStruture.toolinst = viewtools;
createStruture.singleshotrender = true;
zcconfig(options.toolsRef);
zutils.enableshortcuts();

outereditor.zcanvas(options); // blank editor

outereditor.click().disableSelection(); // For default style apply (1st click on Style)

// Menu and Submenu Heading Toggle
var menuheadings = $('.zcanvas-menu-heading , .zcanvas-submenu-heading');
thirdPartyUtils.titleForEllipsis(menuheadings);
menuheadings.click(function (event) {
    var $target = $(event.target);
    $target.toggleClass('zcnotransform'); // NO I18N
    $target.next().slideToggle();
    var _targetps = $target.closest('.ps-container'); // NO I18N
    setTimeout(function () {
        if (_targetps.length) {
            var _tid = _targetps.attr('id'); // NO I18N
            disablePerfectScroll(_tid); // NO I18N
            enablePerfectScroll(_tid);  // NO I18N
        }

    }, 500);
})

// To Initialize the dialog
ZComponents.dialog("#canvasdetails", {
    height: "100%",
    width: "100%",
    draggable: false,
    resizable: false,
    // open: function(e) {
    //     alert("triggered")
    // }
});

// To open the dialog on button click
document.getElementById("previewIcon").addEventListener('click', function (event) {
    ZComponents.dialog("#canvasdetails").open();
});
