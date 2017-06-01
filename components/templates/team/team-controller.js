module.exports = {
    url: '/team',
    template: require('raw!templates/team.html'),
    controller: TeamController,
    controllerAs: 'teamCtrl',
    params: {
      'division': null,
    }
}

function TeamController($scope, $state, store, contentful, $window, $uibModal, Slug) {
  var vm = this;
  $window.scrollTo(0, 0);

  contentful.entries('content_type=team').then(function(res) {
    console.log('team page', res);
    $scope.teamPage = res.data.items[0]
  })
  contentful.entries('content_type=teamMembers').then(function(res) {
    console.log('team members', res);
    $scope.teamPage = res.data.items[0]
  })
  $scope.filteredMembers= [
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
  ],
  $scope.setCurrentTeamMember = function (member) {
    $scope.currentTeamMember = member
  }
}
