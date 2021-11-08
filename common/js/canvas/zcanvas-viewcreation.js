(function () { // eslint-disable-line zstandard/no-global-function-call

    var canvasOutput = (function () {
        function nodesJson(selectNode, compressed) {
            $('.ui-draggable-dragging').removeClass('ui-draggable-dragging');
            return jsonCreation.createJson(selectNode, compressed);
        }
        function getHtml(selectedNode, nodeJson, servercall, viewType, viewWidth) {
            var html = createStruture.layoutHtml(selectedNode, nodeJson, servercall, viewType, viewWidth);
            return html;
        }
        // function getHtmlNew(selectedNode, nodeJson){
        // 	return createStruture.layoutHtmlNew(selectedNode, nodeJson);
        // }
        function toDom(json, onEditor) {
            return createStruture.innerHtml(json, onEditor);
        }
        function styleAttributes() {
            return jsonCreation.styleAttribute();
        }
        function layoutJson(selectedNode, nodeJson) {
            var layoutJson = createStruture.layoutJson(selectedNode, nodeJson);
            return layoutJson;
        }


        return {
            createJson: nodesJson,
            html: getHtml,
            innerNode: toDom,
            styleattributes: styleAttributes,
            htmlJson: layoutJson
            // htmlNew: getHtmlNew
        };
    })();

    window.canvasOutput = canvasOutput;

})();

(function () {
    // eslint-disable-next-line zohocrm/no-unused-vars
    var createStruture = (function () {

        var SERVER_RENDERING = true;

        var createElement = function (el) {
            //var $body = $('body');
            //var zciframe = $body.find('.zc-iframe'); // NO I18N
            // if(!zciframe.length){
            // 	zciframe = $('<iframe/>' , {class: 'zc-iframe'});
            // 	// eslint-disable-next-line zstandard/no-body-events
            // 	$body.append(zciframe);
            // }

            //var doc = zciframe.length ? zciframe[0].contentDocument : document;
            var zciframe = document.body.querySelector('.zc-iframe'); // NO I18N
            var doc = zciframe ? zciframe.contentDocument : document;
            return doc.createElement(el);
        }

        var $ZEL = function (st) {
            if (typeof st === 'string') {
                var div = createElement('div'); // NO I18N
                div.innerHTML = st;
                return $(div).children();
            } else {
                return st;
            }

        }
        function getvalue(style, property) {
            var result = { left: 0, top: 0, right: 0, bottom: 0 };
            var proparray = ['top', 'right', 'bottom', 'left']; // NO I18N
            if (style[property]) {
                var split = style[property].split(" ");
                if (split.length > 1) {
                    result.top = parseInt(split[0]);
                    result.right = parseInt(split[1]);
                    result.bottom = parseInt(split[2]);
                    result.left = parseInt(split[3]);
                } else {
                    result.top = result.right = result.bottom = result.left = parseInt(split[0]);
                }

            }
            var proplen = proparray.length;
            for (var i = 0; i < proplen; i++) {
                if (style[property + '-' + proparray[i]]) {
                    result[proparray[i]] = parseInt(style[property + '-' + proparray[i]] || 0);
                }
            }

            return result;
        }


        // function newHtmlLayout(){
        // 	return;
        // }

        function htmlLayout(selectedNode, json) {
            if (selectedNode) {
                var node = $(selectedNode);
                json = canvasOutput.createJson(node, undefined, true);
            } else if (json) {
                json = JSON.parse(JSON.stringify(json));
            } else {
                json = canvasOutput.createJson($("#zcanvas-editor-outer"), undefined, true);
            }
            if (!json) {
                return;
            }
            var type = json._type;
            if (type === "pagecomponent" || type === "component" || type === "relatedlist") {
                // setPadding(json);
                // var jsonChildren = json.children;
                // var htmlJson = viewUtils.distrubNodeGroup(json, "row");//NO I18N
                // if(type != "relatedlist"){
                // 	if(htmlJson && htmlJson.ui && htmlJson.ui.value.style){
                // 		htmlJson.ui.value.style.marginTop = htmlJson.ui.value.position.startY;
                // 		htmlJson.ui.value.style.marginLeft = htmlJson.ui.value.position.startX;
                // 	}
                // }
                // viewUtils.overlapAdjustment(json);
                viewUtils.distrubNodeGroup(json, "row");//NO I18N
                return json;
            } else {
                return json;
            }
        }

        function setComponentPadding(json) {
            if (json.ui.value.style && !json.ui.value.style.default) {
                json.ui.value.style.default = { };
            }
            var children = json.children;
            var paddingval = createStruture.splitstyle(json.ui.value.style.default, 'padding') // NO I18N
            var haspadding = typeof json.ui.value.style.default.padding !== 'undefined'; // NO I18N 
            if (children.length > 0) {
                // eslint-disable-next-line webperf/layout-thrashing
                var leftSpace = json.ui.value.position.minLeft || 0;
                // eslint-disable-next-line webperf/layout-thrashing
                var topSpace = json.ui.value.position.minTop || 0;
                // eslint-disable-next-line webperf/layout-thrashing
                var rightMaxNode = canvasObjUtils._.max(children, function (b) { return b.ui.value.position.endX });

                // var leftPadding = paddingvall.left;
                // var topPadding = paddingvall.top;
                // eslint-disable-next-line webperf/layout-thrashing
                if (paddingval.right > 0) {
                    // eslint-disable-next-line webperf/layout-thrashing
                    var rightSpace = json.ui.value.position.width - rightMaxNode.ui.value.position.endX;
                    // eslint-disable-next-line webperf/layout-thrashing
                    if (rightSpace < paddingval.right) {
                        var rightVal = rightSpace;
                    } else {
                        // eslint-disable-next-line webperf/layout-thrashing
                        var rightVal = paddingval.right;
                    }
                    json.ui.value.style.default['padding-right'] = rightVal + 'px'; // NO I18N
                } else if (haspadding) {
                    json.ui.value.style.default['padding-right'] = '0px'; // NO I18N
                }
                // eslint-disable-next-line webperf/layout-thrashing
                if (paddingval.bottom > 0) {
                    // eslint-disable-next-line webperf/layout-thrashing
                    var bottomSpace = json.ui.value.position.height - (rightMaxNode.ui.value.position.startY + rightMaxNode.ui.value.position.height);
                    // eslint-disable-next-line webperf/layout-thrashing
                    if (bottomSpace < paddingval.bottom) {
                        var bottomVal = bottomSpace;
                    } else {
                        // eslint-disable-next-line webperf/layout-thrashing
                        var bottomVal = paddingval.bottom;
                    }
                    json.ui.value.style.default['padding-bottom'] = bottomVal + 'px'; // NO I18N
                } else if (haspadding) {
                    json.ui.value.style.default['padding-bottom'] = '0px'; // NO I18N
                }
                json.ui.value.style.default['padding-left'] = leftSpace + 'px'; // NO I18N
                json.ui.value.style.default['padding-top'] = topSpace + 'px'; // NO I18N
            } else {
                // eslint-disable-next-line webperf/layout-thrashing
                json.ui.value.style.default['padding-left'] = paddingval.left + 'px'; // NO I18N
                // eslint-disable-next-line webperf/layout-thrashing
                json.ui.value.style.default['padding-right'] = paddingval.right + 'px'; // NO I18N
                // eslint-disable-next-line webperf/layout-thrashing
                json.ui.value.style.default['padding-top'] = paddingval.top + 'px'; // NO I18N
                // eslint-disable-next-line webperf/layout-thrashing
                json.ui.value.style.default['padding-bottom'] = paddingval.bottom + 'px'; // NO I18N

            }

            // eslint-disable-next-line webperf/layout-thrashing
            if (json.ui.value.style.default.padding) {
                // eslint-disable-next-line webperf/layout-thrashing
                delete json.ui.value.style.default.padding;
            }
        }
        function createHtmlnew(json, viewType, outerflag) { // viewtype is px or percentage 
            // var tagName = json.ui.value.tagname;
            // var styleObj = json.ui.value.style;
            // var nodeClass = json.ui.value.class;
            var outerDiv = $(createElement('div')); //NO I18N
            // for(key in styleObj) {
            // 	$(node).css(key, styleObj[key]);
            // }
            // $(node).addClass(nodeClass).addClass("zcanvas");
            // $(node).zaddClass(nodeClass);
            var parentChildrens = json.children;
            var parentChildrenLength = parentChildrens.length;

            //			var splitValues = _.chain(parentChildrens).map(function(b){return canvasObjUtils._.extend(b.ui.value.position, b.ui.value.style)}).value();
            //			var totalWidth = _.chain(splitValues).map(function(d){return (d.marginLeft||0) + (d.marginRight||0) + (d.width || 0) }).reduce(function(memo, num){ return memo + num; }, 0).value();
            for (var i = 0; i < parentChildrenLength; i++) {
                var nostyleapply = false;
                var currentNodeJson = parentChildrens[i];

                if (currentNodeJson.postLoad) {
                    //					var styleObjNew = {};
                    //					for(key in currentNodeJson.ui.value.style) {
                    //						styleObjNew[key] =  currentNodeJson.ui.value.style[key];
                    //					}
                    // eslint-disable-next-line webperf/layout-thrashing
                    //					styleObjNew.width = currentNodeJson.ui.value.position.width;
                    // eslint-disable-next-line webperf/layout-thrashing
                    //					currentNode.css(styleObj);
                    // eslint-disable-next-line webperf/layout-thrashing
                    outerDiv.append(currentNodeJson.value);
                    // eslint-disable-next-line webperf/layout-thrashing
                    // $(node).append(createTd);
                    //					outerDiv.append(currentNodeJson.value);

                    if (currentNodeJson.ui && currentNodeJson.ui.value.postclass) {
                        // eslint-disable-next-line webperf/no-multipleDOMLookup
                        outerDiv.children().addClass(currentNodeJson.ui.value.postclass);
                    }

                }
                else {
                    var tagName = currentNodeJson.ui.value.tagname || "div";//NO I18N
                    //					var styleObj = currentNodeJson.ui.value.style;
                    //					var nodeClass = currentNodeJson.ui.value.class;
                    var currentNode = $(createElement(tagName || 'div')); //NO I18N
                    //					for(key in styleObj) {
                    //						$(currentNode).css(key, styleObj[key]);
                    //					}
                    if (currentNodeJson.customComponent || currentNodeJson._type === 'component' && !currentNodeJson.theme || currentNodeJson.theme === 'Custom Layout') {
                        delete currentNodeJson.customComponent;
                        if (!currentNodeJson.ui.value.style.default) {
                            currentNodeJson.ui.value.style.default = { };
                        }
                        currentNodeJson.ui.value.style.default.overflow = "auto";//NO I18N
                        currentNode.addClass('zcanvassection');
                        if (currentNodeJson.ui.value.fixed || currentNodeJson.ui.value.fixedHeight) {
                            currentNode.css({
                                minHeight: currentNodeJson.ui.value.position.height,
                                height: currentNodeJson.ui.value.position.height
                            });
                        } else {
                            currentNode.css({
                                minHeight: currentNodeJson.ui.value.position.height
                            });
                        }
                        if (currentNodeJson.statichtml) {
                            var getHtml = fullHtml(undefined, currentNodeJson);
                            currentNode.append(getHtml);
                        } else if (currentNodeJson.relatedList && createStruture.singleshotrender) {
                            var getHtml = zcanvasrelatedList.toView(currentNodeJson, null, null, true);
                            currentNode.append(getHtml);
                        } else {
                            // setPadding(currentNodeJson);
                            //							var gethtml = getHtmlnew(undefined, currentNodeJson);
                            var gethtml = fullHtml(undefined, currentNodeJson);
                            //							setComponentPadding(currentNodeJson);
                            currentNode.append(gethtml);
                        }

                        if (currentNode && currentNode.length && currentNodeJson.ui && currentNodeJson.ui.value && currentNodeJson.ui.value.attr) {
                            for (var atrkey in currentNodeJson.ui.value.attr) {
                                currentNode[0].setAttribute(atrkey, currentNodeJson.ui.value.attr[atrkey]);
                            }
                        }

                        // $(createRowElm).append(createTd);
                    } else if (currentNodeJson.layoutComponent || currentNodeJson.theme && currentNodeJson.theme !== 'Custom Layout') {
                        var layoutname = currentNodeJson.theme || currentNodeJson.layoutName;
                        var layoutinstance = zclayout.prototype.layouts[layoutname];
                        var gethtml = layoutinstance.toView(currentNodeJson, currentNode, SERVER_RENDERING);
                        if (currentNodeJson.theme === "Grid List" || currentNodeJson.replacenode) {//NO I18N
                            currentNode = $(gethtml);
                        } else {
                            currentNode.append(gethtml);
                        }
                        nostyleapply = true;
                        // $(createRowElm).append(createTd);
                    } else if (currentNodeJson._type === "dummyDiv") {
                        var jsonNew = JSON.parse(JSON.stringify(currentNodeJson))//canvasObjUtils._.clone(nodeJson);
                        // var createJson = htmlLayout(undefined, currentNodeJson);
                        // var gethtml = createHtmlnew(createJson);
                        if (SERVER_RENDERING) {
                            var gethtml = createHtmlnew(jsonNew, null, true);
                        } else {
                            var gethtml = getHtmlnew(undefined, jsonNew, true);
                        }

                        if (gethtml.hasClass("canvas-component")) {
                            // var node = $(gethtml)[0];
                            // var styleObjCom = inlineStyle(node);
                            currentNode.append(gethtml.html());
                            var dataClass = gethtml.data("zcanvasclass");//NO I18N
                            currentNode.addClass(dataClass);
                            //							for(key in styleObjCom) {
                            //								currentNode.css(key, styleObjCom[key]);
                            //							}
                        } else {
                            currentNode.append(gethtml);
                        }
                        // eslint-disable-next-line no-multipleDOMLookup
                        // if(currentNodeJson.divType === "column" && currentNodeJson.children.length > 1 || currentNodeJson.divType === "row" && currentNodeJson.children.length > 1){//NO I18N
                        // 	var _cbElementappend =  createElement('div'); // NO I18N
                        // 	_cbElementappend.classList.add('cB'); // NO I18N 
                        // 	currentNode.append(_cbElementappend);//NO I18N
                        // }
                        currentNode.addClass("divClass");
                        //						for(key in currentNodeJson.ui.value.style) {
                        //							currentNode.css(key, currentNodeJson.ui.value.style[key]);
                        //						}
                        if (viewType) {
                            currentNode.css({
                                width: currentNodeJson.ui.value.position.width,
                                // minHeight: currentNodeJson.ui.value.position.height,
                                height: "auto"//NO I18N
                            });
                        } else {
                            // eslint-disable-next-line no-lonely-if
                            if (viewType) {
                                currentNode.css({
                                    width: currentNodeJson.ui.value.position.width,
                                    // minHeight: currentNodeJson.ui.value.position.height,
                                    height: "auto"//NO I18N
                                });
                            } else {
                                // eslint-disable-next-line no-lonely-if
                                if (currentNodeJson.divType === "column") {
                                    currentNode.css({
                                        width: "100%",
                                        // minHeight: currentNodeJson.ui.value.position.height,
                                        height: "auto"//NO I18N
                                    });
                                } else {
                                    if (currentNodeJson.ui.value.style && !currentNodeJson.ui.value.style.default) {
                                        currentNodeJson.ui.value.style.default = { };
                                    }
                                    // var marginval = getvalue(currentNodeJson.ui.value.style.default , 'margin'); // NO I18N
                                    // var leftMargin = currentNodeJson.ui.value.style.default.marginLeft || 0;
                                    // var rightMargin = currentNodeJson.ui.value.style.default.marginRight || 0;
                                    // var leftMargin = marginval.left;
                                    // var rightMargin = marginval.right;
                                    // var marginVal =  leftMargin + rightMargin;
                                    // var perWidth = (currentNodeJson.ui.value.position.width/(json.ui.value.position.width + marginVal))*100;
                                    //var perWidth = ((currentNodeJson.ui.value.position.width + marginVal)/defaults.viewOuterWidth)*100;
                                    // var widthWidthMargin = currentNodeJson.ui.value.position.width + marginVal;
                                    var nodeWidth = currentNodeJson.ui.value.position.width;

                                    // if(currentNodeJson._type == 'dummyDiv'){
                                    // 	var  marginval = getvalue(currentNodeJson.ui.value.style.default , 'margin'); // NO I18N
                                    // 	// eslint-disable-next-line webperf/layout-thrashing
                                    // 	var leftMargin = marginval.left;
                                    // 	// eslint-disable-next-line webperf/layout-thrashing
                                    // 	var rightMargin = marginval.right;
                                    // 	var marginVal =  leftMargin ;
                                    // 	nodeWidth -= marginVal;
                                    // }


                                    // var widthWidthMargin = nodeWidth + marginVal;
                                    var paddingVal = getvalue(json.ui.value.style.default || { }, 'padding') // NO I18N
                                    // eslint-disable-next-line webperf/layout-thrashing
                                    var rightSpace = paddingVal.right;
                                    // eslint-disable-next-line webperf/layout-thrashing
                                    var outerContainerWidth = json.ui.value.position.width - (json.ui.value.position.minLeft || 0) - rightSpace;
                                    // var perWidth = ((currentNodeJson.ui.value.position.width)/json.ui.value.position.width)*100;

                                    if (currentNodeJson.ui.value.fixed) {
                                        var perWidth = nodeWidth + "px";//NO I18N
                                        var perHeight = currentNodeJson.ui.value.position.height + "px";//NO I18N
                                        var flexShrinkVal = 0;
                                        var flexGrowVal = 0;
                                    } else if (currentNodeJson.ui.value.fixedWidth) {
                                        var perWidth = nodeWidth + "px";//NO I18N
                                        var perHeight = "auto";//NO I18N
                                        var flexShrinkVal = 0;
                                        var flexGrowVal = 0;
                                    } else if (currentNodeJson.ui.value.fixedHeight) {
                                        var perWidth = nodeWidth / outerContainerWidth * 100 + "%";//NO I18N
                                        var perHeight = currentNodeJson.ui.value.position.height + "px";//NO I18N
                                        var flexShrinkVal = 1;
                                        var flexGrowVal = 0;
                                    } else {
                                        var perWidth = nodeWidth / outerContainerWidth * 100 + "%";//NO I18N
                                        var perHeight = "auto";//NO I18N
                                        var flexShrinkVal = 1;
                                        var flexGrowVal = 1;
                                    }
                                    // var leftMarginPer = ((leftMargin/outerContainerWidth)*100);
                                    // var rightMarginPer = ((rightMargin/outerContainerWidth)*100);

                                    // eslint-disable-next-line webperf/layout-thrashing
                                    currentNode.css({
                                        // width: 'calc('+perWidth+' - '+leftMargin+'px - '+rightMargin+'px)',//NO I18N
                                        // minHeight: currentNodeJson.ui.value.position.height,
                                        width: perWidth,
                                        height: perHeight,//NO I18N
                                        flexShrink: flexShrinkVal,
                                        flexGrow: flexGrowVal
                                    });
                                    //									if(currentNodeJson.ui.value.fixed){
                                    //										var perWidth = widthWidthMargin;
                                    //										currentNode.css({
                                    //											width: 'calc('+perWidth+'px - '+leftMargin+'px - '+rightMargin+'px)',  //perWidth+"%",
                                    //											// minHeight: currentNodeJson.ui.value.position.height,
                                    //											height	: "auto",//NO I18N
                                    //											flexShrink: 0
                                    //										});
                                    //									} else {
                                    //										var perWidth = ((widthWidthMargin)/json.ui.value.position.width)*100;
                                    //										currentNode.css({
                                    //											width: 'calc('+perWidth+'% - '+leftMargin+'px - '+rightMargin+'px)',  //perWidth+"%",
                                    //											// minHeight: currentNodeJson.ui.value.position.height,
                                    //											height: "auto",//NO I18N
                                    //											flexGrow: 1
                                    //										});
                                    //									}
                                }
                            }
                        }

                    } else if (currentNodeJson._type === "tableStruture") {
                        var gethtml = newTableCreation(currentNodeJson); //getHtmlnew(undefined, currentNodeJson);
                        // eslint-disable-next-line webperf/layout-thrashing
                        currentNode.append(gethtml);
                        // eslint-disable-next-line webperf/layout-thrashing
                        currentNode.addClass("canvas-component"); //NO I18N
                        // currentNode = $(getHt)
                        //						for(key in currentNodeJson.ui.value.style) {
                        //							currentNode.css(key, currentNodeJson.ui.value.style[key]);
                        //						}
                    } else {
                        //						var childrenLen = currentNodeJson.children.length;
                        //						if(childrenLen > 0){

                        var innerContent = toDomnew(currentNodeJson);
                        currentNode = innerContent;
                        nostyleapply = true;
                        if (currentNodeJson._type === "row") {
                            var _fields = $(innerContent).find('.zcanvas-field'); // NO I18N
                            var nodeln = _fields.length;
                            for (var index = 0; index < nodeln; index++) {
                                // eslint-disable-next-line webperf/no-multipleDOMLookup
                                applyzcss(_fields.eq(index), currentNodeJson.children[index] ? currentNodeJson.children[index].ui : { }, createStruture.toolinst, true);
                            }
                        } else {
                            // eslint-disable-next-line zstandard/no-jQuery-casting
                            applyzcss($(currentNode), currentNodeJson.ui, createStruture.toolinst, true);
                        }

                        //						}
                        // $(createRowElm).append(createTd);	
                    }
                    var styleObj = currentNodeJson.ui.value.style;
                    var nodeClass = currentNodeJson.ui.value.class;

                    if (currentNodeJson.ui.value && currentNodeJson.ui.value.system_id) {
                        nodeClass += ' canvasselectableelemnt canvas-element-id-' + currentNodeJson.ui.value.system_id; // NO I18N
                    }
                    // eslint-disable-next-line zstandard/no-jQuery-casting
                    var $currentNode = $(currentNode);
                    var zIndex = currentNodeJson.ui.value.position.depth;
                    // for(key in styleObj) {
                    // 	$currentNode.css(key, styleObj[key]);
                    // }
                    var zid = zutils.getRandomId();

                    if (!nostyleapply) {
                        applystyle($currentNode, styleObj, zid, null, currentNodeJson);
                        // eslint-disable-next-line webperf/layout-thrashing
                        /*$currentNode.addClass(zid);
                        var inst = createStruture.toolinst;
                        !canvasObjUtils._.isEmpty((styleObj && styleObj.default) || {}) && inst.addrule('.'+zid , styleObj.default || {} );
                        !canvasObjUtils._.isEmpty((styleObj && styleObj.hover) || {}) && inst.addrule('.'+zid+':hover' , styleObj.hover || {} );*/
                    }


                    if (currentNodeJson.ui.value.fixed && currentNodeJson._type === "dummyDiv") {
                        // eslint-disable-next-line webperf/layout-thrashing
                        $currentNode.attr('data-fixed', 'true').addClass("zcfixed");//NO I18N
                    }
                    if (zIndex) {
                        // eslint-disable-next-line webperf/layout-thrashing
                        $currentNode.css("z-index", zIndex);//NO I18N
                    }
                    // eslint-disable-next-line webperf/layout-thrashing
                    $currentNode.addClass(nodeClass).addClass("zcanvas");
                    // eslint-disable-next-line webperf/layout-thrashing
                    $currentNode.zaddClass(nodeClass);
                    // eslint-disable-next-line webperf/layout-thrashing
                    outerDiv.append(currentNode);

                    if (createStruture && createStruture.toolinst && createStruture.toolinst.config && createStruture.toolinst.config.viewcallback) {
                        createStruture.toolinst.config.viewcallback(currentNode, currentNodeJson);
                    }
                }
            }
            // eslint-disable-next-line webperf/no-multipleDOMLookup
            return outerflag ? outerDiv.children() : outerDiv.html();
        }
        function newTableCreation(currentNodeJson) {
            var createDiv = $(createElement('div'));//NO I18N
            var children = canvasObjUtils._.sortBy(currentNodeJson.children, function (d) { return d.ui.value.position.startY });
            var childrenLen = children.length;
            var outerNode = canvasObjUtils._.clone(currentNodeJson);
            for (var i = 0; i < childrenLen; i++) {
                var outerContainer = children[i];
                var outerContent = toDomnew(outerContainer);
                var eachNode = outerContainer.children;
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                outerNode.children = [];
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                outerNode.children.push(eachNode);
                var getHtml = createHtmlnew(outerNode);
                $(outerContent).append(getHtml);
                createDiv.append(outerContent);
            }
            return createDiv;
        }

        function getClass_(json, parrentJson) {
            var type = json._type;
            var parrentType = parrentJson && parrentJson._type;
            var returnClass;
            if (type === "field" && parrentType !== "rows") { //NO I18N
                returnClass = "zcanvas-field";//NO I18N
            } else if (type === "field" && parrentType === "rows") { //NO I18N
                returnClass = "zcanvas-holder zcanvas-data-node";//NO I18N
            } else if (type === "merge-field") {
                returnClass = "zcanvas-field zcanvas-merged-node";//NO I18N
            } else if (type === "rows") {
                returnClass = "zcanvas-row-separator";//NO I18N
            } else if (type === "separator" || type === "zcseparator") {
                returnClass = "zcanvas-seperator";//NO I18N
            } else if (type === "system") {//NO I18N
                returnClass = "zcanvas-value-container";//NO I18N
            } else if (type === "action" || type === "button" || type === "link") { // NO I18N
                returnClass = "zcanvas-field"; // NO I18N
            }
            return returnClass;
        }
        function createNode(ui, value, json, parrentJson, onEditor, nostyleapply) {
            if (json) {
                var editorClass = getClass_(json, parrentJson);
            }
            var tagName = ui.tagName || "div";//NO I18N
            var styleObj = ui.style;
            var nodeClass = ui.class;
            var node = createElement(tagName);

            // for(key in styleObj) {
            // 	$(node).css(key, styleObj[key]);
            // }
            if (!onEditor && !nostyleapply) {
                var zid = zutils.getRandomId();
                $(node).addClass(zid);
                if (value && typeof value === "string" && value.indexOf('img') > -1) { // NO I18N
                    zid = zid + ' img'; // NO I18N
                }
                applystyle($(node), styleObj, zid, true);
                /*var inst = createStruture.toolinst;
                !canvasObjUtils._.isEmpty((styleObj && styleObj.default) || {}) && inst.addrule('.'+zid , styleObj.default || {} );
                !canvasObjUtils._.isEmpty((styleObj && styleObj.hover) || {}) && inst.addrule('.'+zid+':hover' , styleObj.hover || {} );*/
            }


            $(node).addClass(nodeClass).addClass("zcanvas").addClass(editorClass);
            $(node).zaddClass(nodeClass).zaddClass(editorClass);

            if (value && !ui.icon) {
                // if(sanitize){
                // 	var $temps =  document.createElement("template");

                // 	$temps.innerHTML = value;

                // 	value = $temps.content.children[0];
                // }
                if (ui.extrahtml) {
                    value += ui.extrahtml;
                }
                $(node).zhtml(value);
            }
            if (ui.icon) {
                $(node).attr('zc-icon', ui.icon).addClass(ui.icon).addClass('zcicon').html('');
            }

            attachinteractions(ui, node, onEditor);


            return node;
        }
        function attachinteractions(ui, node, isEditor) {
            if (ui.interactions) {
                var intlen = ui.interactions.length;
                for (var i = 0; i < intlen; i++) {
                    node.setAttribute(ui.interactions[i].event, ui.interactions[i].handler);
                }
            }
            // Attach names
            if (!isEditor && ui.system_id) {
                node.classList.add('canvasselectableelemnt'); // NO i18N
                node.classList.add('canvas-element-id-' + ui.system_id); // NO I18N
            }

        }
        function setZdata(currentJson, node, onEditor) {
            if (!onEditor) {
                return;
            }
            var cloneData = canvasObjUtils._.clone(currentJson);
            delete cloneData.ui;
            delete cloneData.children;
            delete cloneData.dataHolder;
            $(node).data("zcanvasField", cloneData);
            $(node).attr("data-zcanvasid", cloneData.zcanvasId).addClass("zcanvas-data-node").zdata(cloneData);
        }
        function toDomnew(currentJson, onEditor, parrentNode) {
            //			var tagName	= currentJson.ui.value.tagName || "div";//NO I18N
            //			var styleObj = currentJson.ui.value.style;
            //			var nodeClass = currentJson.ui.value.class;
            //			var node =  document.createElement(tagName);
            //			for(key in styleObj) {
            //				$(node).css(key, styleObj[key]);
            //			}
            //			$(node).addClass(nodeClass).addClass("zcanvas");
            //			$(node).zaddClass(nodeClass);
            var type = currentJson._type;
            if (currentJson.ui && currentJson.ui.value && currentJson.ui.value.position) {
                var currentJsonHeight = currentJson.ui.value.position.height;
                var currentJsonWidth = currentJson.ui.value.position.endX - currentJson.ui.value.position.startX;
            }

            //			if(type == "field-holder"){
            //				var node = 	createNode(currentJson.ui.holder);
            //			} else {
            var node = createNode(currentJson.ui.value, undefined, currentJson, parrentNode, onEditor);
            //			}
            var childrenNodes = currentJson.children || [];
            var childrenLength = childrenNodes.length;

            if (type) {
                //				if(type == "label"){
                //					$(node).html(currentJson.label);
                //				} else 
                //				type == "field" || 
                if (type === "relatedlist") { // || type == "action" || type == "system"
                    $(node).html(currentJson.value);
                }
                if (type === "separator") {
                    $(node).html(currentJson.ui && currentJson.ui.value && currentJson.ui.value.value);
                }
            }
            if (type === "field" || type === "action" || type === "system" || type === "link" || type === "button") {
                var parentType = parrentNode && parrentNode._type;
                var fieldNode = createNode(currentJson.ui.field, currentJson.value, null, null, onEditor, true);
                $(fieldNode).addClass("zcanvas-value-container zcanvas-inner-component");//NO I18N
                if (currentJson.ui.label) {
                    var labelNode = createNode(currentJson.ui.label, currentJson.label, null, null, onEditor);
                    var lnode = $(labelNode);
                    lnode.addClass("zcanvas-label zcanvas-inner-component");//NO I18N

                }
                if (currentJson.ui.icon) {
                    var labelNode = createNode(currentJson.ui.icon, null, null, null, onEditor);
                    var lnode = $(labelNode);
                    lnode.addClass("zcanvas-label zcanvas-inner-component");//NO I18N
                }
                if (currentJson.datatype === "text-area" && currentJson.ui.value.fixed) {//NO I18N
                    !onEditor && $(fieldNode).css({ "height": currentJsonHeight, "overflow": "auto" });//NO I18N
                }
                var hzid = currentJson.zcanvasId || zutils.getRandomId();
                node.classList.add(hzid);
                if (currentJson.ui.holder) {
                    var holderNode = createNode(currentJson.ui.holder, null, null, null, onEditor);
                    var $holder = $(holderNode)

                    $holder.addClass("zcanvas-holder zcanvas-data-node");//NO I18N
                    setZdata(currentJson, holderNode, onEditor);
                    holderNode.append(labelNode);
                    holderNode.append(fieldNode);

                    node.append(holderNode);
                    !onEditor && $holder.attr('data-zcanvasid', hzid); // NO I18N
                    onEditor && applyzcss($(node), currentJson.ui);
                    if (currentJson.datatype === "text-area") {//NO I18N
                        !onEditor && $holder.css("min-height", currentJsonHeight);//NO I18N
                    }
                    if (type === "action" || type === "button") {//NO I18N
                        if (onEditor) {
                            $(node).css("width", currentJsonWidth);
                        } else {
                            $(node).css("min-width", currentJsonWidth);
                        }
                    }
                } else {
                    if (parentType === "rows") {
                        setZdata(currentJson, node, onEditor);
                    } else {
                        setZdata(currentJson, fieldNode, onEditor);
                    }
                    if (labelNode) {
                        node.append(labelNode);
                    }
                    if (currentJson.datatype === "text-area") {//NO I18N
                        $(holderNode).css("min-height", currentJsonHeight);//NO I18N
                    }
                    if (type === "action" || type === "button") {//NO I18N
                        if (onEditor) {
                            $(node).css("width", currentJsonWidth);
                        } else {
                            $(node).css("min-width", currentJsonWidth);
                        }
                    }
                    if (type !== 'field') {
                        if (onEditor) {
                            $(node).css("width", currentJsonWidth);
                        } else {
                            $(node).css("min-width", currentJsonWidth);
                        }
                    }
                    if (currentJson.datatype && currentJson.datatype.toLowerCase().indexOf("profileimage") > -1) {
                        var w = currentJson.ui.value.position.width;
                        var h = currentJson.ui.value.position.height;
                        var bdrStr = currentJson.ui.field.style && currentJson.ui.field.style.default && currentJson.ui.field.style.default.border;
                        if (bdrStr) {
                            var bdrSplit = bdrStr.match(/\d+/g) || [];//NO I18N
                            var bdrValue = parseInt(bdrSplit[0]);
                            var leftBdrVal = bdrValue || 0;
                            var rightBdrVal = bdrValue || 0;
                            var topBdrVal = bdrValue || 0;
                            var btmBdrVal = bdrValue || 0;
                        } else {
                            var leftBdrStr = currentJson.ui.field.style && currentJson.ui.field.style.default && currentJson.ui.field.style.default["border-left"];//NO I18N
                            var rightBdrStr = currentJson.ui.field.style && currentJson.ui.field.style.default && currentJson.ui.field.style.default["border-right"];//NO I18N
                            var topBdrStr = currentJson.ui.field.style && currentJson.ui.field.style.default && currentJson.ui.field.style.default["border-top"];//NO I18N
                            var btmBdrStr = currentJson.ui.field.style && currentJson.ui.field.style.default && currentJson.ui.field.style.default["border-bottom"];//NO I18N

                            var leftBdrSplit = leftBdrStr && leftBdrStr.match(/\d+/g);//NO I18N
                            var rightBdrSplit = rightBdrStr && rightBdrStr.match(/\d+/g);//NO I18N
                            var topBdrSplit = topBdrStr && topBdrStr.match(/\d+/g);//NO I18N
                            var btmBdrSplit = btmBdrStr && btmBdrStr.match(/\d+/g);//NO I18N

                            var leftBdrVal = leftBdrSplit && parseInt(leftBdrSplit[0]) || 0;
                            var rightBdrVal = rightBdrSplit && parseInt(rightBdrSplit[0]) || 0;
                            var topBdrVal = topBdrSplit && parseInt(topBdrSplit[0]) || 0;
                            var btmBdrVal = btmBdrSplit && parseInt(btmBdrSplit[0]) || 0;
                        }
                        // eslint-disable-next-line webperf/layout-thrashing
                        var pdstr = currentJson.ui.field.style && currentJson.ui.field.style.default && currentJson.ui.field.style.default.padding;

                        if (pdstr) {
                            var psplit = pdstr.match(/\d+/g) || [];//NO I18N
                            var pvalue = parseInt(psplit[0]);
                            var lp = pvalue || 0;
                            var rp = pvalue || 0;
                            var tp = pvalue || 0;
                            var bp = pvalue || 0;
                        } else {
                            var lpstr = currentJson.ui.field.style && currentJson.ui.field.style.default && currentJson.ui.field.style.default["padding-left"];//NO I18N
                            var rpstr = currentJson.ui.field.style && currentJson.ui.field.style.default && currentJson.ui.field.style.default["padding-right"];//NO I18N
                            var tpstr = currentJson.ui.field.style && currentJson.ui.field.style.default && currentJson.ui.field.style.default["padding-top"];//NO I18N
                            var bpstr = currentJson.ui.field.style && currentJson.ui.field.style.default && currentJson.ui.field.style.default["padding-bottom"];//NO I18N

                            var lpsplit = lpstr && lpstr.match(/\d+/g);//NO I18N
                            var rpsplit = rpstr && rpstr.match(/\d+/g);//NO I18N
                            var tpsplit = tpstr && tpstr.match(/\d+/g);//NO I18N
                            var bpsplit = bpstr && bpstr.match(/\d+/g);//NO I18N

                            var lp = lpsplit && parseInt(lpsplit[0]) || 0;
                            var rp = rpsplit && parseInt(rpsplit[0]) || 0;
                            var tp = tpsplit && parseInt(tpsplit[0]) || 0;
                            var bp = bpsplit && parseInt(bpsplit[0]) || 0;
                        }
                        var imgNode = $(fieldNode).find("img");//NO I18N
                        imgNode.css({ maxWidth: w - leftBdrVal - rightBdrVal - lp - rp, maxHeight: h - topBdrVal - btmBdrVal - tp - bp });
                    }
                    fieldNode.classList.add('zcanvas-data-node'); // NO I18N
                    !onEditor && $(fieldNode).attr('data-zcanvasid', hzid); // NO I18N
                    var $node = $(node);
                    onEditor && applyzcss($node, currentJson.ui);
                    node.append(fieldNode);
                }
            } else {
                for (var j = 0; j < childrenLength; j++) {
                    node.append(toDomnew(childrenNodes[j], onEditor, currentJson));
                }
            }

            var conf = createStruture.toolinst;

            if (conf && conf.config && conf.config.nodeattr) {
                var attrdata = currentJson[conf.config.nodeattr.key] || currentJson[conf.config.nodeattr.key2];
                if (!attrdata && conf.config.nodeattr.altercheck) {
                    attrdata = currentJson[conf.config.nodeattr.alterkey];
                }
                for (attr in conf.config.nodeattr.attr) {
                    attrdata && node.setAttribute(attr, conf.config.nodeattr.attr[attr] + attrdata);
                }
            }

            if (currentJson.ui && currentJson.ui.value && currentJson.ui.value.attr) {
                for (var atrkey in currentJson.ui.value.attr) {
                    node.setAttribute(atrkey, currentJson.ui.value.attr[atrkey]);
                }
            }

            return node;
        }

        var applyzcss = function (node, ui, inst, flag) {
            if (jsonCreation.toolinst || inst) {
                var field = node;
                var _node = node[0];
                var holder = $(_node.querySelector('.zcanvas-holder')); // node.find('.zcanvas-holder'); // NO I18N
                var lable = $(_node.querySelector('.zcanvas-label'));  //node.find('.zcanvas-label'); // NO I18N
                var value = $(_node.querySelector('.zcanvas-value-container')); //node.find('.zcanvas-value-container'); // NO I18N
                if (field.length && ui.value) {
                    field.zccss(ui.value.style, false, inst, flag);
                }
                if (holder.length && ui.holder) {
                    holder.zccss(ui.holder.style, false, inst, flag);
                }
                if (lable.length && ui.label) {
                    lable.zccss(ui.label.style, false, inst, flag);
                }
                if (value.length && ui.field) {
                    value.zccss(ui.field.style, false, inst, flag);
                }
                if (lable.length && ui.icon) {
                    lable.zccss(ui.icon.style, false, inst, flag);
                }
            }
        }

        // function createHtml(json){
        // 	var childrens = json.children;
        // 	var outerDiv = toDom(json);
        // 	return outerDiv;
        // }
        // function toDom(json, onEditor){
        // 	var type = json._type;

        //     // if(json.postLoad){
        //     //     var styleObj = {};
        //     //     for(key in json.ui.value.style) {
        //     //         styleObj[key] =  currentNodeJson.ui.value.style[key];
        //     //     }
        //     //     // eslint-disable-next-line webperf/layout-thrashing
        //     //     styleObj.width = currentNodeJson.ui.value.position.width;
        //     //     // eslint-disable-next-line webperf/layout-thrashing
        //     //     createTd.css(styleObj);
        //     //     // eslint-disable-next-line webperf/layout-thrashing
        //     //     $(createTd).append(currentNodeJson.value);
        //     //     // eslint-disable-next-line webperf/layout-thrashing
        //     //     $(createRowElm).append(createTd);
        //     // }

        // 	if(json._type == "component"){
        // 		var componentHtml = getHtml(undefined, json);

        // 		var tagName = json.ui.value.tagname;
        // 		var styleObj = json.ui.value.style;
        // 		var nodeClass = json.ui.value.class;
        // 		var createDiv = document.createElement(tagName);
        // 		for(key in styleObj) {
        // 			$(createDiv).css(key, styleObj[key]);
        // 		}
        // 		$(createDiv).addClass(nodeClass).addClass("zcanvas");
        // 		$(createDiv).zaddClass(nodeClass);

        // 		$(createDiv).append(componentHtml);
        // 	} else if(json.layoutComponent){
        // 		var tagName = json.ui.value.tagname;
        // 		var createDiv = document.createElement(tagName);
        // 		var layoutname = json.theme;
        // 		var layoutinstance  = zclayout.prototype.layouts[layoutname];
        // 		var gethtml = layoutinstance.toView(json);

        // 		$(createDiv).append(gethtml);	
        // 	} else if (json._type == "pagecomponent" || json._type == "view"){
        // 		var html = getHtml(undefined, json.children[0]);
        // 		var tagName = json.ui.value.tagname;
        // 		var styleObj = json.ui.value.style;
        // 		var nodeClass = json.ui.value.class;
        // 		var createDiv = document.createElement(tagName);
        // 		for(key in styleObj) {
        // 			$(createDiv).css(key, styleObj[key]);
        // 		}
        // 		$(createDiv).addClass(nodeClass).addClass("canvas-outer");
        // 		$(createDiv).zaddClass(nodeClass);

        // 		$(createDiv).append(html);
        // 	} else {
        // 		if(type == "dummyDiv"){
        // 			var createDiv = $("<div />");
        // 			createDiv.addClass("divClass");

        // 			var styleObj = json.ui.value.style;
        // 			for(key in styleObj) {
        // 				$(createDiv).css(key, styleObj[key]);
        // 			}
        // 			createDiv.css({
        // 				width: json.ui.value.position.width,
        // 				height: json.ui.value.position.height
        // 			});
        // 		} else {
        // 			var tagName = json.ui.value.tagname;
        // 			var styleObj = json.ui.value.style;
        // 			var nodeClass = json.ui.value.class;
        // 			var createDiv = document.createElement(tagName);
        // 			for(key in styleObj) {
        // 				$(createDiv).css(key, styleObj[key]);
        // 			}
        // 			$(createDiv).addClass(nodeClass).addClass("zcanvas");
        // 			$(createDiv).zaddClass(nodeClass);

        // 			if(type == "label"){
        // 				$(createDiv).html(json.label);
        // 			} else if(type == "field" || type == "separator" || type == "relatedlist" || type == "link" || type == "button" || type == "special_comp") {
        // 				$(createDiv).html(json.value);
        //             }

        //             if(json.dataHolder && onEditor){
        //                 var cloneData = canvasObjUtils._.clone(json);
        //                 delete cloneData.ui;
        //                 delete cloneData.children;
        //                 delete cloneData.dataHolder;
        //                 $(createDiv).data("zcanvasField", cloneData);
        //                 $(createDiv).attr("data-zcanvasid", cloneData.zcanvasId).addClass("zcanvas-data-node").zdata(cloneData);
        //             }
        // 		}

        // 		var children = json.children;
        // 		var childrenLen = children.length;
        // 		for(var i=0; i< childrenLen; i++){
        // 			$(createDiv).append(toDom(children[i], onEditor));
        // 		}
        // 	}
        // 	return createDiv;
        // }

        function getHtmlnew(selectedNode, nodeJson, canvasLayout) {
            if (selectedNode) {
                var createJson = htmlLayout(selectedNode);
                var html = createHtmlnew(createJson);
            } else if (nodeJson) {
                var json = JSON.parse(JSON.stringify(nodeJson))//canvasObjUtils._.clone(nodeJson);
                if (!canvasLayout) {
                    var createJson = SERVER_RENDERING ? json : htmlLayout(undefined, json);
                    var html = createHtmlnew(createJson);
                } else {
                    var html = createHtmlnew(json);
                }
            }

            return html;
        }

        function fullHtml(selectedNode, nodeJson, serverCall, viewType, viewWidth, canvasLayout) {
            if (selectedNode) {
                var nodeJson = canvasOutput.createJson(selectedNode, undefined, true);
            }
            if (viewType === "fluid" && viewWidth) {
                nodeJson.ui.value.position.width = viewWidth;
            }
            if (nodeJson.postLoad && nodeJson.value) {
                return nodeJson.value;
            }
            var createDiv = $(createElement('div'));
            createDiv.addClass("canvas-outer");//NO I18N
            if (nodeJson.layoutComponent || nodeJson.theme && nodeJson.theme !== 'Custom Layout') {
                var tagName = nodeJson.ui.value.tagname || "div";//NO I18N
                var currentNode = $(createElement(tagName)); //NO I18N

                var layoutname = nodeJson.theme || nodeJson.layoutName;
                var layoutinstance = zclayout.prototype.layouts[layoutname];
                var gethtml = layoutinstance.toView(nodeJson, currentNode, SERVER_RENDERING);
                return gethtml;
                //				if(currentNodeJson.theme == "Grid List"){//NO I18N
                //					currentNode = gethtml;
                //				}
                //				currentNode.append(gethtml);	

                // $(createRowElm).append(createTd);
            } else if (serverCall && nodeJson._type === "component") {
                var json = JSON.parse('{"_type":"dummyDiv","ui":{"value":{"position":{"startX":"","startY":"","width":"","height":"","endX":"","singleCellWidth":""},"style":{},"class":[]}},"children":[]}') //NO I18N
                // nodeJson.ui.value.style.width = nodeJson.ui.value.position.width;
                // nodeJson.ui.value.style.height = nodeJson.ui.value.position.height;
                // nodeJson.ui.value.style.height = "auto";//NO I18N
                json.children.push(nodeJson);
                var getInnerHtml = getHtmlnew(undefined, json, canvasLayout);
                setComponentPadding(json);
                return $ZEL(getInnerHtml);
            }
            // else if(nodeJson && nodeJson.statichtml){
            // 	var getInnerHtml = nodeJson.statichtml;
            // } 
            else if (serverCall && nodeJson._type === 'relatedlist') { // NO I18N
                var getInnerHtml = getHtmlnew(undefined, nodeJson, canvasLayout);
                setComponentPadding(nodeJson);
                createDiv.css({
                    height: nodeJson.ui.value.position.height,
                    minHeight: nodeJson.ui.value.position.height
                })
            } else {
                var getInnerHtml = getHtmlnew(undefined, nodeJson, canvasLayout);
                if (!canvasLayout) {
                    setComponentPadding(nodeJson);
                }
            }

            createDiv.zhtml(getInnerHtml);
            // var _cbElement =  createElement('div'); // NO I18N
            // _cbElement.classList.add('cB'); // NO I18N 
            // createDiv.append(_cbElement);//NO I18N
            if (nodeJson._type === "pagecomponent") {
                var styleObj = nodeJson.ui.value.style;
                styleObj.default.height = nodeJson.ui.value.position.height;
                // styleObj.height = "100%";//NO I18N
                // styleObj.width = nodeJson.ui.value.position.width;
                styleObj.default.height = "unset";//NO I18N
                // for(key in styleObj) {
                // 	$(createDiv).css(key, styleObj[key]);
                // }
                var zid = 'zc-page-component-outer'; // NO I18N
                applystyle(createDiv, styleObj, zid);
                /*$(createDiv).addClass(zid);
                var inst = createStruture.toolinst;
                !canvasObjUtils._.isEmpty((styleObj && styleObj.default) || {}) && inst.addrule('.'+zid , styleObj.default || {} );
                !canvasObjUtils._.isEmpty((styleObj && styleObj.hover) || {}) && inst.addrule('.'+zid , styleObj.hover || {} )*/
            }
            if (viewType === "fixed") {
                createDiv.css({ "width": nodeJson.ui.value.position.width, "margin": "0 auto", "box-sizing": "unset" });//NO I18N
            } else if (viewType === "warp") {
                createDiv.css({ "width": nodeJson.ui.value.position.width });//NO I18N
            } else {
                createDiv.css("width", "100%");//NO I18N
            }
            //			$(createDiv).css("height", "100%");//NO I18N

            if (nodeJson.relatedList) {
                createDiv.css({
                    display: "flex",//NO I18N
                    flexDirection: "column"//NO I18N
                });
            } else if (nodeJson.divType === "row") {
                createDiv.css({
                    display: "flex",//NO I18N
                    flexDirection: "column"//NO I18N
                });
            } else if (nodeJson.divType === "column" || nodeJson.children.length > 1) {
                createDiv.css({
                    display: "flex",//NO I18N
                    flexDirection: "row"//NO I18N
                });
            } else {
                createDiv.css({
                    display: "flex",//NO I18N
                    flexDirection: "column"//NO I18N
                });
            }

            return createDiv;
        }

        function applystyle(node, styleObj, zid, flag, mainjson) {
            var zid = zid || zutils.getRandomId();
            var addclasses = ''
            !flag && (addclasses += zid); //node.addClass(zid);
            var _ispage = zid === 'zc-page-component-outer'; // NO I18N
            _ispage && (addclasses += ' zc-page-component'); // NO I18N
            addclasses && node.addClass(addclasses); // NO I18N
            var inst = createStruture.toolinst;
            if (styleObj) {
                for (var keys in styleObj) {
                    switch (keys) {
                        case 'default':
                            var selector = null
                            if (_ispage) {
                                var newzid = zutils.getRandomId();
                                selector = '.' + zid + '.' + newzid;
                                node.addClass(newzid);
                            }
                            !canvasObjUtils._.isEmpty(styleObj && styleObj.default || { }) && inst.addrule(selector ? selector : '.' + zid, styleObj.default || { });
                            break;
                        case 'hover':
                            !canvasObjUtils._.isEmpty(styleObj && styleObj.hover || { }) && inst.addrule('.' + zid + ':hover', styleObj.hover || { });
                            break;
                        case 'active':
                            !canvasObjUtils._.isEmpty(styleObj && styleObj.active || { }) && inst.addrule('.' + zid + '.active', styleObj.active || { });
                            break;
                        default:
                            var selector = '.' + zid;
                            if (_ispage) {
                                var newzid = zutils.getRandomId();
                                selector = selector + '.' + newzid;
                                node.addClass(newzid);
                            }
                            if (inst.config && inst.config.customstate) {
                                selector = inst.config.customstate(keys, selector, node, styleObj, mainjson);
                            } else if (node && node.hasClass('zcanvas-non-delete')) { // NO I18N
                                selector = selctor + '.' + keys;
                            } else {
                                selector = '.' + keys + ' ' + selector;
                            }
                            if (styleObj[keys] && styleObj[keys]._classstyle_ && styleObj[keys]._classstyle_.length) {
                                styleObj[keys]._classstyle_.map(function (cname) { node.addClass(cname) });
                            }
                            !canvasObjUtils._.isEmpty(styleObj && styleObj[keys] || { }) && inst.addrule(selector, styleObj[keys] || { });
                            break;
                    }
                }
            }


        }


        function htmlouter(nodeJson) {
            var createDiv = $(createElement('div')); // NO I18N
            createDiv.addClass("canvas-outer");//NO I18N
            setComponentPadding(nodeJson);
            var styleObj = nodeJson.ui.value.style;
            // eslint-disable-next-line webperf/layout-thrashing
            styleObj.default.height = nodeJson.ui.value.position.height;
            // styleObj.height = "100%";//NO I18N
            // styleObj.width = nodeJson.ui.value.position.width;
            styleObj.default.height = "unset";//NO I18N
            // for(key in styleObj) {
            // 	$(createDiv).css(key, styleObj[key]);
            // }
            var zid = 'zc-page-component-outer'; // NO I18N
            applystyle(createDiv, styleObj, zid);
            /*$(createDiv).addClass(zid);
            var inst = createStruture.toolinst;
            !canvasObjUtils._.isEmpty((styleObj && styleObj.default) || {}) && inst.addrule('.'+zid , styleObj.default || {} );
            !canvasObjUtils._.isEmpty((styleObj && styleObj.hover) || {}) && inst.addrule('.'+zid , styleObj.hover || {} ) */

            if (nodeJson.divType === "row") {
                createDiv.css({
                    display: "flex",//NO I18N
                    flexDirection: "column"//NO I18N
                });
            } else if (nodeJson.divType === "column" || nodeJson.children.length > 1) {
                createDiv.css({
                    display: "flex",//NO I18N
                    flexDirection: "row"//NO I18N
                });
            } else {
                createDiv.css({
                    display: "flex",//NO I18N
                    flexDirection: "column"//NO I18N
                });
            }
            return createDiv;
        }

        return {
            layoutJson: htmlLayout,
            layoutHtml: fullHtml,
            innerHtml: toDomnew,
            applystyle: applystyle,
            splitstyle: getvalue,
            rawhtml: createHtmlnew,
            outerhtml: htmlouter,
            createElement: createElement,
            attachinteractions: attachinteractions
            // splitedJson: renderJson;
            // layoutHtmlNew: getHtml //getHtmlnew
        };

    })();
    window.createStruture = createStruture;
})();

// (function () {
//     var zcanvastools = function (config) {
//         this.config = config;
//         this.zcstyles = { };
//         this.availabletools = { };
//         this.selectedfields = { };
//         this.sheet = { };
//         this.state = 'default'; // NO I18N
//         this.changestate = function (state, flag) {
//             this.state = state;
//             flag || this.selectfield(this.selectedfields, true);
//         }
//         this.init = function () {
//             var base = $(this.config.baseeditor);
//             var $style = base.find('.zc-core-style');
//             if (!$style.length) {
//                 var style = document.createElement('style'); // NO I18N
//                 style.setAttribute('class', 'zc-core-style'); // NO I18N
//                 base.append(style);
//                 $style = [style];
//             }
//             this.sheet = $style[0].sheet;
//             this.config.nocompile || this.compiletheme();
//         }
//         this.addtool = function (toolconfig) {
//             this.availabletools[toolconfig.toolname] = toolconfig;
//             if (this.tools.handler[toolconfig.type]) {
//                 this.tools.handler[toolconfig.type].bind(this)(toolconfig);
//             } else {
//                 toolconfig.handler.bind(this)(toolconfig);
//             }
//         }
//         this.selectfield = function (event, flag) {
//             if (event.type == 'click' && (event.shiftKey || this.stopPropogate)) { // NO I18N
//                 var $selected = $(this.selectedfields).not('.zcanvas-editor-outer');
//                 if (event.target && !$selected.has(event.target).length) {
//                     var $target = $(event.target)
//                     var target = $target.not('.zcanvas-editor-outer'); // NO I18N
//                     if (!$selected.length || target.parent().is($selected.parent())) {
//                         $selected = $selected.add(target);
//                         if ($selected.length == 0) {
//                             this.selectfield($target);
//                         } else if ($selected.length > 1) {
//                             $selected.addClass('zcanvas-multiselect');
//                             this.multiselect();
//                         } else {
//                             $selected.addClass('zcanvas-selected-element');
//                             this.selectfield($selected);
//                         }
//                     }

//                 }
//                 return;
//             }
//             $('.zcanvas-selectbox').remove();
//             $('.zcanvas-selected-element').removeClass('zcanvas-selected-element'); //NO I18N
//             $('.zcanvas-multiselect').removeClass('zcanvas-multiselect'); //NO I18N
//             var selectedfields = this.selectedfields = event.target ? this.getselectedfields($(event.target)) : event;
//             selectedfields.addClass('zcanvas-selected-element'); //NO I18N
//             if (zcanvasrelatedList) {
//                 zcanvasrelatedList.switchmenu(selectedfields);
//             }
//             var selecteddata = this.config.gettype ? this.config.gettype(selectedfields) : this.gettypefromelement(selectedfields);
//             var toolstypes = [];
//             toolstypes = toolstypes.concat([selecteddata.zctype]);
//             if (this.config && this.config.onBeforeSelection && !flag) {
//                 this.config.onBeforeSelection.bind(this)(toolstypes)
//             }
//             this.executetools(toolstypes, flag);
//         }

//         this.getselectedfields = function (el) {
//             var selectedfields = el;
//             var closestsubselection = selectedfields.closest('.zc-rl-sub-selectable'); // NO I18N
//             var closesttab = selectedfields.closest('.tab'); // NO I18N
//             if (el.hasClass('zcanvas-non-selectable')) {
//                 return;
//             } else if (closesttab.length) {
//                 selectedfields = closesttab;
//             } else if (el.hasClass('zc-rl-sub-selectable') || closestsubselection.length) { // NO I18N
//                 selectedfields = el.closest('.zc-rl-sub-selectable'); // NO I18N
//             } else if (el.hasClass('zcanvas-skip-selection')) { // NO I18N
//                 selectedfields = el.parent('.zcanvas'); // NO I18N
//             } else if (el.hasClass('zcanvas-next-selection')) { // NO I18N
//                 selectedfields = el.find(el.attr('data-nextselect'));
//             } else if (el.hasClass('zcanvas')) { // NO I18N
//                 selectedfields = el;
//             } else if (el.is(this.config.baseeditor)) {
//                 selectedfields = $(this.config.baseeditor);
//             } else {
//                 selectedfields = el.closest('.zcanvas'); //No I18N
//             }
//             return selectedfields;
//         }

//         this.gettypefromelement = function (selectedfields) {
//             var selecteddata = { };
//             var staticparent = selectedfields.parents('.zcanvas-static-editor'); // NO I18N
//             // add condition below staticparent.length
//             if (selectedfields.hasClass('zcanvas-static-editor')) { // NO I18N 
//                 selectedfields = staticparent.length ? staticparent : selectedfields;
//                 selecteddata = { zctype: 'editor' }; // NO I18N
//             } else if (selectedfields.hasClass('zc-rl-sub-selectable')) { // NO I18N
//                 selecteddata = { zctype: 'subtype' }; // NO I18N
//             } else if (selectedfields.hasClass('zclayout')) { // NO I18N    
//                 var layoutname = selectedfields.attr('data-layoutname'); // NO i18N
//                 selecteddata = { zctype: layoutname }
//             } else if (selectedfields.hasClass('zclayoutselectable')) { // NO i18N
//                 selecteddata = { zctype: selectedfields.attr('data-layout-selctabletype') }; // NO i18N
//             } else if (selectedfields.hasClass('zcanvas-editor') || selectedfields.hasClass('zcanvas-editor-outer')) { //NO I18N
//                 selecteddata = { zctype: 'editor' }; // NO I18N
//             } else if (selectedfields.hasClass('zcanvas-field')) { // NO I18N
//                 selecteddata = zutils.getdatafromelement(selectedfields);
//             } else if (selectedfields.hasClass('zcanvas-seperator')) { // NO I18N
//                 selecteddata = { zctype: 'seperator' }; // NO I18N
//             } else if (selectedfields.hasClass('zcanvas-selectable')) { // NO I18N
//                 selecteddata = { zctype: selectedfields.attr('data-zcanvastooltype') } // NO i18N
//             } else {
//                 selecteddata = zutils.getdatafromelement(selectedfields.parents('.zcanvas-field')); //NO I18N
//             }
//             return selecteddata;
//         }

//         this.executetools = function (type, flag) {
//             var toollist = this.getTools(type, this.config) || [];
//             var toollistlen = toollist.length;
//             var toolelements = $(this.config.toolcommon);
//             toolelements.hide();
//             for (var i = 0; i < toollistlen; i++) {
//                 var toolconfig = this.availabletools[toollist[i]];
//                 this.showtools(toolconfig);
//             }
//             if (this.config.onSelection && !flag) {
//                 this.config.onSelection.bind(this)(type);
//             }
//         }
//         this.getTools = function (type, config) {
//             var toolsList = [];
//             if (!config.tools[type]) {
//                 toolsList = config.tools.zcdefault;
//             } else {
//                 toolsList = config.tools[type];
//             }
//             return toolsList;
//         }

//         this.showtools = function (config) {
//             config.basecontainer && $(config.basecontainer).show();
//             this.setcurrentvalue(config);
//         }

//         this.getstylebyselector = function (selector, flag) {
//             var obj = { };
//             if (this.zcstyles[selector]) {
//                 obj = this.zcstyles[selector] || { };
//             } else if (_.isEmpty(obj) && flag) {
//                 obj = this.zcstyles[selector] = { };
//             }
//             return obj
//         }
//         this.setcurrentvalue = function (config) {
//             var selectedfield = this.selectedfields.eq(0);
//             var zctype = this.config.gettype(selectedfield);
//             var style = { };
//             switch (config.actiontype) {
//                 case 'action':
//                     var selector = this.getSelectorByElement(selectedfield, 'default'); // NO I18N
//                     var type = zctype ? zctype.zctype : '';
//                     var obj = this.getstylebyselector(selector, true)[this.state] || { };;
//                     if (obj[config.actionproperty]) {
//                         style[config.actionproperty] = obj[config.actionproperty];
//                     } else if (this.config.theme.currenttheme[type] && ((this.config.theme.currenttheme[type][this.state] && this.config.theme.currenttheme[type][this.state][config.actionproperty]) || (!_.isEmpty(this.config.theme.currenttheme[type].default) && this.config.theme.currenttheme[type].default[config.actionproperty]))) {
//                         var themestyle = { }
//                         if (this.config.theme.currenttheme[type][this.state]) {
//                             themestyle = this.config.theme.currenttheme[type][this.state]
//                         } else {
//                             themestyle = this.config.theme.currenttheme[type].default;
//                         }
//                         style[config.actionproperty] = themestyle[config.actionproperty];
//                     } else {
//                         style[config.actionproperty] = selectedfield.css(config.actionproperty);
//                     }
//                     break;
//                 case 'actionclasslist':
//                     var filter = config.list.filter(function (item) { return this.el.hasClass(item.class) }.bind({ config: config, el: selectedfield }))
//                     style = filter && filter[0] ? filter[0] : { };
//                     break;
//                 case 'classaction':
//                     style.flag = selectedfield.hasClass(config.actionclass);
//                     break;
//                 case 'condition':
//                     if (config.actioncondition) {
//                         style.flag = config.actioncondition.bind(this)(selectedfield, config);
//                     }
//                     break;
//             }
//             if (this.tools.populate[config.type] && !config.populate) {
//                 this.tools.populate[config.type].bind(this)(config, style, selectedfield);
//             } else {
//                 config.populate.bind(this)(config, style, selectedfield);
//             }
//         }

//         this.changehandler = function (config, result, flag, _previous, selectioncallback) {
//             var selectedfield = this.selectedfields;
//             var selectedfieldlen = selectedfield.length;
//             var undoaction = { action: 'link', actionarray: [], node: '#' }; // NO I18N
//             var getactionclass = function (item) {
//                 if (this.el.hasClass(item)) {
//                     selectedfield.eq(i).removeClass(item).zremoveClass(item);
//                     this.previous.class = item;
//                 }
//             }
//             if (this.config.preprocess) {
//                 if (this.config.preprocess(selectedfield, config, result)) {
//                     return;
//                 }
//             }
//             for (var i = 0; i < selectedfieldlen; i++) {
//                 var undo = { };
//                 switch (config.actiontype) {
//                     case 'action':
//                         if (selectioncallback) {
//                             selectedfield = selectioncallback(selectedfield);
//                         }
//                         var selector = this.getSelectorByElement(selectedfield.eq(i), 'default'); // NO I18N
//                         var styleselector = this.getSelectorByElement(selectedfield.eq(i));
//                         var styles = this.getstylebyselector(selector, true);
//                         if (!styles[this.state]) {
//                             this.zcstyles[selector][this.state] = { };
//                         }
//                         undo.action = 'action'; // NO I18N
//                         undo.node = selector;
//                         var previous = { };
//                         if (!_previous) {
//                             for (var key in result.style) {
//                                 previous[key] = this.zcstyles[selector][this.state][key];
//                             }
//                         } else {
//                             previous = _previous;
//                         }
//                         _.extend(this.zcstyles[selector][this.state], result.style);
//                         undo.noimportant = config.noimportant;
//                         this.updatestyle(config, styleselector, this.zcstyles[selector][this.state], config.noimportant);
//                         undo.state = this.state;
//                         undo.previous = previous;
//                         undo.current = result.style;
//                         if (this.config.postprocess) {
//                             this.config.postprocess.bind(this)(selectedfield.eq(i), result.style, config, undoaction.actionarray, flag);
//                         }
//                         break;
//                     case 'classaction':
//                         undo.node = selectedfield.eq(i);
//                         undo.action = 'classaction'; // NO I18N
//                         undo.className = config.actionclass;
//                         if (result) {
//                             undo.previous = false;
//                             undo.current = true;
//                             selectedfield.eq(i).addClass(config.actionclass).zaddClass(config.actionclass);
//                         } else {
//                             undo.previous = true;
//                             undo.current = false;
//                             selectedfield.eq(i).removeClass(config.actionclass).zremoveClass(config.actionclass);
//                         }
//                         break;
//                     case 'actionclasslist':
//                         undo.node = selectedfield.eq(i);
//                         undo.action = 'actionclasslist'; // NO I18N
//                         undo.current = result;
//                         var previous = { class: '' };
//                         config.availableclass.map(getactionclass.bind({ el: selectedfield.eq(i), previous: previous }))
//                         undo.previous = previous;
//                         if (config.preprocess) {
//                             config.preprocess(selectedfield.eq(i), result, undoaction.actionarray, undo);
//                         }
//                         selectedfield.eq(i).addClass(result.class).zaddClass(result.class);
//                         if (config.postprocess) {
//                             config.postprocess(selectedfield.eq(i), result, undoaction.actionarray, undo);
//                         }
//                         break;
//                 }
//                 undoaction.actionarray.push(undo);
//             }

//             !flag && this.savecanvasaction(undoaction);
//         }


//         this.updatestyle = function (config, selector, obj, noimportant) {
//             var resultstyle = zutils.zcopyobj(obj);
//             if (config.process) {
//                 resultstyle = config.process(config, resultstyle);
//             }
//             this.addrule(selector, resultstyle, noimportant);
//         }


//         this.addrule = function (selector, obj, noimportant) {
//             var rules = '';
//             var sheet = this.sheet;
//             var nostyleimp = ['width', 'height']; // NO I18N
//             for (style in obj) {
//                 rules += style + ' : ' + obj[style] + ((!noimportant && obj[style] && !(nostyleimp.indexOf(style) > -1)) ? ' !important ; ' : ';');
//             }
//             this.deleterule(selector);
//             if ("insertRule" in sheet) {
//                 sheet.insertRule(selector + "{" + rules + "}", sheet.cssRules.length);
//             }
//             else if ("addRule" in sheet) {
//                 sheet.addRule(selector, rules, sheet.cssRules.length);
//             }
//         }

//         this.deleterule = function (selector) {
//             var sheet = this.sheet;
//             var rules = sheet.cssRules;
//             var rulelen = rules.length;
//             var deletables = [];
//             for (var i = 0; i < rulelen; i++) {
//                 if (rules[i].selectorText == selector) {
//                     deletables.push(i);
//                 }
//             }
//             var deletableslen = deletables.length;
//             for (var i = 0; i < deletableslen; i++) {
//                 sheet.deleteRule(deletables[i]);
//             }
//         }


//         this.compiletheme = function () {
//             var themeconfig = this.config.theme;
//             if (!themeconfig) {
//                 return;
//             }
//             var obj = themeconfig.currenttheme;
//             for (key in obj) {
//                 for (state in obj[key]) {
//                     var selector = themeconfig.selector[key][state];
//                     this.deleterule(selector);
//                     this.addrule(selector, obj[key][state], true);
//                 }

//             }
//         }

//         this.getSelectorByElement = function (element, state) {
//             var selector;
//             if (_.isString(element)) {
//                 selector = element;
//                 element = $(element);
//             } else {
//                 selector = zutils.getSelectorByElement(element);
//             }
//             var isImage = element.closest('.zcbdrbox'); // NO I18N
//             if (isImage.length) {
//                 var elnode = isImage.find('.zcanvas-data-node'); // NO I18N
//                 selector = '.' + elnode.attr('data-zcanvasid') + ' .zcanvas-value-container';
//             }

//             //  These things should done using a config

//             if (!selector && element.hasClass('zc-tabs')) { // NO I18N
//                 var zid = element.closest('.zclayout').attr('id'); // NO I18N
//                 selector = '#' + zid + ' .zc-tabs';
//             } else if (!selector && element.hasClass('tab')) { // NO I18N
//                 var zid = element.closest('.zclayout').attr('id'); // NO I18N
//                 selector = '#' + zid + ' .zc-tabs li.tab';
//             } else if (!selector && element.hasClass('zc-tab-container')) { // NO I18N
//                 var zid = element.closest('.zclayout').attr('id'); // NO I18N
//                 selector = '#' + zid + ' .zc-tab-container';
//             }

//             if (element.hasClass('zcdivider')) {
//                 var zid = element.closest('.zclayout').attr('id'); // NO I18N
//                 selector = '#' + zid + ' .zc-divider-line';
//             }


//             if (state == 'default') {
//                 return selector;
//             }
//             // End of config
//             if (this.state == 'hover' || state == 'hover') {
//                 selector += ':hover'; // NO I18N
//             } else if (this.state == 'active' || state == 'active') { // NO I18N
//                 selector += '.active'; // NO I18N
//             }
//             return selector;
//         }

//         this.applyjsontostyle = function (element, json, allowempty, noimportant) {
//             var selector = this.getSelectorByElement(element);
//             this.zcstyles[selector] = json;
//             (json.default || allowempty) && this.addrule(selector, json.default || { }, noimportant);
//             selector = this.getSelectorByElement(element, 'hover'); // NO I18N
//             (json.hover || allowempty) && this.addrule(selector, json.hover || { }, noimportant);
//             selector = this.getSelectorByElement(element, 'active'); // NO I18N
//             (json.active || allowempty) && this.addrule(selector, json.active || { }, noimportant);
//         }

//         this.savecanvasaction = function (obj, el) {
//             var basecanvas = { };
//             var element = el || this.selectedfields;
//             if (element.length > 1) {
//                 element = element.eq(0);
//             }
//             if ((element.is('.zcanvas-editor') && !element.hasClass('zclayout')) || element.is('.zcanvas-editor-outer')) {
//                 basecanvas = element;
//             } else {
//                 var $elparent = element.parents('.zcanvas-editor'); // NO I18N
//                 if ($elparent.length) {
//                     basecanvas = $elparent;
//                 } else {
//                     $elparent = element.parents('.zcanvas-editor-outer'); // NO I18N
//                     basecanvas = $elparent;
//                 }
//             }
//             if (basecanvas.length) {
//                 var inst = basecanvas.data('zcanvas'); // NO I18N
//                 inst.savecanvasaction(this.selectedfields, null, null, null, null, null, obj);
//             }

//         }

//         this.init();
//     }
//     window.zcanvastools = zcanvastools;
// })();

(function () {
    var zcanvastools = function (config) {
        this.config = config;
        this.zcstyles = { };
        this.availabletools = { };
        this.selectedfields = { };
        this.classaction = [];
        this.sheet = { };
        this.state = 'default'; // NO I18N
        this.changestate = function (state, flag) {
            this.state = state;
            flag || this.selectfield(this.selectedfields, true, true);
            if (this.config.onstatechange) {
                this.config.onstatechange.bind(this)(state);
            }
        }
        this.init = function () {
            var base = $(this.config.baseeditor);
            var $style = base.find('.zc-core-style');
            if (!$style.length) {
                var style = document.createElement('style'); // NO I18N
                style.setAttribute('class', 'zc-core-style'); // NO I18N
                base.append(style);
                $style = [style];
            }
            var segregatedsheet = null;
            if (this.config.segregatedstyle) {
                var segregatedstylessheet = base.find('.' + this.config.segregatedstyle);
                if (!segregatedstylessheet.length) {
                    var sstyle = document.createElement('style'); // NO I18N
                    sstyle.setAttribute('class', this.config.segregatedstyle); // NO I18N
                    base.append(sstyle);
                    segregatedstylessheet = [sstyle];
                }
                segregatedsheet = segregatedstylessheet[0].sheet;
            }
            this.themestylesheet = $style[0].sheet;
            this.sheet = segregatedsheet ? segregatedsheet : $style[0].sheet;
            this.config.nocompile || this.compiletheme();
        }
        this.addtool = function (toolconfig) {
            this.availabletools[toolconfig.toolname] = toolconfig;
            if (this.tools.handler[toolconfig.type]) {
                this.tools.handler[toolconfig.type].bind(this)(toolconfig);
            } else {
                toolconfig.handler.bind(this)(toolconfig);
            }
        }

        this.hoverfield = function (event, flag) {
            $('.zcanvas-hover-element').removeClass('zcanvas-hover-element'); // NO I18N
            if (flag) {
                $(event.currentTarget).addClass('zcanvas-hover-element'); // NO I18N
            }
            event.stopPropagation();
        }

        this.selectfield = function (event, flag, force, meta) {
            if (event.type === 'click' && (event.shiftKey || this.stopPropogate)) { // NO I18N
                var $selected = $(this.selectedfields).not('.zcanvas-editor-outer');
                if (event.target && !$selected.has(event.target).length) {
                    var $target = $(event.target);
                    $target = $target.closest('.zcanvas:not(.zcanvas-ignore)');  // NO I18N
                    var target = $target.not('.zcanvas-editor-outer'); // NO I18N
                    if (target.hasClass('zc-no-parentselect')) {
                        target = target.closest('.zclayout'); // NO I18N
                    }
                    var islabel = $target.is('.zcanvas-inner-component'); // NO I18N
                    if (!$selected.length || target.parent().is($selected.parent()) || islabel) {
                        $selected = $selected.add(target);
                        if ($selected.length === 0) {
                            this.selectfield($target);
                        } else if ($selected.length > 1) {
                            $selected.addClass('zcanvas-multiselect');
                            if (!islabel) {
                                this.multiselect(null, null, false, true);
                            } else {
                                var lables = $selected.filter('.zcanvas-inner-component'); // NO I18N
                                $selected.not(lables).removeClass('zcanvas-selected-element . zcanvas-multiselect');
                                this.multiselect(null, null, true);
                            }

                        } else {
                            $selected.addClass('zcanvas-selected-element');
                            this.selectfield($selected);
                        }
                    }

                }
                return;
            }
            // eslint-disable-next-line webperf/no-multipleDOMLookup
            var selectedfields = event.target ? this.getselectedfields($(event.target)) : event;
            selectedfields = selectedfields ? selectedfields.not('.zcanvas-ignore') : selectedfields; // NO I18N
            if (selectedfields && !selectedfields.length) {
                return;
            }
            $('.zcanvas-selectbox').remove();
            $('.zcanvas-selected-element').removeClass('zcanvas-selected-element'); //NO I18N
            $('.zcanvas-multiselect').removeClass('zcanvas-multiselect'); //NO I18N
            if (selectedfields && selectedfields.is && selectedfields.is(this.selectedfields) && this.selectedfields && this.selectedfields.length === 1 && !force && event.target) {
                selectedfields.addClass('zcanvas-selected-element'); //NO I18N
                return;
            }
            this.selectedfields = selectedfields;
            selectedfields.addClass('zcanvas-selected-element'); //NO I18N
            if (zcanvasrelatedList) {
                zcanvasrelatedList.switchmenu(selectedfields);
            }
            var selecteddata = this.config.gettype ? this.config.gettype(selectedfields) : this.gettypefromelement(selectedfields);
            var toolstypes = [];
            toolstypes = toolstypes.concat([selecteddata.zctype]);
            if (this.config && this.config.onBeforeSelection && !flag) {
                this.config.onBeforeSelection.bind(this)(toolstypes, null, meta)
            }
            this.executetools(toolstypes, flag, meta);
        }

        this.getselectedfields = function (el) {
            var selectedfields = el;
            var closestsubselection = selectedfields.closest('.zc-rl-sub-selectable'); // NO I18N
            var closesttab = selectedfields.closest('.tab'); // NO I18N
            if (el.hasClass('zcanvas-non-selectable')) {
                return;
            } else if (closesttab.length) {
                selectedfields = closesttab;
            } else if (el.hasClass('zc-rl-sub-selectable') || closestsubselection.length) { // NO I18N
                selectedfields = el.closest('.zc-rl-sub-selectable'); // NO I18N
            } else if (el.hasClass('zcanvas-skip-selection')) { // NO I18N
                selectedfields = el.parent('.zcanvas'); // NO I18N
            } else if (el.hasClass('zcanvas-next-selection')) { // NO I18N
                selectedfields = el.find(el.attr('data-nextselect'));
            } else if (el.hasClass('zcanvas-holder')) { // NO I18N
                selectedfields = el.closest('.zcanvas-field'); // NO I18N
            } else if (el.hasClass('zcanvas')) { // NO I18N
                selectedfields = el;
            } else if (el.is(this.config.baseeditor)) {
                selectedfields = $(this.config.baseeditor);
            } else {
                selectedfields = el.closest('.zcanvas'); //No I18N
            }
            return selectedfields;
        }

        this.gettypefromelement = function (selectedfields) {
            var selecteddata = { };
            var staticparent = selectedfields.parents('.zcanvas-static-editor'); // NO I18N
            // add condition below staticparent.length
            if (selectedfields.hasClass('zcanvas-static-editor')) { // NO I18N 
                selectedfields = staticparent.length ? staticparent : selectedfields;
                selecteddata = { zctype: 'editor' }; // NO I18N
            } else if (selectedfields.hasClass('zc-rl-sub-selectable')) { // NO I18N
                selecteddata = { zctype: 'subtype' }; // NO I18N
            } else if (selectedfields.hasClass('zclayout')) { // NO I18N    
                var layoutname = selectedfields.attr('data-layoutname'); // NO i18N
                selecteddata = { zctype: layoutname }
            } else if (selectedfields.hasClass('zclayoutselectable')) { // NO i18N
                selecteddata = { zctype: selectedfields.attr('data-layout-selctabletype') }; // NO i18N
            } else if (selectedfields.hasClass('zcanvas-editor') || selectedfields.hasClass('zcanvas-editor-outer')) { //NO I18N
                selecteddata = { zctype: 'editor' }; // NO I18N
            } else if (selectedfields.hasClass('zcanvas-field')) { // NO I18N
                selecteddata = zutils.getdatafromelement(selectedfields);
            } else if (selectedfields.hasClass('zcanvas-seperator')) { // NO I18N
                selecteddata = { zctype: 'seperator' }; // NO I18N
            } else if (selectedfields.hasClass('zcanvas-selectable')) { // NO I18N
                selecteddata = { zctype: selectedfields.attr('data-zcanvastooltype') } // NO i18N
            } else {
                selecteddata = zutils.getdatafromelement(selectedfields.parents('.zcanvas-field')); //NO I18N
            }
            return selecteddata;
        }

        this.executetools = function (type, flag, meta) {
            var toollist = this.getTools(type, this.config) || [];
            var toollistlen = toollist.length;
            var toolelements = $(this.config.toolcommon);
            toolelements.hide();
            var basenodes = [];
            for (var i = 0; i < toollistlen; i++) {
                var toolconfig = this.availabletools[toollist[i]];
                var base = this.showtools(toolconfig);
                base && basenodes.push(base);
            }
            if (this.config.onSelection && !flag) {
                this.config.onSelection.bind(this)(type, meta, basenodes);
            }
            $(basenodes.join(',')).show();
        }
        this.getTools = function (type, config) {
            var toolsList = [];
            if (!config.tools[type]) {
                toolsList = config.tools.zcdefault;
            } else {
                toolsList = config.tools[type];
            }
            return toolsList;
        }

        this.showtools = function (config) {
            var basenode;
            if (config.conditionalopen) {
                config.conditionalopen.bind(this)(config);
            } else if (config.basecontainer) {
                basenode = config.basecontainer;
                if (config.showcondition && !config.showcondition.bind(this)(config)) {
                    basenode = null;
                }
            }
            this.setcurrentvalue(config);
            return basenode ? basenode : null;
        }

        this.getstylebyselector = function (selector, flag, compressed) {
            var obj = { };
            if (this.zcstyles[selector]) {
                obj = this.zcstyles[selector] || { };
            } else if (canvasObjUtils._.isEmpty(obj) && flag) {
                obj = this.zcstyles[selector] = { };
            }
            if (compressed) {
                var newobj = { };
                for (var key in obj) {
                    var statestyle = obj[key];
                    var newstyle = { };
                    for (var k in statestyle) {
                        var newkey = this.getCompressionMapping('stylekey', k);  // NO I18N
                        var newval = this.getCompressionMapping('stylevalue', statestyle[k]); // NO I18N
                        newstyle[newkey] = newval;
                    }
                    this.config && this.config.stylecompressioncallback && this.config.stylecompressioncallback(newstyle);
                    newobj[key] = newstyle;
                }
                return newobj;
            } else {
                return obj;
            }
        }

        this.getcurrentstyle = function (config, selectedfield, zctype) {
            var style = { };
            switch (config.actiontype) {
                case 'action':
                    var selector = this.getSelectorByElement(selectedfield, 'default'); // NO I18N
                    var type = zctype ? zctype.zctype : '';
                    var styleselector = this.getstylebyselector(selector, true);
                    var obj = styleselector[this.state] || { };
                    var mouseobj;
                    if (!obj[config.actionproperty] && this.state !== 'default' && this.config.mousestateprefix && this.state.indexOf(this.config.mousestateprefix) > -1) {
                        var _mousestate;
                        var _mousestateparent;
                        var mousestateparent = this.state.split(this.config.mousestateprefix) || [];
                        _mousestate = mousestateparent[1];
                        _mousestateparent = mousestateparent[0];
                        if (_mousestate && _mousestateparent && styleselector[_mousestate] && styleselector[_mousestate][config.actionproperty]) {
                            mouseobj = styleselector[_mousestate][config.actionproperty];
                        }
                    }
                    if (obj[config.actionproperty]) {
                        style[config.actionproperty] = obj[config.actionproperty];
                    } else if (mouseobj) {
                        style[config.actionproperty] = mouseobj;
                    } else if (this.state !== 'default' && styleselector && styleselector.default && styleselector.default[config.actionproperty]) { // NO I18N
                        style[config.actionproperty] = styleselector.default[config.actionproperty] // NO I18N
                    } else if (this.config.theme.currenttheme[type] && (this.config.theme.currenttheme[type][this.state] && this.config.theme.currenttheme[type][this.state][config.actionproperty] || !canvasObjUtils._.isEmpty(this.config.theme.currenttheme[type].default) && this.config.theme.currenttheme[type].default[config.actionproperty])) {
                        var themestyle = { }
                        if (this.config.theme.currenttheme[type][this.state] && this.config.theme.currenttheme[type][this.state][config.actionproperty]) {
                            themestyle = this.config.theme.currenttheme[type][this.state]
                        } else {
                            themestyle = this.config.theme.currenttheme[type].default;
                        }
                        style[config.actionproperty] = themestyle[config.actionproperty];
                    } else { // NO I18N
                        style[config.actionproperty] = selectedfield.css(config.actionproperty);
                    }
                    break;
                case 'actionclasslist':
                    var filter;
                    if (this.state !== 'default') { // NO I18N
                        filter = config.list.filter(function (item) {
                            return this.el.hasClass(item.class + '_state_' + this.state)  // NO I18N
                        }.bind({ config: config, el: selectedfield, state: this.state })); // NO I18N
                        if (!filter.length && config.revert && config.removeclass) {
                            if (selectedfield.hasClass(config.removeclass + '_state_' + this.state)) { // NO I18N
                                filter = [{ }];
                            }
                        }
                    }
                    if (!filter || !filter.length) {
                        filter = config.list.filter(function (item) { return this.el.hasClass(item.class) }.bind({ config: config, el: selectedfield }))
                    }
                    style = filter && filter[0] ? filter[0] : { };
                    break;
                case 'classaction':
                    var tempflag;
                    if (this.state !== 'default') { // No I18N
                        tempflag = selectedfield.hasClass(config.actionclass + '_state_' + this.state); // NO I18N
                        if (!tempflag && config.removeclass) {
                            tempflag = selectedfield.hasClass(config.removeclass + '_state_' + this.state); // No I18N
                        }
                    }
                    if (!tempflag) {
                        style.flag = selectedfield.hasClass(config.actionclass);
                    } else {
                        style.flag = true;
                    }

                    break;
                case 'condition':
                    if (config.actioncondition) {
                        style.flag = config.actioncondition.bind(this)(selectedfield, config);
                    }
                    break;
            }
            return style;
        }

        this.multiobject = function (config, obj, stringify) {
            var objlen = obj.length;
            var isequal = true;
            for (var i = 1; i <= objlen - 1; i++) {
                var src = obj[i];
                var dst = obj[i - 1];
                var result;

                if (!stringify) {
                    result = zutils.objectEquals(src, dst)
                } else {
                    result = JSON.stringify(src) === JSON.stringify(dst) ? true : false;
                }

                if (!result) {
                    isequal = false;
                }
            }
            return isequal;
        }

        this.setcurrentvalue = function (config) {
            if (this.selectedfields.length > 1) {
                var sellen = this.selectedfields.length;
                var style = [];
                for (var i = 0; i < sellen; i++) {
                    var selectedfield = this.selectedfields.eq(i);
                    var zctype = this.config.gettype(selectedfield);
                    style.push(this.getcurrentstyle(config, selectedfield, zctype));
                }
            } else {
                var selectedfield = this.selectedfields.eq(0);
                var zctype = this.config.gettype(selectedfield);
                var style = this.getcurrentstyle(config, selectedfield, zctype);
            }

            if (this.tools.populate[config.type] && !config.populate) {
                if (config.prepopulatehandler) {
                    style = config.prepopulatehandler.bind(this)(config, style, selectedfield);
                }
                this.tools.populate[config.type].bind(this)(config, style, selectedfield);
            } else {
                config.populate.bind(this)(config, style, selectedfield);
            }
        }

        this.changehandler = function (config, result, flag, _previous, selectioncallback, selectedelement, stylecreationcallback) {
            var selectedfield = selectedelement || this.selectedfields;
            var selectedfieldlen = selectedfield.length;
            var undoaction = { action: 'link', actionarray: [], node: '#' }; // NO I18N
            var getactionclass = function (item) {
                if (this.inst.state === 'default') { // NO I18N
                    if (this.el.hasClass(item)) {
                        selectedfield.eq(i).removeClass(item).zremoveClass(item);
                        this.previous.class = item;
                    }
                } else {
                    var itemclass = item + '_state_' + this.inst.state; // NO I18N
                    if (this.el.hasClass(itemclass)) {
                        selectedfield.eq(i).removeClass(itemclass);
                        this.previous.class = itemclass;
                        if (this.objref) {
                            var spliceindex = this.objref.indexOf(item);
                            if (spliceindex > -1) {
                                this.objref.splice(spliceindex, 1);
                            }
                        }
                    }
                    if (config.revert && config.removeclass && config.removeclass.indexOf(item) > -1) {
                        var itemremoveclass = config.removeclass + '_state_' + this.inst.state; // NO I18N
                        if (this.el.hasClass(itemremoveclass)) {
                            selectedfield.eq(i).removeClass(itemremoveclass);
                            this.previous.class = itemremoveclass;
                            if (this.objref) {
                                var spliceindex = this.objref.indexOf(config.removeclass);
                                if (spliceindex > -1) {
                                    this.objref.splice(spliceindex, 1);
                                }
                            }
                        }
                    }
                }

            }

            for (var i = 0; i < selectedfieldlen; i++) {
                var ismultiresult = result.length ? true : false;
                if (this.config.preprocess) {
                    if (this.config.preprocess(selectedfield.eq(i), config, ismultiresult ? result[i] : result, flag, undoaction)) {
                        return;
                    }
                }
                if (this.config.integritycheck && !this.config.integritycheck.bind(this)(selectedfield.eq(i), config)) {
                    continue;
                }
                var undo = { };
                if (selectioncallback) {
                    selectedfield = selectioncallback(selectedfield);
                }
                var selector = this.getSelectorByElement(selectedfield.eq(i), 'default'); // NO I18N
                var styleselector = this.getSelectorByElement(selectedfield.eq(i));
                var styles = this.getstylebyselector(selector, true);
                if (!styles[this.state]) {
                    this.zcstyles[selector][this.state] = { };
                    stylecreationcallback && stylecreationcallback(this.zcstyles[selector][this.state]);
                }
                switch (config.actiontype) {
                    case 'action':
                        undo.action = 'action'; // NO I18N
                        undo.node = selector;

                        // FIXME:: this check should be generic call back

                        if (selector.indexOf('.tab') > -1) {
                            undo.actualnode = this.getSelectorByElement(selectedfield.eq(i), 'default', true); // NO I18N
                        }
                        var previous = { };
                        if (!_previous) {
                            for (var key in ismultiresult ? result[i].style : result.style) {
                                var currentst = this.zcstyles[selector][this.state][key];
                                previous[key] = zutils.zcopyobj2(currentst ? currentst : '');
                            }
                        } else {
                            previous = zutils.zcopyobj2(_previous.length ? _previous[i].style : _previous || { });
                        }
                        canvasObjUtils._.extend(this.zcstyles[selector][this.state], ismultiresult ? result[i].style : result.style);

                        undo.noimportant = config.noimportant;
                        this.updatestyle(config, styleselector, this.zcstyles[selector][this.state], config.noimportant);
                        undo.state = this.state;
                        undo.previous = previous;
                        undo.current = zutils.zcopyobj2(ismultiresult ? result[i].style : result.style || { });
                        if (this.config.postprocess) {
                            this.config.postprocess.bind(this)(selectedfield.eq(i), ismultiresult ? result[i].style : result.style, config, undoaction.actionarray, flag, null, styles);
                        }
                        break;
                    case 'classaction':
                        undo.node = selectedfield.eq(i);
                        undo.action = 'classaction'; // NO I18N
                        undo.className = config.actionclass;
                        if (this.state !== 'default' && this.zcstyles[selector][this.state] && !this.zcstyles[selector][this.state]._classstyle_) {
                            this.zcstyles[selector][this.state]._classstyle_ = [];
                        }
                        if (this.state !== 'default') {
                            undo.classstate = this.state;
                            undo.selector = selector;
                            undo.removeclass = config.removeclass;
                            undo.styleselector = styleselector;
                            undo.noimp = config.noimportant;
                        }
                        if (result) {
                            undo.previous = false;
                            undo.current = true;
                            if (this.state !== 'default') {
                                undo.hasremove = selectedfield.eq(i).hasClass(config.removeclass + '_state_' + this.state); // NO I18N
                                selectedfield.eq(i).removeClass(config.removeclass + '_state_' + this.state); // NO I18N
                                var spliceindex = this.zcstyles[selector][this.state]._classstyle_.indexOf(config.removeclass + '_state_' + this.state);
                                if (spliceindex > -1) {
                                    this.zcstyles[selector][this.state]._classstyle_.splice(spliceindex, 1);
                                }
                                this.zcstyles[selector][this.state]._classstyle_.push(config.actionclass + '_state_' + this.state);
                                selectedfield.eq(i).addClass(config.actionclass + '_state_' + this.state); // NO I18N
                                this.updatestyle(config, styleselector, this.zcstyles[selector][this.state], config.noimportant);
                            } else {
                                selectedfield.eq(i).addClass(config.actionclass).zaddClass(config.actionclass);
                            }

                        } else {
                            undo.previous = true;
                            undo.current = false;
                            if (this.state !== 'default') {
                                undo.hasaction = selectedfield.eq(i).hasClass(config.actionclass + '_state_' + this.state); // NO I18N
                                selectedfield.eq(i).removeClass(config.actionclass + '_state_' + this.state); // NO I18N
                                var spliceindex = this.zcstyles[selector][this.state]._classstyle_.indexOf(config.actionclass + '_state_' + this.state); // NO I18N
                                if (spliceindex > -1) {
                                    this.zcstyles[selector][this.state]._classstyle_.splice(spliceindex, 1);
                                }
                                this.zcstyles[selector][this.state]._classstyle_.push(config.removeclass + '_state_' + this.state);
                                selectedfield.eq(i).addClass(config.removeclass + '_state_' + this.state); // NO I18N
                                this.updatestyle(config, styleselector, this.zcstyles[selector][this.state], config.noimportant);
                            } else {
                                selectedfield.eq(i).removeClass(config.actionclass).zremoveClass(config.actionclass);
                            }
                        }
                        if (this.config.postprocess && !selectedelement) {
                            this.config.postprocess.bind(this)(selectedfield.eq(i), result, config, undoaction.actionarray, flag, undo, styles);
                        }
                        break;
                    case 'actionclasslist':
                        undo.node = selectedfield.eq(i);
                        undo.action = 'actionclasslist'; // NO I18N
                        undo.current = result;
                        var previous = { class: '' };
                        config.availableclass.map(getactionclass.bind({ el: selectedfield.eq(i), previous: previous, inst: this, objref: this.zcstyles[selector][this.state]._classstyle_ }))
                        undo.previous = previous;
                        if (config.preprocess) {
                            config.preprocess(selectedfield.eq(i), result, undoaction.actionarray, undo);
                        }
                        var resultclass = result.class;
                        if (this.state !== 'default') {
                            undo.classstate = this.state;
                            undo.selector = selector;
                            undo.styleselector = styleselector;
                            undo.noimp = config.noimportant;
                            if (this.zcstyles[selector][this.state] && !this.zcstyles[selector][this.state]._classstyle_) {
                                this.zcstyles[selector][this.state]._classstyle_ = [];
                            }
                            if (resultclass || config.removeclass) {
                                config.hasremove = !resultclass || config.removeclass;
                                var classtoadd = resultclass ? resultclass + '_state_' + this.state : config.removeclass + '_state_' + this.state; // NO I18N
                                var classloadindex = this.zcstyles[selector][this.state]._classstyle_.indexOf(classtoadd);
                                if (classloadindex > -1) {
                                    this.zcstyles[selector][this.state]._classstyle_.splice(classloadindex, 1);
                                }
                                this.zcstyles[selector][this.state]._classstyle_.push(classtoadd);
                                selectedfield.eq(i).addClass(resultclass ? resultclass + '_state_' + this.state : config.removeclass + '_state_' + this.state); // NO I18N
                            }
                            this.updatestyle(config, styleselector, this.zcstyles[selector][this.state], config.noimportant);
                        } else {
                            selectedfield.eq(i).addClass(resultclass).zaddClass(resultclass);
                        }
                        if (config.postprocess) {
                            config.postprocess(selectedfield.eq(i), result, undoaction.actionarray, undo);
                        }
                        if (this.config.postprocess && !selectedelement) {
                            this.config.postprocess.bind(this)(selectedfield.eq(i), result, config, undoaction.actionarray, flag, undo, styles);
                        }
                        break;
                }
                !canvasObjUtils._.isEmpty(undo) && undoaction.actionarray.push(undo);
            }

            !flag && undoaction.actionarray.length && this.savecanvasaction(undoaction);

            return undoaction;
        }


        this.updatestyle = function (config, selector, obj, noimportant) {
            var resultstyle = zutils.zcopyobj(obj);
            if (config.process) {
                resultstyle = config.process(config, resultstyle);
            }
            this.addrule(selector, resultstyle, noimportant);
        }

        this.classstylehandling = function (selector, styles) {
            if (this.config.classstyles) {
                var stlen = styles.length;
                for (var i = 0; i < stlen; i++) {
                    var stname = styles[i].split('_state_')[0]; // NO I18N
                    var sel = this.config.classstyles[stname];
                    if (sel) {
                        var selec = sel.selector;
                        var seleclen = selec.length;
                        var mainselector = '';
                        if (this.config.classselector) {
                            selector = this.config.classselector(selector);
                        }
                        for (var j = 0; j < seleclen; j++) {
                            mainselector += selector + selec[j];
                            if (seleclen - 1 !== j) {
                                mainselector += ',';
                            }
                        }
                        mainselector = mainselector.replace(new RegExp(stname, 'g'), styles[i].trim());
                        this.addrule(mainselector, sel.style, sel.noimportant);
                    }
                }
            }
        }

        this.addrule = function (selector, obj, noimportant, flag, themecreation, customsheet) {
            var rules = '';
            var sheet = customsheet ? customsheet : this.sheet;
            var nostyleimp = ['width', 'height']; // NO I18N
            var restricted = ['_name_', '_classstyle_', '_order', '_inherited']; // NO I18N
            if (this.config.stylepriority) {
                noimportant = this.config.stylepriority(selector, noimportant);
            }
            if (obj._classstyle_) {
                this.classstylehandling(selector, obj._classstyle_);
            }
            for (style in obj) {
                if (restricted.indexOf(style) > -1) {
                    continue;
                }
                if (this.config.stylecreationcallback && !themecreation) {
                    this.config.stylecreationcallback(style, obj[style]);
                }
                rules += this.getReverseCompressionMapping('stylekey', style) + ' : ' + this.getReverseCompressionMapping('stylevalue', obj[style]) + (!noimportant && obj[style] && !(nostyleimp.indexOf(style) > -1) ? ' !important ; ' : ';');  // NO I18N
            }
            this.deleterule(selector);
            if ("insertRule" in sheet) {
                sheet.insertRule(selector + "{" + rules + "}", sheet.cssRules.length);
            }
            else if ("addRule" in sheet) {
                sheet.addRule(selector, rules, sheet.cssRules.length);
            }
            if (this.config.poststylecreate && !flag) {
                this.config.poststylecreate.bind(this)(selector, obj, noimportant);
            }
        }

        this.adjustSelector = function (selector) {
            if (!selector) {
                return;
            }
            // TODO: this should be config in future
            var parentSelectorIndex = selector.indexOf('.zc-tablist-container');
            if (parentSelectorIndex > -1) {
                var match = selector.match(/\S>/); // NO I18N
                if (match) {
                    var index = match.index + 1;
                    selector = selector.slice(0, index) + " " + selector.slice(index);
                }
                // normalize selector
                //selector = selector.replace('> ', ' > ');
            }
            return selector
        }

        this.deleterule = function (selector) {
            var sheet = this.sheet;
            var rules = sheet.cssRules;
            var rulelen = rules.length;
            var deletables = [];
            var adjustedselector = this.adjustSelector(selector);
            for (var i = 0; i < rulelen; i++) {
                if (rules[i].selectorText === adjustedselector) {
                    deletables.push(i);
                }
            }
            var deletableslen = deletables.length;
            for (var i = 0; i < deletableslen; i++) {
                sheet.deleteRule(deletables[i]);
            }
        }


        this.compiletheme = function () {
            var themeconfig = this.config.theme;
            if (!themeconfig) {
                return;
            }
            var obj = themeconfig.currenttheme;
            for (key in obj) {
                for (state in obj[key]) {
                    var selector = themeconfig.selector[key][state];
                    this.deleterule(selector);
                    this.addrule(selector, obj[key][state], state === 'default' ? true : false, null, true, this.themestylesheet);
                }

            }
            if (this.config.classstyles) {
                var classtheme = this.config.classstyles;
                for (var key in classtheme) {
                    if (!classtheme[key].nodefault) {
                        var sellen = classtheme[key].selector.length;
                        var selec = ''; // NO I18N
                        for (var i = 0; i < sellen; i++) {
                            selec += classtheme[key].selector[i];
                            if (sellen - 1 !== i) {
                                selec += ','; // NO I18N
                            }
                        }
                        this.addrule(selec, classtheme[key].style, classtheme[key].noimportant, null, null, this.themestylesheet);
                    }
                }
            }
        }

        this.getSelectorByElement = function (element, state, exact, specialcondtn) {
            var selector;
            if (canvasObjUtils._.isString(element)) {
                selector = element;
                element = $(element);
            } else {
                selector = zutils.getSelectorByElement(element);
            }


            var closefield = zutils.getClosefield(element[0]);
            var isimagefield = false;
            if (closefield && closefield.classList.contains('zcbdrbox')) {
                isimagefield = true;
                var elnode = closefield.querySelector('.zcanvas-data-node'); // NO I18N
                var zcanid = elnode ? elnode.getAttribute('data-zcanvasid') : undefined;
                selector = '.' + zcanid + ' .zcanvas-value-container img';
            }
            /* var isImage = element.closest('.zcbdrbox'); // NO I18N
             if(isImage.length){
                 var elnode = isImage.find('.zcanvas-data-node'); // NO I18N
                 selector = '.' + elnode.attr('data-zcanvasid') + ' .zcanvas-value-container img';
             } */


            // FIXME: MUSTFIX::::: move this handling to cofig

            /* var isTag = element.children('crm-tag'); // NO I18N
             if(isTag.length){
                 selector += ' crm-tag ul li:not(.lyteMultiselectInput)'; // NO I18N
             } */

            var type = this.config && this.config.gettype && this.config.gettype(element);

            if (type && type.zctype === 'field' && !specialcondtn && !isimagefield) { // NO I18N
                selector = zutils.getSelectorByElement(element.children('.zcanvas-data-node')); // NO I18N
            }

            if (type && type.zctype === 'MERGEFIELD') {
                selector += ' .zcanvas-merge-container'; // NO I18N
            }

            if (element.hasClass('zcstaticicon')) { // NO I18N
                selector += ' .zciconcontainer'; // NO I18N
            }




            //  These things should done using a config

            if (!selector && element.hasClass('zc-tabs')) { // NO I18N
                var zid = element.closest('.zclayout').attr('id'); // NO I18N
                selector = '#' + zid + '> .zc-tablist-container .zc-tabs';
            } else if (!selector && element.hasClass('tab')) { // NO I18N
                var zid = element.closest('.zclayout').attr('id'); // NO I18N
                selector = '#' + zid + '> .zc-tablist-container > .zc-tabs li.tab';
                if (exact) {
                    selector += '[data-tab="' + element.attr('data-tab') + '"]'; // NO I18N
                }
            } else if (!selector && element.hasClass('zc-tab-container')) { // NO I18N
                var zid = element.closest('.zclayout').attr('id'); // NO I18N
                selector = '#' + zid + '> .zc-tab-container';
            }

            if (element.hasClass('zcdivider')) {
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                var zid = element.closest('.zclayout').attr('id'); // NO I18N
                selector = '#' + zid + ' .zc-divider-line';
            }


            if (state === 'default') {
                return selector;
            }
            // End of config
            if (this.state === 'hover' || state === 'hover') {
                selector += ':hover'; // NO I18N
            } else if (this.state === 'active' || state === 'active') { // NO I18N
                selector += '.active'; // NO I18N
            } else if (this.config.customstate && (state !== 'default' || this.state !== 'default')) { // NO I18N
                selector = this.config.customstate(state || this.state, selector, element);
            }


            return selector;
        }

        this.applyjsontostyle = function (element, json, allowempty, noimportant, decompress, noprop, selectorflag) {
            if (!json) {
                return;
            }
            var selector = this.getSelectorByElement(element, 'default'); // NO I18N
            if (json && decompress) {
                for (var key in json) {
                    var statestyle = json[key];
                    var newstyle = { };
                    for (var k in statestyle) {
                        var newkey = this.getReverseCompressionMapping('stylekey', k); // NO I18N
                        var newval = this.getReverseCompressionMapping('stylevalue', statestyle[k]); // NO I18N
                        newstyle[newkey] = newval;
                    }
                    this.config && this.config.styledecompressioncallback && this.config.styledecompressioncallback(newstyle);
                    json[key] = newstyle;
                }
            }
            this.zcstyles[selector] = json;

            for (key in json) {
                switch (key) {
                    case 'default':
                        (json.default || allowempty) && this.addrule(selector, json.default || { }, noimportant);
                        break;
                    case 'hover':
                        var $selector = this.getSelectorByElement(element, 'hover'); // NO I18N
                        (json.hover || allowempty) && this.addrule($selector, json.hover || { }, noimportant);
                        break;
                    case 'active':
                        var $selector = this.getSelectorByElement(element, 'active'); // NO I18N
                        (json.active || allowempty) && this.addrule($selector, json.active || { }, noimportant);
                        break;
                    default:
                        // FIXME: shouldbe handled outside
                        if (key && key.indexOf('zcanvas_') !== 0) {
                            continue;
                        }
                        var _mousekey = '_mousestate_'; // NO I18N
                        var _mousestate = key.indexOf('_mousestate_'); // NO I18N
                        var _key = key;
                        if (_mousestate > -1) {
                            _key = _key.slice(0, _mousestate);
                        }
                        var $selector = element && element.hasClass('zcanvas-non-delete') ? '.' + _key + selector : '.' + _key + ' ' + selector; // NO I18N
                        if (selectorflag && this.config && this.config.customstate) {
                            $selector = this.config.customstate(_key, selector, element, json);
                        }
                        var originalmousestate = '';
                        if (_mousestate > -1) {
                            var stlen = key.length;
                            var mouselen = _mousekey.length;
                            originalmousestate = key.slice(_mousestate + mouselen, stlen);
                            (json[key] || allowempty) && this.addrule($selector + (originalmousestate === 'hover' ? ':hover' : originalmousestate === 'active' ? '.active' : ''), json[key] || { }, noimportant); // NO I18N
                            key = _key;
                        } else {
                            (json[key] || allowempty) && this.addrule($selector, json[key] || { }, noimportant);
                        }

                        // Class list handling
                        // FIXME: should be handled in config
                        if (json[key] && json[key]._classstyle_ && json[key]._classstyle_.length) {
                            var rselement = element.hasClass('zcanvas-holder') ? element.parent('.zcanvas-field') : element; // NO I18N
                            rselement.addClass(json[key]._classstyle_.join(' '));
                        }

                        break;
                }
            }
            if (element && !noprop) {
                var zdcond = Object.keys(json).filter(function (jstate) {
                    return jstate.indexOf('zcanvas') > -1 && !json[jstate]._inherited && jstate !== 'default' && jstate !== 'active' && jstate !== 'hover'; // NO I18N
                }).sort(function (a, b) { return (json[a]._order || 0) - (json[b]._order || 0) });
                zdcond = zdcond.map(function (jstate) {
                    if (jstate && jstate.indexOf('_mousestate_') > -1) { // NO I18N
                        jstate = jstate.slice(0, jstate.indexOf('_mousestate_'));
                    }
                    return jstate;
                })
                if (zdcond && zdcond.length) {
                    element.data('zccustomstate', canvasObjUtils._.uniq(zdcond)); // NO I18N
                }

            }

        }

        this.getCompressionMapping = function (compressionkey, key) {
            var mapping = this.config.compressionmap;
            if (mapping && mapping[compressionkey] && mapping[compressionkey][key]) {
                key = mapping[compressionkey][key];
            }
            return key;
        }

        this.getReverseCompressionMapping = function (compressionkey, key) {
            var mapping = this.config.compressionmap;
            if (mapping && mapping[compressionkey]) {
                var map = mapping[compressionkey];
                for (var i in map) {
                    if (map[i] === key) {
                        key = i;
                        break;
                    }
                }
            }
            return key;
        }

        this.savecanvasaction = function (obj, el) {
            var basecanvas = { };
            var element = el || this.selectedfields;
            if (element.length > 1) {
                element = element.eq(0);
            }
            if (element.is('.zcanvas-editor') && !element.hasClass('zclayout') || element.is('.zcanvas-editor-outer')) {
                basecanvas = element;
            } else {
                var $elparent = element.parents('.zcanvas-editor:not(.zclayout)'); // NO I18N
                if ($elparent.length) {
                    basecanvas = $elparent;
                } else {
                    $elparent = element.parents('.zcanvas-editor-outer'); // NO I18N
                    basecanvas = $elparent;
                }
            }
            if (basecanvas.length) {
                var inst = basecanvas.data('zcanvas'); // NO I18N
                inst.savecanvasaction(this.selectedfields, obj ? obj.action : null, null, null, null, null, obj);
            }

            return obj;

        }

        this.init();
    }
    window.zcanvastools = zcanvastools;
})()
var zutils = {
    zcanvas_spaceBar: false,
    stylecompressionmap: {
        'stylekey': { // NO I18N
            'font-family': 'ff', // NO I18N
            'font-size': 'fs', // NO I18N
            'width': '_width_' // NO I18N
        },
        'stylevalue': { // NO I18N
            'LatoThin': 't', // NO I18N
            'LatoThinItalic': 'ti', // NO I18N
            'LatoLight': 'l', // NO I18N
            'LatoLightItalic': 'li', // NO I18N
            'LatoRegular': 'r', // NO I18N
            'LatoItalic': 'ri', // NO I18N
            'LatoMedium': 'm', // NO I18N
            'LatoMediumItalic': 'mi', // NO I18N
            'LatoSemibold': 's', // NO I18N
            'LatoSemiboldItalic': 'si', // NO I18N
            'LatoBold': 'b', // NO I18N
            'LatoBoldItalic': 'bi', // NO I18N
            'LatoBlack': 'x', // NO I18N
            'LatoBlackItalic': 'xi' // NO I18N
        }
    },
    classstyles: {
        'zcanvasuppercase': { // NO I18N
            selector: ['.zcanvasuppercase'], style: { 'text-transform': 'uppercase' } // NO I18N
        },
        'zcanvaslowercase': { // NO I18N
            selector: ['.zcanvaslowercase'], style: { 'text-transform': 'lowercase' } // NO I18N
        },
        'zcanvasuppercase_removed': { // NO I18N
            selector: ['.zcanvasuppercase_removed'], style: { 'text-transform': 'initial' } // NO I18N
        },
        'zcanvaslinethrough': { // NO I18N
            selector: ['.zcanvaslinethrough', '.zcanvaslinethrough span:not(.zcs-dib)', '.zcanvaslinethrough.zcanvas-value-container *', '.zcanvaslinethrough .zcanvas-value-container *', '.divClass .zcanvaslinethrough .canvasCruxComponent', '.divClass .zcanvaslinethrough [zc-icon]'], // NO I18N
            style: { 'text-decoration': 'line-through' }, // NO I18N
            noimportant: true,
            nodefault: true
        },
        'zcanvaslinethrough_removed': { // NO I18N 
            selector: ['.zcanvaslinethrough', '.zcanvaslinethrough span:not(.zcs-dib)', '.zcanvaslinethrough.zcanvas-value-container *', '.zcanvaslinethrough .zcanvas-value-container *', '.divClass .zcanvaslinethrough .canvasCruxComponent', '.divClass .zcanvaslinethrough [zc-icon]'], // NO I18N
            style: { 'text-decoration': 'initial' }, // NO I18N
            noimportant: true,
            nodefault: true
        },
        'zc-ta-left': { // NO I18N
            selector: ['.zc-ta-left', '.zc-ta-left .zcanvas-holder'], style: { 'text-align': 'left' } // NO I18N
        },
        'zc-ta-center': { // NO I18N
            selector: ['.zc-ta-center', '.zc-ta-center .zcanvas-holder'], style: { 'text-align': 'center' } // NO I18N
        },
        'zc-ta-right': { // NO I18N
            selector: ['.zc-ta-right', '.zc-ta-right .zcanvas-holder'], style: { 'text-align': 'right' } // NO I18N
        }
    },
    // Method to return tool obj
    getinstancetool: function () {
        if (jsonCreation && jsonCreation.toolinst) {
            return jsonCreation.toolinst;
        } else {
            return createStruture.toolinst;
        }
    },
    getReverseCompressionMapping: function (key, value) {
        var toolinst = zutils.getinstancetool();
        if (toolinst) {
            return toolinst.getReverseCompressionMapping(key, value);
        } else {
            return value;
        }
    },
    getCompressionMapping: function (key, value) {
        var toolinst = zutils.getinstancetool();
        if (toolinst) {
            return toolinst.getCompressionMapping(key, value);
        } else {
            return value;
        }
    },
    forceselect: function (el) {
        var toolinst = zutils.getinstancetool();
        if (toolinst) {
            return toolinst.selectfield(el, null, true);
        }
    },
    matchdefaultstyles: function (element, $parentdata, dataclone, olddataclone, menuinst) {
        var resizeconfig = $parentdata.getResizableOptionsByType(dataclone.zctype);
        if (resizeconfig) {
            element.resizable('destroy'); // NO I18N
            element.resizable(resizeconfig);
            if (menuinst.config) {
                if (menuinst.config.defaultclass) {
                    if (menuinst.config.defaultclass[dataclone.zctype]) {
                        element.addClass(menuinst.config.defaultclass[dataclone.zctype]).zaddClass(menuinst.config.defaultclass[dataclone.zctype]);
                    }
                    if (menuinst.config.defaultclass[olddataclone.zctype]) {
                        element.removeClass(menuinst.config.defaultclass[olddataclone.zctype]).zremoveClass(menuinst.config.defaultclass[olddataclone.zctype]);
                    }
                }
                // FIXME: this needs to be removed from config
                element.css('height', ''); // NO I18N
                if (menuinst.config.defaultstyle && menuinst.config.defaultstyle[dataclone.zctype]) {
                    element.css(menuinst.config.defaultstyle[dataclone.zctype]);
                }
            }
        }
    },
    getdatafromelement: function (element) {
        var $el = $(element);
        if (!$el.hasClass('zcanvas-field')) { //NO I18N
            element = $el.parent('.zcanvas-field'); //NO I18N
        }
        // return JSON.parse(decodeURI($(element).data('zcanvas'))); //NO I18N
        return $el.data('zcanvas'); // NO I18N

    },
    compresstheme: function (theme) {
        var inst = zutils.getinstancetool();
        var newtheme = { };
        for (var ikey in theme) {
            var newobj = { };
            var obj = theme[ikey];
            for (var key in obj) {
                var statestyle = obj[key];
                var newstyle = { };
                for (var k in statestyle) {
                    var newkey = inst.getCompressionMapping('stylekey', k);  // NO I18N
                    var newval = inst.getCompressionMapping('stylevalue', statestyle[k]); // NO I18N
                    newstyle[newkey] = newval;
                }
                newobj[key] = newstyle;
            }
            newtheme[ikey] = newobj;
        }

        return newtheme;
    },
    decompresstheme: function (theme) {
        var inst = zutils.getinstancetool();

        var newtheme = { };
        for (var ikey in theme) {
            var newobj = { };
            var obj = theme[ikey];
            for (var key in obj) {
                var statestyle = obj[key];
                var newstyle = { };
                for (var k in statestyle) {
                    var newkey = inst.getReverseCompressionMapping('stylekey', k);  // NO I18N
                    var newval = inst.getReverseCompressionMapping('stylevalue', statestyle[k]); // NO I18N
                    newstyle[newkey] = newval;
                }
                newobj[key] = newstyle;
            }
            newtheme[ikey] = newobj;
        }

        return newtheme;
    },
    updateDataElement: function (element, data) {
        data = encodeURI(JSON.stringify(data));
        $(element).attr({
            zcanvas: data
        });
    },
    getEditorView: function (data, flag) {
        var element;
        if (!flag) {
            data.zcanvasId = zutils.getRandomId();
        }
        if (data.hideLabel) {
            element = zutils.generateTemplateString(zcanvasdefaults.templates.hiddenlabel)({ data: data });
        } else {
            element = zutils.generateTemplateString(zcanvasdefaults.templates.label)({ data: data });
        }
        // PURPOSE data is set here only to test.
        // $(element).zdata(data);
        return $(element);
    },

    resizeWidthHeight: function (nodes) {
        var currentWidth = $(nodes).width();
        var resizeWidth = currentWidth + 20;
        $(nodes).css({
            width: resizeWidth
        });

    },

    findDisturbedNode: function (ui, editor) {
        var parentEditor = editor || zutils.findParentEditor(ui);
        var helper = $(ui.helper);
        if (helper.hasClass('ui-draggable-container')) {
            return;
        }
        var draggables = $.merge($(parentEditor).find('.zcanvas-data-node').not(helper.find('.zcanvas-data-node')), $('.zcanvastempell')); // NO I18N

        return zutils.getInterceptedNodes(draggables, { x: ui.offset.left, y: ui.offset.top, width: helper.width(), height: helper.height() });
    },
    /**
     * Since there will be multiple editors can receive elements from sidebar. the disturbing nodes parent editor will be determined from here.
     * @param {JQuery Draggable UI element} ui 
     */
    findParentEditor: function (ui, tempEl) {
        //TODO: Apply additional selection with fieldclass using options
        if (!ui) {
            ui = {
                offset: {
                    left: tempEl.x,
                    top: tempEl.y
                },
                width: tempEl.width,
                height: tempEl.height
            }
        }
        // FIXME: Added quick fix as check only visible editors
        // FIXME: Must be handled with the droppable action ie ( onactive from droppable)
        var editors = $(".ui-droppable:visible:not(.ui-droppable-disabled)");
        var editorscount = editors.length;
        var helper = $(ui.helper);
        var hwidth = ui.width || helper.width();
        var hheight = ui.height || helper.height();
        for (var i = 0; i < editorscount; i++) {
            var boundedRect = zutils.getBoundedRect(editors[i]);
            if (boundedRect.top < ui.offset.top && boundedRect.left < ui.offset.left &&
                boundedRect.right > ui.offset.left + hwidth && boundedRect.bottom > ui.offset.top + hheight) {
                return editors[i];
            }
        }
    },

    /**
         * This method is used to return the disturbed node 
         * @param {Nodes in Editor except moving node} othernodes 
         * @param {Moving node} currentNode 
         */
    getInterceptedNodes: function (othernodes, currentNode) {
        var currentdefaults = { x: 0, y: 0, width: 1, height: 1 };
        currentNode = canvasObjUtils._.defaults(currentNode, currentdefaults);
        return canvasObjUtils._.find(othernodes, function (n) {
            var iElement = $(n);
            var iElparent = iElement.parent('.zcanvas-row-separator'); // NO I18N
            var fieldParent;
            var isOnlyChild = zutils.isOnyChild(iElement);
            if (isOnlyChild) {
                fieldParent = iElement.parents('.zcanvas-field'); //NO I18N
            } else {
                fieldParent = iElparent.parents('.zcanvas-field'); //NO I18N
            }
            var nodeRect = {
                x: iElement.offset().left,
                y: iElement.offset().top,
                width: iElement.outerWidth(),
                height: iElement.outerHeight()
            }

            if (iElparent.length && iElement.is(':last-child') || isOnlyChild && fieldParent.length) {
                var rowwidth = fieldParent.outerWidth();
                var elwidth = iElement.position().left + nodeRect.width;
                var diffwidth = rowwidth - elwidth;
                nodeRect.width += diffwidth;
            }
            return zutils.isIntercepted(nodeRect, currentNode);
        }.bind(this));
    },

    isOnyChild: function (element) {
        var $parent = element.parents('.zcanvas-field'); // NO I18N
        var child = $parent.children('.zcanvas-data-node'); // NO I18N
        return child.length ? true : false;
    },
    /**
         * This method used to find whether two node intercepted ie disturbed
         * @param {Node A} a 
         * @param {Node B} b 
         */
    isIntercepted: function (a, b) {
        return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height - 2 <= b.y || b.y + b.height <= a.y + 2);
    },

    isInterceptedByPosition: function (a, b) {
        return !(a.left + a.width <= b.left || b.left + b.width <= a.left || a.top + a.height - 2 <= b.top || b.top + b.height <= a.top + 2);
    },

    /**
     * To find the element positions
     * @param {Element for getting rect details} el 
     */
    getBoundedRect: function (el) {
        var element = $(el);
        return {
            top: element.position().top,
            left: element.position().left,
            bottom: element.position().top + element.height(),
            right: element.position().left + element.width()
        };
    },

    deleteElement: function (node, flag) {
        if (!node) {
            node = $(".zcanvas-selected-element , .zcanvas-multiselect");//NO I18N
        } else {
            node = $(node);
        }
        if (node.length > 1) {
            var nodelen = node.length;
            var undoobj = [];
            var selector = $('.zcanvas-selectbox');
            var inst;
            if (!selector.length) {
                var closesteditor = zutils.getClosestEditor(node);
                inst = zutils.getdatabyelement(closesteditor);
            } else {
                inst = zutils.getParentData(selector);
            }
            for (var i = 0; i < nodelen; i++) {
                var uobj = zutils.deleteElement(node.eq(i), true);
                uobj && undoobj.push(uobj);
            }
            inst.savecanvasaction({ }, 'link', null, null, null, null, {
                action: 'link', // NO I18N
                node: '',
                actionarray: undoobj
            })
            selector.zremove();
            return;
        }
        if (node.is('.zcanvas-ignore')) { // NO I18N
            node.zremove();
            return;
        }
        if (node.closest('.zc-fieldsection').length) { // NO I18N
            return;
        }
        var delhandler = node.closest('.zcdeletelayouthandler'); // NO I18N
        if (delhandler.length) {
            var layoutname = delhandler.attr('data-layoutname'); // NO I18N
            var editorInstance = zclayout.prototype.layouts[layoutname];
            return editorInstance.deletelayout(node, flag);
        }
        if (node.is('.zcanvas-editor')) {
            return zutils.deleteEditor(node, flag);
        }

        if (node.is('.zcanvas-static-editor')) {
            return zutils.deletestaticeditor(node, flag);
        }

        if (node.is('.zc-rl-sub-selectable')) {
            node = node.closest('.zcanvas-static-editor');  // NO I18N
            return zutils.deletestaticeditor(node, flag);
        }

        if (node.is('.zclayout') || node.is('.zclayoutselectable') || node.is('.zclayoutdeletable')) {
            node = node.is('.zclayoutselectable') ? node.closest('.zclayout') : node; // NO I18N 
            return zutils.deleteLayout(node, flag);
        }

        return zutils.deletefield(node, flag);
    },
    deletefield: function (node, flag) {
        var previousData, currentData, currentNode, referenceNode, editorInstance;
        referenceNode = node.is('.zcanvas-field') ? node : node.closest('.zcanvas-field'); // NO I18N
        var ref_ = zutils.getSelectorByElement(referenceNode);
        previousData = canvasOutput.createJson(referenceNode);
        var prevstyle = zutils.getParentStyles(referenceNode);
        var parenteditor = zutils.getSelectorByElement(zutils.getParentEditor(referenceNode));
        editorInstance = zutils.getParentData(referenceNode);
        var getNodeData = node.zdata()[0];
        if (getNodeData) {
            var getMenuData = $(getNodeData.fieldContainer).data("zcanvasMenu");//NO I18N
            getMenuData && getMenuData.addElement(getNodeData);
        }

        zutils.zremoveData(node);

        if (node.hasClass("zcanvas-field") || node.hasClass("zcanvas-row-separator")) {
            node.zremove();
        } else if (node.hasClass("zcanvas-holder")) { // NO I18N
            referenceNode.zremove();
        } else if (node.hasClass("zcanvas-inner-component")) {
            var fieldOuterNode = node.parents(".zcanvas-field"); // NO I18N
            var rowOuterNode = node.parents(".zcanvas-row-separator"); //No I18N
            var fieldCount = fieldOuterNode.find(".zcanvas-value-container").length;
            var rowFieldCount = rowOuterNode.find(".zcanvas-value-container").length;
            if (fieldCount <= 1) {
                fieldOuterNode.zremove();
            } else if (rowFieldCount <= 1) {
                rowOuterNode.zremove();
            } else {
                var holder = node.parent(".zcanvas-holder"); //No I18N
                var nextSeparator = holder.next(".zcanvas-seperator"); //No I18N
                var prevSeparator = holder.prev(".zcanvas-seperator"); //No I18N
                holder.zremove()
                nextSeparator.zremove();
                if (nextSeparator.length === 0) {
                    if (prevSeparator.next().length === 0) {
                        prevSeparator.zremove();
                    }
                }
            }
        }
        // eslint-disable-next-line webperf/layout-thrashing
        currentData = referenceNode.is(':visible') ? canvasOutput.createJson(referenceNode) : { }; // NO I18N
        currentNode = referenceNode;
        var undoobj = {
            node: ref_,
            action: 'delete', // NO I18N
            previous: previousData,
            current: currentData,
            prevstyle: prevstyle,
            data: getNodeData,
            editor: parenteditor
        }
        if (!flag) {
            editorInstance && editorInstance.savecanvasaction(currentNode, 'delete', null, null, null, null, undoobj);
        } else {
            return undoobj;
        }
    },
    deleteEditor: function (editor, flag) {
        var $editor = $(editor);
        if ($editor.is('.zcanvas-non-delete') || $editor.is('.zcanvas-title-editor')) {
            return;
        }
        var baseeditor = $editor.parent();
        if (baseeditor.hasClass('zcanvas-skip-selection')) {
            baseeditor = baseeditor.parent();
        }
        var editorInstance = baseeditor.data('zcanvas'); // NO I18N
        var previousData = {
            editor: $editor.attr('id'), // NO I18N
            json: canvasOutput.createJson(editor),
            previousstyle: { ui: { value: { style: jsonCreation.getstyles(baseeditor) } } }
        }
        var isTable = $editor.hasClass('zclayout-table'); // NO I18N
        var elements;
        if (isTable && !$editor.zhasClass('zcrestricttable')) {
            elements = $editor.find('.zcanvas-field'); // NO I18N
        } else {
            elements = $editor.children('.zcanvas-field , .zcanvas-editor , .zcanvas-static-editor , .zclayout'); // NO I18N
        }
        elements.each(function () { // NO I18N
            var $el = $(this);
            if ($el.is('.zcanvas-editor')) {
                zutils.deleteEditor($el, true);
            } else if ($el.is('.zcanvas-field')) { // NO I18N
                zutils.deleteElement($el, true);
            } else if ($el.is('.zcanvas-static-editor')) { // NO I18N
                zutils.deletestaticeditor($el, true);
            } else if ($el.is('.zclayout')) { // NO I18N
                zutils.deleteLayout($el, true);
            }
        });
        $editor.remove();
        if ($editor.zhasClass('zc-lsection')) {
            zutils.changelayoutscope(editorInstance, "Section Layout"); // NO I18N
        } else if ($editor.hasClass('zclayout-table')) { // NO I18N
            zutils.changelayoutscope(editorInstance, "Table Layout"); // NO I18N
        }
        if (!flag) {
            editorInstance.savecanvasaction({ }, 'deleteeditor', previousData, { });

        } else {
            return {
                node: $editor,
                action: 'deleteeditor', // NO I18N
                previous: previousData,
                editor: zutils.getSelectorByElement(baseeditor)
            }
        }
    },

    deletestaticeditor: function (editor, flag) {
        var $editor = $(editor);
        var _editorparent = zutils.getParentEditor($editor);
        if (_editorparent.is('.zcanvas-restricted-drop') && !flag) {
            var _tabzid = _editorparent.attr('id'); // NO I18N
            var _tabelement = $('.zctablist' + _tabzid + ' .deletetabicon'); // NO I18N
            _tabelement.click();
            return;
        }
        if ($editor.hasClass('zcnoaction')) {
            var parenteditor = zutils.getParentEditor($editor);
            var editorinst = zutils.getdatabyelement(parenteditor);
            var previousdata = {
                editor: $editor.attr('id'), // NO I18n
                parent: '#' + parenteditor.attr('id'), // NO I18N
                json: canvasOutput.createJson($editor), // NO I18N
                action: 'callback', // NO I18N
                node: $editor,
                callback: function (data, method) {
                    var $node = $(data.node);
                    if (method === 'undo') {
                        var parentinst = zutils.getdatabyelement($(data.parent));
                        parentinst && parentinst.addElement([data.json]);
                    } else {
                        $node.zremove();
                    }
                }
            }
            $editor.zremove();
            if (!flag) {
                editorinst && editorinst.savecanvasaction($editor, 'callback', null, null, null, null, previousdata);
                return;
            } else {
                return previousdata;
            }
        }
        var baseeditor = $editor.parent();
        if (baseeditor.hasClass('zcanvas-skip-selection')) {
            baseeditor = baseeditor.parent();
        }
        var editorInstance = baseeditor.data('zcanvas'); // NO I18N
        var titledata = canvasOutput.createJson($editor.find('.zcanvas-title-editor')); // NO I18N
        var editorpos = jsonCreation.getposition($editor);
        editorpos.left = editorpos.startX;
        editorpos.top = editorpos.startY;
        var previousData = {
            editor: $editor.attr('id'), // NO I18N
            json: $editor.data('zcanvas'), // NO I18N
            style: editorpos,
            titledata: titledata,
            cdata: $editor.data('zcanvasdata') // NO I18N
        }
        zcanvasrelatedList.filltemplates($editor, null, true, previousData.json.data);
        $editor.remove();
        var menuinst = $(previousData.json.fieldContainer).data('zcanvasMenu'); // NO I18N
        menuinst.addElement(previousData.json);
        if (!flag) {
            editorInstance.savecanvasaction({ }, 'deletestaticeditor', previousData, { });
        } else {
            return {
                node: $editor,
                action: 'deletestaticeditor', // NO I18N
                previous: previousData,
                editor: zutils.getSelectorByElement(baseeditor)
            }
        }

    },


    deleteLayout: function (element, flag) {
        var layoutname = element.attr('data-layoutname'); // NO I18N
        var editorInstance = zclayout.prototype.layouts[layoutname];
        return editorInstance.deletelayout(element, flag);
    },

    getzdataIds: function (elm) {
        if ($(elm).hasClass("zcanvas-data-node")) {
            var id = $(elm).map(function () {
                return $(this).attr('data-zcanvasid');//NO I18N  
            })
        } else if ($(elm).hasClass("zcanvas-inner-component")) {//NO I18N
            var id = $(elm).map(function () {
                return $(this).parent('.zcanvas-data-node').attr('data-zcanvasid');//NO I18N  
            });
        } else if ($(elm).hasClass("zcanvas-field") || $(elm).hasClass("zcanvas-row-separator")) {//NO I18N
            var valueContainers = $(elm).find(".zcanvas-value-container");//NO I18N
            var id = valueContainers.map(function (count, nodes) {
                if ($(nodes).parent().hasClass("zcanvas-holder")) {
                    return $(this).parent('.zcanvas-data-node').attr('data-zcanvasid');
                } else {
                    return $(this).attr('data-zcanvasid'); //NO I18N
                }
            });
        }

        return id;
    },

    zremoveData: function (node) {
        var getId = zutils.getzdataIds(node);

        $(getId).each(function (count, id) {
            delete window.zcanvasdata[id];
        });
    },

    search: function (element, menu, searchclass, subclass, hideclass, nomatch, subselection) {
        element = element ? element : '#sidemenuSearchInput'; // NO I18N
        var $el = $(element);
        var inputValue = $el.val() || '';
        var $parent = $el.parent();
        if (inputValue === '') {
            $parent.find('.zc_searchIcon').removeClass('zc-search-hide');
            $parent.find('.zc-closesearch-icon').addClass('zc-search-hide');
        } else {
            $parent.find('.zc_searchIcon').addClass('zc-search-hide');
            $parent.find('.zc-closesearch-icon').removeClass('zc-search-hide');
        }
        if (!subclass) {
            subclass = { }
        }
        var activemenu = zcanvasrelatedList && zcanvasrelatedList.currentmenu && zcanvasrelatedList.currentmenu.opened ? zcanvasrelatedList.currentmenu.opened : "#zcanvas_menu"; // NO I18N

        var fields_outer_container = $(menu || activemenu);
        if (!fields_outer_container.length) {
            fields_outer_container = $('#zcanvas_menu'); // NO I18N
        }
        var container_valHolder = fields_outer_container.find(searchclass || ".zcanvas-on-menu:not(.zc-strict-hide)").not('.zcanvas-menuhidden').not('.zcmenu-disable-item'); // NO I18N

        /*   var containFieldsLowerCase = _.chain(container_valHolder).filter(function(d){
               var string = $(d).clone().children().remove().end().text();
               return string.includes(inputValue.toLowerCase())}).value();
           var containFieldsUpperCase = _.chain(container_valHolder).filter(function(d){
               var string = $(d).clone().children().remove().end().text();
               return string.includes(inputValue.toUpperCase())}).value();
           var containFieldsCamelizeCase = _.chain(container_valHolder).filter(function(d){
               var string = $(d).clone().children().remove().end().text();
               return string.includes(zhelpers.camelize(inputValue))}).value();
           var containFields = $(containFieldsLowerCase).add(containFieldsUpperCase).add(containFieldsCamelizeCase); */

        var containFields = _.chain(container_valHolder).filter(function (d) {
            var searchel = $(d);
            if (subselection) {
                var subselectionel = searchel.find(subselection);
                if (subselectionel && subselectionel.length) {
                    searchel = subselectionel;
                }
            }
            var string = searchel.clone().children().remove().end().text().toLowerCase();
            return string.includes(inputValue.toLowerCase())
        }).value();

        containFields = $(containFields);

        var fields = searchclass ? $(hideclass || searchclass) : fields_outer_container.find(".zcanvas-on-menu , .zcanvas-submenu-heading, .zcanvas-menu-heading , .zcanvas-submenu-container");
        //  fields.hide();


        var noMatchElem = $(nomatch || "#sidebarnomatch");
        var nomatchflag = false;
        var outcontainerflag = false;
        var result = $('');
        var searchmatchsource = $el.is(noMatchElem.attr('data-search-source')); // NO I18N
        if (containFields.length > 0) {
            containFields.each(function () {
                var outfield = $(this);
                // outfield.show();
                result = result.add(outfield);
                var subcont = outfield.parent(subclass.submenucontainer || '.zcanvas-submenu-container'); // NO I18N
                if (!subcont.length && subclass.closest) {
                    subcont = outfield.closest(subclass.submenucontainer);
                }
                result = result.add(subcont);
                //  subcont.show();
                var subhead = subcont.prev(subclass.submenu || '.zcanvas-submenu-heading'); // NO I18N
                // subhead.show();
                result = result.add(subhead);
                var mainparent = outfield.parent(subclass.fieldwrapper || '.zcanvas-field-wrapper'); // NO I18N
                if (!mainparent.length) {
                    mainparent = subcont.parent(subclass.fieldwrapper || '.zcanvas-field-wrapper'); // NO I18N
                }
                var mainhead = mainparent.prev(subclass.menuheading || '.zcanvas-menu-heading') // NO I18N
                result = result.add(mainhead);
                //  mainhead.show(); 
                if (noMatchElem.is(":visible")) {
                    //  fields_outer_container.show();
                    outcontainerflag = true;
                    if (searchmatchsource) {
                        // noMatchElem.hide();
                        nomatchflag = true;
                    }
                }


            });

            if (nomatchflag) {
                noMatchElem.hide();
            }

            if (outcontainerflag) {
                fields_outer_container.show();
            }

            fields.not(result).not('.zc-strict-hide').not('.zcanvas-menuhidden').not('.zcmenu-disable-item').hide(); // NO I18N

            result.show();


        } else {
            // fields_outer_container.hide();
            fields.not('.zc-strict-hide').not('.zcanvas-menuhidden').not('.zcmenu-disable-item').hide(); // NO I18N
            searchmatchsource && noMatchElem.show();
        }

        // fields_outer_container.scrollTop(0);
    },

    menuSearchClear: function (flag, el, searchclass, menu, subclass, hideclass, nomatch) {
        var focusneeded = el ? true : false;
        var searchel = el ? $(el) : $("#sidemenuSearchInput");
        if (searchel.val() || flag) {
            searchel.val("");
            zutils.search(el, menu, searchclass, subclass, hideclass, nomatch);
            var $parent = searchel.parent();
            $parent.find('.zc_searchIcon').removeClass('zc-search-hide');
            $parent.find('.zc-closesearch-icon').addClass('zc-search-hide');
            if (focusneeded) {
                searchel.focus();
            }
        }

    },

    bindHoverBorder: function (nodes) {
        // if(!nodes) {
        //     nodes = jSortable.cd_selectedGridItem;
        // }
        $(nodes).each(function (count, eachNode) {
            var eachNodeFields = $(eachNode).find(".zcanvas-inner-component");
            if (eachNodeFields.length === 1) {
                $(eachNode).unbind('mousemove mouseout');
                return true;
            }

            $(eachNode).mousemove(function (event) {
                var $target = $(event.target);
                if (!$target.hasClass("canvas_hoverOutline")) {
                    $(".canvas_hoverOutline").removeClass("canvas_hoverOutline");
                    $(".cd_hoverBdr").removeClass("cd_hoverBdr");
                    var closestField = $target.closest(".zcanvas-inner-component"); // NO I18N
                    var closestRow = $target.closest(".zcanvas-row-separator"); // NO I18N
                    var closestSep = $target.closest(".zcanvas-seperator"); // NO I18N

                    if (closestField.length > 0) {
                        closestField.addClass("canvas_hoverOutline");//NO I18N
                    } else if (closestSep.length > 0) {
                        closestSep.addClass("canvas_hoverOutline");//NO I18N
                    } else {
                        closestRow.addClass("canvas_hoverOutline");//NO I18N
                    }
                }
            });
            $(eachNode).mouseout(function () {
                $(".canvas_hoverOutline").removeClass("canvas_hoverOutline");//NO I18N
            });
        });
    },

    triggerEvent: function (eventName, element, event, ui) {
        $(element).trigger({
            type: eventName,
            message: {
                target: event.target,
                ui: ui
            }
        });
    },
    generateTemplateString: (function () {
        var cache = { };

        function generateTemplate(template) {
            var fn = cache[template];

            if (!fn) {
                // Replace ${expressions} (etc) with ${map.expressions}.
                // eslint-disable-next-line no-useless-escape
                var sanitized = template.replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function (_, match) {
                    return '${map.' + match.trim() + '}'; //NO I18N
                })
                    // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
                    .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

                fn = Function('map', 'return `' + sanitized + '`');
            }
            return fn;
        }

        return generateTemplate;
    })(),
    getRandomId: function () {
        return 'zcanvas_' + Math.random().toString(36).substring(2, 15); // NO I18N
    },
    adjustWidth: function (el, scrollWidthflag) {
        var $el = $(el);
        var scrollWidth = $el.get(0).scrollWidth;
        var width = $el.width();
        var minWidth;
        if (scrollWidth > width || !scrollWidthflag) {
            minWidth = scrollWidth;
        } else {
            var rsep = $el.find('.zcanvas-row-separator');
            if (rsep.length) {
                minWidth = canvasObjUtils._.max(rsep, function (d) { return $(d).width() }).scrollWidth;
            } else {
                var zdn = $el.find('.zcanvas-data-node');
                if (zdn.length) {
                    minWidth = zdn.width();
                }
            }
        }
        return minWidth;
        // $el.css('min-width',minWidth); // NO I18N
    },
    findDistrubNodeRight: function (allElm, currentNode, allOrMin) {
        // if(allElm == undefined){
        //     allElm = $("#grid1").find(".grid-stack-item");
        // }
        var currentNodeStartY = $(currentNode).position().top;
        var currentNodeStartX = $(currentNode).position().left;
        var currentNodeEndY = currentNodeStartY + $(currentNode).height();
        var distrubedNodeArray = [];
        var allelmlen = allElm.length;
        for (var i = 0; i < allelmlen; i++) {
            var checkingNode = allElm[i];
            var checkingNodeStartY = $(checkingNode).position().top;
            var checkingNodeStartX = $(checkingNode).position().left;
            // id = avoid same node return,, startX = after space join
            if (checkingNodeStartX !== currentNodeStartX && currentNodeStartX < checkingNodeStartX) {
                //              var checkingNodeStartY = checkingNode.ui.position.startY;
                var checkingNodeEndY = checkingNodeStartY + $(checkingNode).height();
                // 1.same row or less than same row 2.
                if (checkingNodeStartY >= currentNodeStartY && currentNodeEndY > checkingNodeStartY ||
                    checkingNodeStartY < currentNodeStartY && checkingNodeEndY > currentNodeStartY) {
                    distrubedNodeArray.push(allElm[i]);
                }
            }
        }
        if (distrubedNodeArray.length !== 0) {
            if (allOrMin) {
                return distrubedNodeArray;
            } else {
                var closestNode = canvasObjUtils._.min(distrubedNodeArray, function (num) { return $(num).position().left });
                return closestNode;
            }
        }
    },

    loadDefaultWorkspace: function () {
        var editorWorkspace = zcanvasdefaults.templates.editorNode;
        // eslint-disable-next-line zstandard/no-body-events
        $("body").append(editorWorkspace);
    },

    canvasWorkspaceResize: function (workspaceEdit) {
        if (workspaceEdit) {
            zutils.zcanvas_spaceBar = true;
            document.body.style.cursor = "grab";
        } else {
            zutils.zcanvas_spaceBar = false;
            document.body.style.cursor = "default";
        }
    },
    tabPress: function () {
        $("#zcanvas_menu, #canvas-toolbar").toggle();
    },
    zcopyobj: function (src) {
        return Object.assign({ }, src);
    },
    zcopyobj2: function (src) {
        return JSON.parse(JSON.stringify(src));
    },
    findpositionAndWidth: function (el, pos, cont, target, flag, mindata) {
        var $el = $(el);
        var $target = $(target);
        var outerContainerOffset = $el.offset();
        var outWidth = cont.outerWidth();
        var leftPosi = pos.left - outerContainerOffset.left;
        var minw = mindata || target.attr('data-zc-min-width'); // NO I18N
        if (minw) {
            var minwidth = parseInt(minw);
            if (leftPosi + minwidth > outWidth) {
                leftPosi = outWidth - minwidth;
            }
        }
        var toppos = pos.top - outerContainerOffset.top;
        var nodeWidth = 0;
        var nowidthflag = $target.is('.zc-no-resize'); // NO I18N

        if (!flag && !nowidthflag) {
            var allNodes = cont.children(".zcanvas-editor, .zcanvas-static-editor, .zclayout");//NO I18N
            var distrubNode = zutils.findDistrubNodeRight(allNodes, target);
            if (!distrubNode) {
                nodeWidth = cont.width() - leftPosi - 10;
            } else {
                nodeWidth = $(distrubNode).position().left - leftPosi - 10;
            }

            if (minw) {
                var minwidth = parseInt(minw);
                if (nodeWidth < minwidth) {
                    nodeWidth = minwidth;
                }
            }
        } else if (nowidthflag) {
            nodeWidth = $target.width();
        }

        return {
            leftpos: leftPosi,
            toppos: toppos,
            targetwidth: nodeWidth
        }
    },
    findImmediateDisturb: function (parent, node, side, json) {
        var allnodes = parent.children('.zcanvas').not(node); // NO I18N
        var sortednodes = [];
        if (side === 'top' || side === 'bottom') {
            sortednodes = canvasObjUtils._.sortBy(allnodes, function (snode) { return snode.offsetTop + snode.offsetHeight })
            if (side === 'top') {
                sortednodes = sortednodes.reverse();
            }
        } else {
            sortednodes = canvasObjUtils._.sortBy(allnodes, function (snode) { return snode.offsetLeft + snode.offsetWidth });
            if (side === 'left') {
                sortednodes = sortednodes.reverse();
            }
        }
        allnodes = $(sortednodes);
        var pos;
        if (json) {
            pos = json;
        } else {
            pos = node.position();
            pos.width = pos.left + node.outerWidth();
            pos.height = pos.top + node.outerHeight();
        }

        var allnodelen = allnodes.length;
        for (var i = 0; i < allnodelen; i++) {
            var $el = allnodes.eq(i); // $(allnodes[i]);
            var dpos = $el.position();
            dpos.width = dpos.left + $el.outerWidth();
            dpos.height = dpos.top + $el.outerHeight();
            switch (side) {
                case 'top':
                    if (dpos.top < pos.top && (dpos.left >= pos.left && pos.width > dpos.left || dpos.left < pos.left && dpos.width > pos.left)) {
                        return $el;
                    }
                    break;
                case 'bottom':
                    if (dpos.top > pos.top && (dpos.left >= pos.left && pos.width > dpos.left || dpos.left < pos.left && dpos.width > pos.left)) {
                        return $el;
                    }
                    break;
                case 'left':
                    if (dpos.left < pos.left && (dpos.top >= pos.top && pos.height > dpos.top || dpos.top < pos.top && dpos.height > pos.top)) {
                        return $el;
                    }
                    break;
                case 'right':
                    if (dpos.left > pos.left && (dpos.top >= pos.top && pos.height > dpos.top || dpos.top < pos.top && dpos.height > pos.top)) {
                        return $el;
                    }
                    break;
            }
        }
        return;

    },
    getBoxdimensions: function (el) {
        var dimensions = {
            left: canvasObjUtils._.min(el, function (item) { return item.offsetLeft }).offsetLeft,
            top: canvasObjUtils._.min(el, function (item) { return item.offsetTop }).offsetTop
        }
        var endxel = canvasObjUtils._.max(el, function (item) { return item.offsetLeft + item.offsetWidth });
        dimensions.width = endxel.offsetLeft + endxel.offsetWidth; //  - dimensions.left removed for PURPOSE

        var endyl = canvasObjUtils._.max(el, function (item) { return item.offsetTop + item.offsetHeight });
        dimensions.height = endyl.offsetTop + endyl.offsetHeight; // - dimensions.top removed for PURPOSE

        dimensions.elheight = endyl.offsetTop - dimensions.top + endyl.offsetHeight;
        dimensions.elwidth = endxel.offsetLeft - dimensions.left + endxel.offsetWidth;
        return dimensions;
    },
    zobjdiff: function (obj1, obj2) {
        var result = { };
        if (Object.is(obj1, obj2)) {
            return undefined;
        }
        if (!obj2 || typeof obj2 !== 'object') {
            return obj2;
        }
        Object.keys(obj1 || { }).concat(Object.keys(obj2 || { })).forEach(function (key) {
            if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
                result[key] = obj2[key];
            }
            if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
                var value = zutils.zobjdiff(obj1[key], obj2[key]);
                if (value !== undefined) {
                    result[key] = value;
                }
            }
        });
        return result;
    },
    getParentData: function (element) {
        var $parent = element.parent('.zcanvas-editor');   // NO I18N
        if ($parent.is('.zcanvas-selectbox')) {
            $parent = zutils.getParentEditor($parent);
        }
        if (!$parent.length && element.parent().is('.zcanvas-row-seperator')) {
            $parent = zutils.getParentEditor(element.closest('.zcmergelayout')); // NO I18N
        }
        var parentdata = { };
        if (!$parent.length) {
            $parent = element.parent('.zcanvas-editor-outer');  // NO I18N
        }
        parentdata = $parent.data('zcanvas')  // NO I18N
        return parentdata;
    },
    getParentEditor: function (element) {
        var $parent = element.parent('.zcanvas-editor'); // NO I18N
        if (!$parent.length) {
            $parent = element.parent('.zcanvas-editor-outer'); // NO I18N
        }

        return $parent;
    },
    getClosestEditor: function (element) {
        var $editor = element.closest('.zcanvas-editor:not(.zclayout)'); // NO I18N
        if (!$editor.length) {
            $editor = element.closest('.zcanvas-editor-outer'); // NO I18N
        }
        return $editor;
    },
    getParentStyles: function (e) {
        var editor = zutils.getParentEditor(e);
        return { ui: { value: { style: jsonCreation.getstyles(editor) } } };
    },
    // FIXME: simplify logic
    getdatabyelement: function (element) {
        if (element.is('.zcanvas-editor-outer')) { // NO I18N
            return element.data('zcanvas'); // NO I18N
        } else if (element.is('.zcanvas-editor')) { // NO I18N
            return element.data('zcanvas'); // NO I18N
        }
    },
    getClosefield: function (element) {
        if (element) {
            if (element.classList.contains('zcanvas-field')) {
                return element;
            } else if (element.classList.contains('zcanvas-data-node')) {  // NO I18N
                return element.parentElement;
            } else if (element.classList.contains('zcanvas-inner-component')) {  // NO I18N
                return element.parentElement.parentElement;
            }
        }
        return;
    },
    getSelectorByElement: function (element) {
        if (element.hasClass('zcanvas-field')) {
            var datanode = element[0].querySelector('.zcanvas-data-node'); // NO I18N
            var zid = datanode ? datanode.getAttribute('data-zcanvasid') : undefined; // NO I18N
            return '.zcanvas-field.' + zid;  // NO I18N
        }
        // var closefield = element.closest('.zcanvas-field'); // NO I18N
        var closefield = zutils.getClosefield(element[0]);
        if (closefield) { // NO I18N
            var datanode = closefield.querySelector('.zcanvas-data-node'); // NO I18N
            var zid = datanode ? datanode.getAttribute('data-zcanvasid') : undefined; // NO I18N
            if (element.hasClass('zcanvas-holder')) {
                return '.' + zid + ' .zcanvas-holder'; // NO I18N
            } else if (element.hasClass('zcanvas-label')) { // NO I18N
                return '.' + zid + ' .zcanvas-label'; // NO I18N
            } else if (element.hasClass('zcanvas-value-container')) { // NO I18N
                return '.' + zid + ' .zcanvas-value-container'; // NO I18N
            }
        } else if (element.hasClass('zcanvas-editor') || element.hasClass('zcanvas-static-editor') || element.hasClass('zclayout') || element.hasClass('zcanvas-editor-outer') || element.hasClass('zcanvas-row') || element.hasClass('zcanvas-row-seperator') || element.hasClass('zcanvas-seperator')) { // NO I18N
            return '#' + element.attr('id');
        }
    },
    getElementBySelector: function (selector) {
        if (selector.indexOf(':parent()') > -1) {
            selector.replace(':parent()', '');
            return $(selector).parent();
        }
        return $(selector);
    },
    objectEquals: function objectEquals(obj1, obj2) {
        for (var i in obj1) {
            if (obj1.hasOwnProperty(i)) {
                if (!obj2.hasOwnProperty(i)) { return false };
                if (obj1[i] !== obj2[i]) { return false };
            }
        }
        for (var i in obj2) {
            if (obj2.hasOwnProperty(i)) {
                if (!obj1.hasOwnProperty(i)) { return false };
                if (obj1[i] !== obj2[i]) { return false };
            }
        }
        return true;
    },
    getadjustpadding: function (style) {
        var result = { paddingLeft: 0, paddingTop: 0 };
        if (style.padding) {
            result.paddingLeft = result.paddingTop = parseInt(style.padding || 0)
        }
        if (style['padding-left']) {
            result.paddingLeft = parseInt(style['padding-left'] || 0); // NO I18N
        }
        if (style['padding-top']) {
            result.paddingTop = parseInt(style['padding-top'] || 0); // NO I18N
        }
        return result;
    },
    blinkelement: function (el, config) {
        $('.zc-blink-bg').removeClass('zc-blink-bg'); // NO I18N
        el.addClass('zc-blink-bg');
        var duration = 1000;
        if (config && config.time) {
            duration = config.time;
        }
        setTimeout(function () {
            el.removeClass('zc-blink-bg');
        }, duration);
    },
    getOverlappedNodes: function (el) {
        var $parent = zutils.getParentEditor(el);
        var othernode = $parent.children('.zcanvas').not(el); // NO I18N

        var sourcedim = el.offset();
        sourcedim.width = el.outerWidth();
        sourcedim.height = el.outerHeight();

        return canvasObjUtils._.filter(othernode, function (d) {
            var nodedim = $(d).offset();
            nodedim.width = $(d).outerWidth();
            nodedim.height = $(d).outerHeight();
            return zutils.isInterceptedByPosition(sourcedim, nodedim);
        })

    },
    overlapHandling: function (el, ref) {
        var overlapnodes = zutils.getOverlappedNodes(el);
        var undoredoobj = { action: 'link', node: ref.node, actionarray: [zutils.zcopyobj(ref)] };
        var newindex = 1;
        var overlapindex = 1;
        if (overlapnodes && overlapnodes.length) {
            var overlapelength = overlapindex = overlapnodes.length;
            overlapnodes = canvasObjUtils._.sortBy(overlapnodes, function (d) { return d.style.zIndex; })
            for (var i = 0; i < overlapelength; i++) {
                var $node = $(overlapnodes[i])
                var currentindex = i;
                var $currentnodeindex = $node[0].style.zIndex; //NO I18N
                if (parseInt($currentnodeindex) > 1) {
                    var secondlab = zutils.getOverlappedNodes($node);
                    if (secondlab && secondlab.length) {
                        currentindex = parseInt($currentnodeindex);
                        overlapindex = currentindex > overlapindex ? currentindex : overlapindex;
                        continue;
                    }
                }

                $node.css('z-index', currentindex + 1); // NO I18N
                var undoobj = {
                    action: 'cssaction', node: zutils.getSelectorByElement($node), previous: { 'z-index': $currentnodeindex }, current: { 'z-index': currentindex + 1 } // NO I18N
                }
                undoredoobj.actionarray.push(undoobj);
            }
            var undoobj = {
                action: 'cssaction', node: zutils.getSelectorByElement(el), previous: { 'z-index': el[0].style.zIndex }, current: { 'z-index': overlapnodes.length + 1 } // NO I18N
            }
            undoredoobj.actionarray.push(undoobj);
            el.css('z-index', overlapindex + 1); // NO I18N
            ref.action = 'link'; // NO I18N
            ref.actionarray = undoredoobj.actionarray;
            newindex = overlapindex + 1;
            // zutils.reinitarrange(el);
        } else if (el && el[0] && el[0].style.zIndex !== '1') {
            var undoredoobj = { action: 'link', node: ref.node, actionarray: [zutils.zcopyobj(ref)] };
            var undoobj = {
                action: 'cssaction', node: zutils.getSelectorByElement(el), previous: { 'z-index': el[0].style.zIndex }, current: { 'z-index': 1 } // NO I18N
            }
            undoredoobj.actionarray.push(undoobj);
            ref.action = 'link'; // NO I18N
            ref.actionarray = undoredoobj.actionarray;
            el.css('z-index', 1); // NO I18N
        }
        zutils.reinitarrange(el);
        $('.zcanvas-editor-outer').data('zcanvas').config.toolsRef.availabletools.depthbackward.populate(null, { 'z-index': newindex }, el, overlapnodes); // NO I18N
    },
    adjustoverlap: function (el, ref, index) {
        var undoredoobj = { action: 'link', node: ref.node, actionarray: [zutils.zcopyobj(ref)] };
        var overlapnodes = canvasObjUtils._.sortBy(zutils.getOverlappedNodes(el) || [], function (d) { return d.style.zIndex; });
        overlapnodes.splice(index - 1, 0, el[0]);
        var overlaplen = overlapnodes.length;
        for (var i = 0; i < overlaplen; i++) {
            var $overnode = $(overlapnodes[i]);
            if (!$overnode.is(el)) {
                var undoobj = {
                    action: 'cssaction', node: zutils.getSelectorByElement($overnode), previous: { 'z-index': $overnode[0].style.zIndex }, current: { 'z-index': i + 1 } // NO I18N
                }
                undoredoobj.actionarray.push(undoobj);
            }
            $overnode.css('z-index', i + 1); // NO I18N
        }
        ref.action = 'link';
        ref.actionarray = undoredoobj.actionarray;
    },
    changelayoutscope: function (editorInstance, layout, flag) {
        if (editorInstance.config && editorInstance.config.zclayoutcontainer) {
            var zdata = $(editorInstance.config.zclayoutcontainer).data('zcanvasMenu'); // NO I18N
            if (zdata) {
                var drg = zdata.getElementByKey('layoutname', layout); // NO I18N
                if (drg && drg.length) {
                    var zidata = drg.data('zcanvas'); // NO I18N
                    !flag ? zdata.addElement(zidata) : zdata.reduceScope(zidata);
                    if (!flag) {
                        editorInstance.config && editorInstance.config.toolsRef && editorInstance.config.toolsRef.selectfield(editorInstance.container);
                    }
                }
            }
        }
    },
    reinitarrange: function (node) {
        if (node && (node.hasClass('ui-droppable') || node.hasClass('zclayout-table') || node.hasClass('zctablayout'))) { // NO I18N
            var dinst = node.data('uiDroppable'); // NO I18N
            if (dinst) {
                dinst._updatedepth();
            } else {
                dinst = $('.zcanvas-editor-outer').data('uiDroppable'); // NO I18N
            }
            dinst && dinst._rearrangescopes(dinst.options.scope || 'default'); // NO I18N
        }
    },
    pauseScoping: function (flag) {
        var menu = '#zcanvas_menu'; // NO I18N
        if (zcanvasrelatedList && zcanvasrelatedList.currentmenu && zcanvasrelatedList.currentmenu.opened) {
            menu = zcanvasrelatedList.currentmenu.opened;
        }
        var insert = menu + '_insert'; // NO I18N
        var inst = $(menu).data('zcanvasMenu'); // NO I18N
        inst && inst.pause(flag);
        var iinst = $(insert).data('zcanvasMenu'); // NO I18N
        iinst && iinst.pause(flag);
    },
    throttle: function (fn, delay) {
        zutils.timeout = null;

        return function throttledFn() {
            window.clearTimeout(zutils.timeout);
            var ctx = this;
            var args = Array.prototype.slice.call(arguments);// eslint-disable-line zstandard/no-reserved-words
            zutils.timeout = window.setTimeout(function callThrottledFn() {
                fn.apply(ctx, args);
            }, delay);
        }
    },
    destroyevents: function () {
        // eslint-disable-next-line zstandard/no-body-events
        $(document).off('keydown.zcanvaskey'); // NO I18N
    },
    getBorderWidth: function (value) {
        if (value) {
            var split = value.split(' '); // NO I18N
            return parseInt(split[0] || 0);
        }
        return 0;
    },
    getBorderProperties: function (json) {
        var result = {
            'border-left-width': 0, // NO I18N
            'border-right-width': 0, // NO I18N
            'border-top-width': 0, // NO I18N
            'border-bottom-width': 0 // NO I18N
        }
        if (json) {
            if (json.border) {
                var borderwidth = zutils.getBorderWidth(json.border);
                result['border-top-width'] = result['border-bottom-width'] = result['border-left-width'] = result['border-right-width'] = borderwidth; // NO I18N
            } else {
                result['border-top-width'] = zutils.getBorderWidth(json['border-top']); // NO I18N
                result['border-left-width'] = zutils.getBorderWidth(json['border-left']); // NO I18N
                result['border-bottom-width'] = zutils.getBorderWidth(json['border-bottom']); // NO I18N
                result['border-right-width'] = zutils.getBorderWidth(json['border-right']); // NO I18N
            }
        }
        return result;
    },
    getSpacingProperties: function (key, json) {
        var result = { };
        result[key + '-top'] = 0; // NO I18N
        result[key + '-right'] = 0; // NO I18N
        result[key + '-left'] = 0; // NO I18N
        result[key + '-bottom'] = 0; // NO I18N

        if (json) {
            if (json[key]) {
                result[key + '-top'] = result[key + '-right'] = result[key + '-left'] = result[key + '-bottom'] = parseInt(json[key] || 0); // NO I18N
            } else {
                result[key + '-top'] = parseInt(json[key + '-top'] || 0); // NO I18N
                result[key + '-right'] = parseInt(json[key + '-right'] || 0); // NO I18N
                result[key + '-left'] = parseInt(json[key + '-left'] || 0); // NO I18N
                result[key + '-bottom'] = parseInt(json[key + '-bottom'] || 0); // NO I18N
            }
        }
        return result;
    }
}

var canvasObjUtils = {
    hasExternalutils: typeof $u !== 'undefined', // NO I18N
    hasExternalFramework: typeof $L !== 'undefined'  // NO I18N
}
canvasObjUtils._ = {
    filter: function (obj, iterator) {
        if (obj) {
            if (obj.filter !== Array.prototype.filter && obj.toArray) {
                obj = obj.toArray();
            }
            return obj.filter(iterator);
        }
        return [];
    },
    map: function (obj, iterator) {
        if (obj) {
            if (obj.map !== Array.prototype.map && obj.toArray) {
                obj = obj.toArray();
            }
            return obj.map(iterator);
        }
        return [];
    },
    isArray: Array.isArray,
    find: function (obj, iterator) {
        if (obj) {
            if (obj.find !== Array.prototype.find && obj.toArray) {
                obj = obj.toArray();
            }
            return obj.find(iterator);
        }
        return [];
    },
    keys: Object.keys,
    sortBy: canvasObjUtils.hasExternalutils ? $u.sortBy : _.sortBy,
    uniq: canvasObjUtils.hasExternalutils ? $u.uniq : _.uniq,
    isString: canvasObjUtils.hasExternalutils ? $u.isString : _.isString,
    debounce: canvasObjUtils.hasExternalFramework ? $L.debounce : _.debounce,
    extend: canvasObjUtils.hasExternalFramework ? $L.extend : _.extend,
    min: canvasObjUtils.hasExternalutils ? $u.min : _.min,
    max: canvasObjUtils.hasExternalutils ? $u.max : _.max,
    defaults: canvasObjUtils.hasExternalutils ? $u.defaults : _.defaults,
    groupBy: canvasObjUtils.hasExternalutils ? $u.groupBy : _.groupBy,
    difference: canvasObjUtils.hasExternalutils ? $u.difference : _.difference,
    clone: canvasObjUtils.hasExternalutils ? $u.clone : _.clone,
    isEmpty: canvasObjUtils.hasExternalutils ? $u.isEmpty : _.isEmpty,
    intersection: canvasObjUtils.hasExternalutils ? $u.intersection : _.intersection
};

(function () {
    var viewOverlap = {
        overlapAdjustment: function (json) {
            var allElements = json.children;
            var allElmentsLen = allElements.length;
            for (var i = 0; i < allElmentsLen; i++) {
                var selectedElement = allElements[i];
                var selectedElementOverLeft = Math.abs(selectedElement.ui.value.position.overLeft) || 0;
                var selectedElementOverTop = Math.abs(selectedElement.ui.value.position.overTop) || 0;
                var selectedElementOver = Math.abs(selectedElement.ui.value.position.overWidth) || 0;

                var h = selectedElement.ui.value.position.height - selectedElementOverTop;
                var w = selectedElement.ui.value.position.width - selectedElementOverLeft - selectedElementOver;

                var selectedElementLeft = selectedElement.ui.value.position.startX + selectedElementOverLeft;
                var selectedElementRight = selectedElementLeft + w;
                var selectedElementTop = selectedElement.ui.value.position.startY + selectedElementOverTop;
                var selectedElementBottom = selectedElementTop + h;
                for (var j = 0; j < allElmentsLen; j++) {
                    if (i === j) {
                        continue;
                    }
                    var checkingElement = allElements[j];
                    var checkingElementOverLeft = Math.abs(checkingElement.ui.value.position.overLeft) || 0;
                    var checkingElementOverTop = Math.abs(checkingElement.ui.value.position.overTop) || 0;
                    var checkingElementOver = Math.abs(checkingElement.ui.value.position.overWidth) || 0;

                    var cH = checkingElement.ui.value.position.height - checkingElementOverTop;
                    var cW = checkingElement.ui.value.position.width - checkingElementOverLeft - checkingElementOver;

                    var left = checkingElement.ui.value.position.startX + checkingElementOverLeft;
                    var right = left + cW;
                    // eslint-disable-next-line zstandard/no-reserved-words
                    var top = checkingElement.ui.value.position.startY + checkingElementOverTop;
                    var bottom = top + cH;


                    if (left < selectedElementRight && right > selectedElementLeft && (top > selectedElementTop && top < selectedElementBottom) ||
                        selectedElementLeft < right && selectedElementRight > left && (selectedElementTop > top && selectedElementTop < bottom) ||
                        left > selectedElementLeft && left < selectedElementRight && (top < selectedElementBottom && bottom > selectedElementTop) ||
                        selectedElementLeft > left && selectedElementLeft < right && (selectedElementTop < bottom && selectedElementBottom > top)) {

                        if (top < selectedElementTop && bottom < selectedElementBottom) {
                            // Top side
                            var diff = bottom - selectedElementTop;
                            var newOverTop = diff + selectedElementOverTop;
                            if (selectedElement.ui.value.position.overTop && newOverTop > -selectedElement.ui.value.position.overTop || !selectedElement.ui.value.position.overTop) {
                                selectedElement.ui.value.position.overTop = -newOverTop;
                            }
                        }
                        else if (left > selectedElementLeft && right > selectedElementRight) {
                            //right side
                            var diff = selectedElementRight - left;
                            var newOverLeft = diff + checkingElementOverLeft;
                            if (checkingElement.ui.value.position.overLeft && newOverLeft > -checkingElement.ui.value.position.overLeft || !checkingElement.ui.value.position.overLeft) {
                                checkingElement.ui.value.position.overLeft = - newOverLeft;
                            }
                        } else if (top > selectedElementTop && bottom > selectedElementBottom) {
                            //bottom side 
                            var diff = selectedElementBottom - top;
                            var newOverTop = diff + checkingElementOverTop;
                            if (checkingElement.ui.value.position.overTop && newOverTop > -checkingElement.ui.value.position.overTop || !checkingElement.ui.value.position.overTop) {
                                checkingElement.ui.value.position.overTop = - newOverTop;
                            }
                        } else if (left < selectedElementLeft && right < selectedElementRight) {
                            //Left side
                            var diff = right - selectedElementLeft;
                            var newOverLeft = diff + selectedElementOverLeft;
                            if (selectedElement.ui.value.position.overLeft && newOverLeft > -selectedElement.ui.value.position.overLeft || !selectedElement.ui.value.position.overLeft) {
                                selectedElement.ui.value.position.overLeft = -newOverLeft;
                            }
                        } else {
                            // eslint-disable-next-line no-lonely-if
                            if (bottom >= selectedElementBottom) {
                                var diff = selectedElementBottom - top;
                                if (checkingElement.ui.value.position.overTop && diff > -checkingElement.ui.value.position.overTop || !checkingElement.ui.value.position.overTop) {
                                    checkingElement.ui.value.position.overTop = -diff;
                                }
                            } else if (selectedElementBottom >= bottom) {
                                var diff = bottom - selectedElementTop;
                                if (selectedElement.ui.value.position.overTop && diff > -selectedElement.ui.value.position.overTop || !selectedElement.ui.value.position.overTop) {
                                    selectedElement.ui.value.position.overTop = -diff;
                                }
                            }
                        }

                    }
                }
            }
        }
    }
    var jsonCreation = (function () {
        function nodesJson(selectNode, compressed) {
            // var nodesJson = [];
            var eachNodeJson = createJson(selectNode);
            viewOverlap.overlapAdjustment(eachNodeJson);
            // nodesJson.push(eachNodeJson);
            if (compressed) {
                eachNodeJson = compressJson(eachNodeJson, ['id', 'datatype', '_type', 'ui', 'theme', 'name', 'tabrelatedlistid', 'subformid', 'sectionId', 'personalityName', 'relatedList']); // NO I18N
            }
            return eachNodeJson;
        }

        function compressJson(json, key, callback, removecustom) {
            var resultjson = { };
            var keylen = key.length;
            var ui = json.ui;
            zutils.compressioncallback && zutils.compressioncallback(json, null, removecustom);

            for (var i = 0; i < keylen; i++) {
                if (json[key[i]]) {
                    resultjson[key[i]] = json[key[i]];
                }
            }
            for (var property in ui) {
                var currentObj = ui[property];
                delete currentObj.tagname;
            }
            // if(json.ui.value && json.ui.value.tagname){
            // 	delete json.ui.value.tagname;
            // }
            // eslint-disable-next-line webperf/no-multipleDOMLookup
            var childlen = json.children && json.children.length;
            var childrendata = []
            for (var i = 0; i < childlen; i++) {
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                childrendata.push(compressJson(json.children[i], key, callback, removecustom));
            }
            callback && callback(resultjson);
            resultjson.children = childrendata;
            return resultjson;
        }

        function getStyles() {
            return ["color", "backgroundImage", "backgroundColor", "fontFamily", "fontSize", "fontWeight", "textTransform", "textDecoration", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop", "marginLeft", "marginBottom", "marginRight", "borderBottom", "borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderColor", "borderLeft", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRight", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderStyle", "borderTop", "borderTopColor", "borderTopStyle", "borderTopWidth", "borderWidth", "boxShadow", "borderRadius"];	 // NO I18N
        }
        function constructValue(node) {
            var obj = { };
            var style = createStyle(node);
            obj.style = style;
            if (node.hasClass("zcanvas-field") || node.hasClass("editor") || node.hasClass("zcanvas-editor-outer") || node.hasClass("zclayout") || node.hasClass('zcanvas-editor') || node.hasClass('zcanvas-static-editor')) {
                var position = createPosition(node);
                obj.position = position;
            }

            if (node.attr("fixed") === "true" || node.attr("data-fixed-x") === "true" && node.attr("data-fixed-y") === "true") {//NO I18N
                obj.fixed = true;
            } else if (node.attr("data-fixed-x") === "true") {
                obj.fixedWidth = true;
            } else if (node.attr("data-fixed-y") === "true") {
                obj.fixedHeight = true;
            }
            obj.tagname = node.prop("tagName");//NO I18N
            obj.class = node.data("zcanvasclass");//NO I18N
            //		obj.children = [];
            var ndata = node.data('zcanvasdata'); // NO I18N
            if (ndata) {
                if (ndata.name) {
                    obj.zcode = { };
                    obj.zcode.name = ndata.name;
                }
                if (ndata.systemid) {
                    obj.system_id = ndata.systemid;
                }
            }

            // Apply fixed for this elements
            var nodeDatavalue = node.zdata();
            if (nodeDatavalue && nodeDatavalue.length && node.is('.zcanvas-field')) {
                var nodevalue = nodeDatavalue[0];
                var isImage = nodevalue && nodevalue.zctype && nodevalue.zctype.toLowerCase().indexOf("profileimage") > -1;
                //	var isButton = nodevalue && nodevalue.zctype && nodevalue.zctype.toLowerCase().indexOf("button") > -1;
                //				if( isImage || isButton ){ // nodevalue.zctype.toLowerCase().indexOf("image") > -1 todo
                if (isImage) {
                    obj.fixed = true;
                }
                if (obj.style && !obj.style.default || isImage) {
                    obj.style.default = { };
                    if (isImage) {
                        var imagestyles = ['_order', '_name_', '_classstyle_', '_show_', '_hide_']; // NO I18N
                        var imstlen = imagestyles.length;

                        // FIXME: Needs to be handled using config outside canvas
                        for (var stylekey in obj.style) {
                            if (stylekey === 'default') { // NO I18N
                                continue;
                            }
                            var _allstyles = { };

                            for (var _i = 0; _i < imstlen; _i++) {
                                if (obj.style[stylekey].hasOwnProperty(imagestyles[_i])) {
                                    _allstyles[imagestyles[_i]] = obj.style[stylekey][imagestyles[_i]];
                                }
                            }

                            obj.style[stylekey] = _allstyles;
                        }
                    }

                }
            }

            return obj;
        }

        function createJson(node) {
            node = $(node);
            var eachNodeJson = { };
            eachNodeJson.ui = { };
            eachNodeJson.ui.value = constructValue(node);
            eachNodeJson.children = [];

            if (node.is(".zcanvas-field:not(.zclayout)") && !node.hasClass("zcanvas-merged-node") || node.hasClass("zcanvas-holder")) {
                eachNodeJson = copydata(eachNodeJson, node);
                var _type = eachNodeJson._type;
                var holder = node.find(".zcanvas-holder");//NO I18N
                var field = node.find(".zcanvas-value-container");//NO I18N
                // eslint-disable-next-line zstandard/no-reserved-words
                var label = node.find(".zcanvas-label");//NO I18N
                if (holder.length > 0) {
                    eachNodeJson.ui.holder = constructValue(holder);
                }
                if (field.length > 0) {
                    eachNodeJson.ui.field = constructValue(field);
                }
                if (label.length > 0) {
                    if (node.hasClass('zccbuttonicon')) {
                        eachNodeJson.ui.icon = constructValue(label);
                        eachNodeJson.ui.icon.icon = label.attr('zc-icon'); // NO I18N
                    } else {
                        eachNodeJson.ui.label = constructValue(label);
                    }

                }
                //				if(_type == "action"){//NO I18N
                //					eachNodeJson.ui.value.fixed = true;
                //				}
                eachNodeJson._type = _type; // NO I18N
            } else if (node.hasClass("zcanvas-seperator")) {
                eachNodeJson._type = "separator"; // NO I18N
                var val = node.html();
                eachNodeJson.ui.value.value = val;
                eachNodeJson.zcanvasId = node.attr('id'); // NO I18N
            } else {

                if (node.hasClass("zcanvas-merged-node")) {
                    eachNodeJson._type = "merge-field"; // NO I18N
                } else if (node.hasClass("zcanvas-editor") && !node.hasClass("zclayout")) {
                    // eachNodeJson.customComponent = true;
                    eachNodeJson._type = "component";//NO I18N
                    eachNodeJson.theme = 'Custom Layout'; // NO I18N
                    // eachNodeJson.elm = $(node);
                    eachNodeJson.zcanvasId = node.attr('id'); //NO I18N
                    var compmeta = node.data('zccompmeta'); // NO I18N
                    if (compmeta) {
                        for (var key in compmeta) {
                            eachNodeJson[key] = compmeta[key];
                        }
                    }
                } else if (node.hasClass("zcanvas-static-editor")) {
                    eachNodeJson._type = "component"; // NO i18N 
                    eachNodeJson.relatedList = true;
                    eachNodeJson.theme = 'Custom Layout'; // NO I18N
                    // eachNodeJson.customComponent = true;
                    eachNodeJson.ui.value.relatedList = true;

                    //	var nodedata = node.data('zcanvas') || {}; // NO i18N 
                    eachNodeJson.zcanvasId = node.attr('id'); // NO I18N
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    eachNodeJson.children = zcanvasrelatedList.toJson(node, eachNodeJson);
                    // eachNodeJson.statichtml = zcanvasrelatedList.toView(eachNodeJson , nodedata, nodedata.template);
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    //	eachNodeJson.children[0]._type = 'relatedlist';// NO i18N
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    //	eachNodeJson.children[0].id = nodedata.id;// NO i18N 
                    // if(node.has('.zc-noneditable-rl').length){
                    // 	eachNodeJson.children[0].theme = 'Table Layout';// NO i18N
                    // 	eachNodeJson.children[0].children = [];
                    // 	eachNodeJson.children[0].ui = { value: { position: jsonCreation.getposition(node.find('.zc-noneditable-rl')), style: {} } };
                    // } 
                    return eachNodeJson;
                } else if (node.hasClass("zclayout")) {
                    eachNodeJson.layoutComponent = true;
                    var layoutname = node.attr('data-layoutname'); // NO i18N
                    var layoutinstance = zclayout.prototype.layouts[layoutname];
                    var resultjson = layoutinstance.toJson(node, eachNodeJson);
                    var layoutstyle = node.data('layoutstyle'); // NO i18N
                    if (layoutstyle) {
                        eachNodeJson.ui.value.layoutstyle = layoutstyle;
                    }
                    if (resultjson.length) {
                        // eslint-disable-next-line webperf/no-multipleDOMLookup
                        eachNodeJson.children = resultjson;
                    } else {
                        eachNodeJson = resultjson;
                    }
                    eachNodeJson.theme = layoutname;
                    eachNodeJson._type = 'component'; //NO I18N
                    eachNodeJson.zcanvasId = eachNodeJson.zcanvasId || node.attr('id'); //NO I18N
                    return eachNodeJson;
                } else if (node.hasClass("zcanvas-row-separator")) {
                    eachNodeJson._type = "rows"; // NO I18N
                } else if (node.hasClass("zcanvas-editor-outer")) {
                    eachNodeJson._type = "pagecomponent";//NO I18N
                }

                if (node.hasClass("zcanvas-editor") || node.hasClass("zcanvas-editor-outer") || node.hasClass("zcanvas-merged-node") || node.hasClass("zcanvas-holder") || node.hasClass("zcanvas-row-separator")) {
                    var children = node.children(".zcanvas:not(.zcanvas-ignore)");//NO I18N
                    var siblings = [];
                    var childlen = children.length;
                    for (var i = 0; i < childlen; i++) {
                        siblings.push(createJson(children[i]));
                    }
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    eachNodeJson.children = siblings;
                }
            }
            viewOverlap.overlapAdjustment(eachNodeJson);
            return eachNodeJson;
        }



        function createJsonNew(node) {
            node = $(node);
            //		var style = createStyle(node);
            var eachNodeJson = { };
            eachNodeJson.ui = { };
            eachNodeJson.ui.value = constructValue(node);

            //		eachNodeJson.ui.value.style = style;
            //		if(node.hasClass("zcanvas-field") || node.hasClass("editor") || node.hasClass("zcanvas-editor-outer") || node.hasClass("zclayout") || node.hasClass('zcanvas-editor') || node.hasClass('zcanvas-static-editor')) {
            //			var position = createPosition(node);
            //			eachNodeJson.ui.value.position = position;	
            //		}
            //		eachNodeJson.ui.value.tagname = node.prop("tagName");//NO I18N
            //		eachNodeJson.ui.value.class =  node.data("zcanvasclass");//NO I18N
            eachNodeJson.children = [];

            if (node.hasClass("zcanvas-inner-component")) {
                var parentNodeData = node.zdata()[0];//NO I18N
                if (node.hasClass("zcanvas-label")) {
                    eachNodeJson._type = "label";//NO I18N
                    eachNodeJson.label = parentNodeData.label;
                } else if (node.hasClass("zcanvas-value-container")) {
                    var isOnlyValue = node.is('.zcanvas-data-node'); // NO I18N
                    if (!node.parent('.zcanvas-holder').length || isOnlyValue) { //NO I18N
                        eachNodeJson = copydata(eachNodeJson, node);
                    }
                    if (isOnlyValue) {
                        eachNodeJson.dataHolder = true;
                        eachNodeJson._type = "field-holder";//NO I18N
                    }
                    // eachNodeJson._type = "field";//NO I18N
                    // TODO: Must have confirmation
                    // 'FIXME: This is a quick fix, the value should come from zcfieldtype
                    eachNodeJson._type = parentNodeData.type;
                    eachNodeJson.value = parentNodeData.value;
                }
            } else if (node.hasClass("zcanvas-seperator")) {
                var val = node.html();
                // FIXME: to separator after list view revamp
                var nodetype = "separator";//NO I18N
                eachNodeJson.ui.value.value = val;
                eachNodeJson.zcanvasId = node.attr('id'); // NO I18N
                eachNodeJson._type = nodetype;
            } else {
                var children = node.children(".zcanvas");//NO I18N
                var siblings = [];
                if (node.hasClass("zcanvas-holder") || node.hasClass('zcanvas-data-node')) {
                    var valueNode = node.find(".zcanvas-value-container");//NO I18N
                    var labelNode = node.find(".zcanvas-label");//NO I18N
                    eachNodeJson = copydata(eachNodeJson, node);
                    eachNodeJson.dataHolder = true;
                    eachNodeJson._type = "field-holder";//NO I18N
                    eachNodeJson.ui.holder = eachNodeJson.ui.value;
                    delete eachNodeJson.ui.value;
                    eachNodeJson.ui.value = constructValue(valueNode);
                    if (labelNode) {
                        eachNodeJson.ui.label = constructValue(labelNode);
                    }
                }
                if (node.hasClass("zcanvas-editor")) {
                    // eachNodeJson.customComponent = true;
                    eachNodeJson._type = "component";//NO I18N
                    eachNodeJson.theme = 'Custom Layout'; // NO I18N
                    // eachNodeJson.elm = $(node);
                    eachNodeJson.zcanvasId = node.attr('id'); //NO I18N
                }
                if (node.hasClass("zcanvas-static-editor")) {
                    eachNodeJson._type = "component"; // NO i18N 
                    eachNodeJson.relatedList = true;
                    eachNodeJson.theme = 'Custom Layout'; // NO I18N
                    // eachNodeJson.customComponent = true;
                    eachNodeJson.ui.value.relatedList = true;
                    var nodedata = node.data('zcanvas') || { }; // NO i18N 
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    eachNodeJson.children = [nodedata.data];
                    eachNodeJson.statichtml = nodedata.template;
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    eachNodeJson.children[0]._type = 'relatedlist';// NO i18N
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    eachNodeJson.children[0].id = nodedata.id;// NO i18N 
                    if (node.has('.zc-noneditable-rl').length) {
                        // eslint-disable-next-line webperf/no-multipleDOMLookup
                        eachNodeJson.children[0].theme = 'Table Layout';// NO i18N
                        // eslint-disable-next-line webperf/no-multipleDOMLookup
                        eachNodeJson.children[0].children = [];
                        // eslint-disable-next-line webperf/no-multipleDOMLookup
                        eachNodeJson.children[0].ui = { position: jsonCreation.getposition(node.find('.zc-noneditable-rl')), style: { } };
                    }
                    eachNodeJson.zcanvasId = node.attr('id'); // NO I18N
                    return eachNodeJson;
                }
                if (node.hasClass("zcanvas-merged-node")) {
                    eachNodeJson._type = "merge-field"; // NO I18N
                } else if (node.hasClass("zcanvas-field") && !node.hasClass("zcanvas-merged-node")) {
                    eachNodeJson._type = "field"; // NO I18N
                } else if (node.hasClass("zcanvas-row-separator")) {
                    eachNodeJson._type = "rows"; // NO I18N
                } else if (node.hasClass("zcanvas-editor-outer")) {
                    eachNodeJson._type = "pagecomponent";//NO I18N
                }
                if (node.hasClass("zclayout")) {
                    eachNodeJson.layoutComponent = true;
                    var layoutname = node.attr('data-layoutname'); // NO i18N
                    var layoutinstance = zclayout.prototype.layouts[layoutname];
                    var resultjson = layoutinstance.toJson(node);
                    var layoutstyle = node.data('layoutstyle'); // NO i18N
                    if (layoutstyle) {
                        eachNodeJson.ui.value.layoutstyle = layoutstyle;
                    }
                    if (resultjson.length) {
                        // eslint-disable-next-line webperf/no-multipleDOMLookup
                        eachNodeJson.children = resultjson;
                    } else {
                        eachNodeJson = resultjson;
                    }
                    eachNodeJson.theme = layoutname;
                    eachNodeJson._type = 'component'; //NO I18N
                    return eachNodeJson;
                }
                var childlen = children.length;
                for (var i = 0; i < childlen; i++) {
                    siblings.push(createJson(children[i]));
                }
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                eachNodeJson.children = siblings;
            }

            return eachNodeJson;
        }

        function copydata(eachNodeJson, node) {
            var nodeData = node.zdata()[0];//NO I18N
            if (!nodeData) {
                nodeData = node.data('zcanvas') || { }; // NO I18N
            }
            for (key in nodeData) {
                eachNodeJson[key] = nodeData[key];
            }
            return eachNodeJson;
        }

        function CanvasRound(num, decimal_threshold) {
            var decimal_part = num - Math.floor(num);
            if (decimal_part >= decimal_threshold) {
                return Math.ceil(num);
            } else {
                return Math.floor(num);
            }
        }

        function createPosition(node) {

            var nodeParent = node.parent();//NO I18N
            var position = { };
            // if(node.hasClass("zcanvas-field") && !node.hasClass('zcanvas-no-img-default')){
            // 	var nodeWidth = Math.floor(node.width());
            // 	var nodeHeight = Math.floor(node.height());
            // } else 

            //	node.removeClass('ui-draggable-dragging'); // NO I18N
            if (node.hasClass("zcanvas-editor-outer")) {//NO I18N
                var nodeWidth = CanvasRound(node.width(), 0.9);
                var nodeHeight = CanvasRound(node.outerHeight(), 0.9);
            } else {
                var nodeWidth = CanvasRound(node.outerWidth(), 0.9);
                var nodeHeight = CanvasRound(node.outerHeight(), 0.9);
            }
            //  if(nodeParent.hasClass("zcanvas-editor") || nodeParent.hasClass("zcanvas-editor-outer")){//NO I18N
            //  	var paddingLeft = parseInt(nodeParent.css("paddingLeft"));//NO I18N
            //  	var paddingTop = parseInt(nodeParent.css("paddingTop"));//NO I18N

            //  	position.startX = Math.floor(node.position().left);
            //  	position.startY = Math.floor(node.position().top);
            //  } else {
            // 	position.startX = Math.floor(node.position().left);
            // 	position.startY = Math.floor(node.position().top);
            //  }
            position.startX = CanvasRound(node.position().left, 0.9);
            position.startY = CanvasRound(node.position().top, 0.9);

            position.endX = CanvasRound(node.position().left + nodeWidth, 0.9);
            position.width = nodeWidth;
            position.height = nodeHeight;
            var depth = node.css('z-index'); // NO I18N
            position.depth = isNaN(parseInt(depth)) ? 1 : parseInt(depth);
            if (node.hasClass("zcanvas-editor") || node.hasClass("zcanvas-static-editor")) {//NO I18N
                var childrenNodes = $(node).children(".zcanvas");
                if (childrenNodes.length > 0) {
                    var closestNodeTop = canvasObjUtils._.min(childrenNodes, function (n) { return $(n).position().top });
                    var closestNodeLeft = canvasObjUtils._.min(childrenNodes, function (n) { return $(n).position().left });

                    var paddingTop = $(closestNodeTop).position().top;
                    var paddingLeft = $(closestNodeLeft).position().left;
                    if (paddingTop > 0) {
                        position.minTop = CanvasRound(paddingTop, 0.9);
                    }
                    if (paddingLeft > 0) {
                        position.minLeft = CanvasRound(paddingLeft, 0.9);
                    }
                }
            }
            if (node.hasClass("grid-stack-item-content")) {
                var nodeParent = node.parents(".grid-stack-item");//NO I18N
                var nodeMaxWidth = parseInt(nodeParent.css("maxWidth"));//NO I18N
                var nodeMaxHeight = parseInt(nodeParent.css("maxHeight"));//NO I18N
                position.maxHeight = nodeMaxHeight;
                position.maxWidth = nodeMaxWidth;
                position.startX = nodeParent.position().left
                position.startY = nodeParent.position().top;
            }
            if (node.hasClass("zcanvas-editor-outer")) {//NO I18N
                position.startX = 0;
                position.startY = 0;
            }
            if (node.hasClass('zcanvas-locked-element')) { // NO I18N
                position._locked_ = 'true'; // NO I18N
            }

            return removeEmptyKeys(position, true);
        }

        // function createStyle2(node){
        // 	var style = {};
        // 	var styleProperties = node[0].style;

        // 	var availbalestyles = getStyles();
        // 	var stylelen = availbalestyles.length;
        // 	for (var i = 0 ; i < stylelen ; i ++){
        // 		style[availbalestyles[i]] = styleProperties[availbalestyles[i]];
        // 	}

        // 	if(node.hasClass("zcanvas-editor-outer")){ // NO I18N
        // 		style.fontSize = node.css("font-size");//NO I18N
        // 		style.fontFamily = node.css("font-family");//NO I18N
        // 	}


        // 	var nodeDatavalue = node.zdata();
        // 	if(nodeDatavalue && nodeDatavalue.length){
        // 		var nodevalue = nodeDatavalue[0];
        // 		if((nodevalue && nodevalue.zctype.toLowerCase().indexOf("image") > -1) || (nodevalue && nodevalue.zctype.toLowerCase().indexOf("button") > -1)) { // nodevalue.zctype.toLowerCase().indexOf("image") > -1 todo
        // 			style.width = parseInt(styleProperties.width);
        // 			style.height = parseInt(styleProperties.height);			
        // 		}	
        // 	}


        // 	return removeEmptyKeys(style);
        // }

        function createStyle(node) {
            var inst = jsonCreation.toolinst;
            var selector = inst.getSelectorByElement(node, 'default', false, true); // NO I18N
            var styles = zutils.zcopyobj2(inst.getstylebyselector(selector, null, true));

            /*			var nodeDatavalue = node.zdata();
                        if(nodeDatavalue && nodeDatavalue.length && node.is('.zcanvas-field')){
                            var nodevalue = nodeDatavalue[0];
                            var isImage = nodevalue && nodevalue.zctype && nodevalue.zctype.toLowerCase().indexOf("profileimage") > -1;
                            var isButton = nodevalue && nodevalue.zctype && nodevalue.zctype.toLowerCase().indexOf("button") > -1;
                            if( isImage || isButton ){ // nodevalue.zctype.toLowerCase().indexOf("image") > -1 todo
                                var styleProperties = node[0].style;
                                if(styles && !styles.default || isImage){
                                    styles.default = {};
                                }
                                // eslint-disable-next-line webperf/layout-thrashing
                                styles.default.width = parseInt(styleProperties.width) + 'px';
                                // eslint-disable-next-line webperf/layout-thrashing
                                styles.default.height = parseInt(styleProperties.height) + 'px';			
                            }	
                        } */

            return styles;
        }


        function removeEmptyKeys(json, zeroAllow) {
            var returnJson = { };
            for (key in json) {
                var value = json[key];
                if (zeroAllow) {
                    // eslint-disable-next-line zstandard/no-duplicate-null-check, eqeqeq
                    if (value != undefined && value != null) {
                        returnJson[key] = json[key];
                    }
                    // eslint-disable-next-line eqeqeq
                } else if (value && value != 0) {
                    returnJson[key] = json[key];
                }

            }
            return returnJson
        }

        return {
            createJson: nodesJson,
            createJsonNew: createJsonNew,
            styleAttribute: getStyles,
            compress: compressJson,
            getposition: createPosition,
            getstyles: createStyle,
            getValue: constructValue
        };
    })();

    window.jsonCreation = jsonCreation;

})();

(function () {
    var zclayout = function (uniquekey, filter) {
        this.getlayouts = function () {
            var resultlayouts = [];
            var layouts = zclayout.prototype.layouts;
            for (var key in layouts) {
                if (layouts.hasOwnProperty(key)) {
                    var result = {
                        label: layouts[key].getLabelHtml && layouts[key].getLabelHtml() || key,
                        datatype: 'layout', // NO I18N
                        templateHtml: layouts[key].gethtml()
                    }
                    result[uniquekey] = zutils.getRandomId();
                    if (filter) {
                        if (filter.indexOf(key) > -1) {
                            resultlayouts.push(result);
                        }
                    } else {
                        resultlayouts.push(result);
                    }
                }
            }
            return resultlayouts;

        }
        return this.getlayouts();
    }
    zclayout.prototype.layouts = [];
    window.zclayout = zclayout;
})();

/**
 * Simple data handler for canvas which takes the randomly generated from the holder and handle value for the id
 * PURPOSE: instead of loading the data to the dom and we can store it in the variable to safe access.
 */
(function ($) {
    $.fn.zdata = function (value) {
        // Return if any other than zcanvas holder
        // Create a variable if not exists
        if (!window.zcanvasdata) {
            window.zcanvasdata = { };
        }

        var id = zutils.getzdataIds(this);

        // add data to the particular id and retrive it 
        if (value && id && id !== 'undefined') {
            var getId = id[0];
            window.zcanvasdata[getId] = value;
        } else {
            if (!id) {
                return;
            }
            var values = canvasObjUtils._.map(id, function (value) {
                return window.zcanvasdata[value]
            });
            return values;
        }
    };

    $.fn.zaddClass = function (value) {
        var element = $(this);
        if (!jsonCreation || !jsonCreation.toolinst) {
            return element;
        }
        var oldvalue = element.attr('data-zcanvasclass'); //NO I18N
        var newvalue = oldvalue || value;
        if (value && oldvalue) {
            var vclasses = canvasObjUtils._.isArray(value) ? value : value.split(" ");
            var vlen = vclasses.length;
            var valuec = [];
            for (var i = 0; i < vlen; i++) {
                if (!(oldvalue.indexOf(vclasses[i]) > -1) && !(valuec.indexOf(vclasses[i]) > -1)) {
                    valuec.push(vclasses[i]);
                }
            }
            value = valuec.join(" ").trim();
        }
        if (oldvalue) {
            var classes = oldvalue.split(" ");
            if (classes.indexOf(value) < 0) {
                classes.push(value);
                newvalue = classes.join(" ").trim();
            }
        }
        element.attr('data-zcanvasclass', newvalue); //NO I18N
        element.data('zcanvasclass', newvalue); //NO I18N
        return element;
    };
    $.fn.zremoveClass = function (value) {
        if (!value) {
            value = '';
        }
        var element = $(this);
        var valuesplit = value.split(" ");
        var splitlen = valuesplit.length;
        if (splitlen > 1) {
            for (var i = 0; i < splitlen; i++) {
                element.zremoveClass(valuesplit[i]);
            }
            return element;
        }
        var oldvalue = element.attr('data-zcanvasclass'); //NO I18N
        var newvalue = oldvalue;
        if (oldvalue) {
            var classes = canvasObjUtils._.isArray(oldvalue) ? oldvalue : oldvalue.split(" ");
            var itemIndex = classes.indexOf(value)
            if (itemIndex > -1) {
                classes.splice(itemIndex, 1);
                newvalue = classes.join(" ");
            }
        }
        element.attr('data-zcanvasclass', newvalue); //NO I18N
        element.data('zcanvasclass', newvalue); //NO I18N
        return element;
    };
    $.fn.zremoveClassexp = function (method) {
        var element = $(this);
        var oldvalue = element.attr('data-zcanvasclass'); //NO I18N
        if (oldvalue) {
            var classes = canvasObjUtils._.isArray(oldvalue) ? oldvalue : oldvalue.split(" ");
            var classname = classes.reduce(function (t, v, i) {
                return method(i.v);
            })
            element.zremoveClass(classname);
        }
        return element;
    }
    $.fn.zhasClass = function (value) {
        var element = $(this);
        var oldvalue = element.attr('data-zcanvasclass'); //NO I18N
        if (oldvalue) {
            var classes = oldvalue.split(" ");
            if (classes.indexOf(value) > -1) {
                return true;
            }
        }
        return false;
    };
    $.fn.ztoggleClass = function (value) {
        if (this.zhasClass(value)) {
            this.zremoveClass(value);
        } else {
            this.zaddClass(value);
        }
    }
    $.fn.zremove = function () {
        var $el = $(this);
        $el.off();
        var $data = $el.data();
        if ($data) {
            for (var key in $data) {
                if ($data[key] && typeof $data[key].destroy === 'function') {
                    $data[key].destroy();
                }
                if (key === 'zcanvas' && $data[key]) {
                    $data[key].container = null;
                    if ($data[key].selectable) {
                        $data[key].selectable.area = null;
                        $data[key].selectable = null;
                    }
                }
                if ($data[key]) {
                    delete $data[key];
                }

            }
        }
        $el.remove();
    }

    $.fn.zcss = function (value) {
        var element = $(this);
        var style = element.attr('style') || ''; // NO I18N
        var result = '';
        var regex = new RegExp('(' + value + ':?.*?\\;)', 'g');
        var mx = style.match(regex);
        if (mx && mx.length) {
            var rx = new RegExp('(' + value + ':)', 'g');
            result = mx[0].replace(rx, '').replace(/(;)/, '').trim('');
        }
        return result;
    }

    $.fn.zccss = function (style, noimportant, exinst, flag) {
        var inst = exinst || $('.zcanvas-editor-outer').data('zcanvas');
        if (inst) {
            inst = exinst || inst.config.toolsRef;
        } else {
            return;
        }
        if (canvasObjUtils._.isString(this)) {
            inst.applyjsontostyle(this, style, true, noimportant, true, false, flag);
        } else {
            $(this).each(function () {
                inst.applyjsontostyle($(this), style, true, noimportant, true, false, flag);
            })
        }

    }

    $.fn.zhtml = function (html) {
        if (this[0] && typeof html === 'string') { // NO I18N
            this[0].innerHTML = html;
        } else {
            $(this).html(html);
        }
    }

    $.fn.zappend = function (html) {
        $(this).append(html);
    }
})(jQuery);

(function () {
    zclayout.prototype.layouts["Tab Layout"] = new function () {

        var self_ = this;

        var template = '<div style="height:300px" class="zclayout zctablayout zcanvas" data-layoutname="Tab Layout" data-zc-min-force="200" data-zc-min-width="180">\
                            <div class="zc-tablist-container zcanvas-cancel-resize">\
                                <ul class="zc-tabs zcanvas zc-non-linkable zclayoutselectable" data-layout-selctabletype="Tab Bar">\
                                    <li class="tab active" data-tab="${data.id}"><span class="icon"></span><span class="tabname">Unnamed Tab</span><span class="deletetabicon"></span></li>\
                                    <li class="tabadd zcaddtab"><span>+</span></li>\
                                </ul>\
                                <span class="zc-tabs-nav">\
                                    <div class="zc-center">\
                                    <span class="zcnavleft"></span>\
                                    <span class="zcnavright"></span>\
                                    </div>\
                                </span>\
                            </div>\
                            <div class="zc-tab-container zcanvas zclayoutselectable zc-no-parentselect zcanvas-cancel-resize" data-layout-selctabletype="Tab Container">\
                                <h3 class="d_active zc-tab-heading" data-tab="${data.id}">Activity</h3>\
                                <div id="${data.zid}" class="zc-tab-content">\
                                </div>\
                            </div>\
                        </div>';

        var basetemplate = '<div class="zclayout zcanvas" data-layoutname="Tab Layout">\
                            <div class="zc-tablist-container">\
                                <ul class="zc-tabs">\
                                </ul>\
                                <span class="zc-tabs-nav">\
                                    <div class="zc-center">\
                                    <span class="zcnavleft"></span>\
                                    <span class="zcnavright"></span>\
                                    </div>\
                                </span>\
                            </div>\
                                <div class="zc-tab-container">\
                                </div>\
                            </div>';


        this.defaulttheme = { }; // NO I18N

        this.getLabelHtml = function () {
            //var html = '<div class="zcTab"><span><span class="zctabLine"></span></span><span></span><span></span></div><div class="zcTabLabel">' + I18n.getMsg('crm.canvas.builder.tab') + '</div></div></div>';//NO I18N
            return '<div class="zclisticon"><div class="zcl_container zctablayouticon"></div><div class="zcl_title">' + I18n.getMsg('crm.canvas.builder.tab') + '</div></div>'; // NO I18N
        }
        this.gethtml = function () {
            var zid = zutils.getRandomId();
            var compiledtemplate = zutils.generateTemplateString(template)({ data: { id: '#' + zid, zid: zid } });
            return compiledtemplate;
        }

        this.highlighttab = function (el) {
            var outercontainer = $('.zcanvas-editor-outer');
            var data = outercontainer.data('zcanvas'); // NO I18N
            var $closetab = el.closest('.zctablayout'); // NO I18N
            if ($closetab.length) {
                el.mouseover(function (e) {
                    data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e, true);
                }).mouseout(function (e) {
                    data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e);
                });
            }

        }

        var addnewtab = function (tabname, $container, component, flag, zid, icon, hidetext, disabled, editmode) {
            var tablist = component.children('.zc-tablist-container'); // NO I18N
            tabname = tabname ? tabname : 'Unnamed Tab'; // NO I18N
            var generateId = zid || zutils.getRandomId();
            //eslint-disable-next-line	webperf/directly-select-with-id
            var $li = $($.parseHTML('<li class="tab zctablist' + generateId + '" data-tab="#' + generateId + '">' + '<span class="icon"></span><span class="tabname"></span><span class="deletetabicon"></span>' + '</li>'));
            var $tabname = $li.find('.tabname'); // NO I18N
            $tabname.html(tabname);
            if (hidetext) {
                $tabname.hide();
            }
            if (icon) {
                var $icon = $(' <span class="zctabicons ' + icon + '" data-zcicon="' + icon + '"></span>');
                $icon.insertBefore($tabname);
                hidetext && $icon.addClass('zctabnotext');
            }
            if (disabled) {
                $tabname.addClass('zc-tab-noedit'); // NO I18N
            }
            //eslint-disable-next-line	webperf/directly-select-with-id
            var head = $($.parseHTML('<h3 class="d_active zc-tab-heading" data-tab="#' + generateId + '">' + '<span></span>' + '</h3>'));
            head.find('span').html(tabname);
            var container = $($.parseHTML('<div id="' + generateId + '" class="zc-tab-content"></div>'));
            var tabs = tablist.find('.tab'); // NO I18N
            var lasttab = tabs.last();
            if (lasttab.length) {
                $li.insertAfter(lasttab);
            } else {
                tablist.find('.zc-tabs').prepend($li);
            }
            if (disabled) {
                container.addClass('zcanvas-restricted-drop'); // NO I18N
            }
            $container.append(head).append(container);
            self_.highlighttab($li);
            $li.click(function () {
                self_.tabclickhandler.bind(this, component)();
            });
            head.click(function () {
                self_.activetabclickhandler.bind(this, component)();
            });
            // tabname.dblclick(function(e){
            //     var el = $(this);
            //     el.focus();
            //    // self_.renamefocus(el);
            //     e.stopPropagation();
            //     el.data('zc-old-text', el.text()); // NO I18N
            // });
            $tabname.blur(function () {
                var el = $(this);
                var previous = el.data('zc-old-text'); // NO I18N
                var current = el.text();
                if (previous !== current) {
                    var undoobj = {
                        action: 'layout', // NO I18N
                        instance: self_,
                        json: {
                            action: 'rename', // NO I18N
                            current: current,
                            previous: previous,
                            node: el,
                            editor: component
                        }
                    }
                    self_.savecanvasaction(undoobj);
                }

            });
            $li.find('.deletetabicon').click(function (e) {
                self_.deletetab(component, e);

            })

            !editmode && self_.tabclickhandler.bind($li, component, 'end')();
            flag || self_.configlayout(component);

            return generateId;
        }

        this.init = function (component, noconfig, undoredo, isview, zid, scope, containment, callback) {
            var $tabcont = component.children('.zc-tablist-container'); // NO I18N
            var tabcont = component.children('.zc-tab-container');  // NO I18N
            var tabcontent = tabcont.children(".zc-tab-content"); // NO I18N
            var tabhead = tabcont.children('.zc-tab-heading'); // NO I18N
            if (!noconfig) {
                var compid = component.attr('id'); // NO I18N
                if (!compid) {
                    component.attr('id', zutils.getRandomId()); // NO I18N
                }
                var zid = zutils.getRandomId();
                var tabid = '#' + zid; // NO I18N
                var firsttab = $tabcont.find('.zc-tabs .tab').first();
                self_.highlighttab(firsttab);
                var firsthead = tabhead.first();
                var firstcontent = tabcontent.first();
                firsttab.attr('data-tab', tabid).addClass('zctablist' + zid); // NO I18N
                firsthead.attr('data-tab', tabid); // NO I18N
                firstcontent.attr('id', zid); // NO I18N
                this.configlayout(component);
                component.data('layoutstyle', JSON.parse(JSON.stringify(self_.defaulttheme))); // NO I18N
            }
            var $tabcontent = tabcontent.css('display', 'none'); // NO I18N 
            $tabcontent.first().css('display', 'block'); // NO I18N
            var $tab = $tabcont.find('.tab');
            var $addbtn = $tabcont.find('.tabadd');
            var $container = tabcont;
            var $leftnav = $tabcont.find('.zcnavleft');
            var $rightnav = $tabcont.find('.zcnavright');
            // $tab.find('.tabname').dblclick(function(e){
            //     var el = $(this);
            //     el.focus();
            //  //   self_.renamefocus(el);
            //     e.stopPropagation();
            // }).blur(function(){
            //     var el = $(this);
            //     var previous = el.data('zc-old-text'); // NO I18N
            //     var current = el.text();
            //     var undoobj = {
            //         action: 'layout', // NO I18N
            //         instance: self_,
            //         json: {
            //             action: 'rename', // NO I18N
            //             current: current,
            //             previous: previous,
            //             node: el,
            //             editor: component
            //         }
            //     }
            //     self_.savecanvasaction(undoobj);
            // });
            !isview && $tab.find('.deletetabicon').click(function (e) {
                self_.deletetab(component, e);

            })
            $tab.off('click'); // NO I18N
            $tab.on('click', function () {
                self_.tabclickhandler.bind(this, component, null, callback)();
            });
            tabhead.click(function () {
                self_.activetabclickhandler.bind(this, component)();
            });
            var data = $('.zcanvas-editor-outer').data('zcanvas');
            !isview && $container.click(function (e) {
                if (!component.hasClass('zcanvas-selected-element') && !e.target.classList.contains('zctabli')) {
                    data && data.config && data.config.toolsRef && data.config.toolsRef.selectfield(e);
                }
            });
            var $hoverel = $container.add($tabcont.find('.zc-tabs')); // NO I18N
            self_.highlighttab($hoverel);


            var navtab = function (flag) {

                var parentscroll = $tabcont.find('.zc-tabs');
                var scrollPos = 0;

                if (flag) {
                    var hiddenelements = $tabcont.find('.zc-tabs li').filter(function () {
                        var $el = $(this);
                        if ($el.position().left + $el.width() > parentscroll.width()) {
                            return $el;
                        }
                    });

                    var firstelement = hiddenelements.eq(0);
                    if (firstelement && firstelement.length) {
                        var firstpos = parentscroll.width() - firstelement.position().left;
                        scrollPos = parentscroll.scrollLeft() + parentscroll.width() - firstpos;
                    } else {
                        scrollPos = parentscroll.scrollLeft() + parentscroll.width();
                    }

                } else {
                    var hiddenelements = $tabcont.find('.zc-tabs li').filter(function () {
                        var $el = $(this);
                        if ($el.position().left < 0) {
                            return $el;
                        }
                    });

                    var firstelement = hiddenelements.eq(hiddenelements.length - 1);
                    if (firstelement && firstelement.length) {
                        var firstpos = firstelement.outerWidth() + firstelement.position().left;
                        scrollPos = parentscroll.scrollLeft() - parentscroll.width() - firstpos;
                    }

                }
                // eslint-disable-next-line webperf/no-animate
                parentscroll.animate({ scrollLeft: scrollPos });
                zclayout.prototype.layouts['Tab Layout'] && zclayout.prototype.layouts['Tab Layout'].onnavigation && zclayout.prototype.layouts['Tab Layout'].onnavigation($tabcont, scrollPos);
            }

            $addbtn.click(self_.newtab.bind(null, null, $container, component, null, null));
            $leftnav.click(navtab.bind(null, false));
            $rightnav.click(navtab.bind(null, true));
            this.togglenav(component);

            if (undoredo) {
                var undoobj = {
                    action: 'layout', // NO I18N
                    instance: self_,
                    json: {
                        action: 'new', // NO I18N
                        current: canvasOutput.createJson(component),
                        editor: zutils.getParentEditor(component),
                        node: component
                    }
                }
                var undoref = self_.savecanvasaction(undoobj, undoredo);
                zutils.overlapHandling(component, undoref);
            }

        }

        this.newtab = function (tabname, $container, component, flag, zid) {
            if (component.find('.zc-tabs .tab').length > 49) {
                return;
            }
            self_.createdropdown(tabname, $container, component, flag, zid);
            event && event.stopPropagation();
        }



        this.tabclickhandler = function (component, scrolladjust, callback) {
            var $el = $(this);
            if ($el.hasClass('active')) {
                return;
            }
            var tablist = component.children('.zc-tablist-container'); // NO I18N
            var tabcontainer = component.children('.zc-tab-container'); // NO I18N
            self_.togglenav(component);
            if (scrolladjust === 'end') {
                var scrollTab = tablist.find('.zc-tabs')
                scrollTab.scrollLeft(scrollTab[0].scrollWidth);
            }
            var $tabcontent = tabcontainer.children(".zc-tab-content"); // NO I18N
            $tabcontent.hide();
            var activeTab = $el.attr("data-tab");  // NO I18N
            var $activeTab = $(activeTab);
            $activeTab.fadeIn();
            var tabinst = $activeTab.data('zcanvas'); // NO I18N
            if (tabinst && tabinst.config && tabinst.config.onTabSwitch) {
                tabinst.config.onTabSwitch($activeTab);
            }

            tablist.find('.tab').removeClass("active");
            $el.addClass("active");

            callback && callback($el);

            $tabcontent.removeClass("d_active");
            // tabcontainer.find(".zc-tab-content[data-tab^='" + activeTab + "']").addClass("d_active"); 


        }

        /**
         * Depricated
         */
        this.adjustscroll = function (el, component) {

            function isBetween(value, start, end) {
                return value >= start && value <= end;
            }

            var parentscroll = component.find('.zc-tabs');
            var element_position = el.position().left;
            var element_width = el.outerWidth();
            var viewport_height = parentscroll.width();

            if (!isBetween(element_position, 0, viewport_height)) {
                var pos = element_position + element_width - viewport_height;
                parentscroll.scrollLeft(parentscroll.scrollLeft() + pos);
            }
        }


        this.togglenav = function (component) {
            var tablist = component.children('.zc-tablist-container'); // NO I18N
            var parentscroll = tablist.find('.zc-tabs');
            var tabs = tablist.find('.zc-tabs-nav');
            // var outwidth = Math.round(parentscroll.outerWidth());
            var outwidth = parentscroll[0].offsetWidth;
            if (outwidth < parentscroll[0].scrollWidth) {
                //tabs.css('display' , 'inline'); // NO I18N
                tabs[0].style.display = 'inline'; // NO I18N
                zclayout.prototype.layouts['Tab Layout'] && zclayout.prototype.layouts['Tab Layout'].onnavigation && zclayout.prototype.layouts['Tab Layout'].onnavigation(tablist);
            } else {
                //tabs.css('display' , 'none'); // NO I18N
                tabs[0].style.display = 'none'; // NO I18N
            }
        }


        this.activetabclickhandler = function (component) {
            var $el = $(this);
            var tabcontainer = component.children('.zc-tab-container'); // NO I18N
            var $tabcontent = tabcontainer.find(".zc-tab-content");
            var tablist = component.children('.zc-tablist-container'); // NO I18N
            $tabcontent.hide();
            var d_activeTab = $el.attr("data-tab");  // NO I18N
            $("#" + d_activeTab).fadeIn();

            tabcontainer.find(".zc-tab-heading").removeClass("d_active");
            $el.addClass("d_active");

            tablist.find('.tab').removeClass("active");
            // tablist.find("zc-tabs>li[data-tab^='" + d_activeTab + "']").addClass("active");
        }


        this.configlayout = function (component) {
            var parenteditor = component.parent();
            var outinstance = parenteditor.data('zcanvas'); // NO I18N
            var mainconfig = zutils.zcopyobj(outinstance).config;
            var tablist = component.children('.zc-tablist-container'); // NO I18N
            // var selector = mainconfig.editorcontainer+" > .zcanvas:not('.ui-draggable-dragging,.zcanvas-multiselect')";//NO I18N
            // var selectorResizing = mainconfig.editorcontainer+" > .zcanvas:not('.ui-resizable-resizing,.zcanvas-multiselect')";//NO I18N
            component.not('.ui-draggable').draggable({ // NO I18N
                handle: ".zc-tab-container , .zc-tabs", // NO I18N
                containment: mainconfig.zccontainment || 'parent', // NO I18N
                zcGuide: true,
                snapTolerance: 5,
                znoposition: true,
                appendGuideTo: mainconfig.editorcontainer,
                scroll: false,
                disabled: mainconfig.alwaysdisabled,
                stop: function () {
                    outinstance.resetheight && outinstance.resetheight();
                },
                start: function (e) {
                    if (e.shiftKey) {
                        return false;
                    }
                },
                drag: function (e) {
                    if (e.shiftKey) {
                        return false;
                    }
                }
            }).resizable({ // NO I18N
                handles: "e, s, se, w, sw , n , nw , ne",//NO I18N
                classes: {
                    'ui-resizable-se': 'zcanvas-resizable-se' //No I18N
                },
                containment: "parent",//NO I18N
                zcGuide: true,
                zhandlevisible: true,
                snapTolerance: 5,
                appendGuideTo: mainconfig.editorcontainer,
                zrestricteditor: true,
                zalsoResize: '',
                znoleftalsoresize: true,
                start: function () {
                    var element = $(this);
                    var inst = element.data('uiResizable'); // NO I18N
                    var container = component.children('.zc-tab-container'); // NO I18N
                    var editors = container.children('.zcanvas-editor'); // NO I18N
                    var reditors = $('');
                    editors.each(function () {
                        var $this = $(this);
                        var el = $this.children('.zcautoratio'); // NO I18N
                        if (el && el.length) {
                            var prev = {
                                node: '#' + el.attr('id'), // NO I18N
                                action: 'resize', // NO I18N
                                editor: '#' + $this.attr('id'), // NO I18N
                                previous: {
                                    width: el[0].offsetWidth,
                                    height: el[0].offsetHeight
                                }
                            }
                            el.data('zcprev', prev); // NO I18N
                            reditors = reditors.add(el);
                        }
                    });
                    element.resizable('option', 'zalsoResize', reditors); // NO I18N
                    if (reditors.length && inst) {
                        var _plugins = inst.plugins;
                        if (_plugins.start) {
                            var len = _plugins.start.length;
                            for (var i = 0; i < len; i++) {
                                var plugname = _plugins.start[i][0];
                                if (plugname === 'zalsoResize') { // NO I18N
                                    //  inst.axis = 'se'; // NO I18N
                                    _plugins.start[i][1].bind(element)();
                                }
                            }
                        }
                    }
                },
                stop: function (event, ui) {
                    var el = $(this);
                    var inst = el.resizable('instance'); // NO I18N
                    if (inst && inst.options && inst.options.zalsoResize && inst.options.zalsoResize.length) {
                        var undoobj = {
                            action: 'link', // NO I18N
                            node: '#', // NO I18N
                            actionarray: [{
                                action: 'resize', // NO I18N
                                node: zutils.getSelectorByElement(inst.element),
                                previous: canvasObjUtils._.extend(ui.originalSize, ui.originalPosition),
                                current: canvasObjUtils._.extend(ui.size, ui.position),
                                editor: outinstance.config.editorcontainer
                            }]
                        }

                        $(inst.options.zalsoResize).each(function () {
                            var $el = $(this);
                            var prevobj = $el.data('zcprev'); // NO I18N
                            if (prevobj) {
                                prevobj.current = {
                                    width: $el[0].offsetWidth,
                                    height: $el[0].offsetHeight
                                }
                                undoobj.actionarray.push(prevobj);
                            }
                        })

                        outinstance.savecanvasaction(event.target, 'resize', null, null, null, null, undoobj); //NO I18N
                    } else {
                        outinstance.savecanvasaction(event.target, 'resize', canvasObjUtils._.extend(ui.originalSize, ui.originalPosition), canvasObjUtils._.extend(ui.size, ui.position)); //NO I18N
                    }
                    //self_.adjustscroll(component.find('.active'),component);

                    self_.togglenav(component);
                    outinstance.resetheight && outinstance.resetheight();
                    el.resizable('option', 'zalsoResize', ''); // NO I18N
                }
            })

            var $tabs = tablist.find('.zc-tabs');

            $tabs.sortable({
                handle: ".icon",// NO I18N
                axis: "x", // NO I18N
                start: function (event, ui) {
                    $(this).attr('data-previndex', ui.item.index()); // NO I18N
                },
                beforeStop: function (e, ui) {
                    var _ul = ui.helper.closest('.zc-tabs'); // NO I18N
                    _ul.append(_ul.find('.zcaddtab'));
                },
                update: function (event, ui) {
                    var $tab = $(this)
                    var current = ui.item.index();
                    var previous = $tab.attr('data-previndex'); // NO I18N
                    $tab.removeAttr('data-previndex'); // NO I18N
                    var undoobj = {
                        action: 'layout', // NO I18N
                        instance: self_,
                        json: {
                            action: 'taborder', // NO I18N
                            previous: parseInt(previous),
                            current: parseInt(current),
                            editor: component,
                            tab: ui.item.attr('data-tab') // NO I18N
                        }
                    }
                    self_.savecanvasaction(undoobj);
                }
            })

            var activetabs = $tabs.find('.tab');
            activetabs.each(function () {
                var tabcontainer = $(this).attr('data-tab');
                var options = {
                    editorcontainer: tabcontainer,
                    zccontainment: "parent", // NO I18N
                    tools: mainconfig.tools || { },
                    toolsRef: mainconfig.toolsRef || { },
                    undoredomanager: mainconfig.undoredomanager || { },
                    restrictresize: true,
                    acceptWidgets: '.ui-draggable', // NO I18N
                    relatedlistcompile: mainconfig.relatedlistcompile,
                    relatedlistcreate: mainconfig.relatedlistcreate,
                    multiresize: mainconfig.multiresize,
                    style: mainconfig.style,
                    relatedlistdata: mainconfig.relatedlistdata,
                    relatedlistmenu: mainconfig.relatedlistmenu,
                    listtypes: mainconfig.listtypes,
                    statictypecallback: mainconfig.statictypecallback,
                    onmenuswitch: mainconfig.onmenuswitch,
                    contexttools: mainconfig.contexttools,
                    zclayoutcontainer: mainconfig.zclayoutcontainer,
                    afterrelatedlistplace: mainconfig.afterrelatedlistplace,
                    onTabSwitch: mainconfig.onTabSwitch,
                    onaddelement: mainconfig.onaddelement,
                    onChange: mainconfig.onChange,
                    listinterceptor: mainconfig.listinterceptor,
                    listjson: mainconfig.listjson,
                    lockhandler: mainconfig.lockhandler,
                    unlockhandler: mainconfig.unlockhandler,
                    nohover: true
                }
                var $tabcontainer = $(tabcontainer).not('.zcanvas-editor');
                if ($tabcontainer.length) {
                    $tabcontainer.zcanvas(options);
                    $tabcontainer.addClass('zc-no-bg'); // NO i18N
                    $tabcontainer.data('zcanvas').config.restrictresize = false; // NO I18N
                    // $tabcontainer.data('zcanvas').config.zccontainment = "#zcanvas-editor-outer"; // NO I18N
                }

            });
            $tabs.off('click', 'zcanvas.tabconfig'); // NO i18N
            $tabs.click(function (e) {
                mainconfig && mainconfig.toolsRef && mainconfig.toolsRef.selectfield(e);
            })
            outinstance.resetheight && outinstance.resetheight();


        }

        this.toJson = function (component, extjson) {
            var editorstyle = component.children('.zc-tab-container'); // NO I18N
            var tablistcontainer = component.children('.zc-tablist-container').find('.zc-tabs');  // NO I18N
            var activetabs = tablistcontainer.find('.tab'); // NO I18N

            var compdata = component.data('layoutstyle'); // NO I18N
            var toolinst = zutils.getParentData(component);
            var selector = '#' + component.attr('id') + '> .zc-tablist-container > .zc-tabs li.tab'; // NO I18N
            //   var sstyle = zutils.zcopyobj(toolinst.config.toolsRef.zcstyles[selector] || {});
            var sstyle = zutils.zcopyobj2(toolinst.config.toolsRef.getstylebyselector(selector, true, true));
            compdata = {
                default: sstyle.default,
                hover: sstyle.hover,
                active: sstyle.active
            };
            var defstates = ['default', 'active', 'hover']; // NO I18N
            for (var skey in sstyle) {
                if (defstates.contains(skey)) {
                    continue;
                }
                compdata[skey] = zutils.zcopyobj2(sstyle[skey]);
            }
            zutils.compressioncallback && zutils.compressioncallback({ ui: sstyle }, null, null, sstyle);
            compdata.container = jsonCreation.getstyles(tablistcontainer);
            zutils.compressioncallback && zutils.compressioncallback({ ui: compdata.container }, null, null, compdata.container);
            compdata.editor = jsonCreation.getstyles(editorstyle);
            zutils.compressioncallback && zutils.compressioncallback({ ui: compdata.editor }, null, null, compdata.editor);
            if (compdata.editor) {
                for (var skey in compdata.editor) {
                    var _style = compdata.editor[skey];
                    if (!extjson.ui.value.style[skey]) {
                        extjson.ui.value.style[skey] = { };
                    }
                    var _mstyle = extjson.ui.value.style[skey];
                    if (_style && (_style._hide_ || _style._show_)) {
                        if (_style._hide_) {
                            _mstyle._hide_ = 'true';
                        } else if (_style._show_) {
                            _mstyle._show_ = 'true';
                        }
                        delete _style._hide_;
                        delete _style._show_;
                    }
                }
            }
            component.data('layoutstyle', compdata); // NO I18N
            var result = [];
            activetabs.each(function () {
                var $tab = $(this);
                var tabcontainer = $tab.attr('data-tab'); // NO I18N
                var $tabcontainer = $(tabcontainer);
                var vflag = false;
                if (!$tabcontainer.is(':visible')) {
                    // eslint-disable-next-line webperf/layout-thrashing
                    $tabcontainer.show();
                    vflag = true;
                }
                var json = canvasOutput.createJson(tabcontainer);
                var hasclasses = false;
                if (json.ui.value && json.ui.value.class && json.ui.value.class.indexOf('zc-tab-all-fields') > -1) {
                    hasclasses = true;
                }
                json.ui.value.class = 'zc-tab-section'; // NO I18N
                if (hasclasses) {
                    json.ui.value.class += ' zc-tab-all-fields'; // NO I18N
                }
                json.theme = 'Custom Layout'; // NO I18N
                if (vflag) {
                    // eslint-disable-next-line webperf/layout-thrashing
                    $tabcontainer.hide();
                }
                self_.tabjson(json.ui.value, $tab);
                if (json.ui.value.disabled) {
                    var $st = $tabcontainer.children('.zcanvas-static-editor'); // NO I18N
                    var stdata = $st.data('zcanvas'); // NO I18N
                    if (stdata && stdata.id) {
                        json.tabrelatedlistid = stdata.id;

                        var hastabvisibility = false;

                        var tabchildren = json.children[0];

                        var tabstyle = { };

                        if (tabchildren && tabchildren.ui && tabchildren.ui.value && tabchildren.ui.value.style) {
                            for (var stkey in tabchildren.ui.value.style) {
                                var appliedstyle = tabchildren.ui.value.style[stkey];
                                var resultstyle = { };
                                if (appliedstyle.hasOwnProperty('_show_')) {
                                    resultstyle._show_ = true;
                                    hastabvisibility = true;
                                }
                                if (appliedstyle.hasOwnProperty('_hide_')) {
                                    resultstyle._hide_ = true;
                                    hastabvisibility = true;
                                }
                                if (appliedstyle.hasOwnProperty('_order')) {
                                    resultstyle._order = appliedstyle._order;
                                }
                                tabstyle[stkey] = resultstyle;
                            }
                        }

                        if (hastabvisibility) {
                            json.ui.value.tabstyle = tabstyle;
                        }

                    }
                }
                result.push(json);
            })
            return result;
        }

        this.tabjson = function (json, $tab) {
            var tabname = $tab.find('.tabname'); // NO I18N
            json.name = tabname.html();
            if (!tabname.is(':visible')) {
                json.hidetext = true;
            }
            var icon = $tab.find('.zctabicons'); // NO I18N
            if (icon.length) {
                json.icon = icon.attr('data-zcicon'); // NO I18N
            }
            if (tabname.hasClass('zc-tab-noedit')) {
                json.disabled = true;
            }
            var codedata = $tab.data('zcanvasdata'); // NO I18N
            if (codedata && codedata.systemid) {
                json.system_id = codedata.systemid;
            }
        }

        this.tabitemstyling = function (zid, json) {
            var tabselector = 'zctablist' + zid; // NO I18N
            var tabstyle = json.ui.value.tabstyle;
            if (tabstyle) {

                for (var stkey in tabstyle) {
                    var styles = tabstyle[stkey];
                    if (styles.hasOwnProperty('_show_')) {
                        styles.display = 'inline-block'; // NO I18N
                        delete styles._show_;
                    }
                    if (styles.hasOwnProperty('_hide_')) {
                        styles.display = 'none'; // NO I18N
                        delete styles._hide_;
                    }
                }

                createStruture.applystyle(null, tabstyle, tabselector, true, { });
                return true;
            }
        }

        this.toDom = function (json, container, padingLeft, padingTop) {
            var $template = $(template);
            var $container = $template.children('.zc-tab-container'); // NO I18N
            // Cleaning the default template
            var _tablist = $template.children('.zc-tablist-container'); // NO I18N
            _tablist.find('.zc-tabs li').first().remove(); // NO I18N
            $container.html('');
            container.append($template);
            $template.css({
                left: json.ui.value.position.startX + padingLeft,
                top: json.ui.value.position.startY + padingTop,
                width: json.ui.value.position.width,
                height: json.ui.value.position.height,
                zIndex: json.ui.value.position.depth,
                position: 'absolute' // NO I18N
            });
            $template.zccss(json.ui.value.style);
            $template.addClass(json.ui.value.class);
            if (json.zcanvasId) {
                $template.attr('id', json.zcanvasId); // NO I18N
            }
            var childlen = json.children.length;

            for (var i = 0; i < childlen; i++) {
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                var zid = json.children[i].zcanvasId || zutils.getRandomId();
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                var isi18n = json.children[i].ui.value && json.children[i].ui.value.class && json.children[i].ui.value.class.indexOf('zc-tab-all-fields') > -1;
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                addnewtab(isi18n ? I18n.getMsg('crm.label.all.fields') : json.children[i].ui.value.name, $container, $template, true, zid, json.children[i].ui.value.icon, json.children[i].ui.value.hidetext, json.children[i].ui.value.disabled, true);
                // var tabselector = '#' + zid; // NO I18N
                var tab = $template.find('.zc-tabs li.zctablist' + zid);
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                var tabname = json.children[i].ui.value.name;
                self_.configlayout($template);
                var instance = $('#' + zid).data('zcanvas');
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                instance.addElement(json.children[i].children);
                // FIXME: should be handled by service
                tab.attr('data-zcqa', 'canvas-detail-tab-' + tabname); // NO I18N
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                instance && instance.config && instance.config.onaddelement && instance.config.onaddelement(tab, json.children[i]);
                if (isi18n) {
                    self_.bindscope(instance, '.zc-fieldsection'); // NO I18N
                    instance && instance.container && instance.container.zaddClass('zc-tab-all-fields'); // NO I18N
                }
            }
            self_.init($template, true);
            $template.data('layoutstyle', json.ui.value.layoutstyle); // NO i18N
            //  $container.zccss(json.ui.value.layoutstyle.editor);
            //  self_.compilestyle($template , null ,true);
            var zcid = $template.attr('id');// NO I18N
            if (!zcid) {
                zcid = zutils.getRandomId();
                $template.attr('id', zcid);// NO I18N
            }
            _tablist.find('.zc-tabs .active').removeClass('active'); // NO I18N
            _tablist.find('.zc-tabs .tab').first().addClass('active'); // NO I18N
            var inst = zutils.getParentData($template).config.toolsRef;

            if (json.ui.value.style) {
                for (var skey in json.ui.value.style) {
                    var _style = json.ui.value.style[skey];
                    if (!json.ui.value.layoutstyle.editor) {
                        json.ui.value.layoutstyle.editor = { };
                    }
                    if (!json.ui.value.layoutstyle.editor[skey]) {
                        json.ui.value.layoutstyle.editor[skey] = { };
                    }
                    var _mstyle = json.ui.value.layoutstyle.editor[skey];
                    if (_style && _style.opacity) {
                        if (_style.opacity === '0.5') {
                            _mstyle.opacity = '0.5';
                        } else if (_style.opacity === '1') {
                            _mstyle.opacity = '1';
                        }
                        delete _style.opacity;
                    }
                }
            }

            var $tabs = $template.find('.zc-tabs'); // NO I18N
            // eslint-disable-next-line webperf/no-multipleDOMLookup
            inst.applyjsontostyle($template.find('.zc-tabs li'), json.ui.value.layoutstyle, null, null, true);
            inst.applyjsontostyle($container, json.ui.value.layoutstyle.editor, null, null, true);
            inst.applyjsontostyle($tabs, json.ui.value.layoutstyle.container, null, null, true);

            // $tabs.scrollTo(0); // Perf Improvement
            $tabs.scrollLeft = 0;

            if (json.prefill) {
                self_.prefilltabs($template);
            }

            var parentdata = zutils.getParentData($template);
            parentdata && zutils.changelayoutscope(parentdata, 'Tab Layout', true); // NO I18N
            return $template;
        }

        this.toView = function (json) {
            var $template = $($.parseHTML(basetemplate));
            if (json.ui.value.fixed) {
                $template.css({ width: json.ui.value.position.width, height: json.ui.value.position.height })
            }
            $template.addClass('zctabview').addClass(json.ui.value.class || '');
            $template.data('layoutstyle', json.ui.value.layoutstyle); // NO i18N
            var list = $template.children('.zc-tablist-container').find('.zc-tabs'); // NO I18N
            var editors = $template.children('.zc-tab-container'); // NO I18N
            var childelements = json.children;
            var childlen = childelements.length;
            for (var i = 0; i < childlen; i++) {
                var tab = childelements[i];
                var name_ = tab.ui.value.name;
                var icon = tab.ui.value.icon;
                var hiddenlable = tab.ui.value.hidetext;
                var generateId = zutils.getRandomId();
                var isi18n = tab.ui.value && tab.ui.value.class && tab.ui.value.class.indexOf('zc-tab-all-fields') > -1; // NO I18N
                //eslint-disable-next-line	webperf/directly-select-with-id
                var $li = $($.parseHTML('<li class="tab zctablist' + generateId + '" data-tab="#' + generateId + '"><span class="tabname"></span></li>'));
                //eslint-disable-next-line webperf/no-multipleDOMLookup
                var tabname = $li.find('.tabname');
                tabname.html(isi18n ? I18n.getMsg('crm.label.all.fields') : name_); // NO I18N
                if (tab.ui.value.system_id) {
                    $li.addClass('canvasselectableelemnt canvas-tab-element-id-' + tab.ui.value.system_id); // NO I18N
                }
                if (hiddenlable) {
                    tabname.hide();
                }
                if (icon) {
                    var $icon = $(' <span class="zctabicons ' + icon + '" data-zcicon="' + icon + '"></span>');
                    $icon.insertBefore(tabname);
                    hiddenlable && $icon.addClass('zctabnotext');
                }
                //eslint-disable-next-line	webperf/directly-select-with-id
                var head = $($.parseHTML('<h3 class="d_active zc-tab-heading" data-tab="#' + generateId + '"> </h3>'));
                head.text(name_);
                list.append($li);
                editors.append(head);
                var container = $($.parseHTML('<div id="' + generateId + '" class="zc-tab-content"></div>'));
                var child = { "children": [], "_type": "component" };//NO I18N
                //                var child = zutils.zcopyobj(json);
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                child.children = [tab];
                child.ui = zutils.zcopyobj(json.ui);
                //  if(renderflag){
                //       var table = createStruture.rawhtml(child);
                //    }else{
                var table = createStruture.layoutHtml(undefined, child);
                //    }
                container.append(table);

                //                var styleObj = tab.ui.value.style;
                //				var nodeClass = tab.ui.value.class;
                //				var $currentNode = $(container);
                //				for(key in styleObj) {
                //					$currentNode.css(key, styleObj[key]);
                //				}
                //				$currentNode.addClass(nodeClass).addClass("zcanvas");//NO I18N
                //				$currentNode.zaddClass(nodeClass);


                editors.append(container);
                if (this.tabitemstyling(generateId, tab)) {
                    $li.addClass('zc-hideable-tab'); // NO I18N
                }
            }
            list.find('li').first().addClass('active');
            editors.find('.zc-tab-content').first().css('display', 'block'); // NO I18N
            //    this.init($template,true,null,true);
            $template.attr('id', zutils.getRandomId()); // NO I18N
            // self_.compilestyle($template,{
            //     default: {
            //         'padding-left':'10px', // NO I18N
            //         'padding-right':'10px' // NO I18N
            //     }
            // });
            // editors.css(json.ui.value.layoutstyle.editor);
            var inst = createStruture.toolinst;
            inst.applyjsontostyle($template.find('.zc-tabs li'), json.ui.value.layoutstyle, null, null, null, null, true);
            inst.applyjsontostyle(editors, json.ui.value.layoutstyle.editor, null, null, null, null, true);
            // eslint-disable-next-line webperf/no-multipleDOMLookup
            inst.applyjsontostyle($template.find('.zc-tabs'), json.ui.value.layoutstyle.container, null, null, null, null, true);
            inst.applyjsontostyle($template, json.ui.value.style, null, null, null, null, true);
            return $template;
        }

        this.refreshlayout = function (component, callback) {
            component.addClass('zcrefreshedlayout'); // NO I18N
            this.init(component, true, null, true, null, null, null, callback);
        }

        this.deletetab = function (component, event, flag, noselection) {
            !event.target || event.stopPropagation();
            var el = $(event.target || event);
            var $parent = el.parent('li'); // NO I18N
            var tabparent = $parent.parent('ul'); // NO I18N
            if (!tabparent.length) {
                return;
            } else if (tabparent.find('li:not(.zcaddtab)').length === 1 && !noselection) {
                return this.deletelayout(component, flag);
            }
            var taborder = tabparent.find('li').index($parent);
            var zid = $parent.attr('data-tab'); // NO I18N
            var parentnext = $parent.next('.tab'); // NO I18N
            var parentprev = $parent.prev('.tab'); // NO I18N
            var undoobj = {
                action: 'layout', // NO I18N
                instance: self_,
                json: {
                    editor: component,
                    node: $parent,
                    refid: zid, // NO I18N
                    order: taborder,
                    action: 'deletetab' // NO I18N
                }
            }
            var container = component.find('.zc-tab-container') // NO I18N
            var zcanvas = container.find(zid);
            undoobj.json.previous = { container: canvasOutput.createJson(zcanvas), tab: { } };
            self_.tabjson(undoobj.json.previous.tab, $parent);
            $parent.remove();
            zcanvas.prev().remove();
            zutils.deleteElement(zcanvas, true);
            // eslint-disable-next-line webperf/no-multipleDOMLookup
            if (tabparent.length && !tabparent.find('li:not(.zcaddtab)').length) {
                component.remove();
            } else {
                flag || self_.savecanvasaction(undoobj);
            }
            if (!noselection) {
                if (parentnext.length) {
                    parentnext.click();
                } else if (parentprev.length) {
                    parentprev.click();
                }
            }

            if (flag) {
                return undoobj;
            }
        }

        this.deletelayout = function (component, flag) {
            var inst = zutils.getParentData(component);
            var $parent = component.parent();
            var undoobj = {
                action: 'layout', instance: self_,  // NO I18N
                json: {
                    editor: '#' + component.attr('id'),
                    node: '#' + $parent.attr('id'),
                    previous: canvasOutput.createJson(component),
                    action: 'deleteLayout', // NO I18N
                    parentstyle: { ui: { value: { style: jsonCreation.getstyles($parent) } } }
                }
            } // NO I18N
            var elements = component.find('.deletetabicon'); // NO I18N
            elements.each(function () {
                self_.deletetab(component, this, true, true);
            })
            inst && zutils.changelayoutscope(inst, 'Tab Layout'); // NO I18N
            if (!flag) {
                self_.savecanvasaction(undoobj, inst.config.undoredomanager);
            } else {
                return undoobj;
            }
        }

        this.createdropdown = function (tabname, $container, component, flag, zid) {
            var dropdown = component.children('.zctab-dropdown'); // NO I18N 
            var addbtn = component.children('.zc-tablist-container').find('.zcaddtab'); // NO I18N
            var addbtnposition = addbtn.position();
            var addbtnmargin = addbtn.parent().css(['margin-top', 'margin-left']); // NO I18N
            addbtnposition.top += parseInt(addbtnmargin['margin-top']); // NO I18N
            addbtnposition.left += parseInt(addbtnmargin['margin-left']); // NO I18N
            var addbtndimension = {
                width: addbtn.outerWidth(),
                height: addbtn.outerHeight()
            }
            //  var ddwidth = 0;
            dropdown.remove();
            //  if(!dropdown.length){
            $(window).off('click.zctabselect'); // NO I18N
            var elid = zutils.getRandomId();
            var template = $('<div class="zctab-dropdown"><ul id="' + elid + '"></ul></div>');
            var $ul = template.find('ul'); // NO I18N
            // eslint-disable-next-line webperf/no-multipleDOMLookup,webperf/directly-select-with-id
            var searchtemplate = $('<div class="canvas_field_search searchel">' + // NO I18N
                '<input id="tabsearchinput" placeholder=' + I18n.getMsg('crm.label.search') + ' type="text" oninput="zutils.search(this,\'#' + elid + '\',\'.zctabli\',null,null,\'#tabsidebarnomatch\')" autocomplete="off">' +
                '<span class="dIB pR canvas_search_icon">' +
                '<span class="zc_searchIcon pA"></span> ' +
                '<span class="zc-closesearch-icon zc-search-hide" onclick="zutils.menuSearchClear(null,\'#tabsearchinput\',\'.zctabli\',\'#' + elid + '\',null,null,\'#tabsidebarnomatch\');event.stopPropagation()"></span>' +
                '</span> ' +
                '</div><div class="zcnomatchel" id="tabsidebarnomatch" data-search-source="#tabsearchinput">' + I18n.getMsg('crm.label.no.results.match') + '<div class="zcaddcustomtab">' + I18n.getMsg('crm.canvas.builder.addcustomtab') + '</div></div>');
            template.prepend(searchtemplate);
            // FIXME: Menu container should be comes from config
            var menucontainer = $('#zcanvas_menu').data('zcanvasMenu');
            var relatedlistdata = menucontainer.config.groups.relatedlist.data;
            if (menucontainer.config.groups.system) {
                relatedlistdata = relatedlistdata.concat(menucontainer.config.groups.system.data);
            }
            relatedlistdata = canvasObjUtils._.filter(relatedlistdata, function (i) { return i.zcscope && !i.hidden });
            var rellistlength = relatedlistdata.length;
            // eslint-disable-next-line webperf/no-attribute-selectors
            var hasallfield = !$(".zc-tab-content[data-zcanvasclass~='zc-tab-all-fields']").length; // NO I18N
            var customtemplate = $('<li class="zctabli">' + I18n.getMsg('webform.analytics.timefilter.custom') + '</li>' + (hasallfield && '<li class="zctabli" data-tabtype="fields">' + I18n.getMsg('crm.label.all.fields') + '</li>'));
            $ul.append(customtemplate);
            for (var i = 0; i < rellistlength; i++) {
                var dropdowntemplate = $('<li class="zctabli">' + relatedlistdata[i].zclabel + '</li>');
                dropdowntemplate.data('zcreldata', relatedlistdata[i]);
                $ul.append(dropdowntemplate);
            }
            component.append(template);
            template.find('li').add(template.find('.zcaddcustomtab')).click(self_.tabtypeselect.bind(null, tabname, $container, component, flag, zid))
            dropdown = template;
            var outclickhandler = function (e) {
                if (!(addbtn.is(e.target) || addbtn.has(e.target).length || searchtemplate.has($(e.target).not(".zcaddcustomtab")).length)) {
                    dropdown.hide();
                    $('#zcanvas-editor-outer').disableSelection();
                    $(window).off('click.zctabselect');
                }
            }
            $(window).on('click.zctabselect', outclickhandler)
            //     }
            dropdown.show();
            $('#zcanvas-editor-outer').enableSelection();
            // eslint-disable-next-line webperf/layout-thrashing
            //     ddwidth = dropdown.outerWidth();
            var ddpos = {
                top: addbtnposition.top + addbtndimension.height,
                left: addbtnposition.left - 200 + addbtndimension.width
            }
            if (ddpos.left < 0) {
                ddpos.left = addbtnposition.left;
                dropdown.addClass('zctab-dropdown-openleft');
            } else {
                dropdown.removeClass('zctab-dropdown-openleft');
            }
            dropdown.css(ddpos);
            dropdown.find('input').focus();
            return dropdown;
        }

        this.tabtypeselect = function (tabname, $container, component, flag, zid, e) {

            var el = $(e.target).closest('li');
            var data = el.data('zcreldata'); // NO I18N
            if (data) {
                var menuninstance = $(data.fieldContainer).data('zcanvasMenu');
                var config = menuninstance.config;
                config.zmenustart(data);
                zid = zutils.getRandomId();
                addnewtab(tabname, $container, component, flag, zid);
                self_.renderlist(component, data, zid);
            } else if (el.data('tabtype') === 'fields') { // NO I18N
                // FIeld Handling
                var menucontainer = $('#zcanvas_menu');
                var sections = menucontainer.find('.zcanvas-submenu-heading'); // NO I18N
                var configd = menucontainer.data('zcanvasMenu'); // NO I18N
                var datamap = menucontainer.data('zcdatamap'); // NO I18N
                var config = configd && configd.config;
                var comparray = [];
                sections.each(function () {
                    var sec = $(this);
                    //	var eldata = sec.data('zcanvas'); // NO I18N
                    //	if(!eldata){
                    var fdata = datamap && datamap[sec.data('uniquekey')]; // NO I18N
                    var eldata = config && config.zmenustart(fdata, null, null, true);
                    //	}
                    eldata && comparray.push(eldata);
                });
                var tabid = addnewtab(I18n.getMsg('crm.label.all.fields'), $container, component, flag, zid, null, null, true); // NO I18N
                var complen = comparray.length;
                var dim = { _t: 10, _l: 20 };
                var tabel = $('#' + tabid);
                var tabinst = tabel.data('zcanvas'); // NO I18N
                var tabdim = tabel.outerWidth() - 60;
                for (var i = 0; i < complen; i++) {
                    var compdata = comparray[i]; //&& compdata.condition && compdata.condition(compdata)
                    if (compdata && compdata.data && compdata.data.ui && compdata.data.ui.value && compdata.data.ui.value.position) {
                        compdata.data.ui.value.position.startX = dim._l;
                        compdata.data.ui.value.position.startY = dim._t;
                        compdata.data.ui.value.position.width = tabdim;
                        compdata.data.ui.value.class += ' zc-fieldsectionallfield'; // NO I18N
                        dim._t += compdata.data.ui.value.position.height + 30;
                        compdata.data.sectionId = compdata.sectionid;
                        tabinst.addElement([compdata.data]);

                    }
                }
                self_.bindscope(tabinst, '.zc-fieldsection'); // NO I18N
                tabel.zaddClass('zc-tab-all-fields'); // NO I18N
                self_.savenewtabdetails(component, tabid);
            } else {
                var tabid = addnewtab(tabname, $container, component, flag, zid);
                self_.savenewtabdetails(component, tabid);
            }
        }
        this.bindscope = function (inst, selector) {
            var el = $(inst.config.editorcontainer);
            var zcopeid = el.attr('id'); // NO I18N
            el.droppable('option', 'scope', zcopeid); // NO I18N
            el.find(selector || '.zcanvas-static-editor').draggable('option', 'scope', zcopeid); // NO I18N
            el.addClass('zcanvas-restricted-drop'); // NO I18N

            if (selector && selector === '.zc-fieldsection') {
                // TEMP CODE to handle all fields.
                var elements = el;
                elements = el.add(el.find('.ui-droppable')); // NO I18N
                elements.droppable('option', 'disabled', true); // NO I18N

                var _drag = el.find('.ui-draggable'); // NO I18N
                _drag.draggable('destroy'); // NO I18N

                var _sort = el.find('.ui-sortable'); // NO I18N
                _sort.sortable('option', 'disabled', true); // NO I18N
            }

        }
        this.renderlist = function (component, data, zid, selectionflag, callback) {
            var hzid = '#' + zid;
            // component.find('[data-tab="' + hzid + '"]').find('.tabname').html(data.zclabel).addClass('zc-tab-noedit'); // NO I18N
            component.find('.zctablist' + zid).find('.tabname').html(data.zclabel).addClass('zc-tab-noedit'); // NO I18N
            var el = $(hzid);
            // el.css('padding','30px'); // NO I18N
            var uioffset = { left: 30, top: 30, width: 'calc(100% - 60px)' }; // NO I18N
            var instance = el.data('zcanvas'); // NO I18N
            var contextid = zutils.getRandomId();
            if (data.data) {
                var tabcallback = function (context) {
                    if (!callback) {
                        // context.css({width: 'calc(100% - 60px)' , height: 'calc(100% - 60px)'}); // NO I18N
                        var parenttab = context.parent();
                        var parentdim = { w: parenttab.width(), h: parenttab.height() };
                        context.css({ width: parentdim.w - 60, height: parentdim.h - 90 });
                        context.addClass('zcautoratio').zaddClass('zcautoratio'); // NO I18N
                        //   zutils.invokeResize(context);
                    }
                }


                if (data.data instanceof Promise) {
                    data.data.then(function (res) {
                        data.data = res.data;
                        data.template = res.template;
                        data.menu = res.menu;
                        data.rellistdata = res.rellistdata;
                        data.module = res.module;
                        data.actions = res.actions;
                        data.fieldid = data.menu.data.map(function (item) { return item.id; });
                        data.gallery = res.gallery;
                        var menuinst = $(data.fieldContainer).data('zcanvasMenu'); // NO I18N
                        menuinst.reduceScope({
                            id: data.id, fieldContainer: data.fieldContainer
                        })
                        instance.renderrelatedList(data, data.template, el, null, instance.config, uioffset, contextid, undefined, selectionflag, tabcallback);
                        self_.bindscope(instance);
                        self_.savenewtabdetails(component, zid, true);
                        callback && callback(contextid);

                    });
                } else if (data.async) {
                    data.asyncloader && data.asyncloader.then(function () {
                        var menuinst = $(data.fieldContainer).data('zcanvasMenu'); // NO I18N
                        menuinst.reduceScope({
                            id: data.id, fieldContainer: data.fieldContainer
                        })
                        instance.renderrelatedList(data, data.template, el, null, instance.config, uioffset, contextid, undefined, selectionflag, tabcallback);
                        self_.bindscope(instance);
                        self_.savenewtabdetails(component, zid, true);
                        callback && callback(contextid);
                        delete data.asyncloader;
                        data.async = false;
                    });
                } else {
                    var menuinst = $(data.fieldContainer).data('zcanvasMenu'); // NO I18N
                    menuinst.reduceScope({
                        id: data.id, fieldContainer: data.fieldContainer
                    })
                    if (!canvasObjUtils._.isEmpty(data.data)) {
                        data.data = zcanvasrelatedList.updatereference(zutils.zcopyobj(data.data));
                        data.template = instance.config.relatedlistcompile(data.data, data, true);
                    }
                    instance.renderrelatedList(data, data.template, el, null, instance.config, uioffset, contextid, undefined, selectionflag, tabcallback);
                    self_.bindscope(instance);
                    self_.savenewtabdetails(component, zid, true);
                    callback && callback(contextid);
                }
                //                callback || setTimeout(function(){
                //                    var context = $('#' + contextid);
                //                   // zutils.invokeResize(context);
                //                    context.css({width: 'calc(100% - 60px)' , height: 'calc(100% - 60px)'}); // NO I18N
                //                },1000)
            }
        }

        this.compilestyle = function (template, defaultdata, flag) {
            var zid = template.attr('id');// NO I18N
            if (!zid) {
                zid = zutils.getRandomId();
                template.attr('id', zid);// NO I18N
            }
            !flag && self_.applystyle(zid, template, defaultdata);
            self_.togglenav(template);
        }

        this.applydefault = function (data, defaultdata) {
            for (var key in data) {
                if (defaultdata[key] && data[key]) {
                    for (var property in defaultdata[key]) {
                        data[key][property] = parseInt(data[key][property]) + parseInt(defaultdata[key][property]) + 'px';
                    }
                }
            }
        }

        this.applystyle = function (zid, template, defaultdata) {
            template.children('style').remove();  // NO i18N
            var styles = template.data('layoutstyle') || { }; // NO i18N
            styles = zutils.zobjdiff(self_.defaulttheme, styles);
            self_.applydefault(styles, defaultdata || { });
            var editor = template.find('.zc-tab-container'); // NO I18N
            editor.css(styles.editor || { });

            var styletag = $('<style/>');
            var defaultstyle = styles.default || { };
            var stylestring = '#' + zid + ' ul .tab {';
            for (var i in defaultstyle) {
                // eslint-disable-next-line no-unused-expressions
                defaultstyle[i] ? stylestring += i + ' : ' + defaultstyle[i] + ';' : '';
            }
            stylestring += '}';

            var hoverstyle = styles.hover || { };
            stylestring += '#' + zid + ' ul .tab:hover {';
            for (var i in hoverstyle) {
                // eslint-disable-next-line no-unused-expressions
                hoverstyle[i] ? stylestring += i + ' : ' + hoverstyle[i] + ';' : '';
            }
            stylestring += '}';

            var activestyle = styles.active || { };
            stylestring += '#' + zid + ' ul .tab.active {';
            for (var i in activestyle) {
                // eslint-disable-next-line no-unused-expressions
                activestyle[i] ? stylestring += i + ' : ' + activestyle[i] + ';' : '';
            }
            stylestring += '}';

            styletag.html(stylestring);

            template.find('.zc-tabs').css(styles.container || { });

            template.append(styletag);
        }



        this.addIcon = function (icon, tab) {
            var previous = { };
            self_.tabjson(previous, tab);
            if (tab.length) {
                var iconel = tab.find('.zctabicons'); // NO I18N
                if (iconel.length) {
                    var exticon = iconel.attr('data-zcicon'); // NO I18N
                    iconel.addClass(icon).removeClass(exticon).attr('data-zcicon', icon); // NO I18N
                } else {
                    var tabsorticon = tab.find('.icon'); // NO I18N
                    iconel = $('<span/>', { class: 'zctabicons' }).addClass(icon).attr('data-zcicon', icon); // NO I18N
                    iconel.insertAfter(tabsorticon);
                }
                self_.rendertabjson(tab, previous);
            }
        }

        this.hideIcon = function (tab) {
            var previous = { };
            self_.tabjson(previous, tab);
            if (tab.length) {
                tab.find('.zctabicons').remove();
                self_.rendertabjson(tab, previous);
            }
        }

        this.hideText = function (tab) {
            var previous = { };
            self_.tabjson(previous, tab);
            if (tab.length) {
                tab.find('.tabname').hide();
                tab.find('.zctabicons').addClass('zctabnotext'); // NO I18N
                self_.rendertabjson(tab, previous);
            }
        }

        this.showText = function (tab) {
            var previous = { };
            self_.tabjson(previous, tab);
            if (tab.length) {
                tab.find('.tabname').show();
                tab.find('.zctabicons').removeClass('zctabnotext'); // NO I18N
                self_.rendertabjson(tab, previous);
            }
        }

        this.rendertabjson = function (tab, json) {
            var current = { };
            self_.tabjson(current, tab);
            var undoobj = {
                action: 'layout', // NO I18N
                instance: self_,
                json: {
                    action: 'rendertab', // NO I18N
                    previous: json,
                    current: current,
                    // eslint-disable-next-line webperf/no-global-variables
                    editor: tab.closest('.zctablayout'), // NO I18N
                    id: tab.attr('data-tab') // NO I18N
                }
            }
            self_.savecanvasaction(undoobj);
        }

        this.rerendertab = function (data, hidetext, icon) {
            // var tab = data.editor.find('li[data-tab="' + data.id + '"]');
            var tabzid = data.id.replace('#', '');
            var tab = data.editor.find('li.zctablist' + tabzid);
            tab.find('.zctabicons').remove();
            // eslint-disable-next-line webperf/show-last
            var tabname = tab.find('.tabname').show(); // NO I18N
            if (hidetext) {
                tabname.hide();
            }
            if (icon) {
                var $icon = $(' <span class="zctabicons ' + icon + '" data-zcicon="' + icon + '"></span>');
                $icon.insertBefore(tabname);
                hidetext && $icon.addClass('zctabnotext');
            }
        }
        this.renamefocus = function (el) {
            if (typeof window.getSelection !== "undefined"
                // eslint-disable-next-line zstandard/no-duplicate-null-check
                && typeof document.createRange !== "undefined") { // NO I18N
                var range = document.createRange();
                range.selectNodeContents(el[0]);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                range.selectNodeContents(el[0]);
                sel.addRange(range);

            } else if (typeof document.body.createTextRange !== "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el[0]);
                textRange.collapse(false);
                textRange.select();
            }
        }

        this.savecanvasaction = function (data, inst) {
            if (data) {
                inst = inst || zutils.getParentData(data.json.editor).config.undoredomanager;
                inst.push(data);
                return data;
            }
        }

        this.savenewtabdetails = function (component, zid, listflag) {
            var hzid = '#' + zid;
            // var tab = component.find('.zc-tabs li[data-tab="' + hzid + '"]');
            var tab = component.find('.zc-tabs li.zctablist' + zid);
            var tabjson = { };
            self_.tabjson(tabjson, tab);
            // eslint-disable-next-line webperf/directly-select-with-id
            var editor = component.find(hzid);
            var editorjson = canvasOutput.createJson(editor);
            var undoobj = {
                action: 'layout', // NO I18N
                instance: self_,
                json: {
                    action: 'newtab', // NO I18N
                    previous: {
                        tab: tabjson,
                        tabid: zid,
                        container: editorjson,
                        isList: listflag
                    },
                    editor: component
                }
            }
            self_.savecanvasaction(undoobj);
            // FIXME:: Needs to handle by service
            tab.attr('data-zcqa', 'canvas-detail-tab-' + tabjson.name); // NO I18N
        }

        this.executeUndo = function (data) {
            switch (data.action) {
                case 'new':
                    data.node = $('#' + data.node.attr('id')); // NO I18N
                    var parentinst = zutils.getParentData(data.node);
                    parentinst && zutils.changelayoutscope(parentinst, 'Tab Layout'); // NO I18N
                    data.node.remove();
                    break;
                case 'rename':
                    data.node.text(data.previous);
                    break;
                case 'deletetab':
                    data.editor = $('#' + data.editor.attr('id'));
                    var component = data.editor;
                    var zid = data.previous.container.zcanvasId;
                    addnewtab(data.previous.tab.name, component.find('.zc-tab-container'), component, false, zid, data.previous.tab.icon, data.previous.tab.hideText, data.previous.tab.disabled);
                    var inst = $('#' + zid).data('zcanvas'); // NO I18N
                    inst.addElement(data.previous.container.children, null, { fieldscoping: true });
                    if (data.previous.container.ui.value && data.previous.container.ui.value.class && data.previous.container.ui.value.class.indexOf('zc-tab-all-fields') > -1) {
                        self_.bindscope(inst, '.zc-fieldsection'); // NO I18N
                        inst && inst.container && inst.container.zaddClass('zc-tab-all-fields'); // NO I18N
                    }
                    var $ul = component.find('.zc-tabs'); // NO I18N
                    //  var hzid = '#' + zid;
                    // var $el = $ul.find('li[data-tab="' + hzid + '"]'); // NO I18N
                    var $el = $ul.find('li.zctablist' + zid); // NO I18N
                    if (data.order) {
                        $el.insertAfter($ul.find('li:eq(' + (data.order - 1) + ')'));
                    } else {
                        $ul.prepend($el);
                    }
                    break;
                case 'rendertab':
                    data.editor = $('#' + data.editor.attr('id'));
                    self_.rerendertab(data, data.previous.hidetext, data.previous.icon);
                    break;
                case 'taborder':
                    data.editor = $('#' + data.editor.attr('id'));
                    var $tab = data.editor.find('.zc-tabs'); // NO I18N
                    // var li = $tab.find('li[data-tab="' + data.tab + '"]').hide();
                    var tabzid = data.tab.replace('#', '');
                    var li = $tab.find('li.zctablist' + tabzid).hide();
                    if (data.previous) {
                        li.insertAfter($tab.find('li:visible:eq(' + (data.previous - 1) + ')')).show();
                    } else {
                        // eslint-disable-next-line webperf/show-last
                        $tab.prepend(li.show())
                    }
                    break;
                case 'newtab':
                    data.editor = $('#' + data.editor.attr('id'));
                    var zid = data.previous.container.zcanvasId;
                    // var hzid = '#' + zid;
                    //  var tab = data.editor.find('.zc-tabs li[data-tab="' + hzid + '"]');
                    var tab = data.editor.find('.zc-tabs li.zctablist' + zid);
                    self_.deletetab(data.editor, tab.children('.tabname'), true); // NO I18N
                    break;
                case 'deleteLayout':
                    var $parent = zutils.getdatabyelement($(data.node));
                    $parent.addElement([data.previous], data.parentstyle);
                    break;
                default:
                    break;
            }
        }

        this.executeRedo = function (data) {
            switch (data.action) {
                case 'new':
                    var $parent = $('#' + data.editor.attr('id'));
                    var parentstyle = jsonCreation.getstyles($parent);
                    var parentdata = zutils.getdatabyelement($parent);
                    parentdata.addElement([data.current], { ui: { value: { style: parentstyle } } });
                    data.node = $('#' + data.current.zcanvasId);
                    break;
                case 'rename':
                    data.node.text(data.current);
                    break;
                case 'deletetab':
                    var component = $('#' + data.editor.attr('id'));
                    var zid = data.previous.container.zcanvasId;
                    //var hzid = '#' + zid;
                    // var el = component.find('li[data-tab="' + hzid + '"]'); // NO I18N
                    var el = component.find('li.zctablist' + zid); // NO I18N
                    self_.deletetab(component, el.find('.deletetabicon'), true);
                    break;
                case 'rendertab':
                    data.editor = $('#' + data.editor.attr('id'));
                    self_.rerendertab(data, data.current.hidetext, data.current.icon);
                    break;
                case 'taborder':
                    data.editor = $('#' + data.editor.attr('id'));
                    var $tab = data.editor.find('.zc-tabs'); // NO I18N
                    // var li = $tab.find('li[data-tab="' + data.tab + '"]').hide();
                    var tabzid = data.tab.replace('#', '');
                    var li = $tab.find('li.zctablist' + tabzid).hide();
                    if (data.current) {
                        li.insertAfter($tab.find('li:visible:eq(' + (data.current - 1) + ')')).show();
                    } else {
                        // eslint-disable-next-line webperf/show-last
                        $tab.prepend(li.show())
                    }
                    break;
                case 'newtab':
                    data.editor = $('#' + data.editor.attr('id'));
                    var component = data.editor;
                    var zid = data.previous.container.zcanvasId;
                    addnewtab(data.previous.tab.name, component.find('.zc-tab-container'), component, false, zid, data.previous.tab.icon, data.previous.tab.hideText, data.previous.tab.disabled);
                    var inst = $('#' + zid).data('zcanvas'); // NO I18N
                    inst.addElement(data.previous.container.children);
                    if (data.previous.container.ui.value && data.previous.container.ui.value.class && data.previous.container.ui.value.class.indexOf('zc-tab-all-fields') > -1) {
                        self_.bindscope(inst, '.zc-fieldsection'); // NO I18N
                        inst && inst.container && inst.container.zaddClass('zc-tab-all-fields'); // NO I18N
                    }
                    break;
                case 'deleteLayout':
                    self_.deletelayout($(data.editor), true);
                    break;
                default:
                    break;
            }
        }


        /**
         * Method to prefill the available RL Tabs loaded
         */

        this.prefilltabs = function (component) {
            var container = component.find('.zc-tab-container')
            self_.createdropdown(null, container, component, null, null).hide();
            var listitems = component.find('.zctab-dropdown li');
            var listlen = listitems.length;
            for (var i = 1; i < listlen; i++) {
                var item = listitems.eq(i);
                var data = item.data('zcreldata'); // NO I18N
                var zid = addnewtab(data.zclabel, container, component, false);
                //var hzid = '#' + zid;
                // component.find('.zc-tabs li[data-tab="' + hzid + '"]').addClass('zctab-nonfilled').data('zcrelfilldata',data); // NO I18N
                component.find('.zc-tabs li.zctablist' + zid).addClass('zctab-nonfilled').data('zcrelfilldata', data); // NO I18N
            }
            self_.lazyfill(component);
        }


        this.lazyfill = function (component) {
            var nonfilledtabs = component.find('.zc-tabs .zctab-nonfilled').eq(0); // NO I18N
            var data = nonfilledtabs.data('zcrelfilldata'); // NO I18N
            if (data) {
                var zid = nonfilledtabs.attr('data-tab').substring(1); // NO I18N
                var menuninstance = $(data.fieldContainer).data('zcanvasMenu');
                var config = menuninstance.config;
                config.zmenustart(data);
                self_.renderlist(component, data, zid, true, function (contextid) {
                    nonfilledtabs.removeClass('zctab-nonfilled'); // NO I18N
                    setTimeout(function () {
                        var context = $('#' + contextid);
                        context.css({ width: 'calc(100% - 60px)', height: 'calc(100% - 60px)' }); // NO I18N
                    }, 500)
                    self_.lazyfill(component);
                });
            }
        }


        this.renametab = function (component, el, input, noundo, encode) {
            var previous = input.data('zc-old-text'); // NO I18N
            // el = component.find('.zc-tabs li[data-tab="' + el + '"]')
            var tabzid = el.replace('#', '');
            el = component.find('.zc-tabs li.zctablist' + tabzid);
            var current = input.val().trim();
            if (encode) {
                current = encode(current);
            }
            el = el.find('.tabname').html(current);
            if (previous !== current && !noundo) {
                var undoobj = {
                    action: 'layout', // NO I18N
                    instance: self_,
                    json: {
                        action: 'rename', // NO I18N
                        current: current,
                        previous: previous,
                        node: el,
                        editor: component
                    }
                }
                self_.savecanvasaction(undoobj);
            }
        }

        this.getComponentStyle = function (tablayout) {
            var tselector = '#' + tablayout.attr('id') + '> .zc-tablist-container > .zc-tabs li.tab'; // NO I18N
            var sstyle = zutils.zcopyobj2(jsonCreation.toolinst.getstylebyselector(tselector, true, true));
            var sstyledata = {
                default: sstyle.default,
                hover: sstyle.hover,
                active: sstyle.active
            }
            sstyledata.container = jsonCreation.getstyles(tablayout.children('.zc-tablist-container').find('.zc-tabs')); // NO I18N
            sstyledata.editor = jsonCreation.getstyles(tablayout.children('.zc-tab-container'));  // NO I18N
            return sstyledata;
        }

        this.applyComponentStyle = function (component, style, flag) {
            var olddata = this.getComponentStyle(component);
            jsonCreation.toolinst.applyjsontostyle(component.find('.zc-tabs li'), style, null, null, true);
            jsonCreation.toolinst.applyjsontostyle(component.children('.zc-tab-container'), style.editor, null, null, true); // NO I18N
            jsonCreation.toolinst.applyjsontostyle(component.find('.zc-tabs'), style.container, null, null, true);
            if (flag) {
                return;
            }
            var undodata = {
                action: 'callback', // NO I18N
                node: '#' + component.attr('id'), // NO I18N
                previous: zutils.zcopyobj2(olddata),
                current: zutils.zcopyobj2(style),
                callback: function (data, operation, node) {
                    var newstyle = operation === 'undo' ? data.previous : data.current; // NO I18N
                    zclayout.prototype.layouts["Tab Layout"].applyComponentStyle(node, newstyle, 1); // NO I18N
                }
            }
            return undodata;

        }
    }();
})();

(function () {
    zclayout.prototype.layouts["Table Layout"] = new function () {
        var self_ = this;
        var template = '<div data-zc-min-width="120" class=\'zcanvas zcanvas-editor zclayout-table zclayout\' data-layoutname=\'Table Layout\' data-zcanvasclass=\'zclayout-table\'>\
                            <div data-tablecolumn=\'0\' class=\'zctableaddrow\'>+</div>\
                            <span class="zc-table-layout-draghandle"></span>\
                            <div class=\'zc-table-resizetable\'></div>\
                            <div class=\'zctable-sortable zcanvas zcanvas-skip-selection\'></div>\
                        </div>';



        this.getLabelHtml = function () {
            //  var html =   '<div style="position:relative"><table class="zctabicon"><tbody><tr><td style=" background: #404560; "></td><td style=" background: #32374e; "></td><td style=" background: #404560; "></td><td style=" background: #32374e; "></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr></tbody></table><div class="zciconlabel">' + I18n.getMsg('crm.dashboard.label.table') + '</div></div>'; // NO I18N
            var html = '<div class="zclisticon"><div class="zcl_container zctablelayouticon"></div><div class="zcl_title">' + I18n.getMsg('crm.dashboard.label.table') + '</div></div>'; // NO I18N
            return html;
        }

        /**
         *  Method for send template
         */
        this.gethtml = function () {
            return template;
        }

        /**
         * Method to call after drop
         */
        this.init = function (component, noconfig, undo, init, zid) {
            if (!noconfig) {
                var createflag = false;
                if (!zid) {
                    createflag = true;
                }
                this.configlayout(component, zid);
                // FIXME: Need to to with Config
                component.find('.zctableaddrow').attr('lt-prop-title', I18n.getMsg('crm.label.addColumn')); // NO I18N
                createflag && self_.newtable(component);
            }
            component.data('zcanvasclass', component.attr('data-zcanvasclass')); // NO I18N
        }

        /**
         * FIXME: Empty methods
         */
        // eslint-disable-next-line zohocrm/no-dummy-functions
        this.selectfieldonEditor = function (event) {
            // PURPOSE: added intentionally to overwrite the canvas (section) function
            return event;
        }

        /**
         * Method to configure the table
         */
        this.configlayout = function (component, zid) {
            var parenteditor = component.parent();
            var outinstance = parenteditor.data('zcanvas'); // NO I18N
            var mainconfig = zutils.zcopyobj(outinstance).config;

            // var selector = mainconfig.editorcontainer+" > .zcanvas:not('.ui-draggable-dragging,.zcanvas-multiselect')";//NO I18N
            // var selectorResizing = mainconfig.editorcontainer+" > .zcanvas:not('.ui-resizable-resizing,.zcanvas-multiselect')";//NO I18N

            var $sortableel = component.find('.zctable-sortable'); // NO I18N
            var data = $('.zcanvas-editor-outer').data('zcanvas');
            zid = zid || zutils.getRandomId();
            component.attr('id', zid); // NO i18N
            var style = component.data('layoutstyle') || { // NO I18N
                row: {
                    height: '50px' // NO i18N
                }
            }; // Empty style
            component.data('layoutstyle', style); // NO i18N
            // eslint-disable-next-line zstandard/combine-properties
            component.data('zcanvas', this); // NO i18N
            // Make component draggable
            component.draggable({
                containment: '.zcanvas-editor-outer', // NO I18N
                zcGuide: true,
                znoposition: true,
                snapTolerance: 5,
                scroll: false,
                appendGuideTo: mainconfig.editorcontainer,
                disabled: mainconfig.alwaysdisabled
            });
            // Make component resizable
            component.resizable({
                containment: 'parent', // NO I18N
                handles: 'e, s, se, w, sw , n , nw , ne', // NO I18N
                classes: { 'ui-resizable-se': 'zcanvas-resizable-se' }, // NO I18N
                zcGuide: true,
                snapTolerance: 5,
                zhandlevisible: true,
                appendGuideTo: mainconfig.editorcontainer,
                stop: function (event, ui) {
                    self_.savecanvasaction($(event.target), { node: '#' + event.target.getAttribute('id'), action: 'resize', previous: canvasObjUtils._.extend(ui.originalSize, ui.originalPosition), current: canvasObjUtils._.extend(ui.size, ui.position) }); // NO I18N
                }
            });
            // Handle Click
            component.click(function (e) {
                data && data.config && data.config.toolsRef && data.config.toolsRef.selectfield(e);
            }).mouseover(function (e) {
                data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e, true);
            }).mouseout(function (e) {
                data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e);
            });

            // Sortable Configuration
            $sortableel.sortable({
                items: ".zcanvas-row", // NO I18N
                tolerance: 'intersect', // NO I18N
                axis: 'y', // NO I18N
                handle: '.zc-table-sort',  // NO I18N
                refreshPositions: true,
                scroll: false,
                over: function (event, ui) {
                    self_.toggleothereditors(ui, true);
                    ui.helper && ui.helper.addClass('zcanvas-on-editor').removeClass('zcanvas-on-menu');
                    var item = ui.helper || ui.item;
                    var draginst = item.draggable('instance'); // NO I18N
                    if (!draginst) {
                        var zdata = item.data('zcanvas'); // NO I18N
                        if (zdata) {
                            var menuint = $(zdata.fieldContainer).data('zcanvasMenu'); // NO I18N
                            var drag = menuint ? menuint.getElementByKey('id', zdata.id) : ''; // NO I18N
                            draginst = $(drag).draggable('instance'); // NO I18N
                        }
                    }
                    if (draginst) {
                        if (!draginst.options.prescope) {
                            draginst.options.prescope = draginst.options.scope;
                            draginst.options.scope = component.attr('id'); // NO I18N
                        }

                        $.ui.ddmanager.prepareOffsets(draginst, event);
                    }
                },
                out: function (event, ui) {
                    self_.toggleothereditors(ui, false);
                    ui.helper && ui.helper.addClass('zcanvas-on-editor').removeClass('zcanvas-on-menu');
                    var item = ui.currentItem || ui.helper || ui.item;
                    var draginst = item.draggable('instance'); // NO I18N
                    if (draginst) {
                        draginst.options.scope = draginst.options.prescope || 'default'; // NO I18N
                        draginst.options.prescope = null;
                    }
                    if (ui.item.parent().length) {
                        var helper = ui.helper;
                        if (!helper) {
                            helper = ui.item;
                        }
                        var drag = helper.data('zcanvas'); // NO I18N
                        var dragdata = helper.draggable('instance'); // NO I18N
                        var drop = dragdata && dragdata._parent ? zutils.getdatabyelement(dragdata._parent) : null;
                        if (drag && drop && dragdata) {
                            var ismulti = drop.config && drop.config.multiresize && drop.config.multiresize.indexOf(drag.zctype) > -1;
                            var dragdata = dragdata.helperProportions
                            var obj = { };
                            // eslint-disable-next-line webperf/layout-thrashing
                            obj.width = dragdata.width;
                            if (ismulti) {
                                // eslint-disable-next-line webperf/layout-thrashing
                                obj.height = dragdata.height;
                            }
                            ui.item.css(obj); // NO I18N
                        } else {
                            ui.item.css({ 'width': 'auto', 'height': 'auto' }); // NO I18N
                        }

                    }
                },
                receive: self_.handledrop.bind(component),
                remove: function (event, ui) {
                    ui.helper && self_.preparedroppable(ui.helper, component, false);
                },
                start: function (event, ui) {
                    ui.item.attr('data-previndex', ui.item.index()); // NO I18N
                },
                stop: function (event, ui) {
                    if (ui.item.hasClass('zcanvas-row')) {
                        self_.rowsort(component, ui.item);
                        return;
                    }
                    ui.item.addClass('zcanvas');
                    var data = ui.item.data('zcanvas'); // NO I18N
                    ui.item.find(".zcanvas-holder").data("zcanvas", data); // NO I18N
                    var holderNode = ui.item.find(".zcanvas-data-node");//NO I18N
                    holderNode.zdata(data);
                    ui.item.css('height', 'auto'); //NO I18N
                    // TODO: Change once undo redo implemented
                    // self_.changedetection(component);
                }
            });

            var addcolumn = component.find('.zctableaddrow'); //NO I18N
            addcolumn.click(function (e) {
                var column = $(e.currentTarget);
                if (column) {
                    var count = parseInt(column.attr('data-tablecolumn')); // NO I18N
                    if (count >= 5) {
                        var parentinst = zutils.getParentData(component);
                        parentinst && parentinst.config && parentinst.config.toolsRef && parentinst.config.toolsRef.config && parentinst.config.toolsRef.config.validationerror('maxerror', 5, '_column_'); // NO I18N
                        return;
                    }
                }
                self_.addcolumn(component, true, true);
            });
            self_.addcolumn(component, true);

        }
        this.reducescope = function (element, ui) {
            if (!element) {
                element = ui.helper;
            }
            var zdata = element.data('zcanvas'); // NO I18N
            if (zdata) {
                var menu = $(zdata.fieldContainer).data('zcanvasMenu'); // NO I18N
                if (menu) {
                    menu.reduceScope(zdata);
                }
            }
        }
        this.handledrop = function (event, ui, flag) {
            var $sortable = this.find('.zctable-sortable');
            // Element already dropped in Droppable
            if (ui.helper && ui.helper.hasClass('zcdropped')) {
                ui.helper.remove();
                $sortable.sortable('refresh');  // NO I18N
                return;
            }
            flag && $sortable.sortable('refresh'); // NO I18N
            // Just an update no need to wrap
            if (!ui.helper && ui.item.is('.zcanvas-row')) {
                return;
            }

            if ($sortable.find('.zcanvas-row').length >= 1000) {
                var parentinst = zutils.getParentData(this);
                parentinst && parentinst.config && parentinst.config.toolsRef && parentinst.config.toolsRef.config && parentinst.config.toolsRef.config.validationerror('maxerror', 1000, '_row_'); // NO I18N
                $sortable.sortable('cancel'); // NO I18N
                if (ui.helper === ui.sender) {
                    var drag = ui.sender.draggable('instance'); // NO I18N
                    if (drag) {
                        var parentinst = drag._parent;
                        if (parentinst) {
                            parentinst.append(ui.sender.css(drag.originalPosition));
                        }
                    }

                } else {
                    ui.helper.remove();
                }

                return;

            }

            if (ui.helper !== ui.sender) {
                self_.reducescope(ui.sender, ui);
            }

            var $helper = ui.helper || ui.item;

            var draginst = ui.item.draggable('instance'); // NO I18N
            if (draginst) {
                draginst.options.scope = draginst.options.prescope;
                draginst.options.prescope = null;
            }
            // DONT accept when the helper is not inside the drop
            if (!$helper.closest(this).length) {
                return;
            }
            var fieldparent = !flag && !ui.item.hasClass('zcanvas-on-menu') ? ui.item.data('uiDraggable') : null; // NO I18N
            var zid = flag || zutils.getRandomId();
            var columnadd = this.find('.zctableaddrow');
            var availablecolumn = parseInt(columnadd.attr('data-tablecolumn')); // NO I18N
            var wraptemplate = '<div id = "' + zid + '" class="zcanvas-row zcanvas zcanvas-selectable zclayoutdeletable" data-layoutname="Table Layout" data-zcanvastooltype="row" data-zcanvasclass="zcanvas-row"><div class="zc-table-cell"></div><span class="zc-insert-trow"></span></div>';
            var sorttemplate = '<div class="zc-table-cell"></div>';
            var data = $helper.data('zcanvas');  // NO I18N
            var $clone = $helper.clone().css('height', 'auto');  // NO I18N
            $helper && $helper.wrapAll(wraptemplate);
            $helper.replaceWith($clone);
            var $wrapper = $clone.parents('.zcanvas-row');  // NO I18N
            $wrapper.prepend('<span class="ui-resizable-s ui-resizable-handle zctable-row-resize"></span><span class="zc-table-sort"></span>');
            while (availablecolumn - 1 > 0) {
                $wrapper.append(sorttemplate);
                availablecolumn--;
            }
            // FIXME: I18n needs to be config
            $wrapper.find('.zc-insert-trow').attr('lt-prop-title', I18n.getMsg('crm.canvas.builder.addrow')).click(self_.addbottomrow.bind(component)); // NO I18N
            self_.configdroppable($wrapper, this);
            self_.preaparedrag($clone, this, true, zutils.zcopyobj(data));
            $sortable.sortable('refresh');  // NO I18N
            self_.configrowresize($wrapper, this, zid);
            flag || event.stopImmediatePropagation();
            self_.blinkelement($wrapper);
            self_.toggleothereditors({ item: $clone }, false);
            if (this.hasClass('zc-no-theme')) { // NO I18N
                $wrapper.find('.zc-table-sort').css('position', 'absolute'); // NO I18N
            }
            // TODO: handle once undo redo implemented
            // self_.changedetection(this);
            flag || self_.newrow(this, $wrapper, ui, fieldparent);
        }
        this.configrowresize = function (wrapper, component, zid) {
            var data = $('.zcanvas-editor-outer').data('zcanvas');
            wrapper && wrapper.resizable({
                handles: {
                    s: '#' + zid + ' .zctable-row-resize'
                }, // NO i18N,
                zhandlevisible: true,
                start: function () {
                    component.addClass('zc-table-rowresizing'); // NO I18N
                },
                resize: canvasObjUtils._.debounce(function (e, ui) {
                    if (e && typeof e.length === 'number') {
                        ui = e[1];
                        e = e[0];
                    }
                    //  var oldheight = ui.originalSize.height;
                    //  var newheight = ui.size.height = oldheight + (  (ui.size.height - oldheight ) / 4 );
                    var newheight = ui.size.height;
                    self_.rowresize(newheight, component);

                }, 600),
                stop: function (e, ui) {
                    component.removeClass('zc-table-rowresizing'); // NO I18N
                    var undoredoobj = {
                        action: 'callback', // NO I18N
                        node: '#' + $(e.target).attr('id'), // NO I18N
                        previous: ui.originalSize.height,
                        current: ui.size.height,
                        table: '#' + component.attr('id'),
                        callback: function (data, method) {
                            var $table = $(data.table);
                            if (method === 'undo') {
                                self_.rowresize(data.previous, $table);
                            } else {
                                self_.rowresize(data.current, $table);
                            }
                        }
                    }
                    // TODO: change once the undo redo implemented
                    //self_.changedetection(component);
                    self_.savecanvasaction(component, undoredoobj);
                }
            });

            wrapper.mouseover(function (e) {
                data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e, true);
            }).mouseout(function (e) {
                data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e);
            })
        }
        this.rowresize = function (newheight, component) {
            var style = component.data('layoutstyle') || { }; // NO I18N
            style.row = style.row || { };
            style.row.height = newheight + 'px';
            self_.compilestyle(component);
        }
        this.configdroppable = function (row, component) {
            var drops = row.find('.zc-table-cell:not(.ui-droppable)'); // NO I18N
            component = component ? component : row.closest('.zclayout-table'); // NO I18N
            drops.droppable({
                tolerance: 'pointer',  // NO I18N
                hoverClass: 'zc-table-cell-active',  // NO I18N
                greedy: true,
                scope: component.attr('id'), // NO I18N
                // accept: '.zcanvas-field',  // NO I18N
                accept: function (draggable) {
                    //  return ( draggable.hasClass('zcanvas-field') && $(this).find('.zcanvas-field').length == 0 ); // NO I18N
                    var flag = false;
                    if (draggable.hasClass('zcanvas-field') && $(this).find('.zcanvas-field').length === 0) { // NO I18N
                        var zdata = draggable.data('zcanvas'); // NO I18N
                        var zinst = draggable.draggable('instance'); // NO I18N
                        if (zdata && zinst && zinst.options.zconnectToSortableCondition && !zinst.options.zconnectToSortableCondition(draggable)) {
                            flag = true;
                        }
                    }

                    return flag;
                },
                drop: function (event, ui, flag) {
                    if (ui.helper.hasClass('zcdropped')) {
                        return;
                    }

                    if (ui.draggable) {
                        var inst = ui.draggable.draggable('instance') || { }; // NO I18N
                        var current = $(inst.currentItem);
                        !current.hasClass('zcanvas-on-editor') && self_.reducescope(ui.draggable); // NO I18N
                        inst.options.scope = inst.options.prescope || 'default'; // NO I18N
                        inst.options.prescope = null;
                    }
                    component = component ? component : row.closest('.zclayout-table'); // NO I18N
                    var target = $(event.target);
                    var data = ui.helper.data();  // NO I18N
                    self_.newcell(component, target.parent(), target, data, flag)
                    var $item = flag || ui.helper.clone();
                    target.append($item);
                    $item.css({ top: 0, left: 0, height: 'auto' });  // NO I18N
                    $item.removeClass('ui-draggable-dragging');
                    self_.blinkelement($item);
                    flag || ui.helper.addClass('zcdropped');
                    event.stopImmediatePropagation();
                    self_.preaparedrag($item, component, true, zutils.zcopyobj(data.zcanvas));

                },
                over: function () {
                    var $sortable = row.parents('.ui-sortable');  // NO I18N
                    $sortable.addClass('zcoverdrop');
                },
                out: function () {
                    var $sortable = row.parents('.ui-sortable');  // NO I18N
                    $sortable.removeClass('zcoverdrop');
                }
            })
        }
        this.preaparedrag = function (item, component, flag, data) {
            var pdata = $('.zcanvas-editor-outer').data('zcanvas');
            var config = pdata.config;
            var hasdrag = false;
            !hasdrag || item.has('.zctablehandler').length || item.prepend('<span class="zctablehandler zc-remove-meta"></span>')
            hasdrag || item.removeClass('ui-draggable');
            !hasdrag || item.draggable({
                containment: config.zccontainment,
                zconnectToSortable: '.zcanvas:not(.zc-non-linkable)', //NO I18N
                cursorAt: {
                    top: 0, left: 5
                },
                scroll: false,
                appendTo: 'body',  // NO I18N
                handle: '.zctablehandler' // NO i18N
            });
            item.data('zcanvas', data).zdata(data);  // NO I18N

            item.addClass('zc-table-field'); // NO I18N

            var $hoverel = item.add(item.find('.zcanvas-holder , .zcanvas-inner-component')); // NO I18N

            $hoverel.mouseover(function (e) {
                config && config.toolsRef && config.toolsRef.hoverfield(e, true);
            }).mouseout(function (e) {
                config && config.toolsRef && config.toolsRef.hoverfield(e);
            });


            // TODO: change once undo redo implemented
            flag && self_.changedetection(component);
        }
        // Method to add column
        this.addcolumn = function (component, flag, undoflag) {
            var columnadd = component.find('.zctableaddrow'); // NO I18N
            var availablecolumn = parseInt(columnadd.attr('data-tablecolumn')); // NO I18N
            availablecolumn++; // Add one column
            // Add Style to component
            var percent = 100 / availablecolumn + '%';
            var compstyle = component.data('layoutstyle') || { };  // NO I18N
            compstyle.field = compstyle.field || { };
            compstyle.field.width = percent;
            self_.compilestyle(component);
            // Add another table resizer
            var $addtemp = $('<div class="zc-table-cell"><div class="zcanvas-field zc-no-contextmenu"><div class="zcanvas-data-node"><div style="position:relative" class="zcanvas-inner-component zcanvas-non-selectable" data-selection="label" data-child=" ' + availablecolumn + '"><span lt-prop-title=' + encodeURIComponent(I18n.getMsg('crm.social.delete.column')) + ' class="zc_delete_column"></span></div><div class="zcanvas-inner-component zcanvas-non-selectable" data-selection="value" data-child=" ' + availablecolumn + '"></div></div></div></div>');
            component.find('.zc-table-resizetable').append($addtemp);
            compstyle.inner = compstyle.inner || [];
            compstyle.inner.push({ }); // Empty object for maintain the inner component height
            columnadd.attr('data-tablecolumn', availablecolumn);  // NO I18N
            var $topcells = $addtemp.find('.zcanvas-inner-component');
            $topcells.click(self_.selectcells.bind(component));
            self_.configcellresize($topcells.first(), component);
            var del_el = $addtemp.find('.zc_delete_column'); // NO I18N
            // FIXME: i18n
            del_el.attr('lt-prop-title', I18n.getMsg('crm.social.delete.column')); //NO I18N
            del_el.click(self_.deletecolumn);
            flag && self_.createdrops(component, availablecolumn);
            // TODO: change once undo redo implemented
            // !flag && self_.changedetection(component);
            undoflag && self_.newcolumn(component);
        }
        this.deletecolumn = function (e) {

            var $target = $(e.target);
            var index = parseInt($target.closest('.zcanvas-inner-component').attr('data-child')); // NO I18N
            var component = $target.closest('.zclayout-table'); // NO I18N
            var prev = canvasOutput.createJson(component);
            var rows = component.find('.zcanvas-row'); // NO I18N
            var rowln = rows.length;
            var $rtable = component.find('.zc-table-resizetable .zc-table-cell');
            var columnadd = component.find('.zctableaddrow'); // NO I18N
            var availablecolumn = parseInt(columnadd.attr('data-tablecolumn'));  // NO I18N
            availablecolumn--;
            if ($rtable.length > 1) {
                for (var i = 0; i < rowln; i++) {
                    var cell = rows.eq(i).find('.zc-table-cell').eq(index - 1);
                    var fieldcell = cell.find('.zcanvas-field');
                    fieldcell.length && zutils.deletefield(fieldcell, true);
                    cell.remove();
                }
                //  $rtable.eq(index - 1).remove();
                $($rtable.splice(index - 1, 1)).remove();
                var rln = $rtable.length;
                for (var i = 0; i < rln; i++) {
                    var field = $rtable.eq(i).find('.zcanvas-inner-component');
                    field.attr('data-child', i + 1); // NO I18N
                }
                columnadd.attr('data-tablecolumn', availablecolumn); // NO I18N
                var percent = 100 / availablecolumn + '%';
                var compstyle = component.data('layoutstyle') || { };  // NO I18N
                compstyle.field = compstyle.field || { };
                compstyle.field.width = percent;
                self_.compilestyle(component);
                var current = canvasOutput.createJson(component);
                var undoredoobj = {
                    action: 'callback', // NO I18N
                    node: '#' + component.attr('id'), // NO I18N
                    parent: '#' + component.parent().attr('id'),
                    previous: prev,
                    current: current,
                    callback: function (data, method) {
                        var component = $(data.node);
                        zutils.deleteElement(component, true);
                        var parentinst = zutils.getdatabyelement($(data.parent));
                        if (method === 'undo') {
                            parentinst.addElement([data.previous]);
                        } else {
                            parentinst.addElement([data.current]);
                        }
                    }

                }
                self_.savecanvasaction(component, undoredoobj);
            } else {
                zutils.deleteElement(component);
            }


        }

        // Method to select cells
        this.selectcells = function (e, flag) {
            var $target = $(e.target);
            var childl = $target.attr('data-child'); // NO I18N
            if (!childl) {
                e.stopPropagation();
                return;
            }
            var column = parseInt(childl); // NO I18N
            var type = $target.attr('data-selection'); // NO I18N
            var selector = '.zc-table-cell:nth-of-type(' + column + ') .zcanvas-field'; // NO I18N
            selector += type === 'label' ? ' .zcanvas-label' : ' .zcanvas-value-container'; // NO I18N
            var selectedfields = this.find('.zcanvas-row ' + selector);
            var data = $('.zcanvas-editor-outer').data('zcanvas');
            if (flag) {
                return selectedfields;
            } else {
                data && data.config && data.config.toolsRef && data.config.toolsRef.selectfield(selectedfields);
            }
            e.stopPropagation();
        }
        this.getcellsbyevent = function (e) {
            var $target = $(e.target);
            var childl = $target.attr('data-child'); // NO I18N
            if (!childl) {
                e.stopPropagation();
                return;
            }
            var column = parseInt(childl); // NO I18N
            var selector = '.zc-table-cell:nth-of-type(' + column + ')'; // NO I18N
            var selectedfields = this.find('.zcanvas-row ' + selector);
            return selectedfields;
        }
        // Method to config resizer
        this.configcellresize = function (el, component) {
            el.resizable({
                containment: 'parent', // NO I18N
                handles: 'e', //NO I18N
                zhandlevisible: true,
                classes: { 'ui-resizable-se': 'zcanvas-resizable-se' }, // NO I18N
                start: function (e) {
                    var outheight = component.outerHeight();

                    $(e.target).find('.ui-resizable-e').addClass('zc-column-resizing').height(outheight); // NO I18N
                },
                resize: function (event, ui) {

                    var $el = ui.element;
                    self_.columnresize($el, component);
                    // TODO: change once the undo redo implemented
                    // self_.changedetection(component);
                },
                stop: function (e, ui) {
                    $(e.target).find('.ui-resizable-e').removeClass('zc-column-resizing').css('height', ''); // NO I18N
                    var undoredoobj = {
                        node: '#' + component.attr('id'), // NO I18N
                        action: 'callback', // NO I18N
                        previous: ui.originalSize.width,
                        current: ui.size.width,
                        index: ui.element.attr('data-child'),//NO I18N
                        callback: function (data, method, node) {
                            var $tableresize = node.find('.zc-table-resizetable'); // NO I18N
                            var resizenode = $tableresize.find('.zc-table-cell:eq(' + (data.index - 1) + ') .ui-resizable'); // NO I18N
                            if (method === 'undo') {
                                resizenode.width(data.previous);
                            } else {
                                resizenode.width(data.current);
                            }
                            self_.columnresize(resizenode, node);
                        }
                    }
                    self_.savecanvasaction(component, undoredoobj);
                }
            });
        }
        this.columnresize = function ($el, component) {
            var child = $el.attr('data-child'); //NO I18N
            var lpercent = $el.width() / $el.parent().width() * 100;
            var style = component.data('layoutstyle') || { };  // NO I18N
            style.inner = style.inner || [];
            style.inner[child - 1] = { percent: lpercent };
            self_.compilestyle(component);
        }
        this.createdrops = function (component, number) {
            var $rows = component.find('.zcanvas-row');
            $rows.each(function () {
                var sorttemplate = $('<div class="zc-table-cell"></div>');
                var $row = $(this);
                var dropslen = $row.find('.zc-table-cell').length;
                var diffdrops = number - dropslen;
                while (diffdrops > 0) {
                    $row.append(sorttemplate);
                    diffdrops--;
                }
                self_.configdroppable($row);
            })
        }
        // Make other droppabled disable
        this.toggleothereditors = function (ui, flag) {
            var $item = ui.item || ui.helper;
            var _outeditor = $('.zcanvas-editor-outer'); // NO I18N
            _outeditor.droppable('option', 'disabled', flag); // NO I18N
            var parenteditor = _outeditor.find('.zcanvas-editor.ui-droppable'); // NO I18N
            if (flag) {
                parenteditor.addClass('zc-table-disableddrop').removeClass('ui-droppable-active ui-droppable-hover zcanvas-overeditor'); // NO I18N
                _outeditor.removeClass('ui-droppable-active ui-droppable-hover zcanvas-overeditor'); // NO I18N
                $item.removeClass("zcOvertable");//NO I18N
            } else {
                parenteditor.removeClass('zc-table-disableddrop'); // NO I18N
                $item.addClass("zcOvertable");//NO I18N
            }

            parenteditor.droppable('option', 'disabled', flag); // NO I18N
        }
        // Method to draggable while sortable started to move
        this.preparedroppable = function (item, component, flag) {
            if (flag) {
                item.on('mousedown.ztablelayout', function () {
                    component.draggable('option', 'disabled', true); // NO I18N
                    $(window).on('mouseup.ztablelayout', function () {
                        component.draggable('option', 'disabled', false);  // NO I18N
                        setTimeout(function () {
                            $(window).off('mouseup.ztablelayout');
                        }, 100);
                    })
                })
            } else {
                item.off('mousedown.ztablelayout'); // NO I18N
            }
        }

        this.compilestyle = function (component) {
            var id = component.attr('id'); // NO I18N
            var styletag = $('<style/>');
            var styleobj = component.data('layoutstyle') || { }; // NO I18N
            var stylestr = '';
            var field = styleobj.field;

            var pretag = '#' + id + ' .zc-table-cell' + ',#' + id + ' .zctable-sortable > .zcanvas-field {';

            for (var key in field) {
                pretag += key + ':' + field[key] + ' !important;';
            }

            pretag += ' }';

            stylestr += pretag;

            var row = styleobj.row;

            var rowtag = '#' + id + ' .zcanvas-row:not(.ui-resizable-resizing) {';

            for (var key in row) {
                rowtag += key + ':' + row[key] + ' !important;';
            }

            rowtag += ' }';

            stylestr += rowtag;

            var inner = styleobj.inner || [];
            var innerlen = inner.length;
            var innertag = '';
            for (var i = 0; i < innerlen; i++) {
                var percent = inner[i].percent;
                var lpercent = percent + '%';
                var vpercent = 100 - percent + '%';
                innertag += '#' + id + ' .zcanvas-row .zc-table-cell:nth-of-type(' + (i + 1) + ') .zcanvas-label { width :' + lpercent + ' } '; //NO I18N
                innertag += '#' + id + ' .zcanvas-row .zc-table-cell:nth-of-type(' + (i + 1) + ') .zcanvas-value-container { width :' + vpercent + ' } '; //NO I18N
            }
            stylestr += innertag;

            styletag.html(stylestr);
            component.children('style').remove(); // NO i18N
            component.append(styletag);
            // TODO: change once undo redo implemented
            //self_.changedetection(component);
        }

        // Method to generate the json from component
        this.toJson = function (node) {
            var $node = $(node);
            var $rows = $node.find('.zcanvas-row');
            var json = {
                children: [],
                ui: {
                    value: jsonCreation.getValue($node)
                },
                zcanvasId: '#' + $node.attr('id'),
                _type: "component", //NO I18N
                theme: "Table Layout" //NO I18N
            }
            json.ui.value.layoutstyle = $node.data('layoutstyle') // NO I18N
            var tnode = $node.data('zcanvasdata'); // NO I18N
            if (tnode && tnode.systemid) {
                json.ui.value.system_id = tnode.systemid;
            }
            $rows.each(function () {
                var $el = $(this);
                var $cells = $el.find('.zc-table-cell');
                var rowjson = {
                    children: [],
                    zcanvasId: $el.attr('id'), // NO I18N
                    ui: {
                        value: {
                            position: jsonCreation.getposition($el),
                            style: jsonCreation.getstyles($el),
                            class: $el.data('zcanvasclass') // NO I18N
                        }
                    },
                    _type: "row" //NO I18N
                }
                var ndata = $el.data('zcanvasdata'); // NO I18N
                if (ndata && ndata.systemid) {
                    rowjson.ui.value.system_id = ndata.systemid;
                }
                $cells.each(function () {
                    var $tcell = $(this);
                    var field = $tcell.find(".zcanvas-field");//NO I18N
                    if (field.length > 0) {
                        var fieldjson = canvasOutput.createJson(field);
                    } else {
                        var fieldjson = {
                            ui: { },
                            children: [],
                            _type: "empty-field"//NO I18N
                        };
                        fieldjson.ui.value = { };
                        fieldjson.ui.value.class = 'zc-table-cell';// NO I18N
                    }
                    rowjson.children.push(fieldjson);
                });

                // eslint-disable-next-line webperf/no-multipleDOMLookup
                json.children.push(rowjson);
            })
            return json;
        }

        // Method to generate the view from json
        this.toView = function (json, currentnode) {
            var jsonHeight = json.ui.value.position.height;
            var $node = $(currentnode).css('width', '100%');
            var zid = zutils.getRandomId();
            $node.attr('id', zid); // NO I18N
            // var html = canvasOutput.html(null, json);
            // FIXME: Quick fix
            json.theme = 'Custom Layout'; // NO I18N
            var html = createStruture.layoutHtml(null, json);
            $(html).find(".zcanvas-row > .zcanvas-field").each(function () {
                var el = $(this);
                el.addClass('zc-no-theme'); // NO I18N
                el.wrapAll("<div class='zc-table-cell'></div>");//NO I18N
            });


            if (json.ui.value.layoutstyle && json.ui.value.layoutstyle.row && json.ui.value.layoutstyle.row) {
                json.ui.value.layoutstyle.row['min-height'] = json.ui.value.layoutstyle.row.height; // NO i18N
                delete json.ui.value.layoutstyle.row.height;
            }
            $node.data('layoutstyle', json.ui.value.layoutstyle); // NO I18N
            self_.compilestyle($node);
            createStruture.applystyle($(html), json.ui.value.style || { });
            $(html).css('min-height', jsonHeight);//NO I18N
            if (json.ui.value.fixedHeight || json.ui.value.fixed) {
                html.css({ 'overflow-y': 'auto', 'height': jsonHeight }); // NO I18N
            }
            return html;
        }

        this.toDom = function (json, container, padingLeft, padingTop) {
            var $template = $(template);
            var childlen = json.children.length;
            json.zcanvasId = json.zcanvasId || zutils.getRandomId()
            $template.css({
                left: json.ui.value.position.startX + (padingLeft || 0),
                top: json.ui.value.position.startY + (padingTop || 0),
                width: json.ui.value.position.width,
                height: json.ui.value.position.height,
                zIndex: json.ui.value.position.depth
            }).attr('id', json.zcanvasId); // NO I18N
            $template.addClass(json.ui.value.class).zaddClass(json.ui.value.class);
            container.append($template);
            var $sortable = $template.find('.zctable-sortable'); // NO I18N
            var assigndata = function (index, element) {
                var $field = $(element);
                var zdata = $field.zdata()[0];
                $field.data('zcanvas', zdata); // NO I18N
                if (!$template.zhasClass('zcrestricttable') && zdata) {
                    var menuinst = $(zdata.fieldContainer).data('zcanvasMenu');
                    menuinst &&
                        menuinst.reduceScope(zdata);
                }
                var childrens = this.json && this.json.children[index];
                if (this.inst && childrens) {
                    this.inst.config && this.inst.config.onaddelement && this.inst.config.onaddelement($field, childrens);
                }
            };
            var parentinst = zutils.getParentData($template);
            for (var i = 0; i < childlen; i++) {
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                var fieldst = canvasOutput.innerNode(json.children[i], true);
                var field = $(fieldst);
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                if (json.children[i].zcanvasId) {
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    field.attr('id', json.children[i].zcanvasId);
                } else {
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    field.attr('id', zutils.getRandomId()); // NO I18N
                }
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                var childnodes = json.children[i];
                parentinst && parentinst.config && parentinst.config.onaddelement && parentinst.config.onaddelement(field, childnodes);
                field.find('.zcanvas-field').each(assigndata.bind({ json: childnodes, inst: parentinst }));
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                if (json.children[i].ui && json.children[i].ui.value && json.children[i].ui.value.style) {
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    field.zccss(json.children[i].ui.value.style)
                }
                $sortable.append(field);
            }

            var $rows = $sortable.find('.zcanvas-row'); // NO i18N
            $rows.each(function () {
                var cell = $(this);
                var zid = cell.attr('id') || zutils.getRandomId(); // NO I18N

                cell.find('.zcanvas-field').each(function () {
                    $(this).wrapAll('<div class="zc-table-cell"></div>');
                })
                cell.addClass('zcanvas-selectable zclayoutdeletable').attr('data-layoutname', 'Table Layout').attr('data-zcanvastooltype', 'row'); // NO I18N
                cell.attr('id', zid); // NO I18N
                self_.configdroppable(cell, $template);
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                var draggable = cell.find('.zcanvas-field');
                draggable.each(function () {
                    var dragdata = $(this).data('zcanvas');
                    self_.preaparedrag($(this), $template, false, zutils.zcopyobj(dragdata));
                })
                cell.prepend('<span class="ui-resizable-s ui-resizable-handle zctable-row-resize"></span><span class="zc-table-sort"></span><span class="zc-insert-trow"></span>');
                if ($template.hasClass('zc-no-theme')) {
                    cell.find('.zc-table-sort').css('position', 'absolute'); // NO I18N
                }
                self_.configrowresize(cell, $template, zid);
                cell.find('.zc-insert-trow').attr('lt-prop-title', I18n.getMsg('crm.canvas.builder.addrow')).click(self_.addbottomrow.bind($template)); // NO I18N
            });
            var $addtemps = $($rows.eq(0)).find('.zc-table-cell'); // NO I18N
            var tempslen = $addtemps.length;
            while (tempslen > 1) {
                self_.addcolumn($template);
                tempslen--;
            }
            $template.data('layoutstyle', json.ui.value.layoutstyle); // NO I18N
            self_.init($template, null, null, null, json.zcanvasId);
            self_.compilestyle($template);
            $template.zccss(json.ui.value.style);
            self_.applytopresize($template, json.ui.value.layoutstyle);
            parentinst && zutils.changelayoutscope(parentinst, 'Table Layout', true); // NO I18N
            return $template;
        }

        this.applytopresize = function (component, style) {
            if (!style) { return; }
            var innerstyle = style.inner || [];
            var instlen = innerstyle.length;
            var tabletop = component.find('.zc-table-resizetable .zc-table-cell'); // NO I18N
            for (var i = 0; i < instlen; i++) {
                tabletop.eq(i).find('.ui-resizable').css('width', (innerstyle[i].percent || 50) + '%'); // NO I18N
            }
        }

        this.blinkelement = function (el) {
            $('.zc-blink-bg').removeClass('zc-blink-bg'); // NO I18N
            el.addClass('zc-blink-bg');
            setTimeout(function () {
                el.removeClass('zc-blink-bg');
            }, 1500);
        }

        this.deletelayout = function (element) {
            var component = element.closest('.zclayout-table'); // NO I18N
            if (element.is('.zcanvas-row')) {
                self_.deleteRow(component, element);
            }
            var $field = element.closest('.zcanvas-field'); // NO I18N
            if ($field.length) {
                self_.deleteField(component, element);
            }
        }

        this.changedetection = function (element) {
            var config;
            if (element) {
                config = element.data('zclayoutconfig'); // NO I18N
                config && config.onChange && config.onChange();
            }
        }

        this.savecanvasaction = function (element, object) {
            var inst = zutils.getParentData(element);
            inst && inst.config.undoredomanager.push(object);
            self_.changedetection(element);
            return object;
        }

        this.converttotable = function (element, container) {
            var cprops = container.position();
            cprops.width = container.width();
            cprops.height = container.height();
            cprops.position = 'absolute'; // NO I18N
            var $template = $(template);
            var $sortable = $template.find('.zctable-sortable'); // NO I18N
            element = $(canvasObjUtils._.sortBy(element, function (_el) { return _el.offsetTop; }));
            var ellen = element.length;
            container.replaceWith($template);
            $template.css(cprops).addClass('zc-no-theme').zaddClass('zc-no-theme'); // NO I18N
            var tzid = zutils.getRandomId();
            var undoredoobj = {
                action: 'callback', // NO I18N
                node: '#' + tzid,
                parent: '#' + $template.parent().attr('id'),
                basenodes: []
            }
            for (var i = 0; i < ellen; i++) {
                var zid = zutils.getRandomId();
                undoredoobj.basenodes.push(canvasOutput.createJson(element.eq(i)));
                var dragdata = element.eq(i).data('zcanvas'); // NO I18N
                var field = element.eq(i).clone();
                field.css({ 'top': 'initial', 'left': 'initial', 'position': 'initial' }); // NO I18N
                var $holder = field.find('.zcanvas-data-node');
                var classes = $holder.attr('data-zcanvasclass'); // NO I18N
                $holder.removeClass(classes).zremoveClass(classes);
                var wraptemplate = '<div id = "' + zid + '" class="zcanvas-row zcanvas zcanvas-selectable zclayoutdeletable" data-layoutname="Table Layout" data-zcanvastooltype="row" data-zcanvasclass="zcanvas-row"><div class="zc-table-cell"></div></div>';
                var $row = $(wraptemplate);
                $row.prepend('<span class="ui-resizable-s ui-resizable-handle zctable-row-resize"></span><span class="zc-table-sort"></span>');
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                $row.find('.zc-table-cell').append(field);
                $sortable.append($row);
                self_.preaparedrag(field, $template, false, zutils.zcopyobj(dragdata));
                self_.configrowresize($row, $template, zid);

            }
            element.remove();
            self_.init($template, null, null, null, tzid);
            var layoutstyle = $template.data('layoutstyle'); // NO I18N
            layoutstyle.row.height = '21px';
            self_.compilestyle($template);
            var pdata = zutils.getParentData($template);
            var toolref = pdata.config.toolsRef;
            toolref.applyjsontostyle($template, { default: { 'background-color': 'rgba(0,0,0,0)' } }); // NO I18N
            undoredoobj.basetable = self_.newtable($template, true);
            undoredoobj.callback = function (data, method) {
                if (method === 'undo') {
                    // eslint-disable-next-line zstandard/no-commoncode-in-ifelse
                    data.basetable.callback(data.basetable, method, $(data.node));
                    var $parent = $(data.parent).data('zcanvas'); // NO I18N
                    var fieldslen = data.basenodes.length;
                    $parent.addElement(data.basenodes);
                } else {
                    var fieldslen = data.basenodes.length;
                    for (var i = 0; i < fieldslen; i++) {
                        $('.' + data.basenodes[i].zcanvasId).remove();
                    }
                    // eslint-disable-next-line zstandard/no-commoncode-in-ifelse
                    data.basetable.callback(data.basetable, method, $(data.node));
                }
            }
            var parentinst = zutils.getParentData($template);
            parentinst && zutils.changelayoutscope(parentinst, 'Table Layout', true); // NO I18N
            self_.savecanvasaction($template, undoredoobj);
            return $template;
        }

        this.newtable = function (component, flag) {
            var $parent = component.parent();
            var parentid = $parent.attr('id'); // NO I18N
            var parentstyle = jsonCreation.getstyles($parent);
            var json = canvasOutput.createJson(component);
            var undoredoobj = {
                action: 'callback', // NO I18N
                node: '#' + component.attr('id'), // NO I18N
                parent: '#' + parentid,
                parentstyle: parentstyle,
                json: json,
                callback: function (data, method, node) {
                    if (method === 'undo') {
                        var parentinst = zutils.getParentData(node);
                        parentinst && zutils.changelayoutscope(parentinst, 'Table Layout'); // NO I18N
                        node.remove();
                    } else {
                        var pdata = zutils.getdatabyelement($(data.parent));
                        pdata.addElement([data.json], { ui: { value: { style: parentstyle } } });
                    }
                }
            }
            if (flag) {
                return undoredoobj;
            }

            var undoref = self_.savecanvasaction(component, undoredoobj);
            zutils.overlapHandling(component, undoref);
        }


        this.newrow = function (component, row, ui, fieldparent) {
            var undoredoobj = {
                action: 'callback', // NO I18N
                node: '#' + row.attr('id'),
                parent: '#' + component.attr('id'),
                index: row.index(),
                fieldjson: canvasOutput.createJson(row.find('.zcanvas-field'))
            }
            if (fieldparent) {
                undoredoobj.previous = fieldparent.originalPosition;
                undoredoobj.width = fieldparent.helperProportions.width;
                undoredoobj.previous.container = '#' + fieldparent._parent.attr('id');
            }
            undoredoobj.callback = function (data, method, node) {
                if (method === 'undo') {
                    node.remove();
                    if (data.previous) {
                        var fieldjson = JSON.parse(JSON.stringify(data.fieldjson));
                        // eslint-disable-next-line webperf/layout-thrashing
                        fieldjson.ui.value.position.startX = data.previous.left;
                        // eslint-disable-next-line webperf/layout-thrashing
                        fieldjson.ui.value.position.width = data.previous.width;
                        // eslint-disable-next-line webperf/layout-thrashing
                        fieldjson.ui.value.position.startY = data.previous.top;
                        var zcont = $(data.previous.container).data('zcanvas'); // NO I18N
                        zcont.addsingleElement(fieldjson);
                    }
                } else {
                    //   $('[data-zcanvasId="'+data.fieldjson.zcanvasId+'"').parent().remove();
                    var $node = $(canvasOutput.innerNode(data.fieldjson, true));
                    $node.data('zcanvas', $node.zdata()[0]);
                    var $parent = $(data.parent);
                    var $sortable = $parent.find('.zctable-sortable');
                    if (data.index) {
                        $node.insertAfter($sortable.find('.zcanvas-row:eq(' + (data.index - 1) + ')'));
                    } else {
                        $sortable.prepend($node);
                    }
                    self_.handledrop.bind($parent)(null, { item: $node }, data.node.replace('#', ''));
                }
            }
            self_.savecanvasaction(component, undoredoobj);
        }

        this.addbottomrow = function (e) {
            var $row = $(e.target).closest('.zcanvas-row');
            self_.insertRow($row.closest('.zclayout-table'), $row); // NO I18N
        }
        this.insertRow = function (component, row, flag) {
            var sortable = component.find('.zctable-sortable'); // NO I18N
            if (sortable.find('.zcanvas-row').length >= 1000) {
                var parentinst = zutils.getParentData(component);
                parentinst && parentinst.config && parentinst.config.toolsRef && parentinst.config.toolsRef.config && parentinst.config.toolsRef.config.validationerror('maxerror', 1000, '_row_'); // NO I18N
                return;
            }
            var zid = flag || zutils.getRandomId();
            var columnadd = component.find('.zctableaddrow');
            var availablecolumn = parseInt(columnadd.attr('data-tablecolumn')); // NO I18N
            var wraptemplate = '<div id = "' + zid + '" class="zcanvas-row zcanvas zcanvas-selectable zclayoutdeletable" data-layoutname="Table Layout" data-zcanvastooltype="row" data-zcanvasclass="zcanvas-row"><div class="zc-table-cell"></div><span class="zc-insert-trow"></span></div>';
            var sorttemplate = '<div class="zc-table-cell"></div>';
            var $wrapper = $(wraptemplate)  // NO I18N
            $wrapper.insertAfter(row);
            $wrapper.prepend('<span class="ui-resizable-s ui-resizable-handle zctable-row-resize"></span><span class="zc-table-sort"></span>');
            while (availablecolumn - 1 > 0) {
                $wrapper.append(sorttemplate);
                availablecolumn--;
            }
            // FIXME i18N
            $wrapper.find('.zc-insert-trow').attr('lt-prop-title', I18n.getMsg('crm.canvas.builder.addrow')).click(self_.addbottomrow.bind(component)); // NO I18N
            self_.configdroppable($wrapper, component);
            self_.configrowresize($wrapper, component, zid);
            self_.blinkelement($wrapper);
            if (component.hasClass('zc-no-theme')) { // NO I18N
                $wrapper.find('.zc-table-sort').css('position', 'absolute'); // NO I18N
            }

            flag || self_.savecanvasaction(component, {
                action: 'callback', // NO I18N
                node: '#' + component.attr('id'),
                index: $wrapper.index(),
                row: zid,
                callback: function (data, method) {
                    if (method === 'undo') {
                        $('#' + zid).remove();
                    } else {
                        self_.insertRow($(data.node), $(data.node + ' .zctable-sortable .zcanvas-row:eq(' + (data.index - 1) + ')'), data.row);
                    }
                }
            });
            sortable.sortable('refresh');  // NO I18N
        }

        this.newcolumn = function (component) {
            var columnadd = component.find('.zctableaddrow');
            var availablecolumn = parseInt(columnadd.attr('data-tablecolumn')); // NO I18N
            var undoredoobj = {
                action: 'callback', // NO I18N
                node: '#' + component.attr('id'),
                index: availablecolumn,
                callback: function (data, method, node) {
                    if (method === 'undo') {
                        var availablecolumn = data.index;
                        var resizable = node.find('.zc-table-resizetable');
                        resizable.find('.zc-table-cell:nth-child(' + availablecolumn + ')').remove();
                        node.find('.zcanvas-row').each(function () {
                            $(this).find('.zc-table-cell:nth-child(' + availablecolumn + ')').remove();
                        });
                        availablecolumn--;
                        var percent = 100 / availablecolumn + '%';
                        var compstyle = node.data('layoutstyle') || { };  // NO I18N
                        compstyle.field = compstyle.field || { };
                        compstyle.field.width = percent;
                        self_.compilestyle(node);
                        var columnadd = component.find('.zctableaddrow'); // NO I18N
                        columnadd.attr('data-tablecolumn', availablecolumn); // NO I18N
                    } else {
                        self_.addcolumn(node, true, false);
                    }
                }
            }
            self_.savecanvasaction(component, undoredoobj);
        }
        this.rowsort = function (component, row) {
            var undoredoobj = {
                action: 'callback', // NO I18N
                node: '#' + row.attr('id'), // NO I18N
                previous: parseInt(row.attr('data-previndex')), // NO I18N
                current: row.index(),
                editor: '#' + component.attr('id'), // NO I18N
                callback: function (data, method, node) {
                    if (method === 'undo') {
                        if (data.previous) {
                            node.insertAfter($(data.editor + ' .zctable-sortable .zcanvas-row:eq(' + data.previous + ')')); // NO I18N 
                        } else {
                            $(data.editor + ' .zctable-sortable').prepend(node);
                        }
                    } else if (method === 'redo') { // NO I18N 
                        if (data.current) {
                            node.insertAfter($(data.editor + ' .zctable-sortable .zcanvas-row:eq(' + data.current + ')')); // NO I18N 
                        } else {
                            $(data.editor + ' .zctable-sortable').prepend(node);
                        }
                    }
                }
            }
            self_.savecanvasaction(component, undoredoobj);
        }
        this.newcell = function (component, row, cell, drag, flag) {
            var cellindex = row.find('.zc-table-cell').index(cell); // NO I18N
            var dragparent = drag.uiDraggable._parent && (drag.uiDraggable._parent.is('.zcanvas-editor') || drag.uiDraggable._parent.is('.zcanvas-editor-outer')) ? '#' + drag.uiDraggable._parent.attr('id') : null; // NO I18N
            var node = drag.uiDraggable.element.is('.zcanvas-on-menu') ? '' : zutils.getSelectorByElement(drag.uiDraggable.element); // NO I18N
            var nodejson = null;
            if (node === '') {
                // nodejson = canvasOutput.createJson(drag.uiDraggable.helper);
                // nodejson._type = 'field'; // NO I18N
                // nodejson.zcanvasId = drag.zcanvas.zcanvasId;
                nodejson = canvasObjUtils._.defaults(drag.zcanvas, canvasOutput.createJson(flag || drag.uiDraggable.helper));
            }
            var undoredoobj = {
                action: 'callback', // NO I18N
                json: nodejson,
                node: node,
                editor: '#' + row.attr('id') + ' .zc-table-cell:eq(' + cellindex + ')', // NO I18N
                table: '#' + component.attr('id'),
                parent: { editor: dragparent, position: drag.uiDraggable.originalPosition, width: drag.uiDraggable.helperProportions ? drag.uiDraggable.helperProportions.width : '' },
                callback: function (data, method, node) {
                    if (method === 'undo') {
                        if (data.parent.editor) {
                            var editor = $(data.parent.editor);
                            editor.append(node);
                            // eslint-disable-next-line webperf/layout-thrashing
                            node.css(data.parent.position).width(data.parent.width);
                            var editdata = zutils.getParentData(node);
                            editdata.prepareElement(node, drag.zcanvas);
                        } else {
                            var el = $(data.editor).find('.zcanvas-field');
                            var json = el.data('zcanvas'); // NO I18N
                            var menuinst = $(json.fieldContainer).data('zcanvasMenu'); // NO I18N
                            menuinst && menuinst.addElement(json);
                            el.remove();
                        }
                    } else {
                        if (data.json) {
                            node = $(canvasOutput.innerNode(data.json, true));
                            node.data('zcanvas', data.json); // NO I18N
                            node.zdata(data.json);
                            self_.reducescope(node);

                        }
                        $(data.editor).append(node);
                        node.addClass('zcdropped');
                        node.css({ top: 0, left: 0, height: 'auto' });  // NO I18N
                        self_.preaparedrag(node, $(data.table), true, zutils.zcopyobj(node.data('zcanvas'))); // NO I18N

                    }
                }
            }
            self_.savecanvasaction(component, undoredoobj);
        }
        this.deleteRow = function (component, element) {
            var undoredoobj = {
                action: 'callback', // NO I18N
                node: '#' + element.attr('id'), // NO I18N
                parent: '#' + component.attr('id'), // NO I18N
                index: element.index(),
                previous: canvasOutput.createJson(element)
            }
            var fields = element.children('.zc-table-cell'); // NO I18N
            var fieldlen = fields.length;
            for (var i = 0; i < fieldlen; i++) {
                // eslint-disable-next-line webperf/no-multipleDOMLookup
                var field = fields.eq(i).children('.zcanvas-field'); // NO I18N
                if (field.length) {
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    undoredoobj.previous.children.push(canvasOutput.createJson(field));
                    zutils.deletefield(field, true);
                } else {
                    // eslint-disable-next-line webperf/no-multipleDOMLookup
                    undoredoobj.previous.children.push(null);
                }

            }
            element.remove();
            undoredoobj.callback = function (data, method) {
                if (method === 'undo') {
                    var $parent = $(data.parent);
                    var $sortable = $parent.find('.zctable-sortable'); // NO I18N
                    var zid = data.node.replace('#', ''); // NO I18N
                    var wraptemplate = '<div id = "' + zid + '" class="zcanvas-row zcanvas zcanvas-selectable zclayoutdeletable" data-layoutname="Table Layout" data-zcanvastooltype="row" data-zcanvasclass="zcanvas-row"><span class="zc-insert-trow"></span></div>';
                    var sorttemplate = '<div class="zc-table-cell"></div>'
                    var $row = $(wraptemplate);
                    if (data.index) {
                        $row.insertAfter($sortable.find('.zcanvas-row:eq(' + (data.index - 1) + ')'));
                    } else {
                        $sortable.prepend($row);
                    }
                    var fields = data.previous.children;
                    var fieldlen = fields.length;
                    for (var i = 0; i < fieldlen; i++) {
                        var $sorttemp = $(sorttemplate);
                        if (fields[i]) {
                            var fieldnode = canvasOutput.innerNode(fields[i], true);
                            $sorttemp.append(fieldnode);
                            self_.preaparedrag($(fieldnode), $parent, true, zutils.zcopyobj(fields[i]));
                            if (fields[i] && fields[i].fieldContainer) {
                                var menuinst = $(fields[i].fieldContainer).data('zcanvasMenu'); // NO I18N
                                menuinst && menuinst.reduceScope(fields[i]);
                            }
                        }
                        $row.append($sorttemp);
                    }
                    $row.prepend('<span class="ui-resizable-s ui-resizable-handle zctable-row-resize"></span><span class="zc-table-sort"></span>');
                    $row.find('.zc-insert-trow').attr('lt-prop-title', I18n.getMsg('crm.canvas.builder.addrow')).click(self_.addbottomrow.bind($parent)); // NO I18N
                    self_.configdroppable($row, $parent);
                    $sortable.sortable('refresh');  // NO I18N
                    self_.configrowresize($row, $parent, zid);
                    if ($parent.hasClass('zc-no-theme')) { // NO I18N
                        $row.find('.zc-table-sort').css('position', 'absolute'); // NO I18N
                    }
                } else {
                    var node = $(data.node);
                    var fields = node.find('.zcanvas-field'); // NO I18N
                    var fieldlen = fields.length;
                    for (var i = 0; i < fieldlen; i++) {
                        zutils.deletefield(fields.eq(i), true);
                    }
                    node.remove();
                }
            }
            self_.savecanvasaction(component, undoredoobj);
        }

        this.deleteField = function (component, elements) {
            var undoredoobj = {
                action: 'link', // NO I18N
                actionarray: [],
                node: '#' + component.attr('id') // NO I18N
            }

            var ellen = elements.length;
            var fieldhandle = function (data, method) {
                if (method === 'undo') {
                    var $parent = $(data.parent + ' ' + data.row + ' ' + '.zc-table-cell'); // NO I18N
                    var fieldnode = canvasOutput.innerNode(data.previous, true);
                    $parent.eq(data.cell).append(fieldnode);
                    self_.preaparedrag($(fieldnode), $(data.parent), true, zutils.zcopyobj(data.previous));
                    if (data.previous && data.previous.fieldContainer) {
                        var menuinst = $(data.previous.fieldContainer).data('zcanvasMenu'); // NO I18N
                        menuinst && menuinst.reduceScope(data.previous);
                    }
                } else {
                    zutils.deletefield($(data.node), true);
                }
            }
            for (var i = 0; i < ellen; i++) {
                var element = elements.eq(i).closest('.zcanvas-field'); // NO I18N
                var cell = element.parent('.zc-table-cell'); // NO I18N
                var row = cell.parent('.zcanvas-row'); // NO I18N
                var undoredo = {
                    action: 'callback',  // NO I18N
                    node: zutils.getSelectorByElement(element),
                    row: zutils.getSelectorByElement(row),
                    cell: row.children('.zc-table-cell').index(cell), // NO I18N
                    parent: '#' + component.attr('id'), // NO I18N
                    previous: canvasOutput.createJson(element),
                    callback: fieldhandle
                }
                undoredoobj.actionarray.push(undoredo);
                zutils.deletefield(element, true);
            }
            self_.savecanvasaction(component, undoredoobj);
        }
    }();
})();

(function () {
    debugger
    zclayout.prototype.layouts['Static Text'] = new function () {

        var self_ = this;

        var template = '<div data-zcanvasclass="zctextempty" class="zclayout zc-no-resize zcanvas zcstatictext zcautoupdate zctoolpostprocess" data-layoutname="Static Text">' +
            '<div class="zctextcontent" spellcheck="false">' + I18n.getMsg('crm.label.text') + '</div>' +
            '</div>';
        var basetemplate = '<div class="zclayout zcanvas zcstatictext" data-layoutname="Static Text">\
                            </div>';

        this.gethtml = function () {
            return template;
        }

        this.getLabelHtml = function () {
            //  return '<div style="background: #404560;padding: 10px;text-align: center;">' + I18n.getMsg('crm.label.text')  + '</div>'
            return '<div class="zclisticon"><div class="zcl_container zctextlayouticon"></div><div class="zcl_title">' + I18n.getMsg('crm.label.text') + '</div></div>'; // NO I18N
        }

        this.setMaxHeight = function (component) {
            var parent_ = zutils.getParentEditor(component);
            var compouter = component.outerHeight();
            var compheight = component.height();
            var comptop = component.offset().top;
            var parentouter = parent_.outerHeight();
            var parenttop = parent_.offset().top;
            var max = parenttop + parentouter - comptop;
            component.css('max-height', max); // NO I18N
            component.find('.zctextcontent').css('max-height', max - (compouter - compheight)); // NO I18N
        }

        this.init = function (component, noconfig, undoredo, init, zid, scope, containment) {
            var $textarea = component.find('.zctextcontent');
            if (!noconfig) {


                var data = $('.zcanvas-editor-outer').data('zcanvas');
                var parenteditor = component.parent();
                var outinstance = parenteditor.data('zcanvas'); // NO I18N
                var mainconfig = zutils.zcopyobj(outinstance).config;

                // var selector = mainconfig.editorcontainer+" > .zcanvas:not('.ui-draggable-dragging,.zcanvas-multiselect')";//NO I18N
                // var selectorResizing = mainconfig.editorcontainer+" > .zcanvas:not('.ui-resizable-resizing,.zcanvas-multiselect')";//NO I18N

                component.hasClass('zc_disabled') || component.resizable({ // NO I18N
                    containment: 'parent', // NO I18N
                    handles: 'e,w,s', // NO I18N
                    classes: { },
                    zcGuide: true,
                    snapTolerance: 5,
                    zhandlevisible: true,
                    appendGuideTo: mainconfig.editorcontainer,
                    zrestricteditor: true,
                    stop: function (event, ui) {
                        var $parent = ui.helper.parent();
                        var parentdata = zutils.getdatabyelement($parent);
                        var stid = '#' + ui.helper.attr('id'); // NO I18N
                        parentdata.savecanvasaction(stid, 'resize', null, null, null, null, { node: stid, action: 'resize', previous: canvasObjUtils._.extend(ui.originalSize, ui.originalPosition), current: canvasObjUtils._.extend(ui.size, ui.position) })
                    },
                    start: function (e, ui) {
                        var rinst = component.resizable('instance'); // NO I18N
                        if (ui && ui.originalSize && component.hasClass('zcautoupdate')) {
                            ui.originalSize.class = 'zcautoupdate'; // NO I18N
                        }
                        if (rinst && rinst.axis && rinst.axis.indexOf('s') > -1) { // NO I18N
                            component.removeClass('zcautoupdate'); // NO I18N
                        }

                    }
                });

                component.draggable({
                    containment: containment || '.zcanvas-editor-outer', // NO I18N
                    cancel: '',
                    zcGuide: true,
                    snapTolerance: 5,
                    scroll: false,
                    znoposition: true,
                    appendGuideTo: mainconfig.editorcontainer,
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
                    stop: function () {
                        component.addClass('zc-text-stopdrag'); // NO I18N
                        self_.setMaxHeight(component);
                    },
                    scope: scope || 'default', // NO I18N
                    disabled: data.config.alwaysdisabled
                });

                component.hasClass('zc_disabled') || $textarea.click(function (e) { // NO I18N
                    var $tparent = $(this).parent();
                    var $textarea = component.find('.zctextcontent');
                    if ($tparent.hasClass('zcanvas-selected-element') && !$tparent.hasClass('zc-text-stopdrag') && !$textarea.attr('contenteditable')) {
                        var previous = $textarea.html();
                        $textarea.attr('contenteditable', 'true').focus(); // NO I18N
                        component.draggable('option', 'disabled', true);// NO I18N
                        var $parentdrag = component.parents('.ui-draggable'); // NO I18N
                        $parentdrag.draggable('option', 'disabled', true);// NO I18N
                        $('.zcanvas-editor-outer').enableSelection();
                        component.data('zcselection', { }); // NO I18N
                        self_.setMaxHeight(component);
                        if (component.zhasClass('zctextempty')) {
                            $textarea.html('');
                            component.zremoveClass('zctextempty'); // NO I18N
                        }


                        $textarea.on('selectstart.zctext', function () {
                            var $textarea = component.find('.zctextcontent');
                            $(window).on('mouseup.zctext', function (e) {
                                var $textarea = component.find('.zctextcontent');
                                component.data('zcselection', self_.saveSelection(component));// NO I18N
                                $(window).off('mouseup.zctext'); // NO I18N
                                $textarea.off('keyup.zctext'); // NO I18N
                                var compinst = zutils.getParentData(component);
                                if (compinst && compinst.config && compinst.config.toolsRef && compinst.config.toolsRef.config) {
                                    compinst.config.toolsRef.config.onBeforeSelection && compinst.config.toolsRef.config.onBeforeSelection.bind(compinst.config.toolsRef)('Text', true); // NO I18N
                                    compinst.config.toolsRef.executetools('Text', true); // NO I18N
                                    self_.prefilltools(compinst.config.toolsRef, component);
                                    compinst.config.toolsRef.stopPropogate = true;
                                    setTimeout(function () {
                                        this.stopPropogate = false;
                                    }.bind(compinst.config.toolsRef), 100);
                                }
                                e.preventDefault();
                            })
                            $textarea.on('keyup.zctext', function () {
                                component.data('zcselection', self_.saveSelection(component));// NO I18N
                                $(window).off('mouseup.zctext'); // NO I18N
                            })
                        })
                        $textarea.on('blur', function () {// NO I18N
                            var $textarea = component.find('.zctextcontent');
                            component.draggable('option', 'disabled', false);// NO I18N
                            var $parentdrag = component.parents('.ui-draggable'); // NO I18N
                            $parentdrag.draggable('option', 'disabled', false);// NO I18N
                            $textarea.removeAttr('contenteditable');// NO I18N
                            $('.zcanvas-editor-outer').disableSelection();
                            $textarea.off('blur');// NO I18N
                            $textarea.off('selectstart.zctext');// NO I18N
                            $textarea.off('paste.zctext');// NO I18N
                            $textarea.off('keypress.zctextinput');// NO I18N
                            var $thtml = $textarea.html();
                            var $htext = $textarea.text() || '';
                            if ($htext === '') {
                                component.zaddClass('zctextempty'); // NO I18N
                                $thtml = zutils.getExternali18n ? zutils.getExternali18n('Text') : 'Text'; // NO I18N
                                $textarea.html($thtml); // NO I18N
                            }
                            if (previous !== $thtml) {
                                self_.newtext(component, previous);
                            }
                        })
                        $textarea.on('paste.zctext', self_.pastehandler)
                        $textarea.on('keypress.zctextinput', self_.changecontrol); // NO I18N
                        e.stopPropagation();
                    }
                    $tparent.removeClass('zc-text-stopdrag'); // NO I18N
                })

                component.click(function (e) {
                    var $textarea = component.find('.zctextcontent');
                    if (!component.hasClass('zcanvas-selected-lement')) {
                        !$textarea.attr('contenteditable') && component.data('zcselection', null); // NO I18N
                        !$textarea.attr('contenteditable') && data && data.config && data.config.toolsRef && data.config.toolsRef.selectfield(e); // NO I18N
                    }
                }).mouseover(function (e) {
                    var $textarea = component.find('.zctextcontent');
                    !$textarea.attr('contenteditable') && data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e, true); // NO I18N
                }).mouseout(function (e) {
                    var $textarea = component.find('.zctextcontent');
                    !$textarea.attr('contenteditable') && data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e); // NO I18N
                });

                component.attr('id', zid || zutils.getRandomId()); // NO I18N
                !init && component.css('width', '70px'); // NO I18N
                !init && self_.newtext(component);
            }
            if (!init) {
                data && data.config && data.config.toolsRef && data.config.toolsRef.selectfield(component);
                $textarea.select();
            }
        }

        this.prefilltools = function (tools, component) {
            // FIXME: this is static method needs to come from outside

            var seldata = component.data('zcselection'); // NO I18N
            if (seldata && seldata.startContainer) {
                var toolist = ['bgcolor', 'bgcolorinput', 'fontsize', 'fontweight', 'fontcolor', 'linethrough']; // NO I18N
                var nearspan = $(seldata.startContainer).parent('span'); // NO I18N
                if (nearspan.length) {
                    var obj = nearspan.css(['color', 'font-size', 'font-family', 'background-color', 'text-decoration']);// NO I18N
                    var toollen = toolist.length;
                    for (var i = 0; i < toollen; i++) {
                        var toolavail = tools.availabletools[toolist[i]];
                        if (tools.tools.populate[toolavail.type]) {
                            if (toolavail.toolname === "linethrough") {
                                var flagobj = { flag: false }
                                if (obj['text-decoration'] && obj['text-decoration'].indexOf('line-through') > -1) {
                                    flagobj.flag = true;
                                }
                                tools.tools.populate[toolavail.type](toolavail, flagobj);
                            } else if (toolavail.toolname === "fontweight") { // NO I18N
                                var fweight = obj['font-family']; // NO I18N
                                var fwobj = { 'font-family': fweight }; // NO I18N
                                //        						var len = toolavail.list && toolavail.list.length;
                                //        						for(var j = 0 ; j < len ; j++){
                                //        							if(toolavail.list[j].style && toolavail.list[j].style['font-family'] == fweight){
                                //        								fwobj = toolavail.list[j];
                                //        							}
                                //        						}
                                tools.tools.populate[toolavail.type](toolavail, fwobj);
                            } else {
                                tools.tools.populate[toolavail.type](toolavail, obj);
                            }

                        }
                    }

                }
            }
        }

        this.toJson = function (component) {
            var _textcontent = component.find('.zctextcontent'); // No I18N
            _textcontent.find('style').remove();
            _textcontent.find('script').remove();
            _textcontent.find('link').remove();
            var value = _textcontent.html();
            var json = {
                children: [],
                ui: {
                    value: jsonCreation.getValue(component),
                    autoheight: component.hasClass('zcautoupdate') // NO I18N
                },
                _type: 'component', // NO I18N
                theme: 'Static Text', // NO I18N
                zcanvasId: component.attr('id') // NO I18N
            }
            json.ui.value.value = value;
            return json;
        }
        this.toView = function (json) {
            var base = $(basetemplate);
            base.addClass(json.ui.value.class);
            createStruture.applystyle(base, json.ui.value.style);
            base.html(json.ui.value.value);
            createStruture.attachinteractions(json.ui.value, base[0]);
            return base;
        }
        this.toDom = function (json, container, paddingLeft, paddingTop) {
            var base = $(template);
            base.zremoveClass('zctextempty'); // NO I18N
            base.addClass(json.ui.value.class).zaddClass(json.ui.value.class);
            base.find('.zctextcontent').html(json.ui.value.value);
            base.css({
                left: json.ui.value.position.startX + (paddingLeft || 0),
                top: json.ui.value.position.startY + (paddingTop || 0),
                width: json.ui.value.position.width,
                height: json.ui.value.position.height,
                zIndex: json.ui.value.position.depth,
                position: 'absolute' // NO I18N
            })
            if (!json.ui.autoheight) {
                base.removeClass('zcautoupdate'); // NO I18N
            }
            container.append(base);
            self_.init(base, null, null, true, json.zcanvasId);
            base.zccss(json.ui.value.style);
            self_.managescope(base, true);
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
                    if (method === 'undo') {
                        var parentinst = zutils.getdatabyelement($(data.parent));
                        parentinst.addElement([data.previous], data.parentstyle);
                    } else {
                        self_.managescope(node);
                        node.zremove();
                    }
                }
            }
            self_.managescope(element);
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
            self_.managescope($clone, true);
        }
        this.postprocessapply = function (element, config, value) {
            var $textarea = element.find('.zctextcontent')
            var previous = $textarea.html();
            $textarea.attr('contenteditable', true).focus(); // NO I18N
            var data = element.data('zcselection'); // NO I18N
            data && data.startContainer && self_.restoreSelection(data);
            var sel;
            if (data && data.startContainer) {
                sel = window.getSelection().getRangeAt(0);
            }
            var flag;
            if (sel && element.has(sel.startContainer).length) {
                if (config.actionproperty && !config.availableclass) {
                    var prop_ = config.actionproperty;
                    document.execCommand("styleWithCSS", 0, true); // NO I18N

                    switch (prop_) {
                        case 'font-size':
                            document.execCommand('fontSize', 0, value.style[prop_]);
                            // eslint-disable-next-line webperf/no-attribute-selectors
                            $textarea.find('[style*="font-size: -webkit-xxx-large"],font[size] , [style*="font-size: xxx-large"]').css("font-size", value.style[prop_]);
                            break;
                        case 'font-family':
                            document.execCommand('fontName', 0, value.style[prop_]);
                            break;
                        case 'color':
                            document.execCommand('foreColor', 0, value.style[prop_]);
                            break;
                        case 'background-color':
                            document.execCommand('backColor', 0, value.style[prop_]);
                            break;
                    }
                } else if (value && value.class) {
                    document.execCommand("styleWithCSS", 0, true); // NO I18N
                    switch (value.class) {
                        case 'zc-ta-left':
                            document.execCommand("justifyLeft", false, ""); // NO I18N
                            break;
                        case 'zc-ta-center':
                            document.execCommand("justifyCenter", false, ""); // NO I18N
                            break;
                        case 'zc-ta-right':
                            document.execCommand("JustifyRight", false, ""); // NO I18N
                            break;
                    }
                } else if (config.toolname === 'linethrough') { // NO I18N
                    document.execCommand("styleWithCSS", 0, true); // NO I18N
                    document.execCommand("strikeThrough", false, ""); // NO I18N
                    var $data = window.getSelection();
                    var $parent = $($data && $data.focusNode && $data.focusNode.parentNode);
                    if (!value && element.hasClass('zcanvaslinethrough')) {
                        var $focusnode = $($data.focusNode)
                        if (!$parent.is('span') && $parent.text() !== $focusnode.text()) { // NO I18N
                            $parent = $focusnode.wrapAll('<span></span>').parent(); // NO I18N
                        }
                        $parent.addClass('zcs-dib'); // NO I18N
                    } else if (value && $parent.is('span')) { // NO I18N
                        $parent.removeClass('zcs-dib'); // NO I18N
                        $parent.find('.zcs-dib').removeClass('zcs-dib');  // NO I18N
                    }
                }

                flag = true;
            }
            // eslint-disable-next-line jQuery-chaining
            $textarea.removeAttr('contenteditable'); // NO I18N
            self_.newtext(element, previous);
            sel && element.data('zcselection', self_.saveSelection(element));// NO I18N
            return flag;
        }

        this.saveSelection = function () {
            if (window.getSelection) {
                var sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    return sel.getRangeAt(0);
                }
            } else if (document.getSelection && document.createRange) {
                return document.createRange();
            }
            return null;
        }

        this.restoreSelection = function (range) {
            if (range) {
                if (window.getSelection) {
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    return true;
                } else if (document.getSelection && range.select) {
                    range.select();
                    return true;
                }
            } else {
                return false;
            }
        }

        this.deleteAndGetElement = function (data) {
            if (data) {
                var clonedSelection = data.cloneContents();
                var div = document.createElement('div');
                div.appendChild(clonedSelection);
                data.deleteContents();
                return div.innerHTML;
            }
            return;
        }

        this.changecontrol = function (e, text) {
            var textarea = $(e.currentTarget);
            var ctext = textarea.text();
            var currenttextlength = ctext.length;

            var selected = window.getSelection().toString();
            var toolinst;
            var pareninst = zutils.getParentData(textarea.closest('.zclayout')); // NO I18N
            if (pareninst && pareninst.config && pareninst.config.toolsRef && pareninst.config.toolsRef.config) {
                toolinst = pareninst.config.toolsRef.config;
            }
            if (selected && !text) {
                return;
            } else if (!text) {
                if (currenttextlength >= 2000) {
                    e.preventDefault();
                    toolinst && toolinst.validationerror('maxerror', 2000, '_textlength_'); // NO I18N
                    return;
                }
            } else {
                currenttextlength = currenttextlength - selected.length;
                if (currenttextlength + text.length >= 2000) {
                    text = text.substring(0, 2000 - currenttextlength);
                    toolinst && toolinst.validationerror('maxerror', 2000, '_textlength_'); // NO I18N
                }
                return text;
            }

        }

        this.pastehandler = function (e) {
            var clipboardData = e.clipboardData || window.clipboardData || e.originalEvent.clipboardData;
            var cliptext = clipboardData.getData('text/plain'); // NO I18N
            cliptext = self_.changecontrol(e, cliptext);
            document.execCommand('insertText', false, cliptext); // NO I18N
            e.preventDefault();
        }

        this.newtext = function (component, update) {
            var $parent = component.parent();
            var parentid = $parent.attr('id'); // NO I18N
            var parentdata = zutils.getdatabyelement($parent);
            if (!update) {
                var parentstyle = jsonCreation.getstyles($parent);
                var json = canvasOutput.createJson(component);
                var undoredoobj = {
                    action: 'callback', // NO I18N
                    node: '#' + component.attr('id'), // NO I18N
                    parent: '#' + parentid,
                    parentstyle: parentstyle,
                    json: json,
                    callback: function (data, method, node) {
                        if (method === 'undo') {
                            node.zremove();
                        } else {
                            var pdata = zutils.getdatabyelement($(data.parent));
                            pdata.addElement([data.json], { ui: { value: { style: data.parentstyle } } });
                        }
                    }
                }
            } else {
                var undoredoobj = {
                    action: 'callback', // NO I18N
                    node: '#' + component.attr('id'), // NO I18N
                    previous: update,
                    current: component.find('.zctextcontent').html(), // NO I18N
                    callback: function (data, method, node) {
                        var spanel = node.find('.zctextcontent');
                        if (method === 'undo') {
                            spanel.html(data.previous);
                        } else {
                            spanel.html(data.current);
                        }
                    }
                }
            }

            var undoref = parentdata.savecanvasaction(component, null, null, null, null, null, undoredoobj);
            zutils.overlapHandling(component, undoref);
        }

        this.managescope = function (element, flag) {
            if (element.hasClass('zc_disabled')) {
                return;
            }
            var parentinst = zutils.getParentData(element);
            parentinst && zutils.changelayoutscope(parentinst, 'Static Text', flag); // NO I18N
        }
    }();
})();

(function () {
    zclayout.prototype.layouts['Static Icon'] = new function () {

        var self_ = this;

        var template = '<div fixed="true" class="zclayout zc-no-resize zcanvas zcstaticicon zc-ta-center" data-zcanvasclass="zc-ta-center" data-layoutname="Static Icon">\
                        <div class="zciconcontainer zc-no-selection">\
                            <span class="zcstaticempty">+</span>\
                        </div></div>';
        var basetemplate = '<div class="zclayout zcanvas zcstaticicon" data-layoutname="Static Icon">\
                            </div>';

        var zofoiconset = ["icon-Icon_plus", "icon-Icon_Back", "icon-Icon_Leftarrow1", "icon-Icon_dot_three", "icon-Icon_Rightarrow1", "icon-Icon_Antenna", "icon-Icon_Datacard", "icon-Icon_Dish", "icon-Icon_Fiber", "icon-Icon_HDvoice", "icon-Icon_Internationalroaming", "icon-Icon_Navigation", "icon-Icon_QRcode", "icon-Icon_Router", "icon-Icon_Scan", "icon-Icon_Signalstrength", "icon-Icon_Simcard", "icon-Icon_Status", "icon-Icon_Surveillance", "icon-Icon_Unlimited", "icon-Icon_Barcode", "icon-Icon_Bill", "icon-Icon_Calculator", "icon-Icon_Cards", "icon-Icon_Customersupport", "icon-Icon_Delivery", "icon-Icon_Dress", "icon-Icon_Elevator", "icon-Icon_Fragile", "icon-Icon_Gift", "icon-Icon_Money", "icon-Icon_Offer", "icon-Icon_Piggybank", "icon-Icon_Shoppingbag", "icon-Icon_Tracking", "icon-Icon_Wallet", "icon-Icon_Area", "icon-Icon_Areaplot", "icon-Icon_Bathtub", "icon-Icon_Carrom", "icon-Icon_Cupboard", "icon-Icon_Dinningtable", "icon-Icon_Doublebed", "icon-Icon_Fan", "icon-Icon_Fence", "icon-Icon_Fireextinguisher", "icon-Icon_Game", "icon-Icon_Gym", "icon-Icon_Intercom", "icon-Icon_Lift", "icon-Icon_Modularkitchen", "icon-Icon_Park", "icon-Icon_Refrigerator", "icon-Icon_Singlebed", "icon-Icon_Sofa", "icon-Icon_Stove", "icon-Icon_Swimmingpool", "icon-Icon_Television", "icon-Icon_Toilet", "icon-Icon_Ambulance", "icon-Icon_Ayurvedic", "icon-Icon_Bandage", "icon-Icon_Blood", "icon-Icon_Dental", "icon-Icon_Eye", "icon-Icon_Female", "icon-Icon_Lifeline", "icon-Icon_Male", "icon-Icon_Medical", "icon-Icon_Medicalbox", "icon-Icon_Medicine", "icon-Icon_Ortho", "icon-Icon_Patientbed", "icon-Icon_Stethoscope", "icon-Icon_Syringe", "icon-Icon_Wheelchair", "icon-Icon_Carparking", "icon-Icon_Clean", "icon-Icon_Cofeemaker", "icon-Icon_Curtains", "icon-Icon_Drinks", "icon-Icon_Food", "icon-Icon_Geyser", "icon-Icon_Hairdryer", "icon-Icon_Holiday", "icon-Icon_Ironbox", "icon-Icon_Nosmoking", "icon-Icon_Roomservice", "icon-Icon_Shower", "icon-Icon_Toiletries", "icon-Icon_Travelbag", "icon-Icon_Washingmachine", "icon-Icon_Account", "icon-Icon_Attachment", "icon-Icon_Bookmark", "icon-Icon_Calender", "icon-Icon_Camera", "icon-Icon_Card", "icon-Icon_Cart", "icon-Icon_Caution", "icon-Icon_Clock", "icon-Icon_Coffeecup", "icon-Icon_Dollar", "icon-Icon_Downarrow", "icon-Icon_Euro", "icon-Icon_Facebook", "icon-Icon_Favourite", "icon-Icon_Flag", "icon-Icon_Flight", "icon-Icon_Folder", "icon-Icon_Gallery", "icon-Icon_Home", "icon-Icon_Info", "icon-Icon_Leftarrow", "icon-Icon_Linkedin", "icon-Icon_Location", "icon-Icon_Mail", "icon-Icon_Map", "icon-Icon_Mention", "icon-Icon_Mic", "icon-Icon_Mobile", "icon-Icon_Notification", "icon-Icon_Phone", "icon-Icon_Pound", "icon-Icon_Printer", "icon-Icon_Profile", "icon-Icon_Rightarrow", "icon-Icon_Search", "icon-Icon_Star", "icon-Icon_Tag", "icon-Icon_Ticket", "icon-Icon_Twitter", "icon-Icon_Uparrow", "icon-Icon_Upload", "icon-Icon_Complete", "icon-Icon_Agricultureloan", "icon-Icon_ATMswipe", "icon-Icon_Bank", "icon-Icon_Banklocker", "icon-Icon_Bond", "icon-Icon_Customerprofile", "icon-Icon_Fastag", "icon-Icon_Goldloan", "icon-Icon_Insurance", "icon-Icon_Investment", "icon-Icon_Loan", "icon-Icon_Netbanking", "icon-Icon_Premiumservice", "icon-Icon_Reward", "icon-Icon_Secure"]; // NO I18N

        var geticondropdown = function () {
            var dtemplate = $('<div class="zcicondropdpwn"> <ul class="zciconlist"></ul></div>');
            var iconlen = zofoiconset.length;
            var listtemp = '';
            for (var i = 0; i < iconlen; i++) {
                listtemp += '<li class="' + zofoiconset[i] + '"></li>';
            }
            dtemplate.find('.zciconlist').append(listtemp);

            return dtemplate;
        };

        var bindevents = function () {
            var icondropdown = $('.zcicondropdpwn'); // NO I18N
            icondropdown.find('li').off('mousedown.zcicondrop').on('mousedown.zcicondrop', function (e) { // NO I18N
                var $window = $(window);
                var selectedel = $('.zcanvas-selected-element');
                if (selectedel.is('.zcstaticicon')) {
                    var $el = selectedel.find('span');
                    var createflag = false;
                    if ($el.hasClass('zcstaticempty')) {
                        $el.removeClass('zcstaticempty');
                        $el.html('');
                        createflag = true;
                    }
                    var prevclass = $el.attr('class'); // NO I18N
                    $el.attr('class', e.target.className); // NO I18N
                    icondropdown.hide();
                    adjustsize($el);
                    if (createflag) {
                        self_.newicon(selectedel);
                    } else {
                        self_.newicon(selectedel, prevclass);
                    }
                }
                $window.off('mousedown.zciconout');  // NO I18N
                $window.off('keyup.zciconout'); // NO I18N
                e.stopPropagation();
                e.stopImmediatePropagation();
            })
            listenouterclick();

        }

        var adjustsize = function (el) {
            // var iconsize = el.width();
            // var iconparent = el.parent('.zcstaticicon'); // NO I18N
            // if(iconsize > iconparent.width()){
            //     iconparent.width(iconsize);
            // }
            var iconparent = el.closest('.zcstaticicon'); // NO I18N
            iconparent.css('width', ''); // NO I18N
        }

        var listenouterclick = function () {
            var closeicons = function (e, flag) {
                var icondropdown = $('.zcicondropdpwn'); // NO I18N
                if (!flag && icondropdown.is(e.target)) {
                    return;
                }
                var $window = $(window);
                var selectedel = $('.zcanvas.zcanvas-selected-element'); // NO I18N
                var sedata = $('.zcanvas-editor-outer').data('zcanvas'); // NO I18N
                if (sedata) {
                    selectedel = sedata.config.toolsRef.selectedfields;
                }
                if (selectedel.is('.zcstaticicon') && (flag || !icondropdown.has(e.target).length)) {
                    var $el = selectedel.find('span')
                    if ($el.hasClass('zcstaticempty')) {
                        var parentinst = zutils.getParentData(selectedel);
                        parentinst && zutils.changelayoutscope(parentinst, 'Static Icon'); // NO I18N
                        selectedel.zremove();
                    }
                    icondropdown.hide();
                }
                $window.off('mousedown.zciconout'); // NO I18N
                $window.off('keydown.zciconout'); // NO I18N
            }
            var $window = $(window);
            $window.on('mousedown.zciconout', closeicons);
            $window.on('keydown.zciconout', function (e) { if (e.keyCode === 27) { closeicons(e) } })
        }


        var calculatedropdownposition = function (component) {
            var wdimension = {
                width: window.innerWidth,
                height: window.innerHeight
            }
            var result = { }
            var cdimension = component.offset();
            cdimension.width = component.outerWidth();
            cdimension.height = component.outerHeight();

            if (wdimension.height - cdimension.top > 300) {
                result.top = cdimension.height / 2 + cdimension.top;
            } else {
                result.top = cdimension.top - 300 + cdimension.height / 2;
            }

            if (wdimension.width - cdimension.left > 300) {
                result.left = cdimension.width + cdimension.left;
            } else {
                result.left = cdimension.left - 300;
            }
            var icondropdown = $('.zcicondropdpwn'); // NO I18N
            icondropdown.css({
                position: 'fixed', // NO I18N
                top: result.top,
                left: result.left
            }).show();

        }

        this.gethtml = function () {
            return template;
        }

        this.getLabelHtml = function () {
            // return '<div style="background: #404560;padding: 10px;text-align: center;">' + I18n.getMsg('crm.canvas.editor.icon') + '</div>'
            return '<div class="zclisticon"><div class="zcl_container zciconlayouticon"></div><div class="zcl_title">' + I18n.getMsg('crm.canvas.editor.icon') + '</div></div>'; // NO I18N
        }

        this.changeIcon = function (component) {
            calculatedropdownposition(component);
            listenouterclick();
        }
        this.resizehandle = function (element) {
            var inst = element.data('uiResizable'); // NO I18N
            var elicon = element.children('.zciconcontainer'); // NO I18N
            var padding = elicon.css(['padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'border-top-width', 'border-bottom-width', 'border-left-width', 'border-right-width']); // NO I18N
            var size = inst.size.width;
            var fsize = size - canvasObjUtils._.max([parseInt(padding['padding-left']), parseInt(padding['padding-right'])]) - canvasObjUtils._.max([parseInt(padding['padding-top']), parseInt(padding['padding-bottom'])]) - canvasObjUtils._.max([parseInt(padding['border-left-width']), parseInt(padding['border-right-width'])]) - canvasObjUtils._.max([parseInt(padding['border-top-width']), parseInt(padding['border-bottom-width'])]); // NO I18N
            elicon[0].style.setProperty('font-size', fsize + 'px', 'important'); // NO I18N
        }
        this.init = function (component, noconfig, undo, init, zid, scope, containment, preventinit) {
            if (!noconfig) {
                // Make component resizable
                component.resizable({
                    containment: 'parent', // NO I18N
                    handles: 'se', // NO I18N
                    classes: { 'ui-resizable-se': 'zcanvas-resizable-se' }, // NO I18N
                    zrestricteditor: true,
                    zhandlevisible: true,
                    aspectRatio: 1,
                    start: function (e, ui) {
                        var fsize = ui.helper.children('.zciconcontainer').css('font-size'); // NO I18N
                        var inst = ui.helper.data('uiResizable'); // NO I18N
                        inst.zcmetastyles.fsize = fsize;
                        var merglayout = ui.helper.closest('.zcmergelayout'); // NO I18N
                        if (merglayout.length) {
                            var _containment = merglayout.parent();
                            inst.options.containment = _containment;
                            inst.plugins && inst.plugins.start && inst.plugins.start.filter(function (l) {
                                if (l[0] === 'containment') {
                                    l[1].bind(ui.helper)(e, ui);
                                };
                            })
                        } else {
                            inst.options.containment = 'parent'; // NO I18N
                        }


                    },
                    resize: function (event, ui) {
                        self_.resizehandle(ui.helper);
                    },
                    stop: function (event, ui) {
                        var inst = ui.helper.data('uiResizable'); // NO I18N
                        // var $parent = ui.helper.parent();
                        // var parentdata = zutils.getdatabyelement($parent);
                        var parentdata = zutils.getParentData(ui.helper);
                        var tools = parentdata.config.toolsRef;
                        var stid = '#' + ui.helper.attr('id'); // NO I18N
                        var undoredoobj = {
                            action: 'link', // NO I18N
                            actionarray: [{ node: stid, action: 'resize', previous: canvasObjUtils._.extend(ui.originalSize, ui.originalPosition), current: canvasObjUtils._.extend(ui.size, ui.position) }], // NO I18N
                            node: stid
                        }
                        var elicon = ui.helper.children('.zciconcontainer'); // NO I18N
                        var previous = { 'font-size': inst.zcmetastyles.fsize }; // NO I18N
                        var current = { 'font-size': elicon.css('font-size') }; // NO I18N
                        var fundo = {
                            action: 'action', // NO I18N
                            node: stid + ' .zciconcontainer', // NO I18N
                            previous: previous,
                            current: current,
                            state: 'default' // NO I18N
                        }
                        undoredoobj.actionarray.push(fundo);

                        var selector = tools.getSelectorByElement(ui.helper, 'default'); // NO I18N
                        var styleselector = tools.getSelectorByElement(ui.helper); // NO I18N
                        var fobj = tools.getstylebyselector(selector, true);
                        if (!fobj.default) {
                            fobj.default = { };
                        }
                        fobj.default['font-size'] = current['font-size']; // NO I18N
                        elicon.css('font-size', ''); // NO I18N
                        tools.updatestyle({ }, styleselector, fobj.default);
                        parentdata.savecanvasaction(ui.helper, null, null, null, null, null, undoredoobj);
                    }
                });


                var outercontainer = $('.zcanvas-editor-outer');

                var data = outercontainer.data('zcanvas'); // NO I18N

                if (!outercontainer.find('.zcicondropdpwn').length) {
                    outercontainer.append(geticondropdown());
                }
                bindevents();
                if (component.find('.zcstaticempty').length && !preventinit) {
                    calculatedropdownposition(component);
                }


                component.draggable({
                    containment: containment || '.zcanvas-editor-outer', // NO I18N
                    cancel: '',
                    scroll: false,
                    znoposition: true,
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
                    scope: scope || 'default', // NO I18N
                    disabled: data.config.alwaysdisabled
                });

                component.attr('id', zid || zutils.getRandomId()); // NO I18N


                component.click(function (e) {
                    if (!component.hasClass('zcanvas-selected-element')) {
                        data && data.config && data.config.toolsRef && data.config.toolsRef.selectfield(e);
                    }
                }).mouseover(function (e) {
                    data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e, true);
                }).mouseout(function (e) {
                    data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e);
                });
            }
            if (!init) {
                data && data.config && data.config.toolsRef && data.config.toolsRef.selectfield(component);
            }
        }

        this.toJson = function (component) {
            var value = component.find('span').attr('class'); // NO I18N
            var json = {
                children: [],
                ui: {
                    value: jsonCreation.getValue(component)
                },
                _type: 'component', // NO I18N
                theme: 'Static Icon', // NO I18N
                zcanvasId: component.attr('id') // NO I18N
            }
            json.ui.value.icon = value;
            return json;
        }
        this.toView = function (json) {
            var base = $(basetemplate);
            base.addClass(json.ui.value.class);
            base.css({
                width: json.ui.value.position.width,
                height: json.ui.value.position.height
            });

            base.html('<div class="zciconcontainer"><span class="' + json.ui.value.icon + '"></span></div>');
            createStruture.applystyle(base.children('.zciconcontainer'), json.ui.value.style); // NO I18N
            createStruture.attachinteractions(json.ui.value, base[0]);
            return base;
        }
        this.toDom = function (json, container, pl, pt) {
            var base = $(template);
            base.addClass(json.ui.value.class);
            var iconel = base.find('span');
            iconel.html('').removeClass('zcstaticempty').attr('class', json.ui.value.icon); // NO I18N
            base.css({
                left: json.ui.value.position.startX + (pl || 0),
                top: json.ui.value.position.startY + (pt || 0),
                width: json.ui.value.position.width,
                height: json.ui.value.position.height,
                zIndex: json.ui.value.position.depth,
                position: 'absolute' // NO I18N
            })
            // Prevent if empty added
            if (json.ui.value.icon !== 'zcstaticempty') {
                container.append(base);
            }
            self_.init(base, null, null, true, json.zcanvasId, null, null, 1);
            base.zccss(json.ui.value.style);
            var parentinst = zutils.getParentData(base);
            parentinst && zutils.changelayoutscope(parentinst, 'Static Icon', true); // NO I18N
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
                    if (method === 'undo') {
                        var parentinst = zutils.getdatabyelement($(data.parent));
                        parentinst.addElement([data.previous], data.parentstyle);
                    } else {
                        var parentinst = zutils.getParentData(node);
                        parentinst && zutils.changelayoutscope(parentinst, 'Static Icon'); // NO I18N
                        node.zremove();
                    }
                }
            }
            var parentinst = zutils.getParentData(element);
            parentinst && zutils.changelayoutscope(parentinst, 'Static Icon'); // NO I18N
            element.zremove();
            if (!flag) {
                parentdata.savecanvasaction(element, null, null, null, null, null, undoredoobj);
            } else {
                return undoredoobj;
            }

        }
        this.clone = function (element) {
            var $layout = element.closest('.zclayout'); // NO I18N
            var pos = $layout.css(['left', 'top']); // NO I18N
            var newpos = { left: parseInt(pos.left) + 5, top: parseInt(pos.top) + 5 }; // NO I18N 
            var $parent = $layout.parent();
            var $clone = $layout.clone();
            $clone.css(newpos);
            $clone.find('.ui-resizable-handle').remove(); // NO I18N
            $parent.append($clone);
            var pdata = zutils.getParentData($layout);
            var tools = pdata.config.toolsRef;
            var style = tools.copystyle($layout);
            self_.init($clone);
            tools.pastestyle(style, $clone);
            var parentinst = zutils.getParentData($clone);
            parentinst && zutils.changelayoutscope(parentinst, 'Static Icon', true); // NO I18N
            self_.newicon($clone);
        }
        this.newicon = function (component, update) {
            var $parent = component.parent();
            var parentid = $parent.attr('id'); // NO I18N
            var parentdata = zutils.getdatabyelement($parent);
            if (!update) {
                var parentstyle = jsonCreation.getstyles($parent);
                var json = canvasOutput.createJson(component);
                var undoredoobj = {
                    action: 'callback', // NO I18N
                    node: '#' + component.attr('id'), // NO I18N
                    parent: '#' + parentid,
                    parentstyle: parentstyle,
                    json: json,
                    callback: function (data, method, node) {
                        if (method === 'undo') {
                            var parentinst = zutils.getParentData(node);
                            parentinst && zutils.changelayoutscope(parentinst, 'Static Icon'); // NO I18N
                            node.zremove();
                        } else {
                            var pdata = zutils.getdatabyelement($(data.parent));
                            pdata.addElement([data.json], { ui: { value: { style: data.parentstyle } } });
                        }
                    }
                }
            } else {
                var undoredoobj = {
                    action: 'callback', // NO I18N
                    node: '#' + component.attr('id'), // NO I18N
                    previous: update,
                    current: component.find('span').attr('class'), // NO I18N
                    callback: function (data, method, node) {
                        var spanel = node.find('span').attr('class', ''); // NO I18N
                        if (method === 'undo') {
                            spanel.addClass(data.previous);
                        } else {
                            spanel.addClass(data.current);
                        }
                    }
                }
            }

            var undoref = parentdata.savecanvasaction(component, null, null, null, null, null, undoredoobj);
            zutils.overlapHandling(component, undoref);
        }
    }();
})();

(function () {
    zclayout.prototype.layouts.Line = new function () {

        var self_ = this;

        var template = '<div style="width:100px" class="zclayout zcanvas zcdivider zc-hr-line" data-layoutname="Line" fixed="true" data-zc-min-width="100" data-zcanvasclass="zc-hr-line">' +
            '<div class="zc-no-selection zc-divider-line"></div>' +
            '</div>';
        var basetemplate = '<div class="zclayout zcanvas zcdivider zc-hr-line" data-layoutname="Line">\
                                <div class="zc-divider-line"></div>\
                            </div>';



        this.gethtml = function () {
            return template;
        }

        this.getLabelHtml = function () {
            // return '<div style="background: #404560;padding: 10px;text-align: center;">' + I18n.getMsg('crm.report.line') + '</div>'
            return '<div class="zclisticon"><div class="zcl_container zclinelayouticon"></div><div class="zcl_title">' + I18n.getMsg('crm.report.line') + '</div></div>'; // NO I18N
        }

        this.init = function (component, noconfig, undo, init, zid) {
            if (!noconfig) {
                // Make component resizable
                component.resizable({
                    containment: 'parent', // NO I18N
                    handles: 'n,s,e,w', // NO I18N
                    classes: { },
                    zhandlevisible: true,
                    start: function (event, ui) {
                        var inst = ui.helper.data('uiResizable');  // NO I18N
                        inst.previous = canvasOutput.createJson(component);
                    },
                    stop: function (event, ui) {
                        var inst = ui.helper.data('uiResizable'); // NO I18N
                        var previous = zutils.zcopyobj(inst.previous);
                        delete inst.previous;
                        self_.rerender(component, previous, canvasOutput.createJson(component));
                    }
                });


                var outercontainer = $('.zcanvas-editor-outer');

                var data = outercontainer.data('zcanvas'); // NO I18N


                component.draggable({
                    containment: '.zcanvas-editor-outer', // NO I18N
                    cancel: '',
                    scroll: false,
                    znoposition: true,
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

                component.css('position', 'absolute'); // NO I18N

                component.attr('id', zid || zutils.getRandomId()); // NO I18N

                component.click(function (e) {
                    if (!component.hasClass('zcanvas-selected-element')) {
                        data && data.config && data.config.toolsRef && data.config.toolsRef.selectfield(e);

                    }
                }).mouseover(function (e) {
                    data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e, true);
                }).mouseout(function (e) {
                    data && data.config && data.config.toolsRef && data.config.toolsRef.hoverfield(e);
                });


                !init && self_.newline(component);
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
                theme: 'Divider', // NO I18N
                zcanvasId: component.attr('id') // NO I18N
            }
            json.ui.value.style = jsonCreation.getstyles(component);
            json.ui.value.class = '';
            json.ui.value.vertical = component.hasClass('zc-vr-line') // NO I18N
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
            base.addClass(json.ui.value.class);
            base.css({
                left: json.ui.value.position.startX + (pl || 0),
                top: json.ui.value.position.startY + (pt || 0),
                width: json.ui.value.position.width,
                height: json.ui.value.position.height
            })
            container.append(base);
            if (json.ui.value.vertical) {
                base.removeClass('zc-hr-line').addClass('zc-vr-line');
            }
            self_.init(base, null, null, true, json.zcanvasId);
            base.zccss(json.ui.value.style, true);
            self_.managescope(base, true);
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
                    if (method === 'undo') {
                        var parentinst = zutils.getdatabyelement($(data.parent));
                        parentinst.addElement([data.previous], data.parentstyle);
                    } else {
                        self_.managescope(node);
                        node.zremove();
                    }
                }
            }
            self_.managescope(element);
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
            self_.init($clone, null, null, true);
            tools.pastestyle(style, $clone, true);
            self_.managescope($clone, true);
            zutils.forceselect($clone);
            self_.newline($clone);
        }
        this.newline = function (component) {
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
                    if (method === 'undo') {
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
                    if (method === 'undo') {
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
        this.managescope = function (element, flag) {
            var parentinst = zutils.getParentData(element);
            parentinst && zutils.changelayoutscope(parentinst, 'Line', flag); // NO I18N
        }
    }();
})();