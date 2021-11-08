// $Id$
var I18n = { };
I18n.logger = [];
I18n.getProperties = function () {
	try {
		if (this.properties) {
			return this.properties;
		} else if (window.opener && window.opener.I18n.properties) {
			return window.opener.I18n.properties;
		} else if (parent.I18n.properties) {
			return parent.I18n.properties;
		}
	} catch (e) { this.logger.push(e.toString()); }
	return { };
};
I18n.getMsg = function (key, params) {
	//console.log("I18n.getMsg ::: called for key :: "+key+" ::: "+params+" :::: "+module);
	var i18nedKeyArray = [];
	if (key && typeof key === "object") {
		var keyLen = key.length;
		for (var i = 0; i < keyLen; i++) {
			i18nedKeyArray[i] = I18n.getMsg(key[i], params);
		}
		return i18nedKeyArray;
	}
	var i18nedKey = key;
	var regexforcmodule = new RegExp('CustomModule\\d+');
	if (regexforcmodule.test(key)) {
		key = key.replace(regexforcmodule, 'CustomModule');
	}
	params = (params !== undefined && typeof params !== "object") ? [params] : params;
	if (!this.properties) {
		this.properties = this.getProperties();
	}
	if (this.properties[key])
		i18nedKey = this.properties[key];
	if (i18nedKey && params) {
		i18nedKey = i18nedKey.replace(/{(\d+)}/g, function (template, idx) {
			return params[idx];
		});
	}
	return i18nedKey;
};
I18n.getMultipleMsg = function (keysJSONArray) {
	var keysArrayLen = keysJSONArray.length;
	var translatedKeys = { };
	for (var idx = 0; idx < keysArrayLen; idx++) {
		var keyObj = keysJSONArray[idx];
		var key = keyObj.key;
		translatedKeys[key] = I18n.getMsg(key, I18n.getMsg(keyObj.params));
	}
	return translatedKeys;
};
I18n.getValueForFields = function (key, params) {
	params = (typeof params == "string") ? [params] : params;
	var pModule = I18n.getModuleFromFieldLabel(params);
	if (I18n) {
		params = I18n.getMsg(params, I18n.getMsg(pModule));
		var msgValue = I18n.getMsg(key, params);
		return msgValue;
	} else {
		renderingUtils.showCustomAlert("Error : I18N Not Found "); //NO I18N
	}
};

I18n.getModuleFromFieldLabel = function (fieldLabel) {

	if (fieldLabel) {
		fieldLabel = fieldLabel[0];
	}

	var CUSTOMOBJ_TAB_GENERATEDTYPE_VAL = 4;

	var keyMap = { "COMMENTCONTENTS": "Comments", "CONTACTNAME": "Contact", "ENTITYNAME": "Related To" };//No I18N

	if (keyMap[fieldLabel]) {
		fieldLabel = keyMap[fieldLabel];
	}

	var values = ('' + fieldLabel).split(" ");

	var singularModule = null;

	var valLength = values.length;
	if (valLength >= 2) {
		var MODULE_INFO = moduleRecordMapping;
		var tempMod = values[0] + values[1];
		var tempLabelMod = values[0];
		if (tempMod == "PurchaseOrder" || tempMod == "SalesOrder" || tempMod == "PriceBook") {
			tempMod = tempMod + "s";//No I18N
			singularModule = MODULE_INFO[tempMod].singular_label;
		}
		else {
			if (fieldLabel.indexOf("Parent Account") == 0) {
				singularModule = MODULE_INFO.Accounts.singular_label;
			}
			else if (tempLabelMod == "Activity") {
				singularModule = MODULE_INFO.Activities.singular_label;
			}
			else if (MODULE_INFO[tempLabelMod] && MODULE_INFO[tempLabelMod].generated_type == "custom") {
				singularModule = MODULE_INFO[tempLabelMod].singular_label;
			}
			else if (tempLabelMod == 'CustomModule' || tempLabelMod == 'LinkingModule') {
				var moduleNameElem = getObj('searchModule');
				if (!moduleNameElem) {
					moduleNameElem = getObj('module');
				}
				singularModule = MODULE_INFO[moduleNameElem.value].singular_label;
			}
			else {
				tempMod = tempLabelMod + "s";//No I18N
				singularModule = (MODULE_INFO[tempMod]) ? MODULE_INFO[tempMod].singular_label : null;
			}
		}
	}
	return singularModule;
};

I18n.init = function (prop) {
	this.properties = prop;
};
I18n.setMsg = function (key, val) {
	if (key && val) {
		this.properties[key] = val;
	}
};
I18n.setProperties = function (keyvaljson) {
	if (I18n.properties != null) {
		I18n.properties = $.extend(I18n.properties, keyvaljson);
	}
	else {
		I18n.properties = keyvaljson;
	};
}