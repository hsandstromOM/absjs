module.exports = {
	url: '/',
	template: require('raw!templates/home/home-view.html'),
	controller: HomeController,
	controllerAs: 'homeCtrl',
};

// @ngInject
function HomeController($scope, $state, store, $window, contentful) {
	var vm = this;
  $window.scrollTo(0, 0);

	contentful.entries('content_type=home').then(function(res) {
		console.log(res);
		$scope.home = res.data.items[0];
	});
	contentful.entries('content_type=home').then(function(res) {
		var seoData = res.data.items[0];
		if (seoData.fields.pageTitleSeo) {
			document.title = seoData.fields.pageTitleSeo;
		}
		if (seoData.fields.pageSpecificMetaDescriptionSeo) {
			var meta = document.getElementsByTagName("meta");
			for (var i = 0; i < meta.length; i++) {
				if (meta[i].name.toLowerCase() === "description") {
					meta[i].content = seoData.fields.pageSpecificMetaDescriptionSeo;
				}
			}
		}
	});
	var left = true
		$scope.certsLeft = []
		$scope.certsRight = []
		contentful.entries('content_type=home').then(function(res) {
			$scope.contentfulData = res.data.items[0]
			angular.forEach($scope.contentfulData.fields.certsAndLicenses, function(entry) {
				if(left === true) {
					$scope.certsLeft.push(entry)
					left = false
				} else {
					$scope.certsRight.push(entry)
					left = true
				}
			})
		});
	vm.allServices = [];
	contentful.entries('content_type=serviceTypes').then(function(res) {
		console.log(res);
  		var entries = res.data
  		entries.items.forEach(function(entry) {
  				vm.allServices.push(entry)
  		});
	});
	$scope.allServicesProvided = []
	$scope.allServiceTypes = []
	$scope.goToService = function (service) {
		console.log(service)
		}
	$scope.goToWorkProjects = function (workProjects) {
			console.log(workProjects)
		};
	$scope.allWorkProjects = []
		contentful.entries('content_type=workProjects').then(function(res) {
			$scope.allWorkProjects = res.data.items
		});
}
