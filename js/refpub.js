//var BASE_URL = 'http://figisapps.fao.org/refpub-web/rest/';
var BASE_URL = 'http://168.202.54.210:8080/refpub-web/rest/';

var menu = {}
menu['main-navigation'] = {}
menu['main-navigation']['id'] = "#main-navigation";
menu['main-navigation']['icon'] = "img/icon/list-2.png";
menu['main-navigation']['iconid'] = "main-browser-icon";
menu['main-navigation']['visible'] = true;
menu['refvis-browse-results'] = {}
menu['refvis-browse-results']['id'] = "#refvis-browse-results";
menu['refvis-browse-results']['icon'] = "img/icon/search.png";
menu['refvis-browse-results']['iconid'] = "refvis-browse-results-icon";
menu['refvis-browse-results']['visible'] = false;
menu['refvis-browse-groups'] = {}
menu['refvis-browse-groups']['id'] = "#refvis-browse-groups";
menu['refvis-browse-groups']['icon'] = "img/icon/search-groups.png";
menu['refvis-browse-groups']['iconid'] = "refvis-browse-groups-icon";
menu['refvis-browse-groups']['visible'] = false;

window['refvis'] = {};
window['refvis']['menu'] = menu;

var RefVis = angular.module('refpub', ['restangular', 'infinite-scroll', 'ngRoute']).config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/groupView/', {
        templateUrl: 'groupView.html',
        controller: 'TestController',
      }).when('list/', {
      	templateUrl: 'listConcepts.html',
      	controller: 'TestController'
      });

    $locationProvider.html5Mode(true);
	}]).directive('onFinishRender', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit('ngRepeatFinished');
				});
			}
		}
	}
}).config( 
	function(RestangularProvider) {
		RestangularProvider.setBaseUrl( BASE_URL );
		RestangularProvider.setRequestSuffix('/');
		RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
			var extractedData;
			var links;
			if (operation === "getList") {
				extractedData = data.conceptList.concept;
				if (data.conceptList.link != undefined) {
					extractedData.links = data.conceptList.link;
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

}).run(function($rootScope, Restangular) {
	Restangular.addRequestInterceptor(function(element) {
		console.debug("addRequestInterceptor");
		if (window['refiVisLoadMore'] == false) {
			$rootScope.xhr = true;
		}
		$('#loadingBar').removeClass('fullwidth').delay(10).queue(function(next){
					$(this).addClass('fullwidth');
					next();
				});
		return element;
	});
	Restangular.addResponseInterceptor(function(data) {
		console.debug("addResponseInterceptor");
		$rootScope.xhr = false;
		$('#loadingBar').removeClass('fullwidth'); 
		if (window['refiVisLoadMore'] == false) {
			$('#' + window['RefVis_ClickTo']).show();
			$('#' + window['RefVis_ClickTo']).css( "visibility", "visible" );
			$('#' + window['RefVis_ClickTo']).scrollTop(0);
		}
		window['refiVisLoadMore'] = false;
		return data;
	});
}).factory('RefVisSharedService', function($rootScope) {
	var sharedService = {};
	
	sharedService.message = '';

	sharedService.prepForBroadcast = function(msg) {
		console.debug("prepForBroadcast");
		this.message = msg;
		this.broadcastItem();
	};

	sharedService.broadcastItem = function() {
		console.debug("broadcastItem");
		$rootScope.$broadcast('handleBroadcast');
	};

	return sharedService;
})
.controller('RefVisMainController', function($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
})
.controller('ConceptList', function($scope, Restangular, RefVisSharedService, $compile) {
	Restangular.all('concept').getList().then(function(response) {
		console.debug("ConceptList");
		var arrayOfConcepts = [];
		for (index = 0, len = response.length; index < len; ++index) {
			var res = {}
			if (response[index].groups != undefined) {
				res['group'] = response[index].groups.link[0].href;
			}
			res['list'] = response[index].link[0].href;
			arrayOfConcepts.push({"name" : response[index].link[0].rel, "sub" : res, "href" : response[index].link[0].href});
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
		prepareList();
	});

	$scope.browseList = function(taskId, to){
		console.debug("browseList");
		window['RefVis_ClickTo'] = to;
		$('*').scrollTop(0);
		RefVisSharedService.prepForBroadcast(taskId);
	  };

	$scope.browseGroup = function(taskId, to){
		console.debug("browseGroup");
		window['RefVis_ClickTo'] = to;
		$('*').scrollTop(0);
		RefVisSharedService.prepForBroadcast(taskId);
	  };
}).controller('ObjectList', function($scope, Restangular, RefVisSharedService) {
	$scope.jqueryScrollbarOptions = {
		"type": "simpble"
	};
	$scope.$on('handleBroadcast', function() {
		if (window['RefVis_ClickTo'] == 'refvis-browse') {
			window['refvis-main-window-id'] = window['refvis']['menu']['refvis-browse-results']['id'];
			console.debug("handleBroadcast");
			$scope.message = RefVisSharedService.message;
			Restangular.all(RefVisSharedService.message.replace(BASE_URL, "")).getList().then(function(response) {
				var arrayOfConcepts = parseConceptList(response);
				window['refvis_nextUrl'] = undefined;
				if (response.links) {
					for (index = 0, len = response.links.length; index < len; ++index) {
						if (response.links[index].rel == "next") {
							window['refvis_nextUrl'] = response.links[index].href;
						}
					}
				}
				collapseExpandDiv(window['refvis-main-window-id'], "expand");
				$scope.concepts = arrayOfConcepts;
			});
		}
	});
	$scope.getConcept = function(url, to) {
		window['RefVis_ClickTo'] = to;
		RefVisSharedService.prepForBroadcast(url);
	};
	$scope.loadMore = function(nextUrl) {
		console.debug("loadMore");
		if (window['refvis_nextUrl'] != undefined) {
			window['refiVisLoadMore'] = true;
			var URLFRAGMENTS = window['refvis_nextUrl'].split("?")
			window['refvis_nextUrl'] = undefined;
			parameters = {};
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
							window['refvis_nextUrl'] = response.links[index].href;
						}
					}
				}
				for (index = 0, len = arrayOfConcepts.length; index < len; ++index) {
					$scope.concepts.push(arrayOfConcepts[index]);
				}
				
			});
		}
	};
}).controller('MainMenu', function($scope, Restangular, RefVisSharedService) {

	$scope.clickingCallback = function(element, event, url) {
		if (event == "open-url") {
			var win = window.open(url, '_blank');
			win.focus();
		}
		if (event == "expand-collapse") {
			collapseExpandDiv(window['refvis']['menu']['main-navigation']['id']);
		}
	};

	$scope.$on('handleBroadcast', function() {
		console.debug("handleBroadcast-MainMenu");
		$scope.message = RefVisSharedService.message;
		if (window['RefVis_ClickTo'] == 'refvis-browse') {
			collapseExpandDiv(window['refvis']['menu']['main-navigation']['id']);
		}
	});

}).controller('TestController', ['$routeParams', function($routeParams) {
  this.name = "TestController";
  this.params = $routeParams;
}]);

/*RefVis.controller('GetConcept', function($scope, Restangular, RefVisSharedService) {

	$scope.$on('handleBroadcast', function() {
		if (window['RefVis_ClickTo'] == 'refvis-get-concept') {
			$scope.message = RefVisSharedService.message;
			Restangular.one(RefVisSharedService.message.replace(BASE_URL, "")).get().then(function(response) {
				collapseExpandDiv(window['refvis-main-window-id'], "collapse");
				var arrayOfConcepts = parseConcept(response);
				$scope.concept = arrayOfConcepts[0].vals;
				$scope.attr = arrayOfConcepts[0].attributes;
				$scope.parents = arrayOfConcepts[0].parents;
				$scope.children = arrayOfConcepts[0].children;
				$scope.xml = arrayOfConcepts.XML;
				$scope.json = arrayOfConcepts.JSON;
			});
		}
	});

	$scope.href = function(url) {
		var win = window.open(url, '_blank');
		win.focus();
	}

	$scope.handleClick = function(url, type) {
		window['RefVis_ClickTo'] = type;
		RefVisSharedService.prepForBroadcast(url);
	};
});



RefVis.controller('GroupList', function($scope, Restangular, RefVisSharedService, $location) {
	$scope.jqueryScrollbarOptions = {
		"type": "simpble"
	};
	$scope.$on('handleBroadcast', function() {
		if (window['RefVis_ClickTo'] == 'refvis-browse-group') {
			window['refvis-main-window-id'] = window['refvis']['menu']['refvis-browse-groups']['id'];
			console.debug("handleBroadcast");
			$scope.message = RefVisSharedService.message;
			Restangular.all(RefVisSharedService.message.replace(BASE_URL, "")).getList().then(function(response) {
				collapseExpandDiv(window['refvis']['menu']['main-navigation']['id'], 'collapse');
				var arrayOfConcepts = parseConceptList(response);
				window['refvis_nextUrl'] = undefined;
				if (response.links) {
					for (index = 0, len = response.links.length; index < len; ++index) {
						if (response.links[index].rel == "next") {
							window['refvis_nextUrl'] = response.links[index].href;
						}
					}
				}
				collapseExpandDiv(window['refvis-main-window-id'], "expand");
				$scope.concepts = arrayOfConcepts;
			});
		}
	});

	$scope.getGroup = function(url, type) {
		window['RefVis_ClickTo'] = type;
		Restangular.all(url.replace(BASE_URL, "")).getList().then(function(response) {
			collapseExpandDiv(window['refvis']['menu']['main-navigation']['id'], 'collapse');
			var arrayOfConcepts = parseGroup(response);
			if (arrayOfConcepts.is == 'hierarchy') {
				$location.url('/groupView/');
			} else {
				window['refvis_nextUrl'] = undefined;
				if (response.links) {
					for (index = 0, len = response.links.length; index < len; ++index) {
						if (response.links[index].rel == "next") {
							window['refvis_nextUrl'] = response.links[index].href;
						}
					}
				}
				collapseExpandDiv(window['refvis-main-window-id'], "expand");
				$scope.concepts = arrayOfConcepts;
			}
		});
	}
});



RefVis.controller('GetGroup', function($scope, Restangular, RefVisSharedService) {
	$scope.jqueryScrollbarOptions = {
		"type": "simpble"
	};
	$scope.$on('handleBroadcast', function() {
		console.debug("++++ GetGroup");
		if (window['RefVis_ClickTo'] == 'refvis-get-group') {
			$scope.message = RefVisSharedService.message;
			Restangular.one(RefVisSharedService.message.replace(BASE_URL, "")).get().then(function(response) {
				collapseExpandDiv(window['refvis-main-window-id'], "collapse");
				var arrayOfConcepts = parseGroup(response);
			});
		}
	});
});

RefVis.controller('TestController', function($scope, Restangular, RefVisSharedService) {
	this.name = "dasdsada";

});


RefVis.controller('MainMenu', function($scope, Restangular, RefVisSharedService) {

	$scope.clickingCallback = function(element, event, url) {
		if (event == "open-url") {
			var win = window.open(url, '_blank');
			win.focus();
		}
		if (event == "expand-collapse") {
			collapseExpandDiv(window['refvis']['menu']['main-navigation']['id']);
		}
	};

	$scope.$on('handleBroadcast', function() {
		console.debug("handleBroadcast-MainMenu");
		$scope.message = RefVisSharedService.message;
		if (window['RefVis_ClickTo'] == 'refvis-browse') {
			collapseExpandDiv(window['refvis']['menu']['main-navigation']['id']);
		}
	});

});*/

RefVis.$inject = ['$scope', 'RefVisSharedService'];