(function (argument) {
	var app = angular.module("NarrowItDownApp", [])
	.controller("NarrowItDownController", NarrowItDownController)
	.directive("foundItems", FoundItemsDirective)
	.service("MenuSearchService", MenuSearchService)
	.constant("BaseApiUrl", "https://davids-restaurant.herokuapp.com/menu_items.json");

NarrowItDownController.$inject = ["MenuSearchService"];
function NarrowItDownController(menuSearchService) {
	var controller = this;
	controller.items = menuSearchService.getAllItems();
	controller.searchCriteria = "";

	controller.getMatchedMenuItems = function () {
		console.log("searchCriteria", controller.searchCriteria);
		menuSearchService.getCategoryBySearchCriteria(controller.searchCriteria).then(function (myItems) {
			controller.items = myItems;
		});	
	};

	controller.onRemoveFoundItem = function (index) {
		menuSearchService.removeItem(index);	
	};
}

MenuSearchService.$inject = ["$q","$http", "BaseApiUrl"];
function MenuSearchService($q, $http, baseApiUrl) {
	var service = this;
	service.allItems = [];

	service.getCategoryBySearchCriteria = function (searchCriteria) {
		var deferred = $q.defer();

		$http({
			url: baseApiUrl
		}).then(function (response) {
			var result = response.data.menu_items.filter(function (x) {
				return x.name.toLowerCase().indexOf(searchCriteria.toLowerCase()) > -1;
			});
			service.allItems = result;
			deferred.resolve(result);
		}, function (error) {
			console.error(error);
			deferred.reject();
		});

		return deferred.promise;
	};

	service.removeItem = function (index) {
		service.allItems.splice(index,1);
	};

	service.getAllItems = function () {
		return service.allItems;
	};
}

function FoundItemsDirective() {
	//onRemove:"&"
	var ddo = {
		restrict: "E",
		templateUrl: "templates/foundItems.html",
		scope: {
			foundItems: "<", 
			onRemove: "&"
		},
		controller: NarrowItDownController,
		controllerAs: "list",
		bindToController: true
	};

	return ddo;
}


})();
