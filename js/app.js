(function (argument) {
	var app = angular.module("NarrowItDownApp", [])
	.controller("NarrowItDownController", NarrowItDownController)
	.directive("foundItems", FoundItemsDirective)
	.service("MenuSearchService", MenuSearchService)
	.constant("BaseApiUrl", "https://davids-restaurant.herokuapp.com/menu_items.json");

NarrowItDownController.$inject = ["MenuSearchService"];
function NarrowItDownController(menuSearchService) {
	var controller = this;
	var found = [];

	controller.getMatchedMenuItems = function (searchCriteria) {

		menuSearchService.getCategoryBySearchCriteria(searchCriteria).then(function (myItems) {
			console.log("found items", myItems);	
		});
		
	}
}

MenuSearchService.$inject = ["$q","$http", "BaseApiUrl"];
function MenuSearchService($q, $http, baseApiUrl) {
	var service = this;
	service.allItems = [];

	service.getCategoryBySearchCriteria = function (searchCriteria) {
		var deferred = $q.defer();

		//TODO here there are some doubts
		// params: searchCriteria
		$http({
			url: baseApiUrl
		}).then(function (response) {
			//service.allItems = response.data;
			//return service.allItems;
			deferred.resolve(response.data);
		}, function (error) {
			console.error(error);
			deferred.reject();
		});

		return deferred.promise;
	}
}

function FoundItemsDirective() {
	var ddo = {
		templateUrl: "templates/foundItems.html",
		scope: {},
	};

	return ddo;
}


})();
