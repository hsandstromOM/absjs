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

	vm.allServices = [];
	contentful.entries('content_type=serviceTypes').then(function(res) {
		console.log(res);
  		var entries = res.data
  		entries.items.forEach(function(entry) {
  				vm.allServices.push(entry)
  		});
	});
}
