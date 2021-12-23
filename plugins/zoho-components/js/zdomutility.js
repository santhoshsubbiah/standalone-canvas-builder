"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

(function () {
  HTMLElement.prototype.matches = HTMLElement.prototype.matches || HTMLElement.prototype.matchesSelector || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.msMatchesSelector || HTMLElement.prototype.oMatchesSelector;
  SVGElement.prototype.matches = SVGElement.prototype.matches || SVGElement.prototype.matchesSelector || SVGElement.prototype.webkitMatchesSelector || SVGElement.prototype.mozMatchesSelector || SVGElement.prototype.msMatchesSelector || SVGElement.prototype.oMatchesSelector;

  var Speed = {
    fast: 200,
    slow: 600,
    _default: 400
  },
      userAgent = navigator.userAgent.toLowerCase(),
      isIE = userAgent.indexOf('msie') > -1 || userAgent.indexOf('.net') > -1,
      pseudoRegex = /:not|:eq|:first|:last|:focus|:visible|:hidden|:checkbox|:radio|:checked|:contains/g,
      notExcludedRegex = /:eq|:first|:last|:focus|:visible|:hidden|:checkbox|:radio|:checked|:contains/g,
      queryRegex = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'],
      // No I18N
  proxyProps = {
    'float': 'cssFloat' // No I18N

  },
      emptyDivStyle,
      rnotwhite = /\S+/g,
      // anything except white space
  rclass = /[\t\r\n\f]/g,
      convertToQuery = function convertToQuery(data) {
    if (typeof data !== 'string') {
      // No I18N
      var str = ''; // No I18N

      for (var k in data) {
        str += (str === '' ? '?' : '&') + k + '=' + data[k]; // No I18N
      }

      return str;
    }

    return data;
  },
      checkVendorPrefix = function checkVendorPrefix(pname) {
    if (!emptyDivStyle) {
      emptyDivStyle = document.createElement('div');
    }

    var name;

    for (var i = cssPrefixes.length - 1; i >= 0; i--) {
      name = cssPrefixes[i] + pname;

      if (name in emptyDivStyle) {
        return name;
      }
    }

    return pname;
  },
      escInvalidSel = function escInvalidSel() {
    var sel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof sel === 'string') {
      // No I18N
      sel = sel.replace(/:not\(null\)/g, '').replace(/:not\(\)/g, ''); // No I18N

      var splitRes = sel.split(','),
          // No I18N
      spLen = splitRes.length,
          fc,
          ascVal,
          val;

      for (var l = 0; l < spLen; l++) {
        val = splitRes[l];

        if (val) {
          fc = val[0];
          ascVal = fc.charCodeAt(0);
          /* In future, CSS.escape method can be used for this purpose. Currently it is in experimental state. */

          if (ascVal >= 48 && ascVal <= 57) {
            // escaping the selectors starting with digits.
            val = '\\3' + fc + ' ' + val.slice(1); // No I18N
          }
        }

        splitRes[l] = val;
      }

      sel = splitRes.join(','); // No I18N
    }

    return sel;
  },
      _filter = function filter(resultArray, actualSel, visibilityCheck, condition, radioCheck, checkChecked) {
    resultArray = resultArray.filter(function (item) {
      if (actualSel) {
        actualSel = escInvalidSel(actualSel);
      }

      if (actualSel ? !item.matches(actualSel) : visibilityCheck ? condition ? window.getComputedStyle(item).display !== 'none' : window.getComputedStyle(item).display === 'none' : condition ? item === document.activeElement : (!radioCheck || item.getAttribute('type') === radioCheck) && (checkChecked ? (item.getAttribute('type') === 'radio' || item.getAttribute('type') === 'checkbox') && item.checked : true)) {
        // No I18N
        return item;
      }
    });
    return resultArray;
  },
      checkContains = function checkContains(resultArray, sel) {
    var text = sel.replace('contains(', '').replace(')', ''),
        // No I18N
    contains,
        child,
        cLen;
    resultArray = resultArray.filter(function (item) {
      contains = true;

      if (item.textContent.trim() !== text) {
        contains = false;
        child = item.children;
        cLen = child.length;

        for (var l = 0; l < cLen; l++) {
          if (child[l].textContent.trim() === text) {
            contains = true;
          }
        }
      }

      if (contains) {
        return item;
      }
    });
    return resultArray;
  },
      getHiddenEleProp = function getHiddenEleProp(ele, prop, isOff) {
    // by default client property will be returned.
    var props = ['position', 'visibility', 'display'],
        // No I18N
    values = ['absolute', 'hidden', 'block'],
        // No I18N
    old = {},
        i = 0,
        val;
    props.forEach(function (value) {
      old[value] = ele.style[value];
      ele.style[value] = values[i++];
    });
    val = ele[(isOff ? 'offset' : 'client') + prop]; // No I18N

    props.forEach(function (value) {
      return ele.style[value] = old[value];
    });
    return val;
  },
      z = function z(selector, context, elements) {
    if (selector instanceof DOMUtil) {
      return selector;
    }

    return new DOMUtil(selector, context, elements);
  };

  function zqueryselector(element, context, retrieveChildren) {
    // selector method
    context = context || document;
    var resultArray = [],
        isStr = typeof element === 'string'; // No I18N

    element = isStr ? element.trim() : element;

    if (!context) {
      return resultArray;
    } else if (!isStr) {
      return (context.nodeType ? context : context[0]).contains(element instanceof z ? element[0] : element) ? element : []; // ( Example Usage: Calling find method by passing element instead of selector )
    } else if (element.search(pseudoRegex) === -1) {
      var spaceSep = element.indexOf('[') === -1 ? element.split(' ') : [element]; // No I18N

      if (spaceSep.length > 1 && element.indexOf(',') < 0) {
        // No I18N
        var c1,
            // > * type selectors ( child combinators )
        specialChars = ['>', '*'];

        for (var i = 0; i < spaceSep.length; i++) {
          c1 = spaceSep[i];
          var lindex = specialChars.indexOf(c1);

          if (lindex > -1) {
            // filter the result array
            if (lindex === 1) {
              // all childrens
              var childs = (resultArray.length ? resultArray[0] : context.nodeType ? context : context[0]).children,
                  clen = childs.length;
              resultArray = [];

              for (var k = 0; k < clen; k++) {
                resultArray.push(childs[k]);
              }
            }
          } else if (resultArray.length) {
            // specific children
            var nArr = [];

            for (var o = 0; o < resultArray.length; o++) {
              nArr = Array.prototype.concat.apply(nArr, z(resultArray[o]).find(c1));
            }

            resultArray = nArr;
          } else {
            c1 = escInvalidSel(c1);
            resultArray = (context.nodeType ? context : context[0]).querySelectorAll(c1);
          }
        }
      } else {
        element = escInvalidSel(element);
        resultArray = (context.nodeType ? context : context[0]).querySelectorAll(element);
      }
    } else {
      // String contains pseudo selectors in them
      // let pseudos = element.match(/:(\w)*\(*[\[\w\'\"\_\-\,\.\s\]]*\)*/g),
      //     selectorSplit = [];
      // if (pseudos.length) {
      //     selectorSplit.push(element.replace(pseudos.join(''), ''));
      //     selectorSplit = Array.prototype.concat.apply(selectorSplit, pseudos);
      // } else {
      // }
      if (context instanceof z) {
        context = context[0];
      }

      if (element.search(notExcludedRegex) === -1) {
        var _resultArray;

        element = escInvalidSel(element);
        var res = context.querySelectorAll(element);
        res.length && (_resultArray = resultArray).push.apply(_resultArray, _toConsumableArray(res));
      } else {
        var selectorSplit = element.split(','),
            selectors,
            sel,
            child,
            _k = 0;

        for (var _i = 0; _i < selectorSplit.length; _i++) {
          selectors = selectorSplit[_i];

          if (selectors.search(notExcludedRegex) === -1) {
            // If the query contains not alone, use document.querySelectorAll alone.
            selectors = escInvalidSel(selectors);

            if (retrieveChildren) {
              child = context.children;

              for (; _k < child.length; _k++) {
                if (child[_k].matches(selectors)) {
                  resultArray.push(child[_k]);
                }
              }
            } else {
              var _resultArray2;

              var _res = context.querySelectorAll(selectors);

              _res.length && (_resultArray2 = resultArray).push.apply(_resultArray2, _toConsumableArray(_res));
            }
          } else {
            var isNotPseudo = selectors[0] !== ':'; // Splitted array is filtered because, for a selector like ':visible' splits as '' && 'visible'

            selectors = selectors.split(':').filter(function (value) {
              return value && value;
            });
            selectors[0] = (isNotPseudo ? '' : ':') + selectors[0]; // If the first selector is not a tagName, then ':' should be added

            selectors[0] = escInvalidSel(selectors[0]);

            if (retrieveChildren) {
              child = context.children;

              for (; _k < child.length; _k++) {
                if (child[_k].matches(selectors[0])) {
                  resultArray.push(child[_k]);
                }
              }
            } else {
              Array.prototype.push.apply(resultArray, context.querySelectorAll(selectors[0]));
            }

            for (var j = 1; j < selectors.length && resultArray.length !== 0; j++) {
              sel = selectors[j];

              if (sel.startsWith('not')) {
                // No I18N
                var actualSel = sel.replace('not(', '').replace(')', ''); // No I18N

                resultArray = _filter(resultArray, actualSel);
              } else if (sel.startsWith('radio') || sel.startsWith('checkbox')) {
                resultArray = _filter(resultArray, undefined, undefined, undefined, sel);
              } else if (sel.startsWith('eq')) {
                // No I18N
                resultArray = [resultArray[parseInt(sel.replace('eq(', '').replace(')', ''))]]; // No I18N
              } else if (sel.startsWith('first') || sel.startsWith('last')) {
                // No I18N
                resultArray = [resultArray[sel.startsWith('first') ? 0 : resultArray.length - 1]]; // No I18N
              } else if (sel.startsWith('visible') || sel.startsWith('hidden')) {
                // No I18N
                var visibleCond = sel.startsWith('visible'); // No I18N

                resultArray = _filter(resultArray, undefined, visibleCond, visibleCond);
              } else if (sel.startsWith('checked') || sel.startsWith('focus')) {
                // No I18N
                var checkFocus = sel.startsWith('focus'); // No I18N

                resultArray = _filter(resultArray, undefined, undefined, checkFocus, undefined, !checkFocus);
              } else if (sel.startsWith('contains')) {
                resultArray = checkContains(resultArray, sel);
              }
            }
          }
        }
      }
    }

    return resultArray;
  }

  var DOMUtil =
  /*#__PURE__*/
  function () {
    _createClass(DOMUtil, [{
      key: "booleanAttrs",
      get: function get() {
        return ['checked', 'selected', 'async', 'autofocus', 'autoplay', 'controls', 'defer', 'disabled', 'hidden', 'ismap', 'loop', 'multiple', 'open', 'readonly', 'required', 'scoped']; // No I18N
      }
    }]);

    function DOMUtil(sel) {
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
      var elements = arguments.length > 2 ? arguments[2] : undefined;

      _classCallCheck(this, DOMUtil);

      if (sel instanceof Array) {
        // No I18N
        elements = sel;
        sel = undefined;
      }

      this.length = 0; // z(undefined) should have length zero

      if (sel || elements) {
        // z(undefined || null) -> should return instance alone
        if (sel !== 1) {
          if (_typeof(sel) === 'object' && !sel.nodeType && sel[0] && sel[0].nodeType) {
            // No I18N
            this._elements = [sel[0]];
          }

          this.selector = sel;
        }

        if (elements) {
          this._elements = elements;
        }

        this.context = context;
        this.init();
      } // Actual DOM Elements will be stored in Array like indexing

    }

    _createClass(DOMUtil, [{
      key: "init",
      value: function init() {
        // DOM querying
        var sel = this.selector,
            context = this.context,
            results = [];

        if (typeof sel === 'string') {
          var parts = sel.indexOf('<') !== -1 ? [sel] : sel.split(','),
              matchedArray,
              ele,
              eleFound,
              actualSel;

          for (var p = 0; p < parts.length; p++) {
            ele = parts[p];
            matchedArray = queryRegex.exec(ele.trim());

            if (matchedArray) {
              if (matchedArray[1]) {
                actualSel = matchedArray[1];
                context = context instanceof z ? context[0] : context;

                if (context) {
                  // non appended nodes might be present
                  actualSel = escInvalidSel(actualSel);
                  eleFound = context.querySelector('#' + actualSel); // No I18N
                } else {
                  eleFound = document.getElementById(actualSel);
                }

                if (eleFound) {
                  results.push(eleFound);
                }
              } else if (matchedArray[2]) {
                if (matchedArray[2] === 'window') {
                  // No I18N
                  results.push(window);
                } else if (matchedArray[2] === 'document') {
                  // No I18N
                  results.push(document.documentElement);
                } else {
                  eleFound = zqueryselector(ele, this.context); // eleFound = document.getElementsByTagName(matchedArray[2]);

                  if (eleFound) {
                    Array.prototype.push.apply(results, eleFound); // Joining the results of two arrays and place in element variable.
                  }
                }
              } else if (matchedArray[3]) {
                // ##revisit
                eleFound = document.getElementsByClassName(matchedArray[3]);

                if (eleFound) {
                  Array.prototype.push.apply(results, eleFound);
                }
              }
            } else if (ele.indexOf('<') !== -1 && ele.indexOf('>') !== -1) {
              // creating elements with attributes in it supported. Ex: $("<button type='submit'>Share</button>");
              var container = document.createElement('div');
              container.innerHTML = ele; // results = container.childNodes;

              var children = container.childNodes;

              for (var h = 0; h < children.length; h++) {
                results.push(children[h]);
              } // let props = element.replace(/[<|>]/g,"").split(" ");
              //  tagName = props[0];
              // element = document.createElement(tagName);
              // if(props.length > 1){
              //  for(let l = 1; l < props.length - 1; l++){
              //      element.setAttribute(props[l].split("=")[0], props[l].split("=")[1]);
              //  }
              // }

            } else {
              // complex selectors
              // results = zqueryselector(ele, this.context);
              var elef = zqueryselector(ele, this.context);
              elef && Array.prototype.push.apply(results, elef);
            }
          }
        } else if (this._elements) {
          if (this._elements instanceof z) {
            results = this._elements;
          } else {
            results = _toConsumableArray(this._elements);
          }

          this._elements = null;
        } else if (sel) {
          if (sel instanceof Array) {
            results = sel;
          } else {
            results.push(sel);
          }
        }

        if (results.length) {
          // results found
          var j = this.length || 0;

          for (var i = 0; i < results.length; i++) {
            this[j++] = results[i];
          }
        }

        this.length = results.length;
      }
      /* String arguments only supported */

    }, {
      key: "addClass",
      value: function addClass(className) {
        return this._handleCls(className, 'add'); // No I18N
      }
    }, {
      key: "removeClass",
      value: function removeClass(className) {
        return this._handleCls(className, 'remove'); // No I18N
      }
    }, {
      key: "toggleClass",
      value: function toggleClass(className, state) {
        return this._handleCls(className, state === undefined ? 'toggle' : state ? 'add' : 'remove'); // No I18N
      }
    }, {
      key: "hasClass",
      value: function hasClass(className) {
        // since classList.contains produces incorrect results for multiple classes, added check like the below.
        var len = this.length;

        if (!this.length || !className) {
          return false;
        }

        var ele;

        for (var i = 0; i < len; i++) {
          ele = this[i];

          if (ele.nodeType === 3) {
            // text nodes
            continue;
          }

          if (!isIE && className.split(' ').length === 1) {
            if (ele.classList.contains(className)) {
              return true;
            }
          } else if (this._hasClassIE(ele, className)) {
            return true;
          }
        }

        return false;
      }
    }, {
      key: "_handleCls",
      value: function _handleCls(className, action) {
        if (!className) {
          return this;
        }

        if (isIE) {
          this._handleIECls(className, action); // No I18N

        } else {
          className = className.trim();

          if (className) {
            className = className.replace(/\s\s+/g, ' ').split(' ');

            for (var i = 0; i < this.length; i++) {
              var _this$i$classList;

              (_this$i$classList = this[i].classList)[action].apply(_this$i$classList, _toConsumableArray(className)); // action might be add, remove or toggle

            }
          }
        }

        return this;
      }
    }, {
      key: "_handleIECls",
      value: function _handleIECls(clsName, action) {
        var len = this.length,
            ele;

        if (action === 'toggle') {
          // No I18N
          for (var i = 0; i < len; i++) {
            ele = z(this[i]);
            ele[ele.hasClass(clsName) ? 'removeClass' : 'addClass'](clsName); // No I18N
          }
        } else {
          // add and remove
          var classes = clsName.match(rnotwhite) || [],
              clsLen = classes.length,
              curValue,
              cur,
              j,
              iCls,
              finalValue;

          for (var _i2 = 0; _i2 < len; _i2++) {
            ele = this[_i2];
            curValue = ele.getAttribute('class') || '';
            cur = ele.nodeType === 1 && (' ' + curValue + ' ').replace(rclass, ' ');

            if (cur) {
              for (j = 0; j < clsLen; j++) {
                iCls = classes[j];

                if (action === 'add') {
                  // No I18N
                  if (cur.indexOf(' ' + iCls + ' ') < 0) {
                    cur += iCls + ' ';
                  }
                } else {
                  // removing
                  while (cur.indexOf(' ' + iCls + ' ') > -1) {
                    cur = cur.replace(' ' + iCls + ' ', ' ');
                  }
                }
              }

              finalValue = cur.trim();

              if (curValue !== finalValue) {
                ele.setAttribute('class', finalValue);
              }
            }
          }
        }
      }
    }, {
      key: "_hasClassIE",
      value: function _hasClassIE(ele, className) {
        var currVal = ' ' + (ele.getAttribute('class') || '') + ' '; // No I18N

        className = ' ' + className + ' '; // No I18N

        if (currVal.replace(rclass, ' ').indexOf(className) > -1) {
          // No I18N
          return true;
        }

        return false;
      }
    }, {
      key: "appendTo",
      value: function appendTo(ele) {
        return this._appPreTo(ele);
      }
    }, {
      key: "prependTo",
      value: function prependTo(ele) {
        return this._appPreTo(ele, true);
      }
    }, {
      key: "after",
      value: function after(eleToIns) {
        // used in sortable
        return z(eleToIns).insertAfter(this[0]);
      }
    }, {
      key: "before",
      value: function before(eleToIns) {
        return z(eleToIns).insertBefore(this[0]);
      } // might be needed in Sortable like components

    }, {
      key: "insertAfter",
      value: function insertAfter(ele) {
        return this._insertAfBe(ele);
      }
    }, {
      key: "insertBefore",
      value: function insertBefore(ele) {
        return this._insertAfBe(ele, true);
      }
    }, {
      key: "_insertAfBe",
      value: function _insertAfBe(ele, before) {
        // Inserting first matched element to single node at after/before positioning alone supported.
        if (!ele || !this.length) {
          return;
        }

        if (!ele.nodeType) {
          ele = z(ele)[0];
        }

        var eleToInsert = this[0],
            parNode = ele.parentNode;

        if (parNode) {
          // IE doesn't have after method support and parNode will not be present for not attached elements.
          parNode.insertBefore(eleToInsert, before ? ele : ele.nextSibling);
        }

        return this;
      }
    }, {
      key: "_appPreTo",
      value: function _appPreTo(ele, prepend) {
        var thisLen = this.length;

        if (!ele || !thisLen) {
          return;
        }

        if (typeof ele === 'string' || ele.nodeType && ele.nodeType === 1) {
          // No I18N
          ele = z(ele);
        } // else element is of z instance only.


        var el,
            eleLen = ele.length;

        for (var i = 0; i < eleLen; i++) {
          el = z(ele[i]);

          for (var j = 0; j < thisLen; j++) {
            el[prepend ? 'prepend' : 'append'](this[j]); // No I18N
          }
        }

        return this;
      }
    }, {
      key: "append",
      value: function append(content) {
        // content may be of String|DOM_NODE|jQuery_like_Obj type
        return this._appPre(content);
      }
    }, {
      key: "prepend",
      value: function prepend(content) {
        return this._appPre(content, true);
      }
    }, {
      key: "_appPre",
      value: function _appPre(content, prepend) {
        if (!content) {
          return;
        }

        if (typeof content === 'string') {
          // No I18N
          // create fragment and perform append/prepend.
          var dcFrag = document.createDocumentFragment(),
              tempDiv = document.createElement('div');
          dcFrag.appendChild(tempDiv);
          tempDiv.innerHTML = content;

          var nodes = _toConsumableArray(tempDiv.childNodes);

          dcFrag.textContent = '';
          var k = 0;

          while (k < nodes.length) {
            dcFrag.appendChild(nodes[k]);
            k++;
          }

          content = dcFrag;
        } else if (content instanceof z) {
          content = content[0]; // ##need to be discussed
        } // otherwise content is of type DOM Object


        var savedContent = content,
            currContent,
            curEle;

        for (var i = 0; i < this.length; i++) {
          currContent = i === this.length - 1 ? savedContent : savedContent.cloneNode(true);
          curEle = this[i];

          if (prepend) {
            // curEle.parentNode.insertBefore(currContent, curEle.firstElementChild);
            curEle.insertBefore(currContent, curEle.firstElementChild);
          } else {
            curEle.appendChild(currContent);
          }
        }

        return this;
      }
    }, {
      key: "add",
      value: function add(sel) {
        sel = z(sel);
        var len = sel.length;

        if (len) {
          var currLen = this.length,
              toAdd,
              res = [];

          for (var i = 0; i < currLen; i++) {
            if (i < this.length) {
              res[i] = this[i];
            } else {
              toAdd = sel[i - this.length];

              if (toAdd.nodeType) {
                res[i] = toAdd;
              }
            }

            if (i === currLen - 1 && i < this.length) {
              currLen += len;
            }
          }

          return z(undefined, undefined, res);
        }

        return this;
      }
    }, {
      key: "text",
      value: function text(content) {
        return this._txtHtml(content);
      }
    }, {
      key: "html",
      value: function html(content) {
        return this._txtHtml(content, true);
      }
    }, {
      key: "_txtHtml",
      value: function _txtHtml(content, html) {
        var len = this.length,
            prop = html ? 'innerHTML' : 'textContent'; // No I18N

        if (len && content === undefined) {
          // len check needed to avoid [0] of undefined error
          return this[0][prop];
        } // content can be null


        var isObj = content && _typeof(content) === 'object',
            // No I18N
        parsedCont = isObj ? content.nodeName ? content.outerHTML : content instanceof z && content.length ? content[0].outerHTML : '' : content;

        for (var i = 0; i < len; i++) {
          this[i][prop] = parsedCont; // No I18N
        }

        return this;
      }
    }, {
      key: "val",
      value: function val(value) {
        // input, select & textarea -- ##need to be discussed
        var len = this.length;

        if (len) {
          var ele = this[0];

          if (value === undefined) {
            return ele.value || ele.getAttribute('value') || ''; // No I18N
          }

          ele.value = value; // setting the value will be updated in property alone.

          return this;
        }

        return undefined; // No I18N
      }
    }, {
      key: "focus",
      value: function focus() {
        // Treating it to pass event handler not supported
        return this._triggerFB(true);
      } // focusin and focusout event triggering will trigger focus and blur only

    }, {
      key: "focusin",
      value: function focusin() {
        return this._triggerFB(true);
      }
    }, {
      key: "focusout",
      value: function focusout() {
        return this._triggerFB();
      }
    }, {
      key: "blur",
      value: function blur() {
        return this._triggerFB();
      }
    }, {
      key: "select",
      value: function select() {
        if (this.length) {
          this[0].select();
        }

        return this;
      }
    }, {
      key: "_triggerFB",
      value: function _triggerFB() {
        if (this.length) {
          this[0][focus ? 'focus' : 'blur'](); // No I18N
        }

        return this;
      }
    }, {
      key: "attr",
      value: function attr(attrName, attrValue) {
        return this._iterate(true, attrName, attrValue); // No I18N
      }
    }, {
      key: "removeAttr",
      value: function removeAttr(attrs) {
        return this._iterate(false, attrs.split(' '));
      }
    }, {
      key: "_iterate",
      value: function _iterate(add, attrName, attrValue) {
        var len = this.length,
            retValue = this;

        if (len) {
          for (var i = 0; i < len; i++) {
            if (add) {
              retValue = this._attr(attrName, attrValue, this[i]);

              if (attrValue === undefined && _typeof(attrName) !== 'object') {
                return retValue;
              }
            } else {
              this._removeAttr(attrName, this[i]);
            }
          }
        }

        return retValue;
      }
    }, {
      key: "_attr",
      value: function _attr(attrName, attrValue, ele) {
        var isBool = false;

        if (_typeof(attrName) === 'object') {
          var val;

          for (var i in attrName) {
            isBool = this.booleanAttrs.indexOf(i) >= 0;
            val = attrName[i];

            if (val !== null && val !== undefined && !(val === false && isBool)) {
              // third condition is added for linux-firefox
              if (isBool && val) {
                val = i;
              }

              ele.setAttribute(i, val);
            } else {
              // boolean attributes might be present
              ele.removeAttribute(i);
            }
          }
        } else {
          isBool = this.booleanAttrs.indexOf(attrName) >= 0;

          if (attrValue === undefined) {
            // getter method
            attrValue = ele.getAttribute(attrName);
            attrValue = attrValue === null ? undefined : isBool && (attrValue === '' || attrValue) ? attrName : attrValue; // ##need to be discussed

            return attrValue;
          }

          if (isBool && attrValue) {
            attrValue = attrName;
          }

          ele.setAttribute(attrName, attrValue);
        }

        return this;
      }
    }, {
      key: "_removeAttr",
      value: function _removeAttr(attrs, ele) {
        var aName;

        for (var i = 0; i < attrs.length; i++) {
          aName = attrs[i];

          if (this.booleanAttrs.indexOf(aName) >= 0) {
            // boolean attributes
            ele[aName] = false;
          }

          ele.removeAttribute(aName);
        }
      }
    }, {
      key: "css",
      value: function css(propName, value) {
        var len = this.length;

        if (len) {
          if (typeof propName === 'string' && value === undefined) {
            // No I18N
            // getter
            propName = propName.replace(/-([a-zA-Z])/g, function (g) {
              return g[1].toUpperCase(); // replacing the hyphenated names to camelCase
            });
            propName = proxyProps[propName] || checkVendorPrefix(propName);
            return window.getComputedStyle(this[0])[propName];
          }

          for (var k = 0; k < len; k++) {
            // setter
            var ele = this[k];

            if (_typeof(propName) === 'object') {
              // No I18N
              for (var i in propName) {
                this._setStyle(i, propName[i], ele);
              }
            } else {
              this._setStyle(propName, value, ele);
            }
          }
        }

        return this;
      }
    }, {
      key: "_setStyle",
      value: function _setStyle(propName, value, ele) {
        propName = propName.replace(/-([a-zA-Z])/g, function (g) {
          return g[1].toUpperCase(); // replacing the hyphenated names to camelCase
        });
        propName = proxyProps[propName] || checkVendorPrefix(propName);

        if (['width', 'height', 'top', 'left', 'right', 'bottom', 'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'].indexOf(propName) >= 0 && typeof value === 'number') {
          // No I18N
          value += 'px'; // No I18N
        }

        ele.style[propName] = value;
      }
    }, {
      key: "show",
      value: function show(dVal) {
        return this._toggle(false, dVal);
      }
    }, {
      key: "hide",
      value: function hide() {
        return this._toggle(true);
      }
    }, {
      key: "_toggle",
      value: function _toggle(hide, dVal) {
        // No I18N
        var len = this.length,
            ele;

        if (len) {
          var pval;

          for (var i = 0; i < len; i++) {
            ele = this[i];

            if (hide && ele.prevDis === undefined) {
              pval = window.getComputedStyle(ele).display;

              if (pval !== 'none') {
                // No I18N
                Object.defineProperty(ele, 'prevDis', {
                  // No I18N
                  value: pval
                });
              }
            }

            if (ele.nodeType === 1) {
              // since text nodes don't have style attribute.
              ele.style.display = hide ? 'none' : dVal || ele.prevDis || ''; // No I18N
            }
          }
        }

        return this;
      }
      /* single element width & height setting alone is supported */

    }, {
      key: "width",
      value: function width(val) {
        return this._innerWH(val, 'Width', true); // No I18N
      }
    }, {
      key: "height",
      value: function height(val) {
        return this._innerWH(val, 'Height', true); // No I18N
      }
    }, {
      key: "outerWidth",
      value: function outerWidth(val, includeMargin) {
        return this._outerWH(val, 'Width', includeMargin); // No I18N
      }
    }, {
      key: "outerHeight",
      value: function outerHeight(val, includeMargin) {
        return this._outerWH(val, 'Height', includeMargin); // No I18N
      }
    }, {
      key: "_outerWH",
      value: function _outerWH(value, prop, includeMargin) {
        // value should be true if margin should be included
        if (this.length) {
          var ele = this[0];

          if (ele === window) {
            return ele['inner' + prop]; // No I18N
          }

          var eleStyle = window.getComputedStyle(ele),
              isHidden = eleStyle.display === 'none' || ele['offset' + prop] === 0,
              // No I18N
          isBorderBox = eleStyle.boxSizing === 'border-box',
              // No I18N
          isH = prop === 'Height',
              // No I18N
          isBool = value === true;
          includeMargin = includeMargin || isBool;

          if (value === undefined || isBool) {
            // getter
            var currVal = isHidden ? getHiddenEleProp(ele, prop, true) : ele['offset' + prop]; // No I18N

            if (includeMargin) {
              currVal += parseFloat(eleStyle[isH ? 'marginTop' : 'marginLeft']) + parseFloat(eleStyle[isH ? 'marginBottom' : 'marginRight']); // No I18N
            }

            return currVal;
          } // else setter


          value = typeof value === 'number' ? value + 'px' : value; // No I18N

          var pname = prop.toLowerCase();
          ele.style[pname] = value;
          var clientVal = isHidden ? getHiddenEleProp(ele, prop) || parseFloat(value) : ele['client' + prop]; // No I18N
          // border is multiplied since clientWidth/Height lacks border values even if border is set to that element.
          // clientVal += (2 * parseFloat(eSty['border' + (isH ? 'Top' : 'Left') + 'Width'])) + (2 * parseFloat(eSty['border' + (isH ? 'Bottom' : 'Right') + 'Width'])); // No I18N
          // padding values should also added.

          var borderVal = parseFloat(eleStyle['border' + (isH ? 'Top' : 'Left') + 'Width']) + parseFloat(eleStyle['border' + (isH ? 'Bottom' : 'Right') + 'Width']); // No I18N

          clientVal = clientVal + (isBorderBox ? borderVal : -borderVal); // No I18N
          // padding calc is removed since outerWidth(398) should set the width style attribute to 398
          // if (!isBorderBox || !isH) {
          //     clientVal = clientVal - (2 * parseFloat(eleStyle['padding' + (isH ? 'Top' : 'Left')])) - (2 * parseFloat(eleStyle['padding' + (isH ? 'Bottom' : 'Right')])); // No I18N
          // }

          if (includeMargin) {
            clientVal = clientVal - parseFloat(eleStyle['margin' + (isH ? 'Top' : 'Left')]) - parseFloat(eleStyle['margin' + (isH ? 'Bottom' : 'Right')]); // No I18N
          }

          ele.style[pname] = clientVal + 'px'; // No I18N
        }

        return this;
      }
    }, {
      key: "innerWidth",
      value: function innerWidth(value) {
        return this._innerWH(value, 'Width'); // No I18N
      }
    }, {
      key: "innerHeight",
      value: function innerHeight(value) {
        return this._innerWH(value, 'Height'); // No I18N
      }
    }, {
      key: "_innerWH",
      value: function _innerWH(value, prop, plain) {
        var ele = this[0],
            cName = 'client' + prop,
            // No I18N
        oName = 'offset' + prop; // No I18N

        if (ele === window) {
          return ele.document.documentElement[cName]; // No I18N
        } else if (ele === document) {
          // nodeType - 9 check can be added
          var doc = ele.documentElement;
          return Math.max(ele.body['scroll' + prop], doc['scroll' + prop], ele.body[oName], doc[oName], doc[cName]); // No I18N
        }

        var eSty = window.getComputedStyle(ele),
            isHidden = eSty.display === 'none' || ele[oName] === 0,
            // No I18N
        isBorderBox = eSty.boxSizing === 'border-box',
            // No I18N
        isH = prop === 'Height',
            // No I18N
        hprop = isH ? 'Top' : 'Left',
            // No I18N
        wprop = isH ? 'Bottom' : 'Right'; // No I18N

        if (value === undefined) {
          /* If the element is hidden, to get the actual dimensions, some display properties have to be included. */
          var _clientVal = isHidden ? getHiddenEleProp(ele, prop, plain) : plain ? ele[oName] : ele[cName]; // No I18N


          if (plain) {
            // padding has to be subtracted
            _clientVal = _clientVal - parseFloat(eSty['padding' + hprop]) - parseFloat(eSty['padding' + wprop]); // No I18N
            // if box-sizing is border-box, then border values are added automatically from offset value. So, subtracting here

            _clientVal -= parseFloat(eSty['border' + hprop + 'Width']) + parseFloat(eSty['border' + wprop + 'Width']); // No I18N
          }

          return _clientVal;
        }

        var pname = prop.toLowerCase();

        if (!value) {
          // resetting the old value by passing empty string.
          ele.style[pname] = value;
          return;
        } // else setter


        var isPredefType = typeof value === 'string'; // No I18N

        value = isPredefType ? value : value + 'px'; // No I18N

        ele.style[pname] = value;

        if (isPredefType && value === 'auto') {
          return this;
        }

        var clientVal = isHidden ? getHiddenEleProp(ele, prop) || parseFloat(value) : ele[cName]; // No I18N
        // border is multiplied since clientWidth/Height lacks border values even if border is set to that element.
        // clientVal += (2 * parseFloat(eSty['border' + (isH ? 'Top' : 'Left') + 'Width'])) + (2 * parseFloat(eSty['border' + wprop + 'Width'])); // No I18N
        // padding values should also added.

        if (isBorderBox || isH) {
          // No I18N
          var borderVal = parseFloat(eSty['border' + hprop + 'Width']) + parseFloat(eSty['border' + wprop + 'Width']); // No I18N

          clientVal = clientVal + (isBorderBox ? 2 * borderVal : borderVal); // No I18N
        }

        if (!plain || isBorderBox) {
          var paddingVal = 2 * parseFloat(eSty['padding' + hprop]) + 2 * parseFloat(eSty['padding' + wprop]); // No I18N

          clientVal = clientVal + (isH ? isBorderBox ? paddingVal / 2 : -paddingVal : paddingVal / 2); // No I18N
        }

        if (isBorderBox || !plain) {
          ele.style[pname] = clientVal + 'px'; // No I18N
        }

        return this;
      }
    }, {
      key: "scrollTop",
      value: function scrollTop(value) {
        return this._scroll(value);
      }
    }, {
      key: "scrollLeft",
      value: function scrollLeft(value) {
        return this._scroll(value, true);
      }
    }, {
      key: "_scroll",
      value: function _scroll(val, left) {
        var len = this.length;

        if (len) {
          var ele = this[0],
              isWindow = z.isWindow(this[0]) || ele.nodeType === 9 && ele.defaultView,
              // nodeType 9 is for document node
          prop = isWindow ? 'page' + (left ? 'X' : 'Y') + 'Offset' : 'scroll' + (left ? 'Left' : 'Top'); // No I18N

          if (val === undefined) {
            // getter
            return isWindow ? window[prop] : this[0][prop];
          }

          if (isWindow) {
            window.scrollTo(left ? val : window.pageXOffset, left ? window.pageYOffset : val);
          } else {
            this[0][prop] = val;
          }
        }

        return this;
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return Array.prototype.slice.call(this);
      }
    }, {
      key: "position",
      value: function position() {
        // only getter
        var ele = this[0],
            top = ele.offsetTop,
            left = ele.offsetLeft,
            pNode = ele.parentNode;
        top -= pNode.scrollTop;
        left -= pNode.scrollLeft;
        return {
          top: top,
          left: left
        };
      }
    }, {
      key: "offset",
      value: function offset(props) {
        // while setting the values margin value should be excluded.
        var ele = this[0];

        if (props) {
          ele = z(ele);
          var cPos,
              cLeft,
              cTop,
              cOff,
              needCalc,
              cssTop,
              cssLeft,
              pos = ele.css('position'); // No I18N

          if (pos === 'static') {
            // No I18N
            ele[0].style.position = 'relative'; // No I18N
          }

          cOff = ele.offset();
          cssTop = ele.css('top'); // No I18N

          cssLeft = ele.css('left'); // No I18N

          needCalc = (pos === 'absolute' || pos === 'fixed') && (cssTop + cssLeft).indexOf('auto') > -1; // No I18N

          if (needCalc) {
            cPos = ele.position();
            cTop = cPos.top;
            cLeft = cPos.left;
          } else {
            cTop = parseFloat(cssTop) || 0;
            cLeft = parseFloat(cssLeft) || 0;
          }

          if (props.top !== null) {
            props.top = props.top - cOff.top + cTop;

            this._setStyle('top', props.top, ele[0]); // No I18N

          }

          if (props.left !== null) {
            props.left = props.left - cOff.left + cLeft;

            this._setStyle('left', props.left, ele[0]); // No I18N

          }
        } else {
          // values will be relative to offset parent element.
          var rect = ele && ele.getBoundingClientRect(),
              docEle = document.documentElement;
          return docEle.contains(ele) && rect ? {
            top: rect.top + window.pageYOffset - docEle.clientTop,
            left: rect.left + window.pageXOffset - docEle.clientLeft
          } : {
            top: 0,
            left: 0
          };
        }

        return this;
      }
    }, {
      key: "findFirst",
      value: function findFirst(selector) {
        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[0];
        // util method - added for perf reasons. Used by list component
        selector = escInvalidSel(selector);
        return z(context).querySelector(selector);
      }
    }, {
      key: "children",
      value: function children(selector) {
        // find the children which matches the selector
        if (this.length) {
          var childElem = _toConsumableArray(this[0].children),
              fRes; // fRes - filtered results


          if (selector) {
            fRes = [];
            var isObj = _typeof(selector) === 'object'; // No I18N

            if (isObj) {
              // element
              selector = selector instanceof z ? selector[0] : selector;
            }

            if (isObj || selector.search(notExcludedRegex) < 0) {
              var len = childElem.length;
              selector = escInvalidSel(selector);

              for (var i = 0; i < len; i++) {
                if (isObj ? childElem[i] === selector : childElem[i].matches(selector)) {
                  fRes.push(childElem[i]);
                }
              }
            } else {
              // selector contains pseudo elements
              fRes = zqueryselector(selector, this[0], true);
            }
          }

          return z(undefined, this[0], fRes || childElem);
        }

        return this;
      }
    }, {
      key: "find",
      value: function find(selector, context) {
        // finding the match within first element only.
        // string type selector alone supported.
        var len = this.length;

        if (!len) {
          return this;
        }

        var results = [];

        for (var i = 0; i < len; i++) {
          Array.prototype.push.apply(results, zqueryselector(selector, context || this[i]));
        }

        return z(undefined, context || this[0], results);
      }
    }, {
      key: "slideDown",
      value: function slideDown() {
        var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
        var callback = arguments.length > 1 ? arguments[1] : undefined;
        return this._slide2(time, callback, true);
      }
    }, {
      key: "slideUp",
      value: function slideUp() {
        var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
        var callback = arguments.length > 1 ? arguments[1] : undefined;
        return this._slide2(time, callback);
      }
    }, {
      key: "_slide",
      value: function _slide() {
        var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
        var callback = arguments.length > 1 ? arguments[1] : undefined;
        var isDown = arguments.length > 2 ? arguments[2] : undefined;

        if (this.length) {
          var ele = this[0],
              eleStyle = ele.style,
              dis;

          if (isDown) {
            eleStyle.removeProperty('display'); // No I18N

            dis = window.getComputedStyle(ele).display;

            if (dis === 'none') {
              dis = 'block'; // No I18N
            }

            eleStyle.display = dis; // making the hidden element visible.
          }

          eleStyle.overflow = 'hidden';
          var compStyle = window.getComputedStyle(ele);
          var prevProps = {
            height: ele.offsetHeight,
            paddingTop: compStyle.paddingTop,
            paddingBottom: compStyle.paddingBottom,
            marginTop: compStyle.marginTop,
            marginBottom: compStyle.marginBottom
          },
              props,
              len;
          eleStyle.height = isDown ? '0px' : ele.offsetHeight + 'px'; // No I18N

          if (isDown) {
            props = ['height', 'paddingTop', 'paddingBottom', 'marginTop', 'marginBottom']; // No I18N

            len = props.length;

            for (var i = 0; i < len; i++) {
              eleStyle[props[i]] = 0;
            }
          }

          eleStyle.transitionProperty = 'height, margin, padding'; // No I18N

          eleStyle.transitionDuration = time + 'ms'; // No I18N
          // eleStyle.boxSizing = 'border-box'; // No I18N

          window.setTimeout(function () {
            props = ['height', 'paddingTop', 'paddingBottom', 'marginTop', 'marginBottom']; // No I18N

            len = props.length;
            var pName,
                val = 0;

            for (var _i3 = 0; _i3 < len; _i3++) {
              pName = props[_i3];
              val = prevProps[pName];
              eleStyle[pName] = isDown ? val ? typeof val === 'number' ? val + 'px' : val : '0px' : 0; // No I18N
            }

            props = ['height', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'overflow', 'transition-duration', 'transition-property', 'box-sizing']; // No I18N

            len = props.length;
            window.setTimeout(function () {
              if (!isDown) {
                eleStyle.display = 'none'; // No I18N
              }

              for (var _i4 = 0; _i4 < len; _i4++) {
                eleStyle.removeProperty(props[_i4]);
              }

              callback && callback();
            }, time);
          }, 1);
        }

        return this;
      }
    }, {
      key: "_slide2",
      value: function _slide2() {
        var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
        var callback = arguments.length > 1 ? arguments[1] : undefined;
        var isDown = arguments.length > 2 ? arguments[2] : undefined;

        if (this.length) {
          var ele = this[0],
              eleStyle = ele.style;

          if (isDown) {
            var disVal = window.getComputedStyle(ele).display;

            if (disVal === 'none') {
              // No I18N
              eleStyle.display = 'block'; // No I18N
            }
          }

          eleStyle.overflow = 'hidden';
          var compStyle = window.getComputedStyle(ele);
          var prevProps = {
            height: ele.offsetHeight,
            paddingTop: compStyle.paddingTop,
            paddingBottom: compStyle.paddingBottom,
            marginTop: compStyle.marginTop,
            marginBottom: compStyle.marginBottom
          },
              props,
              len;
          /* Offsetheight of the element will include padding and borders as well. Hence, subtracting it from height value. */

          prevProps.height = parseInt(prevProps.height || 0) - (parseInt(prevProps.paddingTop || 0) + parseInt(prevProps.paddingBottom || 0));

          if (isDown) {
            eleStyle.removeProperty('height'); // No I18N

            props = ['height', 'paddingTop', 'paddingBottom', 'marginTop', 'marginBottom']; // No I18N

            len = props.length;

            for (var i = 0; i < len; i++) {
              eleStyle[props[i]] = 0;
            }
          }

          eleStyle.height = isDown ? '0px' : prevProps.height + 'px'; // No I18N

          var base = this;
          ele._slideTimeout = window.setTimeout(function () {
            eleStyle.transitionProperty = 'height, margin, padding'; // No I18N

            eleStyle.transitionDuration = time + 'ms'; // No I18N

            props = ['height', 'paddingTop', 'paddingBottom', 'marginTop', 'marginBottom']; // No I18N

            len = props.length;

            var startTime = +new Date(),
                incVal,
                prop,
                remTime,
                val,
                frameOp = function frameOp() {
              remTime = +new Date() - startTime;
              incVal = isDown ? incVal : -incVal;

              for (var _i5 = 0; _i5 < len; _i5++) {
                prop = props[_i5];
                eleStyle[prop] = (isDown ? parseFloat(prevProps[prop] || 0) * remTime / time : 0) + 'px'; // No I18N
              }

              if (remTime <= time) {
                if (!ele._effectsData) {
                  ele._effectsData = {
                    stopMethod: '_stopSlideAnimation',
                    // No I18N
                    params: [ele, props, prevProps, isDown, callback],
                    isTimeout: true
                  };
                } // (window.requestAnimationFrame && requestAnimationFrame(frameOp)) || setTimeout(frameOp, 100);


                ele._effectsData.timeout = setTimeout(frameOp, 100);
              } else {
                ele._slideTimeout = ele._effectsData = undefined;

                base._stopSlideAnimation(ele, props, prevProps, isDown, callback);
              }
            };

            frameOp();
          }, 1);
        }

        return this;
      }
    }, {
      key: "_stopSlideAnimation",
      value: function _stopSlideAnimation(ele, props, prevProps, isDown, callback) {
        var val,
            prop,
            eleStyle = ele.style,
            len = props.length,
            isTransPending = ele.offsetHeight !== prevProps.height + parseInt(prevProps.paddingTop) + parseInt(prevProps.paddingBottom),
            transEndFn = function transEndFn(ev) {
          /* lastTrans is used because transitionEnd will be triggered for all 3 properties */
          if (!ev || ele.lastTrans === ev.originalEvent.propertyName) {
            props = ['transition-duration', 'height', 'transition-property', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'overflow', 'box-sizing']; // No I18N

            len = props.length;

            for (var i = 0; i < len; i++) {
              eleStyle.removeProperty(props[i]);
            }

            z(ele).off(ZComponents._transitionEnd);
            callback && callback();
          }
        };

        if (isDown && isTransPending) {
          /* TransitionEnd is used for slide down because on resetting the previous values in the below code,
             transition will be applied and removing the transition property in the next line shows a jerk.
             Hence, transition end is used for removing the properties. */
          z(ele).on(ZComponents._transitionEnd, transEndFn);
        }

        for (var i = 0; i < len; i++) {
          prop = props[i];
          val = prevProps[prop];

          if (isDown ? parseInt(val) !== parseInt(eleStyle[prop]) : parseInt(eleStyle[prop]) !== 0) {
            ele.lastTrans = prop;
          }

          eleStyle[prop] = isDown ? val ? typeof val === 'number' ? val + 'px' : val : '0px' : 0; // No I18N
        }

        if (!isDown) {
          eleStyle.display = 'none'; // No I18N
        }

        if (!isDown || !isTransPending) {
          transEndFn();
        }
      }
    }, {
      key: "fadeIn",
      value: function fadeIn(time, callback) {
        return this._fade(time, callback, true);
      }
    }, {
      key: "fadeOut",
      value: function fadeOut(time, callback) {
        return this._fade(time, callback);
      }
    }, {
      key: "_fade",
      value: function _fade() {
        var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
        var callback = arguments.length > 1 ? arguments[1] : undefined;
        var isIn = arguments.length > 2 ? arguments[2] : undefined;

        if (this.length) {
          var ele = this[0],
              eleStyle = ele.style;
          eleStyle.opacity = isIn ? 0 : 1;

          if (isIn) {
            var disVal = window.getComputedStyle(ele).display;

            if (disVal === 'none') {
              // No I18N
              eleStyle.display = 'block'; // No I18N
            }
          }

          var curTime = +new Date(),
              incVal,
              op,
              base = this,
              frameOp = function frameOp() {
            incVal = (new Date() - curTime) / time;
            incVal = isIn ? incVal : -incVal;
            eleStyle.opacity = +eleStyle.opacity + incVal;
            curTime = +new Date();
            op = +eleStyle.opacity;

            if (isIn ? op < 1 : op > 0) {
              if (!ele._effectsData) {
                ele._effectsData = {
                  stopMethod: '_stopFadeAnimation',
                  // No I18N
                  params: [eleStyle, isIn],
                  isTimeout: !window.requestAnimationFrame
                };
              }

              ele._effectsData.timeout = window.requestAnimationFrame && requestAnimationFrame(frameOp) || setTimeout(frameOp, 16);
            } else {
              ele._effectsData = undefined;

              base._stopFadeAnimation(eleStyle, isIn);

              callback && callback();
            }
          };

          frameOp();
        }

        return this;
      }
    }, {
      key: "_stopFadeAnimation",
      value: function _stopFadeAnimation(eleStyle, isIn) {
        if (!isIn) {
          eleStyle.display = 'none'; // No I18N
        }

        eleStyle.removeProperty('opacity'); // No I18N
      }
    }, {
      key: "animate",
      value: function animate(props) {
        var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_default';
        var callback = arguments.length > 2 ? arguments[2] : undefined;
        // No I18N
        // easing functions are not considered.
        duration = typeof duration === 'string' ? Speed[duration] : duration; // No I18N

        if (_typeof(duration) === 'object') {
          // No I18N
          callback = duration.complete;
          duration = duration.duration;
        }

        if (this.length) {
          var ele = this[0],
              temp; // assigning it to a variable since not able to checkin without assignment with new operator.

          for (var i in props) {
            // iterate over each and every property
            temp = new ZAnimation(ele, i, props[i], duration);
          }

          window.setTimeout(function () {
            callback && callback();
          }, duration);
        }

        return this;
      }
    }, {
      key: "stop",
      value: function stop() {
        return this._animateEnd();
      }
    }, {
      key: "finish",
      value: function finish() {
        return this._animateEnd(true);
      }
    }, {
      key: "_animateEnd",
      value: function _animateEnd(finish) {
        if (this.length) {
          var ins,
              ele = this[0],
              effectsData = ele._effectsData;

          if (ele.hasOwnProperty('zanimation')) {
            // No I18N
            ins = ele.zanimation;
            ins[finish ? 'finish' : 'stop'](); // No I18N
          }
          /* Stop is not working for other effects like fade, slide ##REVISIT - Karthika */


          if (effectsData) {
            this[effectsData.stopMethod].apply(this, _toConsumableArray(effectsData.params));

            if (effectsData.isTimeout) {
              clearTimeout(effectsData.timeout);
            } else {
              cancelAnimationFrame(effectsData.timeout);
            }

            ele._effectsData = undefined;
          }

          if (ele._slideTimeout) {
            clearTimeout(ele._slideTimeout);
            ele._slideTimeout = undefined;
          }
        }

        return this;
      }
    }, {
      key: "clone",
      value: function clone(deep) {
        if (this.length) {
          var cloned = this[0].cloneNode(deep);
          return z(undefined, this.context, [cloned]);
        }

        return this;
      }
    }, {
      key: "prop",
      value: function prop(propName, val) {
        var ele = this[0];

        if (val !== undefined) {
          ele[propName] = val;
          return this;
        }

        return ele && ele[propName] || false;
      }
    }, {
      key: "empty",
      value: function empty() {
        return this._remove(true);
      }
    }, {
      key: "remove",
      value: function remove() {
        return this._remove();
      }
    }, {
      key: "_remove",
      value: function _remove(makeEmpty) {
        var len = this.length,
            ele;

        if (len) {
          for (var i = 0; i < len; i++) {
            ele = this[i];

            if (makeEmpty) {
              ele.innerHTML = ''; // No I18N
            } else if (ele.parentNode) {
              z(ele).off(); // binded events are removed for the element.

              ele.parentNode.removeChild(ele); // detached dom should be avoided here
            }
          }
        }

        return this;
      }
    }, {
      key: "first",
      value: function first() {
        return this._getAt(0);
      }
    }, {
      key: "last",
      value: function last() {
        return this._getAt(this.length - 1);
      }
    }, {
      key: "get",
      value: function get(index) {
        if (index === undefined || index === null) {
          return [];
        }

        return this._getAt(index, true);
      }
    }, {
      key: "eq",
      value: function eq(index) {
        return this._getAt(index);
      }
    }, {
      key: "_getAt",
      value: function _getAt(index, raw) {
        var ele = this[index];
        return raw ? ele : z(ele);
      }
    }, {
      key: "filter",
      value: function filter(sel) {
        var len = this.length;

        if (len && sel) {
          var res = [],
              item,
              visibleCond,
              isStr = typeof sel === 'string'; // No I18N

          if (isStr && sel.search(pseudoRegex) >= 0 && sel.indexOf(':not') >= 0) {
            // No I18N
            // multiple attribute query selector.
            sel = sel.split(',').join('):not('); // No I18N
          }

          if (isStr) {
            sel = escInvalidSel(sel);
          }

          for (var i = 0; i < len; i++) {
            item = this[i]; // sel can be of type function or string.

            visibleCond = sel === ':visible'; // No I18N

            if (isStr && (visibleCond || sel === ':hidden')) {
              // No I18N
              item = _filter([item], undefined, visibleCond, visibleCond);

              if (item.length) {
                res.push(item[0]);
              }
            } else if (isStr ? item.matches(sel) : sel(i, item)) {
              // No I18N
              res.push(item);
            }
          }

          return z(res.length ? undefined : 1, this, res);
        }

        return z(undefined, this, []); // returning dom util instance always to allow chaining.
      }
    }, {
      key: "map",
      value: function map(callback) {
        var len = this.length;

        if (len) {
          var res = [],
              item;

          for (var i = 0; i < len; i++) {
            item = this[i];

            if (callback(i, item)) {
              res.push(item);
            }
          }

          return z(res.length ? undefined : 1, this, res);
        }

        return z(undefined, this);
      }
    }, {
      key: "is",
      value: function is(selector) {
        // passing argument should be of type String
        if (typeof selector === 'string' && this.length) {
          var ele = this[0];

          if (selector.search(notExcludedRegex) < 0) {
            selector = escInvalidSel(selector);
            return ele.matches(selector);
          } // pseudos present. Ex:.zmenu__item:not():visible


          var psdoIndex = selector.lastIndexOf(':'),
              partialSel = selector.substr(0, psdoIndex);
          selector = selector.slice(psdoIndex);
          partialSel = escInvalidSel(partialSel);

          if (partialSel && !ele.matches(partialSel)) {
            return undefined;
          }

          if ((ele === document || ele === window) && selector === ':visible') {
            // No I18N
            return true;
          } // let disVal = window.getComputedStyle(ele).display;
          // return selector === ':hidden' ? (disVal === 'none') : (selector === ':visible' ? disVal !== 'none' : undefined);// No I18N
          // SVG element lacks offsetWidth and offsetHeight property.


          return selector === ':hidden' ? ele.offsetWidth === 0 || ele.offsetHeight === 0 || ele.getClientRects().length === 0 : selector === ':visible' ? ele.offsetWidth > 0 || ele.offsetHeight > 0 || ele.getClientRects().length > 0 : undefined; // No I18N
          // other pseudos should be added.
        } else if (_typeof(selector) === 'object') {
          // using is for element check can be avoided
          return this[0] === (selector instanceof z ? selector[0] : selector);
        }
      }
    }, {
      key: "has",
      value: function has(sel) {
        // all the elements which matches atleast one of the elements
        // string type selector alone supported.
        var len = this.length,
            isStr = typeof sel === 'string',
            // No I18N
        selEle;

        if (!isStr) {
          selEle = z(sel)[0];
        }

        if (len && sel) {
          var flag = false,
              results = [],
              k = 0;

          for (var i = 0; i < len; i++) {
            var child = z(this[i]).children(),
                cLen = child.length;

            for (var j = 0; j < cLen; j++) {
              var nesChild = child[j],
                  ncObj = z(nesChild);

              while (nesChild.children && nesChild.children.length) {
                flag = isStr ? ncObj.is(sel) : ncObj === selEle;
                nesChild = ncObj.children;
                ncObj = z(nesChild);
              }

              flag = isStr ? ncObj.is(sel) : ncObj === selEle;
            }

            if (flag) {
              results[k++] = this[i];
            }
          }

          var resFound = results.length;
          return z(resFound ? undefined : 1, this, resFound && results);
        }

        return z(1, this[0]);
      }
    }, {
      key: "prev",
      value: function prev(sel) {
        return this._prevNext(sel);
      }
    }, {
      key: "next",
      value: function next(sel) {
        return this._prevNext(sel, true);
      }
    }, {
      key: "_prevNext",
      value: function _prevNext(sel, findNext) {
        if (!this.length) {
          return this;
        }

        var ele = this[0][(findNext ? 'next' : 'previous') + 'ElementSibling']; // No I18N

        sel = escInvalidSel(sel);

        if (ele && sel && !ele.matches(sel)) {
          ele = null;
        }

        return z(ele || 1, this[0]);
      }
    }, {
      key: "prevAll",
      value: function prevAll(sel) {
        return this._prevNextAll(sel);
      }
    }, {
      key: "nextAll",
      value: function nextAll(sel) {
        return this._prevNextAll(sel, true);
      }
    }, {
      key: "_prevNextAll",
      value: function _prevNextAll(sel, findNext) {
        if (!this.length) {
          return this;
        }

        var res = [],
            pname = (findNext ? 'next' : 'previous') + 'ElementSibling',
            // No I18N
        ele = this[0][pname];
        sel = escInvalidSel(sel);
        var contPseudo;

        if (sel) {
          var matchRes = notExcludedRegex.exec(sel);
          notExcludedRegex.lastIndex = 0; // last index should be reset since exec with global regex will remember the last match results.

          if (matchRes) {
            // contains pseudo
            contPseudo = matchRes[0];
            sel = sel.replace(contPseudo, '');
          }
        }

        while (ele) {
          if (!sel || ele.matches(sel)) {
            res.push(ele);
          }

          ele = ele[pname];
        }

        if (contPseudo) {
          // currently :visible alone works
          var visibleCond = contPseudo.startsWith('visible'); // No I18N

          if (visibleCond) {
            res = _filter(res, undefined, visibleCond, visibleCond);
          }
        }

        return z(res.length ? undefined : 1, this[0], res); // length check added to prevent selector assignment in obj
      }
    }, {
      key: "parent",
      value: function parent(sel) {
        var len = this.length;

        if (len) {
          var parNode = this[0].parentNode;
          sel = escInvalidSel(sel);

          if (sel && !parNode.matches(sel)) {
            parNode = null;
          }

          return z(parNode || 1, this[0]);
        }

        return this;
      }
    }, {
      key: "parents",
      value: function parents(sel) {
        var res = [],
            ele = this[0],
            temp;
        sel = escInvalidSel(sel);

        while (ele && ele.tagName !== 'HTML') {
          // No I18N
          temp = ele.parentNode;

          if (sel && temp.matches(sel)) {
            // string type selector and non-pseudo selectors alone considered.
            res = [temp];
            break;
          }

          if (!sel) {
            res.push(temp);
          }

          ele = temp;
        }

        return z(res.length ? undefined : 1, this[0], res);
      }
    }, {
      key: "closest",
      value: function closest(sel) {
        // selector must
        if (!sel) {
          // selector undefined case - faced issue in date pickers
          return z(undefined, [], []);
        }

        if (this.length) {
          var ele = this[0],
              i,
              len,
              selType = typeof sel === 'string' ? 'str' : sel.nodeType ? 'ele' : 'obj'; // No I18N

          if (selType === 'obj') {
            len = sel.length;
          }

          sel = escInvalidSel(sel);
          var checkVis = false;

          while (ele && ele.nodeType === 1 && ele !== document.body) {
            if (selType === 'str' && sel.indexOf(':visible') !== -1) {
              // No I18N
              checkVis = true;
              sel = sel.replace(':visible', ''); // No I18N
            }

            if (selType === 'str' && ele.matches(sel) || selType === 'ele' && ele === sel) {
              // No I18N
              if (checkVis) {
                if (z(ele).is(':visible')) {
                  // No I18N
                  return z(ele);
                }
              } else {
                return z(ele);
              }
            } else if (selType === 'obj') {
              // selector instanceof $
              for (i = 0; i < len; i++) {
                if (ele === sel[i]) {
                  return z(ele);
                }
              }
            }

            ele = ele.parentNode; // parentElement support not found in IE
          }

          return z(1, this[0]);
        }

        return this;
      }
    }, {
      key: "not",
      value: function not(sel) {
        var len = this.length;

        if (len && sel) {
          var item,
              results = [],
              k = 0,
              isStr = typeof sel === 'string',
              // No I18N
          temp = false;
          sel = isStr ? escInvalidSel(sel) : sel instanceof DOMUtil ? sel : z(sel);
          var eleArrLen = !isStr && sel.length;

          for (var i = 0; i < len; i++) {
            item = this[i];
            temp = false;

            if (isStr) {
              temp = item.matches(sel);
            } else {
              for (var j = 0; j < eleArrLen; j++) {
                if (item === sel[j]) {
                  temp = true;
                  break;
                }
              }
            }

            if (!temp) {
              results[k++] = item;
            }
          }

          return z(undefined, undefined, results.length && results);
        }

        return this;
      }
    }, {
      key: "index",
      value: function index(item) {
        if (item) {
          var childs = this.toArray();
          return childs.indexOf(item.nodeType ? item : item[0]);
        }

        return this.length && this[0].parentNode ? this.prevAll().length : -1;
      }
    }, {
      key: "data",
      value: function data(key, val) {
        return this._data(key, val);
      }
    }, {
      key: "removeData",
      value: function removeData(key) {
        return this._data(key, undefined, true);
      }
    }, {
      key: "_data",
      value: function _data(key, value, remove) {
        if (!this.length) {
          return undefined;
        }

        var ele = this[0],
            ins; // instance

        if (ele.hasOwnProperty('database')) {
          ins = ele.database;
        } else {
          ins = new ZData(ele);
        }

        if (remove) {
          ins.remove(key);
        } else if (key && (value || _typeof(key) === 'object')) {
          // No I18N
          ins.set(key, value);
        } else if (!value) {
          return ins.get(key, !key, this);
        }

        return this;
      }
    }, {
      key: "on",
      value: function on(event, handler) {
        var obj = {
          handler: handler,
          delegate: null,
          execOnce: arguments[3]
        };

        if (arguments[2]) {
          obj.delegate = handler;
          obj.handler = arguments[2];
        }

        return this._handleEvent(event, obj);
      }
    }, {
      key: "off",
      value: function off(event) {
        return this._handleEvent(event);
      }
    }, {
      key: "one",
      value: function one(event, delegate, handler) {
        return this.on(event, delegate, handler, true);
      }
    }, {
      key: "trigger",
      value: function trigger(event, params) {
        return this._handleEvent(event, undefined, true, params);
      }
    }, {
      key: "_handleEvent",
      value: function _handleEvent(eName, eHandler, trigger, params) {
        var len = this.length,
            ins,
            ele;

        if (len) {
          for (var i = 0; i < len; i++) {
            ele = this[i];
            ins = ele.zevents;

            if (!ins) {
              ins = new ZEvent(ele);
            }

            if (eHandler) {
              // on
              ins.bindEvent(eName, eHandler);
            } else if (!eHandler && !trigger) {
              // off
              ins.unbindEvent(eName);
            } else if (trigger) {
              ins.trigger(eName, params);
            }
          }
        }

        return this;
      }
    }]);

    return DOMUtil;
  }();

  z.prototype = DOMUtil.prototype; // static methods should be assigned directly in z prototype

  z.isFunction = function (func) {
    return typeof func === 'function'; // No I18N
  };

  z.isEmptyObject = function (obj) {
    for (var i in obj) {
      return false;
    }

    return true;
  };

  z.noop = function () {};

  z.ajax = function (url) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var request = new XMLHttpRequest(),
        promise = new Promise(function (resolve, reject) {
      if (_typeof(url) === 'object') {
        // No I18N
        settings = url;
        url = settings.url;
      }

      var type = settings.type || 'GET',
          // No I18N
      isPostMsg = type === 'POST'; // No I18N

      if (!isPostMsg && settings.data) {
        url += convertToQuery(settings.data);
      }

      request.open(type, url, true);

      if (isPostMsg) {
        request.setRequestHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded; charset=UTF-8');

        request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
            resolve(request.responseText);
          }
        };
      } else {
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            var response = request.responseText,
                contentType = request.getResponseHeader('content-type'); // No I18N

            if (contentType && contentType.indexOf('application/json') !== -1) {
              // No I18N
              response = JSON.parse(response);
            }

            settings.success && settings.success(response, 'success', request); // No I18N

            resolve(response);
          } else {
            settings.error && settings.error(request, 'error', request.statusText); // No I18N

            reject && reject(request.statusText);
          }

          settings.always && settings.always();
        };

        request.onerror = function () {
          settings.error && settings.error(request, 'error', request.statusText); // No I18N

          reject(request.statusText);
          settings.always && settings.always(); // always will be changed to promise later ##revisit
        };
      }

      request.send(isPostMsg ? settings.data : undefined);
    });

    promise.abort = function () {
      request.abort();
    };

    return promise;
  };

  z.inArray = function (ele, arr) {
    return arr === null ? -1 : arr.indexOf(ele);
  };

  z.extend = function () {
    // copyright: jquery
    var options,
        name,
        source,
        copy,
        copyIsArray,
        clone,
        res = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deepCopy = false;

    if (typeof res === 'boolean') {
      deepCopy = res;
      res = arguments[i] || {};
      i++;
    }

    if (_typeof(res) !== 'object' && !z.isFunction(res)) {
      // res is a string - possible in deepCopy case
      res = {};
    }

    if (i === length) {
      // only one argument - z instance itself will be extended.
      res = this;
      i--;
    }

    for (; i < length; i++) {
      options = arguments[i];

      if (options !== null) {
        for (name in options) {
          source = res[name];
          copy = options[name];

          if (res === copy) {
            continue;
          }

          copyIsArray = copy && Array.isArray(copy);

          if (deepCopy && copy && (z.isPlainObject(copy) || copyIsArray)) {
            // recurse if object or array
            if (copyIsArray) {
              copyIsArray = false;
              clone = source && Array.isArray(source) ? source : [];
            } else {
              clone = source && z.isPlainObject(source) ? source : {};
            }

            res[name] = z.extend(deepCopy, clone, copy);
          } else if (copy !== undefined) {
            res[name] = copy;
          }
        }
      }
    }

    return res;
  };

  z.isPlainObject = function (obj) {
    var key,
        tempObj = {},
        propCheck = tempObj.hasOwnProperty;

    if (_typeof(obj) !== 'object' || obj.nodeType || obj === window) {
      return false;
    }

    if (obj.constructor && !propCheck.call(obj, 'constructor') && !propCheck.call(obj.constructor.prototype || {}, 'isPrototypeOf')) {
      return false;
    }

    for (key in obj) {
      tempObj = false;
    }

    return key === undefined || propCheck.call(obj, key);
  };

  z.data = function (ele, key, val) {
    // string type key alone supported
    return z(ele).data(key, val);
  };

  z.Event = function (event, opts) {
    return new ZEvent(event, opts);
  };

  z.isWindow = function (ele) {
    // used in our position utility
    return ele !== null && ele === ele.window;
  };

  var ZEvent =
  /*#__PURE__*/
  function () {
    _createClass(ZEvent, [{
      key: "falsyVal",
      value: function falsyVal() {
        return false;
      }
    }, {
      key: "trueVal",
      value: function trueVal() {
        return true;
      }
    }, {
      key: "props",
      get: function get() {
        return ['altKey', 'bubbles', 'cancelable', 'ctrlKey', 'pageX', 'pageY', 'clientX', 'clientY', 'currentTarget', 'detail', 'eventPhase', 'metaKey', 'relatedTarget', 'shiftKey', 'target', 'timeStamp', 'view', 'which', 'key', 'keyCode', 'code', 'type', 'srcElement']; // No I18N
      }
    }, {
      key: "convertedTypes",
      get: function get() {
        return {
          mouseover: 'mouseenter',
          // No I18N
          mouseout: 'mouseleave' // No I18N

        };
      }
    }]);

    function ZEvent(ele) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, ZEvent);

      if (ele && (ele.nodeType || ele === window)) {
        // No I18N
        this.zevents = {};
        Object.defineProperty(ele, 'zevents', {
          // No I18N
          configurable: true,
          value: this
        });
        this.element = ele;
      } else if (_typeof(ele) === 'object') {
        // No I18N
        if (!ele) {
          // null case
          ele = {};
        }

        var org = 'originalEvent'; // No I18N
        // if (!ele.detail || ele[org]) {
        //     this[org] = ele[org] ? ele[org] : ele;
        // }
        // if (ele.type && (ele.detail === undefined || ele.detail === null || (!ele.detail.alternateEvent && !options.alternateEvent))) {
        //     this[org] = ele;
        // }

        if (ele.type && (ele.detail === undefined || ele.detail === null || !ele.detail.isTriggered || ele.detail.isTriggered && ele.type !== 'mouseout')) {
          // No I18N
          this.originalEvent = ele;
        }

        for (var i = 0; i < this.props.length; i++) {
          // copying all the objects.
          this[this.props[i]] = ele[this.props[i]];
        }
      } else if (typeof ele === 'string') {
        // No I18N
        this.type = ele;

        for (var _i6 in options) {
          // copying all the objects.
          this[_i6] = options[_i6];
        }
      }

      this.isDefaultPrevented = this.falsyVal;
      this.isPropagationStopped = this.falsyVal;
      this.isImmediatePropagationStopped = this.falsyVal;
      return this;
    }

    _createClass(ZEvent, [{
      key: "_isSpecial",
      value: function _isSpecial(eName) {
        // return [ 'mouseover', 'mouseout' ].indexOf(eName) >= 0; // No I18N ##revisit
        return eName === 'mouseout'; // No I18N
      }
    }, {
      key: "bindEventv1",
      value: function bindEventv1(events, obj) {
        var _this = this;

        var ele = this.element;
        var base = this;

        if (!ele.addEventListener) {
          return;
        }

        events = events.trim().split(' ');

        var _loop = function _loop(i) {
          var eName = void 0;
          eName = events[i];

          if (!_this.zevents[eName]) {
            // multiple handlers will be associated to single event
            _this.zevents[eName] = [];
          }

          var eventHandle = function eventHandle(event) {
            // to execute all handlers in correct order
            // if (base._eventHandlers[node] && base._eventHandlers[node][eName]) {
            //     for (let i = 0; i < base._eventHandlers[node][eName].length; i++) {
            //         base._eventHandlers[node][eName][i](event);
            //     }
            // } else
            // to be removed
            // if (event && event.target && !document.contains(event.target)) { // blur handler will be executed while removing an element from DOM.
            //     return;
            // }
            var relTarget = event.relatedTarget,
                isDelegate = !obj.delegate || obj.delegate && z(event.target).closest(obj.delegate).length; // isRelDel = !obj.delegate || !relTarget || !$(relTarget).closest(obj.delegate).length;

            if (isDelegate && (event.returnValue === undefined || event.returnValue) && (obj.delegate || !base._isSpecial(event.type) || !relTarget || relTarget !== ele && !ele.contains(relTarget))) {
              // special events need related target check since child elements movements will also trigger events. For Ex: mouseout.
              var arr = [new ZEvent(event)];

              if (event.detail && _typeof(event.detail) === 'object' && event.detail.custom && event.detail.custom.length) {
                // No I18N
                // arr = Array.prototype.concat.apply(arr, event.detail.custom && event.detail.custom.length ? event.detail.custom : [ event.detail ]);
                arr = Array.prototype.concat.apply(arr, event.detail.custom);
              }

              if (['mouseenter', 'mouseleave'].indexOf(eName.split('.')[0]) > -1) {
                // No I18N
                arr[0].type = eName.split('.')[0]; // No I18N
              }

              var res = obj.handler.apply(this, arr);
              event.returnValue = res === undefined ? !arr[0].isDefaultPrevented() : res;

              if (obj.execOnce) {
                base.unbindEvent(eName);
              }

              if (res !== undefined && !res) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          };

          _this.zevents[eName].push(eventHandle); // new event is pushed into the array


          var orgName = eName.split('.')[0]; // No I18N

          if (orgName === 'mouseenter') {
            // No I18N
            orgName = 'mouseover'; // No I18N
          } else if (orgName === 'mouseleave') {
            // No I18N
            orgName = 'mouseout'; // No I18N
          }

          ele.addEventListener(orgName, eventHandle, false);
        };

        for (var i = 0; i < events.length; i++) {
          _loop(i);
        }
      }
    }, {
      key: "bindEvent",
      value: function bindEvent(events, obj) {
        var ele = this.element;
        var base = this;

        if (!ele.addEventListener) {
          return;
        }

        events = events.trim().split(' ');
        var eName, orgName;

        for (var i = 0; i < events.length; i++) {
          eName = events[i];
          orgName = eName.split('.')[0];
          obj.eveName = eName;

          if (!this.zevents[eName]) {
            // multiple handlers will be associated to single event
            this.zevents[eName] = []; // Array of objects
            // eslint-disable-next-line no-loop-func

            ele[eName + 'zevents'] = function (event) {
              var type = event.type,
                  target = event.target,
                  relTarget = event.relatedTarget,
                  arr = [new ZEvent(event)]; // let canExecute = (event.returnValue === undefined || event.returnValue);

              var canExecute = event.returnValue === undefined || event.returnValue || !base.isImmediatePropagationStopped(event);

              if (!canExecute) {
                return;
              }

              if (event.detail && _typeof(event.detail) === 'object' && event.detail.custom && event.detail.custom.length) {
                // No I18N
                // arr = Array.prototype.concat.apply(arr, event.detail.custom && event.detail.custom.length ? event.detail.custom : [ event.detail ]);
                arr = Array.prototype.concat.apply(arr, event.detail.custom);
              }
              /* check and remove - start */


              if (['mouseover', 'mouseout'].indexOf(type) > -1) {
                // No I18N
                arr[0].type = base.convertedTypes[type];
              }
              /* check and remove - end */


              var handlers = base.zevents[eName],
                  hLen = handlers.length,
                  hObj,
                  isDelegate,
                  res;

              for (var j = 0; j < hLen; j++) {
                hObj = handlers[j];
                isDelegate = hObj.delegate && z(target).closest(hObj.delegate).length && (!base._isSpecial(type) || !relTarget || !z(relTarget).closest(hObj.delegate).length || relTarget !== ele && !ele.contains(relTarget));

                if (!hObj.delegate || isDelegate) {
                  if (hObj.delegate) {
                    // currentTarget info is modified if event delegation presents
                    arr[0].currentTarget = z(target).closest(hObj.delegate);
                  }

                  res = hObj.handler.apply(this, arr);
                  event.returnValue = res === undefined ? !arr[0].isDefaultPrevented() : res;

                  if (hObj.execOnce) {
                    base.unbindEvent(hObj.eveName);
                  }

                  if (res !== undefined && !res) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }
              }
            };

            if (orgName === 'mouseenter') {
              // No I18N
              orgName = 'mouseover'; // No I18N
            } else if (orgName === 'mouseleave') {
              // No I18N
              orgName = 'mouseout'; // No I18N
            }

            ele.addEventListener(orgName, ele[eName + 'zevents']);
          }

          this.zevents[eName].push(obj); // new event is pushed into the array
        }
      }
    }, {
      key: "unbindEvent",
      value: function unbindEvent() {
        var eName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        // No I18N
        eName = eName.trim();
        var isEmp = eName === '';

        if (eName.indexOf('.') === 0 || isEmp) {
          // No I18N
          var splittedName,
              orgName,
              hasSuff = false;

          for (var i in this.zevents) {
            hasSuff = i.indexOf('.'); // No I18N

            orgName = hasSuff && i.substr(0, hasSuff);
            splittedName = hasSuff && i.slice(i.lastIndexOf('.')); // No I18N

            if (isEmp || splittedName && splittedName === eName && this.zevents[i]) {
              this._unbindEve(i, orgName);
            }
          }
        } else {
          var events = eName.trim().split(' '),
              len = events.length,
              eveName;

          for (var _i7 = 0; _i7 < len; _i7++) {
            eveName = events[_i7];

            if (this.zevents[eveName]) {
              this._unbindEve(eveName, eveName.split('.')[0]);
            }
          }
        }
      }
    }, {
      key: "_unbindEvev1",
      value: function _unbindEvev1(eName, orgName) {
        var ele = this.element,
            handlers = this.zevents[eName],
            len = handlers.length;

        for (var i = 0; i < len; i++) {
          if (orgName === 'mouseenter') {
            // No I18N
            orgName = 'mouseover'; // No I18N
          } else if (orgName === 'mouseleave') {
            // No I18N
            orgName = 'mouseout'; // No I18N
          }

          ele.removeEventListener(orgName, handlers[i], false);
        }

        this.zevents[eName] = undefined;
        delete this.zevents[eName];
      }
    }, {
      key: "_unbindEve",
      value: function _unbindEve(eName, orgName) {
        var ele = this.element;

        if (orgName === 'mouseenter') {
          // No I18N
          orgName = 'mouseover'; // No I18N
        } else if (orgName === 'mouseleave') {
          // No I18N
          orgName = 'mouseout'; // No I18N
        }

        ele.removeEventListener(orgName, ele[eName + 'zevents']); // No I18N

        this.zevents[eName] = undefined;
        delete this.zevents[eName];
      }
    }, {
      key: "trigger",
      value: function trigger(eventName) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var custParam = params,
            isArr = params instanceof Array,
            // No I18N
        dObj = isArr ? {} : params;

        if (isArr) {
          dObj.custom = custParam;
        }

        dObj.fromTrigger = true;
        var eventType = eventName,
            which,
            keyCode,
            code,
            px,
            py,
            key,
            isZEveType = eventName instanceof ZEvent;

        if (isZEveType) {
          // No I18N
          eventType = eventName.type;
          dObj = eventName.detail || {};
          which = eventName.which; // ##revisit

          keyCode = eventName.keyCode;
          key = eventName.key;
          code = eventName.code || eventName.keyCode;
          px = eventName.pageX;
          py = eventName.pageY;

          if (!eventName.target) {
            eventName.target = this.element;
          }
        }

        dObj.isTriggered = true;
        var orgName = eventType.split('.')[0],
            // No I18N
        customEve = new CustomEvent(orgName, {
          // ##revisit - Custom Event is not supported in IE
          detail: dObj,
          bubbles: true,
          cancelable: true,
          fromTrigger: true
        });

        if (orgName === 'keydown' || orgName === 'keypress' || orgName === 'keyup') {
          // No I18N
          customEve.which = which;
          customEve.keyCode = keyCode;
          customEve.code = code;
          customEve.key = key;
        } else if (orgName === 'mousemove' || orgName === 'mouseup' || orgName === 'mousedown') {
          // No I18N
          customEve.pageX = px;
          customEve.pageY = py;
        } // if (isZEveType && eventName.originalEvent) {
        //     customEve.originalEvent = eventName.originalEvent;
        // }


        if (isZEveType && eventName.originalEvent) {
          customEve.originalEvent = eventName.originalEvent;
        } //  event received in parameter cannot be dispatched since it has already been dispatched [ Throws Error if we attempt to dispatch ].
        // for(let i in event){
        //     if(i != "type"){
        //        customEve[i] = event[i];
        //     }
        // }

        /* Delegating single event type to its equivalent type events have to be carried out here. for Ex: See special events in jQuery ##revisit */


        var isFoc = orgName === 'focus',
            // No I18N
        isFocBlur = isFoc || orgName === 'blur',
            // No I18N
        isME = orgName === 'mouseenter'; // No I18N

        if (isFocBlur || isME || orgName === 'mouseleave') {
          // No I18N
          var conType = isFocBlur ? isFoc ? 'focusin' : 'focusout' : isME ? 'mouseover' : 'mouseout'; // No I18N

          if (isZEveType) {
            eventName.type = conType;
          } else {
            eventName = conType;
          }

          var _res2 = z(this.element).trigger(eventName, params); // No I18N


          if (isFocBlur) {
            this.element[orgName]();
          }

          return _res2;
        }

        if (isZEveType && eventName.target) {
          var target = eventName.target;
          (target.nodeType ? target : target[0]).dispatchEvent(customEve);
        } else {
          this.element.dispatchEvent(customEve);
        }

        var res = customEve.returnValue === undefined ? true : customEve.returnValue;

        if (!res) {
          (isZEveType ? eventName : customEve).preventDefault();
          (isZEveType ? eventName : customEve).stopPropagation();
        }

        return res;
      }
    }, {
      key: "preventDefault",
      value: function preventDefault() {
        this._stopPropagation(false, true);
      }
    }, {
      key: "stopPropagation",
      value: function stopPropagation() {
        this._stopPropagation();
      }
    }, {
      key: "stopImmediatePropagation",
      value: function stopImmediatePropagation() {
        this._stopPropagation(true);
      }
    }, {
      key: "_stopPropagation",
      value: function _stopPropagation(fast, prevent) {
        var ev = this.originalEvent,
            prefix = fast ? 'Immediate' : ''; // No I18N

        this[prevent ? 'isDefaultPrevented' : 'is' + prefix + 'PropagationStopped'] = this.trueVal; // No I18N

        if (ev && !this.isSimulated) {
          var methodName = prevent ? 'preventDefault' : 'stop' + prefix + 'Propagation'; // No I18N

          ev[methodName] && ev[methodName]();
        }

        fast && this.stopPropagation();
      }
    }]);

    return ZEvent;
  }();

  var ZData =
  /*#__PURE__*/
  function () {
    function ZData(ele) {
      _classCallCheck(this, ZData);

      if (!ele.hasOwnProperty('database')) {
        Object.defineProperty(ele, 'database', {
          // No I18N
          configurable: true,
          value: this
        });
        this._data = {};
      }
    }

    _createClass(ZData, [{
      key: "set",
      value: function set(key, value) {
        var data = this._data;

        if (_typeof(key) === 'object') {
          // No I18N
          for (var i in key) {
            data[i] = key[i];
          }
        } else {
          data[key] = value;
        }
      }
    }, {
      key: "get",
      value: function get(key, all, ele) {
        // revisit - nodeType check removed ... nodeType check added for document element since getAttribute will not be present for document.
        var data = this._data,
            specValue = data[key],
            dataAttrValue = specValue === undefined && !all && ele[0] !== document ? ele.attr('data-' + key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()) : specValue; // No I18N

        return all ? data : dataAttrValue;
      }
    }, {
      key: "remove",
      value: function remove(key) {
        if (key && key.indexOf(' ') === -1) {
          // No I18N
          delete this._data[key];
        } else {
          var splits = key ? key.split(' ') : Object.keys(this._data),
              // No I18N
          len = splits.length;

          for (var i = 0; i < len; i++) {
            delete this._data[splits[i]];
          }
        }
      }
    }]);

    return ZData;
  }();

  var ZAnimation =
  /*#__PURE__*/
  function () {
    _createClass(ZAnimation, [{
      key: "pnum",
      get: function get() {
        return /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
      }
    }, {
      key: "rcssNum",
      get: function get() {
        return new RegExp('^(?:([+-])=|)(' + this.pnum + ')([a-z%]*)$', 'i');
      }
    }]);

    function ZAnimation(ele, prop, propValue, duration) {
      var _this2 = this;

      _classCallCheck(this, ZAnimation);

      Object.defineProperty(ele, 'zanimation', {
        // No I18N
        configurable: true,
        value: this
      });
      this.element = ele;
      this.prop = prop;
      var parts = this.rcssNum.exec(propValue),
          isPropScroll = prop.indexOf('scroll') >= 0; // No I18N

      this.unit = !isPropScroll && (parts && parts[3] ? parts[3] : 'px'); // No I18N

      this.startVal = parseFloat(isPropScroll ? ele[prop] : window.getComputedStyle(ele)[prop]);
      this.endVal = parseFloat(parts ? parts[2] : propValue);
      this.now = ele.style[prop] || this.startVal;
      this.isReverse = this.startVal > this.endVal;
      this.startTime = Date.now();
      this.endTime = duration;
      var interval = parseInt(duration / (this.endVal - this.startVal));
      window.clearInterval(this._timer);
      this._timer = window.setInterval(function () {
        _this2.tick();
      }, interval);
    }

    _createClass(ZAnimation, [{
      key: "finish",
      value: function finish() {
        this.tick(1); // complete the animation
      }
    }, {
      key: "stop",
      value: function stop() {
        window.clearInterval(this._timer);
      }
    }, {
      key: "tick",
      value: function tick(percent) {
        var curTime = Date.now(),
            remaining = Math.max(0, this.startTime + this.endTime - curTime),
            temp = remaining / this.endTime || 0;
        percent = percent || 1 - temp;
        var swingEff = 0.5 - Math.cos(percent * Math.PI) / 2; // swing easing is performed

        this.now = (this.endVal - this.startVal) * swingEff + this.startVal;
        this.now = parseFloat(this.now.toFixed(3));
        var prop = this.prop,
            finalVal = this.now + this.unit,
            endVal = this.endVal.toFixed(3);

        if (this.now < endVal || this.isReverse && this.now > endVal) {
          // isReverse - backward
          this._setVal(prop, finalVal);
        } else {
          this._setVal(prop, finalVal);

          window.clearInterval(this._timer);
        }
      }
    }, {
      key: "_setVal",
      value: function _setVal(prop, val) {
        if (prop.indexOf('scroll') >= 0) {
          // No I18N
          this.element[prop] = val;
        } else {
          this.element.style[prop] = val;
        }
      }
    }]);

    return ZAnimation;
  }();

  window.$zc = z;
  window.$ZCDOMUtil = DOMUtil;
})();