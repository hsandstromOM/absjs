module.exports = {
    template: require('raw!templates/home/header.html'),
    controller: HeaderController,
    scope: {
      mainPage: '=',
      page: '=',
      slide: '='
    }
};

function controller ($scope, $state, $stateParams, contentful, store, slug) {
  var vm = this;

  vm.slugify = function(string) {
    return Slug.slugify(string);
  };
  $scope.allWorkServicesProvided = []
  $scope.allServices = []
  $scope.teamDropClosed = true
  $scope.workDropClosed = true
  $scope.headerDivision = {
    'division': 'All'
  }
  $scope.serviceDropClosed = true
  if(store.get('selectedService')) {
    $scope.selectedService = store.get('selectedService')
  } else {
    $scope.selectedService = ''
  }
  if(store.get('selectedWorkService')) {
    $scope.selectedWorkService = store.get('selectedWorkService')
  } else {
    $scope.selectedWorkService = ''
  }
  if(store.get('currentDivision')) {
    $scope.headerDivision.current = store.get('currentDivision')
  } else {
    $scope.headerDivision.current = 'All'
  }
  $scope.setSelectedService = function (serviceProvided) {
    if(serviceProvided){
      store.set('selectedService', serviceProvided)
    } else {
      store.set('selectedService', $scope.defaultWorkService)
    }
  }
  $scope.setWorkService = function (workService) {
    if(workService){
      store.set('selectedWorkService', workService)
    } else {
      store.set('selectedWorkService', $scope.defaultWorkService)
    }
  }
  $scope.setDivision = function (division) {
    store.set('currentDivision', division)
  }
  function comparePriority(a,b) {
  if (a.fields.priority < b.fields.priority)
    return -1;
  if (a.fields.priority > b.fields.priority)
    return 1;
  return 0;
  }
  contentful.entries('content_type=workProjects&include=3').then(function(res) {
    var workProjects = res.data.items
    $scope.allWorkProjects = res.data.items
    angular.forEach(workProjects, function(workProject){
      if(workProject.fields.services){
        var services = workProject.fields.services
        angular.forEach(services, function(service) {
          if(service.fields){
            var index = $scope.allWorkServicesProvided.indexOf(service)
            if (index < 0) {
              $scope.allWorkServicesProvided.push(service)
              $scope.allWorkServicesProvided.sort(comparePriority)
              $scope.defaultWorkService = $scope.allWorkServicesProvided[0]
              store.set('defaultWorkService', $scope.defaultWorkService)
              console.log($scope.defaultWorkService)
            }
          }
        })
      }
    })
  })
  contentful.entries('content_type=serviceTypes&include=3').then(function(res) {
    var items = res.data.items
    angular.forEach(items, function(item){
      $scope.allServices.push(item)
      $scope.allServices.sort(comparePriority)
    })
    $scope.defaultService = $scope.allServices[0]
    store.set('defaultService', $scope.defaultService)
  })
}
