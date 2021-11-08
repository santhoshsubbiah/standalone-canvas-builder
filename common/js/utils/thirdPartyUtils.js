// $Id$

/**
 * @namespace
*/
var thirdPartyUtils = {};
	
	/**
	 * This method is used to destroy Select2 on child Select2 of given element.
	 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child select2 is to be destroyed.
	 */

thirdPartyUtils.unbindChildSelect2 = function(parentObj){
	var selectObjs = parentObj.find(".select2-hidden-accessible");
	if( selectObjs.length ){
		try{
			selectObjs.select2('destroy');//NO I18N
		}
		catch(e){
			murphy.error(e)
		}
	}
}

	/**
	 * This method is used to destroy PerfectScroll on child PerfectScroll of given element.
	 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child PerfectScroll is to be destroyed.
	 */

thirdPartyUtils.unbindChildPerfectScroll = function(parentObj){
	var psScrolls = parentObj.find(".ps-container");
	if( psScrolls.length ){
		try{
			psScrolls.perfectScrollbar('destroy');//NO I18N
		}
		catch(e){
			murphy.error(e)
		}
	}
}

	/**
	 * This method is used to destroy Highcharts on child Highcharts of given element.
	 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child Highcharts is to be destroyed.
	 */

thirdPartyUtils.unbindHighcharts = function(parentObj) {
	var highChartsInnerDivs = parentObj.find('.highcharts-container');
	var len = highChartsInnerDivs.length;
	for ( var i = 0; i < len; i++ ) {
		try{
			var chartDiv = highChartsInnerDivs.eq(i).parent().highcharts();
			chartDiv && chartDiv.destroy();
		}
		catch(e){
			murphy.error(e)
		}
	}
}

	/**
	 * This method is used to destroy Zohocharts on child Highcharts of given element.
	 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child Zohocharts is to be destroyed.
	 */
thirdPartyUtils.unbindZohoCharts = function(parentObj) {
	var d3InnerDivs = parentObj.find('.d3container');
	var len = d3InnerDivs.length;
	for ( var i = 0; i < len; i++ ) {
		try{
			var chartDiv = d3InnerDivs[i].__data__;
			chartDiv && chartDiv.destroy();
		}
		catch(e){
			murphy.error(e)
		}
	}
}

	/**
	 * This method is used to destroy Gridstack on child Gridstack of given element.
	 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child Gridstack is to be destroyed.
	 */

thirdPartyUtils.unbindGridstack = function(parentObj){
	var grid = parentObj.find(".grid-stack").data("gridstack");//No I18N
	if(grid){
		try{
			grid.destroy();
		}
		catch(e){
			murphy.error(e)
		}
	}
}

	/**
	 * This method is used to unbind all Fileuploader instances and its parent Dropzone instances in detailPage and it is also used to unbind all Dropzone instances sif any instances are available in Feedspage
	 */

thirdPartyUtils.removeDropzoneInstances = function(){
	var _len = FileUploader.instances.length;
	if(FileUploader && _len) {
		while(_len){
			try{
				var _instance = FileUploader.instances[_len - 1];
				_instance.instance.clean();
				_len--;
			}
			catch(e){
				murphy.error(e)
			}
		}
	
	}
	// unbind all Dropzone instances  if any instances are available in Feedspage
	var _len = Dropzone.instances.length;
	if(Dropzone && _len) {
		for( var _i = 0; _i < _len; _i++ ) {
			try{
				var _instance = Dropzone.instances[_i];
				_instance.destroy();
			}
			catch(e){
				murphy.error(e)
			}
		}
	}
};

	/**
	 * This method is used to destroy AutoComplete on child AutoComplete of given element.
	 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child AutoComplete is to be destroyed.
	 */

thirdPartyUtils.unbindAutoComplete = function(parentObj){
	var autoCompleteDivs = parentObj.find(".ui-autocomplete-input");
	var len = autoCompleteDivs.length;
	
	for(var i = 0; i < len; i++)
	{
		try{
			autoCompleteDivs.eq(i).autocomplete('destroy');//NO I18N
		}
		catch(e){
			murphy.error(e)
		}
	}
};


	/**
	 * This method is used to destroy Fullcalendar on child Fullcalendar of given element.
	 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child Fullcalendar is to be destroyed.
	 */

thirdPartyUtils.unbindFullcalendar = function(parentObj){
	var calendarDiv = parentObj.find("#calendarBd");//eslint-disable-line webperf/directly-select-with-id
	if(calendarDiv.length){
		try{
			calendarDiv.fullCalendar('destroy');//NO I18N
		}
		catch(e){
			murphy.error(e)
		}
	}
}

	/**
	 * This method is used to check whether all the third party plugin events are removed or not  
	 * @param {jQueryElement} parentObj - This provides the JQueryELement(parent Object) whose child third party plugin is to be destroyed.
	 */

thirdPartyUtils.unbindChildEvents = function(parentObj) {
	if( !(parentObj instanceof $) ) { parentObj = $(parentObj) };
	if( parentObj.length === 0 ) { return; }
	try{
		thirdPartyUtils.unbindAutoComplete(parentObj);
		thirdPartyUtils.unbindChildPerfectScroll(parentObj); 
		thirdPartyUtils.unbindChildSelect2(parentObj); 
		thirdPartyUtils.unbindHighcharts(parentObj); 
		thirdPartyUtils.unbindZohoCharts(parentObj);
		thirdPartyUtils.unbindGridstack(parentObj);
		thirdPartyUtils.unbindFullcalendar(parentObj);
		//eslint-disable-next-line webperf/no-attribute-selectors
		if( parentObj.find( "[batchid]" ).length || parentObj.find('.dropzone').length){//NO I18N 
			thirdPartyUtils.removeDropzoneInstances();
		}
	}catch(e) {
		return;
	}
}
	
	/**
	 * This method is used to destroy perfect scroll plugin on the given element.
	 * @param {jQueryElement} JElem - This provides the jQueryElement from which perfect scroll plugin has to be destroyed. 
	 */

thirdPartyUtils.unbindPerfectScroll = function(JElem){
	if(  !JElem || !$(JElem).length ){ return; }
	JElem = $(JElem);
	JElem.perfectScrollbar('destroy');//No I18N
};

	/**
	 * This method is used to update the perfectscroll plugin when the size of the content changes.
	 * @param {jQueryElement} JElem - This provides the jQueryElement on which the perfectScroll is to be updated.
	 */

thirdPartyUtils.bindPerfectScrollUpdate = function(JElem){
	if(  !JElem || !$(JElem).length ){ return; }
	JElem = $(JElem);
	JElem.perfectScrollbar('update');//No I18N
};

	/**
	 * This method is used to initiate the perfect scroll plugin
	 * @property {jQueryElement} JElem - This provides the jQueryElement for which the perfect scroll plugin is initiated.
	 * @property {Object} options - Refer {@link https://mdbootstrap.com/freebies/perfect-scrollbar/?utm_source=GitHub&utm_medium=PerfectScrollbar#options|here}
	 * @property {JQueryELement} options.start - it is the child of the container element at which the scroll should be begin. 
	 */

thirdPartyUtils.bindPerfectScroll = function(JElem, options){
	if(  !JElem || !$(JElem).length ){ return; }
	JElem = $(JElem);
	options = options || {};
	if(options.start){
		var startposition = $(options.start).position().top;
		delete options.start;
	}
	JElem.perfectScrollbar(options);
	if(startposition){
		JElem.scrollTop(startposition);
		JElem.perfectScrollbar("update");//No I18N
	}
};
	
	/**
	 * This method is used to initiate the Lyte scroll plugin
	 * @param {jQueryElement} JElem - This provides the jQueryElement in which the Lyte Scroll is defined
	 * @param {Object} options - Refer {@link https://lyte.csez.zohocorpin.com/2.1.0/dom/scroll|Lyte Doc}
	 */

thirdPartyUtils.bindLyteScroll = function(JElem, options){
	if(  !JElem || !$L(JElem).length ){ return; }
	JElem = $L(JElem);
	options = options || {};
	JElem.scroll(options);
	
}


thirdPartyUtils.selectTempResult = function(data){
	 var selectEmptyText = data.text;
	 var ele = data.element;
	 if(ele !== undefined){
			var pickMap = $(ele.parentElement).attr("data-picklistmap");
			if (pickMap !== undefined) {
				var validJson = Crm.isValidJSON(pickMap)
				if (validJson) {
					var index = $(ele).index();
					var pickObj = JSON.parse(pickMap)[index];
					if (pickObj && pickObj.hasOwnProperty('colorCode')){
						var colorCode = pickObj.colorCode;
						if (colorCode){
							selectEmptyText = "<span class='disable" + data.disabled + "'><span class='dIB activitesColor' data-zcqa='option_"+selectEmptyText+"' style='background:" + colorCode + "'></span>" + $ESAPI.encoder().encodeForHTML(data.text) + "</span>";//No I18N
							$('.select2-container').addClass('dropdown_eventcolor');
							return selectEmptyText;
						}
					}
				}
			}
		}
	 return "<span class='disable" + data.disabled + "'>" + $ESAPI.encoder().encodeForHTML(selectEmptyText) + "</span>";
}


thirdPartyUtils.selectEmptyVal = function(data, container){
	 var selectEmptyText = data.text;
	 var selectEmptyId = data.id;
	 if(selectEmptyId === '' || selectEmptyId === '-None-' &&  !container ){
		 if(container != undefined ){
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
 
thirdPartyUtils.bindSelect2 = function(JElem , options){
	
	setTimeout(function(){
		if(  !JElem || !$(JElem).length ){ return; }	
		JElem = $(JElem);
		options = options || {};
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
		var input_too_short_func = options.input_too_short_func || function(args){
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
		JElem.each(function(i){
			bindCondition[i] = isApprovePage === 0 ? $(this).css('display') !== "none" : $(this).is(':visible');//No I18N
		});
		// i=0;
		JElem.each(function(i){
			//if( $(this).css('display') !== "none"){//No I18N
			//if( $(this).is(':visible')){//No I18N
			/*if($(this).hasClass('select2-hidden-accessible')){//No I18N
				return;
			}*/
			
//			var bindCondition = isApprovePage===0 ? $(this).css('display') !== "none" : $(this).is(':visible');//No I18N
			if( bindCondition[i]){
			
				var obj = {
					"minimumResultsForSearch": disable_search_threshold,//No I18N 
					"dir":direction,//No I18N
					"dropdownParent":dropdownParent,//No I18N
					"maximumSelectionLength":maximumSelectionLength,//No I18N
					"language": {//No I18N
					   "noResults": function(){//No I18N
						   return no_results_text;
					   },
					   "maximumSelected" : function(){//No I18N
						   return maximum_result_text; 
					   }
					},
					"width": widthAuto //No i18n
				}
				var isMultipleAttr = $(this).attr('multiple');
				if( isMultipleAttr ){
					obj.placeholder = placeholder//No I18N
					
				}
				var $thisSelect = $(this);
				var elemId = $(this).attr("id");//No i18n
				if(elemId != undefined  && elemId.indexOf("ATTACHMENTID") !== -1){
					$(this).on("focus",function(){
						$(this).parent().trigger('mouseover');
						// var id = $(this).next().attr("id");
//						$( '#'+id+ '> li').on("keypress",function(ev){
//							alert(ev.keyCode);
//						});
					});
				    $(this).on("blur",function(){
				    	$(this).parent().trigger('mouseleave');
				    });
				  return;
				}
				if(options.ajax)
				{
					obj.ajax = options.ajax;
					obj.minimumInputLength = minimumInputLength;
					if(closeOnSelect != undefined)
					{
						obj.closeOnSelect = closeOnSelect;
					}
					obj.language.searching = function(){ return searching_text; };
					obj.language.errorLoading = function(){ return error_loading_text; };
					obj.language.inputTooShort = input_too_short_func;
				}			
				if(options.templateResult)
				{
					obj.templateResult = options.templateResult;
				}
				else if(elemId && elemId === "userDateFormat") //No i18n
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
				else
				{
					obj.templateResult = thirdPartyUtils.selectTempResult;
				}
				obj.templateSelection = $thisSelect.hasClass('ccPhoneNumber') ? CrmPhoneNumberInput.countryCodeSelect : thirdPartyUtils.selectEmptyVal;	//NO I18n
				obj.matcher = renderingUtils.matchStart;
				
				obj.escapeMarkup =  function(m) { return m; }
				var parentId = $(this).parent().parent().parent().parent().attr('id'); //No I18N
				if(parentId === "searchcriteria0"){ //No I18N
					return;
				}
				$(this).select2(obj);
				
				/*$(this).next(".select2").on("click",function(){//No I18N
					setTimeout(function(){
					$('#listViewTable').perfectScrollbar({wheelSpeed: 30,wheelPropagation: true});
						$(".select2-results").addClass("oH pR").perfectScrollbar({wheelSpeed: 30,wheelPropagation: true,suppressScrollX: false});
					},3000);
				});*/
				if( isMultipleAttr ){
					var searchfieldElem = $(this).next(".select2").find(".select2-search__field");
					searchfieldElem.on("focus",function(){//No I18N
						var selTwo = $(this).closest(".select2");
						var closestTd = selTwo.closest("td"); //No i18N
						var selTwo_labelValCreate = selTwo.closest(".labelValCreate");//No I18N
						if(selTwo_labelValCreate.length){
							selTwo_labelValCreate.addClass("focusEleField");//No I18N
						}
						else if(selTwo.closest(".labelValTwo").length){
							selTwo.closest(".tabDiv").addClass("focusEleField");//No I18N
						}else if(closestTd.length) {//No I18N
							$('.wf_setFocus').removeClass('wf_setFocus');
							closestTd.addClass("wf_setFocus");//No I18N
						}
					});
					searchfieldElem.on("blur",function(){//No I18N
						var selTwo = $(this).closest(".select2");
						var closestTd = selTwo.closest("td"); //No i18N
						var selTwo_labelValCreate = selTwo.closest(".labelValCreate");//No I18N
						if(selTwo_labelValCreate.length){
							selTwo_labelValCreate.removeClass("focusEleField");//No I18N
						}
						else if(selTwo.closest(".labelValTwo").length){
							selTwo.closest(".tabDiv").removeClass("focusEleField");//No I18N
						}else if(closestTd.length) {//No I18N
							var elementFocus = $('.select2-container--open').eq(0);
							var focusEle = elementFocus;
							if(focusEle.length === 0){
								closestTd.removeClass("wf_setFocus");//No I18N
							}
						}
					});
				}
				else{
					var selectionElem = $(this).next(".select2").find(".select2-selection");
					selectionElem.on("focus",function(){//No I18N	
						var el = $(this);
						//$(this).keypress(Utils.select2keydownHandler);
						var selTwo = el.closest(".select2"); //No i18N
						var closestTd = selTwo.closest("td"); //No i18N
						el.on("keydown",function(event){
							if(event.keyCode == 40){
								$(this).trigger("click");
								event.preventDefault();
							}
						});
						
						//$(this).on("keydown", openDD);
						var selTwo_labelValCreate = selTwo.closest(".labelValCreate"); //No I18N
						if(selTwo_labelValCreate.length){
							$('.labelValCreate').removeClass('focusEleField');
							selTwo_labelValCreate.addClass("focusEleField");//No I18N
						}
						else if(selTwo.closest(".labelValTwo").length){
							selTwo.closest(".tabDiv").addClass("focusEleField");//No I18N
						}else if(closestTd.length) {//No I18N
							$('.wf_setFocus').removeClass('wf_setFocus');
							closestTd.addClass("wf_setFocus");//No I18N
						}
						if(selTwo.closest("crm-phone-field").length > 0){
							selTwo.closest("tr.topband_dv_row").addClass('txtFldFocusedRow');	//NO I18n
							selTwo.closest("crm-create-subformfields").length > 0 && selTwo.closest(".crm_phone_field").addClass('LyteSForm_focus') && selTwo.closest("lyte-tr").addClass('selectedSubformRow');	//NO I18n
						}
					});
					selectionElem.on("blur",function(){//No I18N
						var el = $(this);
						var selTwo = el.closest(".select2");//No i18N
						var closestTd = selTwo.closest("td"); //No i18N
						el.off("keydown", function(event){//No i18N
							if(event.keyCode == 40){
								$(this).trigger("click");
								event.preventDefault();
								}
						});
						var selTwo_labelValCreate = selTwo.closest(".labelValCreate"); //No I18N
						if(selTwo_labelValCreate.length){
							var dropdownOpenVisible = $('.select2-container--open').length;
							if(dropdownOpenVisible <= 0){
								selTwo_labelValCreate.removeClass("focusEleField");//No I18N
							}
						}
						else if(selTwo.closest(".labelValTwo").length){
							selTwo.closest(".tabDiv").removeClass("focusEleField");//No I18N
						}else if(closestTd.length) {//No I18N
							var elementFocus = $('.select2-container--open').eq(0);
							var focusEle = elementFocus;
							if(focusEle.length === 0){
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
				$(this).next('span.select2.select2-container.select2-container--default').attr("data-zcqa",$(this).attr('data-zcqa'));//No I18N
				$(this).off('select2:opening');
				$(this).on('select2:opening', function (e) {
					var selectObj = $(this);
					if($('#analyticalPageContainer').length === 1 || $('#createDashboardPanel').length === 1) {
						AnalyticsChart.freezePopScroll(selectObj);
					}
					if($('#commonActionPage').hasClass('showPpTop')){
					  $('#commonActionPage .pp-content').css('overflow','hidden');
					}
					if(selectObj.hasClass('ccPhoneNumber')){
						var node = $L('crm-create-fields')[0]; //no i18n
						if (node) {
							node.component.processLayoutRules(node);
						}
						if(!selectObj.is(':visible')){/* eslint-disable-line webperf/layout-thrashing */
						 return false;
						}
						// temp fix - added inorder to scroll to the selected value
						selectObj.data('select2').dataAdapter.query('',function(data){ //No I18N
							selectObj.data('select2').trigger('results:all', //No I18N
								{
									data:data,
									query:''
								}
							)}
						)
					}
					if(!selectObj.hasClass('dataPopulated') && selectObj.hasClass('ccPhoneNumber')) {
						sE(e);
						CrmPhoneNumberInput.populatePhoneNumberCountryCodes(selectObj);	
						return false;
					}
					if(!selectObj.hasClass('dataPopulated') && (selectObj.data('values') || selectObj.data('mapval'))) {
						sE(e);
						populatePicklist(selectObj);	
						return false;
					}
					//eslint-disable-next-line webperf/layout-thrashing 
					else if($(".select2-selection__rendered").height() < 300){//No I18N
						  var layoutConvLanding = $('#layout_landing_right');
					  	  var getScrollBarWidthValue = renderingUtils.windowHeight >= $(document).height() ? 0 : renderingUtils.getScrollBarWidthValue;//eslint-disable-line webperf/layout-thrashing
						  $('html,#setup_new_ContentDiv').css({"overflow":"hidden","margin-right":getScrollBarWidthValue});//No I18N
						  var quickPopup = $('#searchCreateDiv').find('.popup-model-content');
						  if(quickPopup.is(':visible')){//eslint-disable-line webperf/layout-thrashing
							  setTimeout(function(){
								  quickPopup.addClass('oHimp');
							  },200);
						  }
						  var mmCriteriaContainer = $('.mmCriteriaContainer');
						  if(mmCriteriaContainer.is(":visible")){//eslint-disable-line webperf/layout-thrashing
							  mmCriteriaContainer.css({"overflow":"hidden"});//No I18N
						  }  
						  if(layoutConvLanding.is(":visible")){//eslint-disable-line webperf/layout-thrashing
						  	layoutConvLanding.addClass('oH');//No I18N	                                                  }
						 }
					 }
				  
					// var selObj = $(this);
					setTimeout(function(){
					  // if( $('.select2-results__option').length < 10 ){//No I18N
					  // 		$('.select2-container--open').find('.select2-search--dropdown').css({"height":"0px","overflow":"hidden"});//No I18N
				  	//   }
					  var openedSelect2Container = $('body > .select2-container--open');
					  openedSelect2Container.on('click',function(){sE(event)});//No I18N
					  var select2resultsWidth = $('body > .select2-container--open .select2-results').width(); //No I18N
					  if( openedSelect2Container.length && (openedSelect2Container.offset().left + select2resultsWidth) > renderingUtils.windowWidth ){
						  openedSelect2Container.css({"left":"auto","right":select2resultsWidth + 30});//No I18N
						  // setTimeout(function(){
							 //  openedSelect2Container.css({"left":"auto"});//No I18N
						  //  },10);
					  }
					  if( $('.select2-results__option').length < 10 ){//No I18N
					  		$('.select2-container--open').find('.select2-search--dropdown').css({"height":"0px","overflow":"hidden"});//No I18N
				  	  }
					  
				  },10);
				  //Customization starts
				  if( options.onOpenCallback ){
					  Lyte.registeredMixins["crm-utilities"].executeFunctionByName(options.onOpenCallback, window , selectObj);//No I18N
//					  options.onOpenCallback($(this));
				  }
				  setTimeout(function (){
					  var elementFocus = $('.select2-container--open').eq(0);
					  var focusEle = elementFocus;
					  focusEle.closest('td').addClass('wf_setFocus');//No i18N
				      focusEle.closest("crm-phone-field").length > 0 && focusEle.closest("crm-create-subformfields").length > 0 && focusEle.closest(".crm_phone_field").addClass('LyteSForm_focus') && focusEle.closest("lyte-tr").addClass('selectedSubformRow'); 	//NO I18n
					}, 50);
				  //Customization ends
				});
				if(options.afterOpenCallback)
				{
					$(this).off('select2:open').on('select2:open', function () {
						Lyte.registeredMixins["crm-utilities"].executeFunctionByName(options.afterOpenCallback, window , $(this));//No I18N
						//Set focus for select2
					  var elementFocus = $('.select2-container--open').eq(0);
					  var focusEle = elementFocus;
					  focusEle.closest('.labelValCreate').addClass('focusEleField');//No i18N
					  focusEle.closest('td').addClass('wf_setFocus');//No i18N
					});
				}
				if(closeOnSelect !== false && isMultipleAttr ){
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
				  $('html,#setup_new_ContentDiv').css({"overflow":"","margin-right":""});//No I18N
				  var quickPopup = $('#searchCreateDiv').find('.popup-model-content');
				  if(quickPopup.is(':visible')){//eslint-disable-line webperf/layout-thrashing
					  quickPopup.removeClass('oHimp'); 
				  }
				  $('.select2-container--open').find('.select2-search--dropdown').css({"height":"","overflow":""});//No I18N
				  // var divs=['#dvinner','.formcontainer','#setup_new_ContentDiv']; // No I18n
				  var mmCriteriaContainer = $('.mmCriteriaContainer');
				  if(mmCriteriaContainer.is(":visible")){//eslint-disable-line webperf/layout-thrashing
					  
					  mmCriteriaContainer.css({"overflow":"auto"});//No I18N
				  }
				   if(layoutConvLanding.is(":visible")){//eslint-disable-line webperf/layout-thrashing
	                   layoutConvLanding.removeClass('oH');//No I18N 
	                }
				  //renderingUtils.checkOverflowInnerContainer(divs,0,0); // params divs for element list , 0 - > first index , 0/1 -> close/Open Flag
				  //Customization starts
				  if( options.onCloseCallback ){
					  //console.log("onclose" , e);
					  options.onCloseCallback($(this));
				  }
				  //Customization ends  
				});
				$(this).on('select2:closing', function (){
					if($('#analyticalPageContainer').length === 1 || $('#createDashboardPanel').length === 1) {
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
					if(popElement1.hasClass('showPpTop'))
					{		
						if(selectOpenLength > 2)
						{		
							popContent1.css('overflow','hidden'); //No I18N		
						}
						else
						{
							popContent1.css('overflow','auto'); //No I18N		
						}
					}
				});
				if(JElemClosest_wf_chosen_ui && JElemClosest_wf_chosen_ui_sltSetVal.length > 0){
					JElemClosest_wf_chosen_ui_sltSetVal.on('click',function(){//No I18N
						$(this).next("select").select2("open");//No I18N
					})
				}
			}
			// i++;
		});	

		var select2rendered = $(".select2-selection__rendered");
		select2rendered.attr("title","");//No I18N

		var selectedOption = JElem.find('option:selected');
		if(selectedOption.length > 0){
			select2rendered.attr("title", selectedOption.text());//No I18N
		}

			var reportingSelect = $('#reportingSelect');
			var addUserReporting = $('#addUserReporting');
			if(reportingSelect.length > 0 || addUserReporting.length > 0 || $('#roleChangePopUp').length > 0 || $('#branchChangePopup').length > 0)
			{
				$('#userDD,#userReportingDD,#subUserDD').add(reportingSelect).add(addUserReporting).select2({ 
					templateResult: formatState, 
					templateSelection: formatState 
					});
			}
		JElem = null;
	},1);
}
	/**
	 * This method is used to destroy Select2 plugin on the given element.
	 * @param {jQueryElement} JElem - This provides the jQueryElement from which Select2 plugin has to be destroyed. 
	 */
thirdPartyUtils.unbindSelect2 = function(JElem){
	if(  !JElem || !$(JElem).length ){ return; }
	JElem = $(JElem);
	JElem.select2('destroy'); //No I18N
	JElem.closest(".wf_chosen_ui").find(".sltSetVal").off('click');//NO i18N
}

	/**
	 * This method is used to enable tooltip only when content is displayed with ellipsis.
	 * @param {HTMLElement} obj - This provides the HTMLElement on which the toolTip is to be enabled. 
	 */

thirdPartyUtils.titleForEllipsis = function(obj){
	$(obj).off('mouseenter').on('mouseenter', function(){
	    var $this = $(this);
	    $this.removeAttr('title');//NO I18N
    	if(this.offsetWidth <  Math.floor(this.scrollWidth) && this.offsetWidth != Math.floor(this.scrollWidth)){
    		if($this.prop("tagName") === "INPUT"){
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


thirdPartyUtils.bindTableScroll = function() {
	var orgTable = $('#listViewTable');
	var tabCont = orgTable.parent();
	thirdPartyUtils.tabContLeftPos = orgTable.outerWidth() - tabCont.outerWidth();
	if(tabCont.scrollLeft() == 0){
		$('#fixedRowHeader').hide();
	}
    tabCont.scroll(function() {
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
        if(Crm.userDetails.RTL_ENABLED){ 
        	thirdPartyUtils.scrollLeftpos = thirdPartyUtils.scrollLeftpos + renderingUtils.windowWidth - Utils.lvLeftFilterWidth.replace('px','') + 1;
	        if($('.firefox').length > 0){
	        	thirdPartyUtils.scrollLeftpos = Math.abs(listviewtablescrollElemscrollLeft);
	        	if(thirdPartyUtils.scrollLeftpos != 0) {
	        		fixedHeaderColumn.show();
	        		fixedRowHeaderElem.show();
	        		fixedHeaderColumn.addClass('boxShadowFixedColunm');//No i18N
	        		fixedRowHeaderTableElem.css({'top': -1 * tabContTop});//No i18N
//	        		fixedHeaderTableElem.css({'right': -1*Math.abs(thirdPartyUtils.tabContLeftPos-Math.abs(listviewtablescrollElem.scrollLeft()))});//No i18N
	        		orgTable.addClass('ls');
		        }
	        	else {
		        	fixedRowHeaderElem.hide();
		            orgTable.removeClass('ls');
		            fixedHeaderColumn.removeClass('boxShadowFixedColunm');
//		            fixedHeaderTableElem.css({'right': -1*Math.abs(thirdPartyUtils.tabContLeftPos-Math.abs(listviewtablescrollElem.scrollLeft()))});//No i18N
		       }	
	        	fixedHeaderTableElem.css({'right': -Math.abs(listviewtablescrollElemscrollLeft)});//No i18N
	        }
	        else if(thirdPartyUtils.scrollLeftpos !=  fixedHeaderElem.outerWidth()) {
	        	fixedHeaderColumn.show();
	        	fixedRowHeaderElem.show();
	        	fixedHeaderColumn.addClass('boxShadowFixedColunm');
	        	fixedRowHeaderTableElem.css({'top': -1 * tabContTop});//No i18N
	        	fixedHeaderTableElem.css({'right': -1 * Math.abs(thirdPartyUtils.tabContLeftPos - Math.abs(listviewtablescrollElemscrollLeft))});//No i18N
	            orgTable.addClass('ls');
	        }
	        else {
	        	fixedRowHeaderElem.hide();
	            orgTable.removeClass('ls');
	            fixedHeaderColumn.removeClass('boxShadowFixedColunm');
	            fixedHeaderTableElem.css({'right': -1 * Math.abs(thirdPartyUtils.tabContLeftPos - Math.abs(listviewtablescrollElemscrollLeft))});//No i18N
	        	}
	        if(tabContTop > 0) {
	        	fixedHeaderElem.show();
	        }
        }
        else{
        	if(tabContTop > 0) {
        		fixedHeaderElem.show();
                fixedHeaderTableElem.css({'left': -1 * tabContLeft - 1});//No i18N
            }
            else {
            	fixedHeaderElem.hide();
            }
	        if(tabContLeft > 0) {
	        	fixedHeaderColumn.show();
	        	fixedRowHeaderElem.show();
	            fixedHeaderColumn.addClass('boxShadowFixedColunm');
	            var topPos = -1 * tabContTop;
	            fixedRowHeaderTableElem.css({'top': topPos});//No i18N
	            orgTable.addClass('ls');
	        }
	        else {
	        	fixedRowHeaderElem.hide();
	            orgTable.removeClass('ls');
	            fixedHeaderColumn.removeClass('boxShadowFixedColunm');
	        }
        }
        var sortDiv = $('#sort_div');
        if(sortDiv.length && sortDiv.css('display') === 'block'){//eslint-disable-line webperf/layout-thrashing
        	sortDiv.hide();
        }     
    });
}

/**
 * Select2 Hitting backspace on multi-select converts element to text Overwrite method
 */

thirdPartyUtils.select2HandleBackspace = function(){
	$.fn.select2.amd.require(['select2/selection/search'], function (Search) {//No I18N
			if(this.$element && this.$element.data('removeElement'))
			{
				this.trigger('unselect', {//No I18N
					data : arguments[1] //eslint-disable-line zstandard/no-reserved-words
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

thirdPartyUtils.removeSelect2Hover = function(event,element){
	var _this = $(element);
	_this.closest('.select2-results').find('li').removeClass('select2-results__option--highlighted'); //No i18n
}

	/**
	 * This method is used to close the Select2 field used for the dropdown 
	 * @param {String} id - This provides the id of the Select2  
	 */

thirdPartyUtils.closeSelect2 = function(id){
	if(id){
		$('#' + id).select2("close");	
}};

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
