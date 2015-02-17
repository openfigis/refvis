(function(angular) {
  'use strict';

var menu = {}

menu['conceptList'] = {};
menu['conceptDetail'] = {};
menu['groupList'] = {};
menu['conceptList']['iconid'] = "refvis-browse-results-icon";
menu['conceptList']['icon'] = "img/icon/search.png";
menu['conceptDetail']['iconid'] = "refvis-browse-detail-icon";
menu['conceptDetail']['icon'] = "img/icon/search-groups.png";
menu['groupList']['iconid'] = "refvis-browse-group-icon";
menu['groupList']['icon'] = "img/icon/browse-groups.png";

window['refvis'] = {};
window['refvis']['menu'] = menu;
window['refvis']['groups'] = {};
window['refvis']['groups']['clicked-elements'] = {};

angular.module('refvis', ['restangular', 'infinite-scroll', 'ngRoute', 'ui.bootstrap', 'ngSanitize'])
  .config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
			$routeProvider
				.when('/concept/:concept', {
					templateUrl: 'views/conceptDetail.html',
					controller: 'GetConcept',
					controllerAs: 'concept'
			})
				.when('/list/:concept', {
					templateUrl: 'views/listConcepts.html',
					controller: 'ObjectList',
					controllerAs: 'list'
			})
				.when('/group/:group', {
					templateUrl: 'views/groupList.html',
					controller: 'GroupList',
					controllerAs: 'group'
			})
				.when('/group/sub/:group', {
					templateUrl: 'views/groupBrowse.html',
					controller: 'GroupBrowse',
					controllerAs: 'groupBrowse'
			})
				.when('/singleGroup/:group', {
					templateUrl: 'views/singleGroupBrowse.html',
					controller: 'GroupList',
					controllerAs: 'SingleGroupBrowse'
			})
				.when('/fulltextsearch/:text', {
					templateUrl: 'views/fullTextSearch-tmpl.html',
					controller: 'FullTextSearch',
					controllerAs: 'fullTextSearch'
			});

		$locationProvider.html5Mode(true);
  }])
  .config( 
	function(RestangularProvider) {
		RestangularProvider.setBaseUrl( BASE_URL );
		RestangularProvider.setRequestSuffix('/');
		RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
			var extractedData;
			var links;
			if (operation === "getList") {
				if (data.conceptList != undefined) {
					extractedData = data.conceptList.concept;
					if (data.conceptList.link != undefined) {
						extractedData.links = data.conceptList.link;
					}
				} else if (data.link != undefined) {
					extractedData = [];
					extractedData[0] = data;
					/*extractedData.links = data.link;*/
				}
			} 
			else if (operation === "get") {
				extractedData = data;
				if (data.link != undefined) {
					extractedData.links = data.link;
				}
			} 
			else {
				extractedData = data.data;
			}
			
			return extractedData;
		})

   })
  .directive('onFinishRender', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit('ngRepeatFinished');
				});
			}
		}
  }})
  .run(function($rootScope, Restangular) {
	Restangular.addRequestInterceptor(function(element) {
		console.debug("addRequestInterceptor");
		window['refvis']['loading'] = true;
		setTimeout(
			function() {
			  console.debug("two seconds have passed away...");
			  if (window['refvis']['loading'] == true) {
				  var loadingDiv = $("#refvis-loading");
				  if (loadingDiv.hasClass("refvis-loading-hidden")) {
					loadingDiv.removeClass("refvis-loading-hidden");
					loadingDiv.addClass("refvis-loading-visible");
				  }
			  }
			}, 2000);
		if (window['refiVisLoadMore'] == false) {
			$rootScope.xhr = true;

			$('#' + window['RefVis_ClickTo']).removeClass().addClass(window['RefVis_ClickTo'] + ' fadeOutDownBig animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$(this).removeClass().addClass(window['RefVis_ClickTo']);
				$(this).hide();
			});
			
		}
		/*$('#loadingBar').removeClass('fullwidth').delay(10).queue(function(next){
					$(this).addClass('fullwidth');
					next();
				});*/
		return element;
	});
	Restangular.addResponseInterceptor(function(data) {
		console.debug("addResponseInterceptor");
		window['refvis']['loading'] = false;
		if ($("#refvis-loading").hasClass("refvis-loading-visible")) {
			$("#refvis-loading").removeClass("refvis-loading-visible");
			$("#refvis-loading").addClass("refvis-loading-hidden");
		}
		$rootScope.xhr = false;
		/*$('#loadingBar').removeClass('fullwidth'); */
		if (window['refiVisLoadMore'] == false) {
			$('#' + window['RefVis_ClickTo']).show();
			$('#' + window['RefVis_ClickTo']).css( "visibility", "visible" );
			$('#' + window['RefVis_ClickTo']).scrollTop(0);
		}
		window['refiVisLoadMore'] = false;
		return data;
	});
  })
  .controller('MainCtrl', ['$route', '$routeParams', '$location',
		function($route, $routeParams, $location) {
			this.$route = $route;
			this.$location = $location;
			this.$routeParams = $routeParams;
  }])
  .controller('GoBackButton', function ($scope, $log) {
	  $scope.clicked = function() {
	    if (window['refvis']['navigation-url'] != undefined) {
	    	window['refvis']['navigation-url'].shift();
	    	if (window['refvis']['navigation-url'].size > 0) {
	    		$("#go-back-button").attr("href", window['refvis']['navigation-url'][0]);
	    	}

	    }
	    //return true;
	  };
	})
  .controller('DropdownCtrl', function ($scope, $log) {
	  $scope.status = {
	    isopen: false
	  };

	  $scope.toggled = function(open) {
	    //$log.log('Dropdown is now: ', open);
	  };

	  $scope.toggleDropdown = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    $scope.status.isopen = !$scope.status.isopen;
	  };
	})
  .controller('TypeaheadCtrl', ['$scope', '$http', '$location',
		function($scope, $http, $location) {
			$scope.onSelect = function ($item, $model, $label) {
				$scope.$item = $item;
				$scope.$label = $label;
				$scope.typeaheadSelected = $label;
				if ($scope.$item.concept == "figis_group") {
					$location.path("singleGroup/" + Base64.encode($item.url.replace(BASE_URL, "") + "!~~!" + $scope.$label));
				} else {
					$location.path("concept/" + Base64.encode($item.url.replace(BASE_URL, "") + "!~~!" + $scope.$label));
				}
			};
			$scope.autosuggestion = function(val) {
				return $http.jsonp(SOLR_BASE_URL, {
				  params: {
					q: val.replace(new RegExp("\"", 'g'), "'") + '',
					rows: '10',
					wt: 'json',
					defType: 'edismax',
					pf: 'long_name_e long_name_f long_name_s long_name_a long_name_r long_name_c',
					stopwords: 'true',
					'json.wrf': 'JSON_CALLBACK'
				  }
				}).then(function(response){
					var map = response.data.response.docs.map(function(item){
				  		var name = "";
						var scientific_name = null;
						if (item.scientific_name != undefined) {
							scientific_name = item.scientific_name;
						}
						if (item.full_name_e != undefined) {
							name = item.full_name_e;
						} else if (item.official_name_e != undefined) {
							name = item.official_name_e;
						} else if (item.long_name_e != undefined) {
							name = item.long_name_e;
						} else if (item.name_e != undefined) {
							name = item.name_e;
						} else if (item.scientific_name != undefined) {
							name = item.scientific_name;
							scientific_name = null;
						} else if (item.vessel_name != undefined) {
							name = item.vessel_name;
						}
						return {	'name' : name, 
									'concept' : item.concept, 
									'url' : item.url, 
									'scientific_name' : scientific_name
								};
				  	});
					$scope.typeahead_result = map;
				  	return map;
				});

		};
		$scope.triggerFullTextQuery = function($event) {
			if ($event.keyCode == 13) {
				var fullTextBar = $("#refvis-fulltext-bar");
				var text = fullTextBar.val();
				var encodedText = Base64.encode(text);
				$location.path('fulltextsearch/' + encodedText);
			}
		}
  }])
  .controller('FullTextSearch', ['$route', '$routeParams', '$location', '$scope', '$http', 
	function($route, $routeParams, $location, $scope, $http) {
		var decodedQueryString = decodeURIComponent(Base64.decode($routeParams.text));
		return $http.jsonp(SOLR_BASE_URL, {
			params: {
				q: decodedQueryString + '*',
				rows: '100',
				wt: 'json',
				'json.wrf': 'JSON_CALLBACK'
			  }
		}).success(function(response){
			//slideDownMainMenu('#main-navigation', 'main-navigation');
			toggleMainWindow('#main-navigation');
			updateLatest("fulltextsearch/" + $routeParams.text, decodedQueryString, "FullText");
			var arrayOfConcepts = [];
			var map = response.response.docs.map(function(item){
				var res = parseItem(item);
				var name = "";
				if (res['name']['en'] != undefined) {
					name = res['name']['en'];
				} else if (res['name']['fr'] != undefined) {
					name = res['name']['fr'];
				} else if (res['name']['es'] != undefined) {
					name = res['name']['es'];
				} else if (res['name']['zh'] != undefined) {
					name = res['name']['zh'];
				} else if (res['name']['ru'] != undefined) {
					name = res['name']['ru'];
				} else if (res['name']['ar'] != undefined) {
					name = res['name']['ar'];
				}

				var href = "";
				if (item.concept == "figis_group") {
					href = "singleGroup/" + Base64.encode(item.url.replace(BASE_URL, "") + "!~~!" + name);
				} else {
					href = "concept/" + Base64.encode(item.url.replace(BASE_URL, "") + "!~~!" + name);
				}

				arrayOfConcepts.push({"vals" : res, "href" : href, "concept_type" : item.concept});
		  	});
		  	if (arrayOfConcepts.length < 1) {
		  		$scope.norecordsfound = true;
		  	}
			$scope.concepts = arrayOfConcepts;
		});
  }])
  .controller('ConceptList', function($scope, Restangular, $compile, $location) {
	Restangular.all('concept').getList().then(function(response) {
		console.debug("ConceptList");
		var arrayOfConcepts = [];
		for (var index = 0, len = response.length; index < len; ++index) {
			var res = {}
			if (response[index].groups != undefined) {
				res['group'] = response[index].groups.link[0].href;
			} else {
				res['group'] = "";
			}
			res['list'] = response[index].link[0].href;
			arrayOfConcepts.push({
				"name" : response[index].link[0].rel, 
				"sub"  : res, 
				"href" : encodeURIComponent(Base64.encode(response[index].link[0].href.replace(BASE_URL, "") + "!~~!" + response[index].link[0].rel)),
				"group_href" : encodeURIComponent(Base64.encode(res['group'].replace(BASE_URL, "") + "!~~!" + response[index].link[0].rel)),
				"href_uuid" : generateUUID(),
				"group_href_uuid" : generateUUID()
			});
		}
		arrayOfConcepts.sort(function(a, b) {
			var A = a.name.toLowerCase();
			var B = b.name.toLowerCase();
			if (A < B){
				return -1;
			}else if (A > B){
				return  1;
			}else{
				return 0;
			}
			
		});
		$scope.concepts = arrayOfConcepts;

	});
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
		console.debug("ngRepeatFinished");
		prepareList("#refvis_mainNavigation");
	});
	$scope.clickCallback = function(id, className, uuid) {
		if (window['refvis']['lastmenuclick'] != undefined) {
			$(window['refvis']['lastmenuclick']).removeClass('refvis-menu-bold');
		}
		window['refvis']['lastmenuclick'] = '#' + uuid;
		$('#' + uuid).addClass('refvis-menu-bold');
		//slideDownMainMenu(id, className);
	};
})
.controller('ObjectList', ['$route', '$routeParams', '$location', '$scope', 'Restangular', 
	function($route, $routeParams, $location, $scope, Restangular) {
		window['refvis']['nextUrl'] = undefined;
		var decodedQueryString = decodeURIComponent(Base64.decode($routeParams.concept));
		var decodedQueryStringSplit = decodedQueryString.split("!~~!");
		var restUrl = decodedQueryStringSplit[0];
		var callerName = decodedQueryStringSplit[1];
		Restangular.all(restUrl).getList().then(function(response) {
			//slideDownMainMenu('#main-navigation', 'main-navigation');
			toggleMainWindow('#main-navigation');
			updateLatest("list/" + $routeParams.concept, callerName, "List");
			
			var arrayOfConcepts = parseConceptList(response);
			if (response.links) {
				for (index = 0, len = response.links.length; index < len; ++index) {
					if (response.links[index].rel == "next") {
						window['refvis']['nextUrl'] = response.links[index].href;
					}
				}
			}
			
			$scope.concepts = arrayOfConcepts;
		});
		$scope.loadMore = function(nextUrl) {
			if (window['refvis']['nextUrl'] != undefined) {
				window['refiVisLoadMore'] = true;
				var URLFRAGMENTS = window['refvis']['nextUrl'].split("?")
				window['refvis']['nextUrl'] = undefined;
				var parameters = {};
				if (URLFRAGMENTS[1] != undefined) {
					var PARAMETERS = URLFRAGMENTS[1].split("&");
					for (index = 0; index < PARAMETERS.length; index++) {
						var PARAM = PARAMETERS[index].split("=");
						parameters[PARAM[0]] = PARAM[1];
					}
				}
				Restangular.all(URLFRAGMENTS[0].replace(BASE_URL, "")).getList(parameters).then(function(response) {
					var arrayOfConcepts = parseConceptList(response);
					if (response.links) {
						for (index = 0, len = response.links.length; index < len; ++index) {
							if (response.links[index].rel == "next") {
								window['refvis']['nextUrl'] = response.links[index].href;
							}
						}
					}
					for (index = 0, len = arrayOfConcepts.length; index < len; ++index) {
						if ($scope.concepts == undefined) {
							$scope.concepts = [];
						}
						$scope.concepts.push(arrayOfConcepts[index]);
					}
					
				});
			}
		};
  }])
.controller('GroupList', ['$route', '$routeParams', '$location', '$scope', 'Restangular', '$compile',
	function($route, $routeParams, $location, $scope, Restangular, $compile) {
		var decodedQueryString = decodeURIComponent(Base64.decode($routeParams.group));
		var decodedQueryStringSplit = decodedQueryString.split("!~~!");
		var restQuery = decodedQueryStringSplit[0];
		var title = "";
		if (decodedQueryStringSplit[1] != undefined) {
			title = decodedQueryStringSplit[1];
		}
		Restangular.all(restQuery).getList().then(function(response) {
			//slideDownMainMenu('#main-navigation', 'main-navigation');
			toggleMainWindow('#main-navigation');
			updateLatest("group/" + $routeParams.group, title, "Group");
			var arrayOfConcepts = parseConceptList(response);
			window['refvis']['nextUrl'] = undefined;
			for (var index = 0; index < arrayOfConcepts.length; index++) {
				arrayOfConcepts[index]['uuid'] = generateUUID();
			}
			if (arrayOfConcepts[0].hierarchy != undefined) {
				var parentUl = $("#refvis_groupNavigation");
				var ul = renderGroupList(arrayOfConcepts);
				var liParent = $("<li>");
				parentUl.append(liParent);
				liParent.append(ul);
				ul.removeClass("slider-up");
				ul.slideDown();
				ul.addClass("slider-down");
				prepareList("#refvis_groupNavigation");
			} else {
				$scope.groups = arrayOfConcepts;
				$scope.title = title;
			}
			
		});
		$scope.getSubGroup = function(nextUrl) {
			var decodedQueryString = Base64.decode(nextUrl);
			Restangular.all(decodedQueryString).getList().then(function(response) {
				var arrayOfConcepts = parseConceptList(response);
				window['refvis']['nextUrl'] = undefined;

			});
		};
		$scope.clicked = function(id, element, uuid) {
			if (window['refvis']['groups']['clicked-elements'][uuid] == undefined || window['refvis']['groups']['clicked-elements'][uuid] == false) {
				var decodedQueryString = decodeURIComponent(Base64.decode(id));
				var decodedQueryStringSplit = decodedQueryString.split("!~~!");
				var restQuery = decodedQueryStringSplit[0];
				var title = "";
				if (decodedQueryStringSplit[1] != undefined) {
					title = decodedQueryStringSplit[1];
				}
				Restangular.all(restQuery).getList().then(function(response) {
					var arrayOfConcepts = parseConceptList(response);
					if (arrayOfConcepts['type'] == "concept_list") {
						window['refvis']['nextUrl'] = undefined;

						var liParent = $("#" + uuid).parent();
						var ul = $("<ul>").attr("id", generateUUID());
						for (var index = 0; index < arrayOfConcepts.length; index++) {
							var li = $("<li>").addClass("parent");
							var span = $("<span>");
							var spanuuid = generateUUID();
							if (arrayOfConcepts[index]['href_type'] == "figis_group") {
								span.attr("id", spanuuid).attr("ng-click", "clicked('"+arrayOfConcepts[index]['href']+"', '', '"+spanuuid+"')");
								span.text(arrayOfConcepts[index].vals.name.en);
								span.addClass("refvis-object-item-slidable");
								$compile(angular.element(span))($scope);
								li.append(span);
							} else {
								var a = $("<a>");
								a.attr("href", "concept/" + arrayOfConcepts[index]['href']);
								a.attr("class", "refvis-object-item-clickable");
								a.text(arrayOfConcepts[index].vals.name.en);
								li.append(a);
							}
							ul.append(li);
							
						}
						liParent.append(ul);
						ul.removeClass("slider-up");
						ul.slideDown();
						ul.addClass("slider-down");
					} else if (arrayOfConcepts['type'] == "group_list") {
						var ul = renderGroupList(arrayOfConcepts);
						var liParent = $("#" + uuid).parent();
						liParent.append(ul);
						ul.removeClass("slider-up");
						ul.slideDown();
						ul.addClass("slider-down");
					}
					prepareList("#refvis_groupNavigation");				
				});
			}
			window['refvis']['groups']['clicked-elements'][uuid] = true;
			$( '.refvis_group_tree li' ).each( function() {
				if( $( this ).children( 'ul' ).length > 0 ) {
					$( this ).addClass( 'parent' );     
				}
			});
			prepareList("#refvis_groupNavigation");
		};
  }])
.controller('GetConcept', ['$route', '$routeParams', '$location', '$scope', 'Restangular',
	function($route, $routeParams, $location, $scope, Restangular) {
		var decodedQueryString = decodeURIComponent(Base64.decode($routeParams.concept));
		var decodedQueryStringSplit = decodedQueryString.split("!~~!");
		var restQuery = decodedQueryStringSplit[0];
		var title = "";
		if (decodedQueryStringSplit[1] != undefined) {
			title = decodedQueryStringSplit[1];
		}
		Restangular.one(restQuery).get().then(function(response) {
			//slideDownMainMenu('#main-navigation', 'main-navigation');
			toggleMainWindow('#main-navigation');
			updateLatest("concept/" + $routeParams.concept, title, "Concept");
			var arrayOfConcepts = parseConcept(response);
			$scope.concept = arrayOfConcepts[0].vals;
			$scope.attr = arrayOfConcepts[0].attributes;
			$scope.parents = arrayOfConcepts[0].parents;
			$scope.children = arrayOfConcepts[0].children;
			$scope.xml = arrayOfConcepts.XML;
			$scope.json = arrayOfConcepts.JSON;
			$scope.conceptType = arrayOfConcepts.CONCEPT;
		});
		$scope.isEmpty = function (obj) {
			for (var i in obj) if (obj.hasOwnProperty(i)) return false;
			return true;
		};
		$scope.isNotEmpty = function (obj) {
			for (var i in obj) if (obj.hasOwnProperty(i)) return true;
			return false;
		};
}]);
})(window.angular);
