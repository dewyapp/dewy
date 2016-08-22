var app = angular.module('dewy', [
	'config',
	'ngRoute',
	'ngAnimate',
	'ui.sortable',
	'angular-momentjs',
	'stripe',
	'validation.match',
	'dewyControllers',
	'dewyFactories',
	'dewyServices',
	'dewyDirectives'
])

app.config(['$httpProvider', '$routeProvider', '$locationProvider', 'ENV', function($httpProvider, $routeProvider, $locationProvider, ENV) {
	$locationProvider.html5Mode(true);
	$httpProvider.interceptors.push('authInterceptor');
    Stripe.setPublishableKey(ENV.stripePublicKey);
    $routeProvider.
		when('/account', {
			templateUrl: 'templates/account.html',
			controller: 'accountController',
			menuItem: 'account',
			appPage: true,
			requiresAuthorization: true
		}).
		// when('/content/:filter?', {
		// 	templateUrl: 'templates/overview.html',
		// 	controller: 'overviewController',
		// 	menuItem: 'overview',
		// 	requiresAuthorization: true,
		// 	resolve: {
		// 		filters: ['filterFactory', function(filterFactory) {
		// 			return filterFactory.getAll();
		// 		}],
		// 		filterIndex: ['filterFactory', function(filterFactory) {
		// 			return filterFactory.getIndex();
		// 		}],
		// 		data: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
		// 			if ($route.current.params.filter) {
		// 				return filterFactory.getFilter($route.current.params.filter).
		// 				then(function(currentFilter) {
		// 					return sitesFactory.getAll(currentFilter.fid).
		// 					then(function(sites) {
		// 						return {
		// 							currentFilter: currentFilter,
		// 							sites: sites,
		// 							view: 'content'
		// 						}
		// 					});
		// 				});
		// 			}
		// 			else {
		// 				return sitesFactory.getAll().
		// 				then(function(sites) {
		// 					return {
		// 						currentFilter: null,
		// 						sites: sites,
		// 						view: 'content'
		// 					}
		// 				});
		// 			}
		// 		}]
		// 	}
		// }).
		when('/filter/:filter?', {
			templateUrl: 'templates/filter.html',
			controller: 'filterController',
			appPage: true,
			requiresAuthorization: true,
			resolve: {
				operators: ['filterFactory', function(filterFactory) {
					return filterFactory.getOperators();
				}],
				fields: ['filterFactory', function(filterFactory) {
					return filterFactory.getFields();
				}],
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				currentFilter: ['$route', 'filterFactory', function($route, filterFactory) {
					return filterFactory.getFilter($route.current.params.filter);
				}],
				tags: ['sitesFactory', function(sitesFactory) {
					return sitesFactory.getTags();
				}]
			}
		}).
		when('/filters', {
			templateUrl: 'templates/filters.html',
			controller: 'filtersController',
			menuItem: 'filters',
			appPage: true,
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				filterIndex: ['filterFactory', function(filterFactory) {
					return filterFactory.getIndex();
				}]
			}
		}).
		when('/manage', {
			templateUrl: 'templates/manage.html',
			controller: 'manageController',
			menuItem: 'manage',
			appPage: true,
			requiresAuthorization: true,
			resolve: {
				sites: ['sitesFactory', function(sitesFactory) {
					return sitesFactory.getOffline();
				}],
				user: ['userFactory', function(userFactory) {
					return userFactory.get();
				}]
			}
		}).
		when('/modules/:filter?', {
			templateUrl: 'templates/overview.html',
			controller: 'overviewController',
			menuItem: 'overview',
			appPage: true,
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				filterIndex: ['filterFactory', function(filterFactory) {
					return filterFactory.getIndex();
				}],
				data: ['$route', 'filterFactory', 'moduleFactory', function($route, filterFactory, moduleFactory) {
					if ($route.current.params.filter) {
						return filterFactory.getFilter($route.current.params.filter).
						then(function(currentFilter) {
							return moduleFactory.getAll(currentFilter.fid).
							then(function(modules) {
								return {
									currentFilter: currentFilter,
									modules: modules,
									view: 'modules'
								}
							});
						});
					}
					else {
						return moduleFactory.getAll().
						then(function(modules) {
							return {
								currentFilter: null,
								modules: modules,
								view: 'modules'
							}
						});
					}
				}]
			}
		}).
		when('/reset', {
			templateUrl: 'templates/reset.html',
			controller: 'resetController',
			requiresAuthorization: false,
		}).
		when('/reset/:uid/:reset', {
			templateUrl: 'templates/reset.html',
			controller: 'resetController',
			resolve: {
				resetData: ['$rootScope', '$route', '$http', 'authService', '$httpParamSerializer', 'ENV', function($rootScope, $route, $http, authService, $httpParamSerializer, ENV) {
					var encodedClient = window.btoa(ENV.client_id + ':' + ENV.client_secret);
					return $http({
						method: 'POST',
						url: ENV.api + 'users/_reset/' + $route.current.params.uid,
						headers: {
							'Authorization': 'Basic ' + encodedClient,
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: $httpParamSerializer({
							grant_type: 'password',
							verification_code: $route.current.params.verify
						})
					})
					.then(function(result) {
						return result;
					}, function(error) {
						if (error.status == '400') {
							return {error: error.data};
						} else {
							return {error: 'Dewy could not reset your password at this time.'};
						}
					});
				}]
			}
		}).
		when('/signon', {
			templateUrl: 'templates/signon.html',
			controller: 'signonController',
			requiresAuthorization: false,
		}).
		when('/signup', {
			templateUrl: 'templates/signup.html',
			controller: 'signupController',
			requiresAuthorization: false,
		}).
		when('/sites/:filter?', {
			templateUrl: 'templates/overview.html',
			controller: 'overviewController',
			menuItem: 'overview',
			appPage: true,
			requiresAuthorization: true,
			resolve: {
				filters: ['filterFactory', function(filterFactory) {
					return filterFactory.getAll();
				}],
				filterIndex: ['filterFactory', function(filterFactory) {
					return filterFactory.getIndex();
				}],
				data: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
					if ($route.current.params.filter) {
						return filterFactory.getFilter($route.current.params.filter).
						then(function(currentFilter) {
							return sitesFactory.getAll(currentFilter.fid).
							then(function(sites) {
								return {
									currentFilter: currentFilter,
									sites: sites,
									view: 'sites'
								}
							});
						});
					}
					else {
						return sitesFactory.getAll().
						then(function(sites) {
							return {
								currentFilter: null,
								sites: sites,
								view: 'sites'
							}
						});
					}
				}]
			}
		}).
		when('/subscription', {
			templateUrl: 'templates/subscription.html',
			controller: 'subscriptionController',
			menuItem: 'subscription',
			appPage: true,
			requiresAuthorization: true
		}).
		// when('/users/:filter?', {
		// 	templateUrl: 'templates/overview.html',
		// 	controller: 'overviewController',
		// 	menuItem: 'overview',
		// 	requiresAuthorization: true,
		// 	resolve: {
		// 		filters: ['filterFactory', function(filterFactory) {
		// 			return filterFactory.getAll();
		// 		}],
		// 		filterIndex: ['filterFactory', function(filterFactory) {
		// 			return filterFactory.getIndex();
		// 		}],
		// 		data: ['$route', 'filterFactory', 'sitesFactory', function($route, filterFactory, sitesFactory) {
		// 			if ($route.current.params.filter) {
		// 				return filterFactory.getFilter($route.current.params.filter).
		// 				then(function(currentFilter) {
		// 					return sitesFactory.getAll(currentFilter.fid).
		// 					then(function(sites) {
		// 						return {
		// 							currentFilter: currentFilter,
		// 							sites: sites,
		// 							view: 'users'
		// 						}
		// 					});
		// 				});
		// 			}
		// 			else {
		// 				return sitesFactory.getAll().
		// 				then(function(sites) {
		// 					return {
		// 						currentFilter: null,
		// 						sites: sites,
		// 						view: 'users'
		// 					}
		// 				});
		// 			}
		// 		}]
		// 	}
		// }).
		when('/verify/:uid/:verify', {
			templateUrl: 'templates/verify.html',
			controller: 'verifyController',
			resolve: {
				verifyData: ['$rootScope', '$route', '$http', 'authService', '$httpParamSerializer', 'ENV', function($rootScope, $route, $http, authService, $httpParamSerializer, ENV) {
					
					var encodedClient = window.btoa(ENV.client_id + ':' + ENV.client_secret);
					return $http({
						method: 'POST',
						url: ENV.api + 'users/_verify/' + $route.current.params.uid,
						headers: {
							'Authorization': 'Basic ' + encodedClient,
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: $httpParamSerializer({
							grant_type: 'password',
							verification_code: $route.current.params.verify
						})
					})
					.then(function(result) {
						$rootScope.$broadcast('flashMessage', {content: 'Email verified', type: 'message'});
						authService.signOn('/account', result.data);
						return {error: null};
					}, function(error) {
						if (error.status == '400') {
							return {error: error.data};
						} else {
							return {error: 'Dewy could not verify you at this time.'};
						}
					});
				}]
			}
		}).
		when('/', {
			templateUrl: 'templates/index.html',
			requiresAuthorization: false,
		}).
		otherwise({
			controller: ['$location', function($location) {
				$location.path('/');
			}],
			template : '<div></div>'
		})
}]);

app.run(['authService', '$rootScope', '$location', '$http', '$window', 'ENV', function(authService, $rootScope, $location, $http, $window, ENV) {
	$rootScope.env = ENV.environment;
	$rootScope.location = $location;
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		$rootScope.isViewLoading = true;
		if (next.requiresAuthorization) {
			if (!authService.isAuthenticated()) {
				event.preventDefault();
				$location.path('/signon');
			} else {
				var currentUser = authService.currentUser();
				if (!currentUser) {
					$http.get(ENV.api + 'users')
					.success(function(result) {
						authService.setUser(result);
					});
				}
			}
		}
		else if ('requiresAuthorization' in next && !next.requiresAuthorization) {
			if (authService.isAuthenticated()) {
				event.preventDefault();
				if (current && current.controller == "overviewController") {
					$rootScope.isViewLoading = false;
				} else {
					$location.path('/sites');
				}
			}
		}
	});
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		$rootScope.isViewLoading = false;
		$rootScope.appPage = current.appPage;
		$rootScope.menuItem = current.menuItem;
	});
	$rootScope.$on('$routeChangeError', function(event, current, previous) {
		if (previous) {
			$window.history.back();
		}
		else {
			$location.path('/').replace();
		}
		$rootScope.isViewLoading = false;
		$rootScope.$broadcast('flashMessage', {content: 'There is a problem communicating with Dewy at this time', type: 'error'});
	});
	$rootScope.$on('signOff:success', function() {
		$location.path('/signon');
	});
	$rootScope.$on('signOn:success', function(event, data) {
		$location.path(data);
	});
}]);