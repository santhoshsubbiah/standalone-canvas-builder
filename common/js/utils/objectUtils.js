// $Id$
/**
 * @namespace
 */
var objectUtils = {};


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

objectUtils.getKeys = function(jsonObj) {
	var keys = [];
	if ( !jsonObj ) {
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

objectUtils.findKey = function(object,value){
	var key = Object.keys(object).filter(function(key) {return object[key] === value})[0];
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

objectUtils.parseURLParamString = function(URLParamString){
	var params = {}, queries, temp, i, l;
	queries = URLParamString.split('&');
	for( i = 0, l = queries.length; i < l; i++ ) {
		temp = queries[i].split('=');
		params[decodeURIComponent(temp[0])] =  decodeURIComponent(temp[1]);
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

objectUtils.URL =  function(url){//No I18N
	var paramObj = {},params = [];
	var paramsArr = (params = url.split("?")[1]) ? params.split("&") : [];
	return {
		getParams:function(){
			for(var param in paramsArr){
		 		if(paramsArr.hasOwnProperty(param)){
				    var sParam = paramsArr[param].split('=');
				    paramObj[sParam[0]] = decodeURIComponent((sParam[1] || "").replace(/\+/g,' '));
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

objectUtils.cloneObject = function(Obj){//No I18N
	/* Will do a deep copy of the given format Object.*/
	var newObj = {};
	for (var key in Obj) {
		var val = Obj[key];
		if (jQuery.isPlainObject(val)) {
			//if the value is one obj we have to clone that obj also.
			val = this.cloneObject(val);
		} else if(jQuery.isArray(val)) {
			var tempClone = [];
			var len = val.length;
			for (var j = 0;j < len;j++) {
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

objectUtils.cloneObject_new = function(value) { // NO I18N
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

objectUtils.removeKeyFromGivenObj = function( givenObj, key ) {
	if( givenObj.hasOwnProperty( key) ){
		delete givenObj[ key ];
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

objectUtils.addKeyToGivenObj = function( givenObj, key, value ) {
	if( !givenObj.hasOwnProperty( key) ){
		givenObj[ key ] = value;
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

objectUtils.getLength = function(obj) {
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

objectUtils.convertArrayToMap = function(array) {
	var json = {};
	array.forEach(function(eachObj){ json[eachObj] = true; });
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

objectUtils.convertKeys = function(json, keyMap) {
	for(var key in keyMap) {
		var alterKey = keyMap[key];
		var value = json[key];
		if(key != alterKey && typeof value != "undefined") {
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

objectUtils.getValueFromObj = function(json,keys) {
	if(json) {
		if ( Array.isArray(keys) ) {
			var len = keys.length;
			for(var i = 0; i < len; i++) {
				if(json) {
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

 objectUtils.jsonToQueryParam = function(obj) {
	if(typeof obj === "object"){
		return Object.keys(obj).map(function(key){
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

objectUtils.getMatchedObject = function(jsonArray, key, value) {
	var matchedJSON;
	jsonArray.every(function(json) {
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

objectUtils.getMatchedKey = function(json, value) {
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

objectUtils.deepClone = function(value, refFrom, refTo, deep) {
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
			value.forEach(function(eachValue) {
				copiedValue.push(deep ? objectUtils.deepClone(eachValue, refFrom, refTo, true) : eachValue);
			})
		} else  {
			for (var key in value) {
				copiedValue[key] = deep ? objectUtils.deepClone(value[key], refFrom, refTo, true) : value[key];
			}
		}

		return copiedValue;
	}
	if (valueType === "Object") {
		return copy({});
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

objectUtils.cloneRegExp = function(pattern) {
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

objectUtils.typeOf = function(val) {
	return val == null ? 'Null' : val == undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1); // NO I18N
}
