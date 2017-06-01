module.exports = {
    url: '/team-member/:slug',
    template: require('raw!templates/member-view.html'),
    controller: TeamMemberController,
    controllerAs: 'memberCtrl'
}

function TeamMemberController($scope, $stateParams, $state, store, contentful, $window, Slug) {
    $window.scrollTo(0, 0);

    var vm = this;
    var allQuery = "content_type=teamMember";
    var memberQuery = allQuery + "&fields.slug=" + $state.params.slug;

    vm.allMembers = [];
    vm.detailHref = 'team-member';
    vm.parentPage = {
        'text': 'TEAM MEMBERS',
        'href': "/team"
    };

    var getContenfulData = function () {
        contentful.entries(memberQuery).then(function(res) {
            console.log('current', res);
            vm.currentMember = res.data.items[0]
            if (vm.currentMember.fields.pageTitleSeo) {
                document.title = vm.currentMember.fields.pageTitleSeo
            }
            if (vm.currentMember.fields.pageSpecificMetaDescriptionSeo) {
                var meta = document.getElementsByTagName("meta");
                for (var i = 0; i < meta.length; i++) {
                    if (meta[i].name.toLowerCase() === "description") {
                        meta[i].content = vm.currentMember.fields.pageSpecificMetaDescriptionSeo
                    }
                }
            }
        })
        contentful.entries(allQuery).then(function(res) {
            var entries = res.data;
            entries.items.forEach(function(entry) {
                vm.allMembers.push(entry)
            }, function(res) {});
        });
    }

    getContenfulData();
}
