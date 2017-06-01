const ee = require('./services');
const moment = window.moment;
const underscore = window.underscore;
angular.module('app', [
        'ngResource',
        'ngSanitize',
        'ui.router',
        'angular-storage',
        'angular-jwt',
        'angucomplete-alt',
        'contentful',
        'ui.bootstrap',
        'angularUtils.directives.dirPagination',
        'stripe.checkout',
        'hc.marked',
        'slugifier',
        '720kb.socialshare'
    ])
    .constant('ee', ee)
    .constant('moment', moment)
    .constant('underscore', underscore)
    .config(['$urlRouterProvider', '$stateProvider', 'contentfulProvider', 'StripeCheckoutProvider', '$locationProvider', '$compileProvider',
        function($urlRouterProvider, $stateProvider, contentfulProvider, StripeCheckoutProvider, $locationProvider, $compileProvider) {
            // Performance improvement/cleaner markup
            // https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476
            $compileProvider.debugInfoEnabled(false);
            // Stripe confits
            StripeCheckoutProvider.defaults({
                key: 'pk_live_t4DRLFoNpmoWASIiR1ljn7Qs', //STRIPE KEY
            });
            // Contentful configs
            contentfulProvider.setOptions({
                space: 'lxejsmju70ex',
                accessToken: '2ef82748feb6fd9e7d78f7103794d27612337c3499abc02d7f21c1fb4ee5c627',
            });
            $urlRouterProvider.otherwise('/*');
            $stateProvider
                .state('site', require('./components/layout'))
                .state('site.home', require('./components/templates/home/home-controller'))
                .state('site.about', require('./components/templates/about/about-controller'))
                .state('site.contact', require('./components/templates/contact/contact-controller'))
                .state('site.services', require('./components/templates/services/services-controller'))
                .state('site.board-list', require('./components/templates/board/board-list-controller'))
                .state('site.board-member', require('./components/templates/board/board-member-controller'))
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false,
            });
        },
    ])
    .directive('navFooter', require('./components/directives/footer.js'))
    .directive('navHeader', require('./components/directives/header.js'))
