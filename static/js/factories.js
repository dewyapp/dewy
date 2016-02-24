var factories=angular.module("dewyFactories",[]);factories.factory("authInterceptor",["authService","$location","$q","$window",function(a,b,c,d){var e={};return e.request=function(a){return a.headers=a.headers||{},d.localStorage.token?a.headers.Authorization="Bearer "+d.localStorage.token:d.sessionStorage.token&&(a.headers.Authorization="Bearer "+d.sessionStorage.token),a},e.responseError=function(b){return 401==b.status&&(console.log("Access denied"),a.signOff()),c.reject(b)},e}]),factories.factory("authService",["dewySession","$location","$rootScope",function(a,b,c){var d={};return d.currentUser=function(){return a.getUser()},d.isAuthenticated=function(){return!!a.getToken()},d.setUser=function(b){a.setUser(b)},d.signOff=function(){a.destroy(),b.path("/signon")},d.signOn=function(d,e){a.create(d),c.$broadcast("auth-signon-success"),b.path("/sites")},d}]),factories.factory("filterFactory",["$http",function(a){var b={},c="http://dewy.io/api";return b.create=function(b){return a.post(c+"/filters",b).then(function(a){console.log(a)})},b["delete"]=function(b){return a["delete"](c+"/filters/"+b)},b.getAll=function(){return a.get(c+"/filters").then(function(a){return a.data})},b.getFields=function(){return a.get(c+"/fields/values",{cache:!0}).then(function(a){return a.data})},b.getFilter=function(b){return a.get(c+"/filters/"+b).then(function(a){function b(a){var d,e=a.rules;if(e)for(d=e.length;d--;)b(e[d]);else c++}var c=0;return b(a.data),a.data.count=c,a.data})},b.getOperators=function(){return a.get(c+"/fields/operators",{cache:!0}).then(function(a){return a.data})},b.update=function(b){return a.put(c+"/filters/"+b.fid,b).then(function(a){console.log(a)})},b}]),factories.factory("sitesFactory",["$http",function(a){var b={},c="http://dewy.io/api";return b.audit=function(b){var d={audit:!0};return a.put(c+"/sites/"+b,d).success(function(a){return a.data}).error(function(a,b){return a})},b["delete"]=function(b){return a["delete"](c+"/sites/"+b)},b.get=function(b,d){return a.get(c+"/sites/"+b).then(function(a){return a.data})},b.getAll=function(b){return a.get(c+"/sites/_filter/"+b).then(function(a){var b={complexity:[],size:[],activity:[],health:[]};for(var c in a.data)for(var d in b)null==b[d].maximum?b[d].maximum=a.data[c].attributes[d]:b[d].maximum<a.data[c].attributes[d]&&(b[d].maximum=a.data[c].attributes[d]),null==b[d].minimum?b[d].minimum=a.data[c].attributes[d]:b[d].minimum>a.data[c].attributes[d]&&(b[d].minimum=a.data[c].attributes[d]);for(var d in b)b[d].increment=(b[d].maximum-b[d].minimum)/9;for(var c in a.data)for(var d in b)b[d].increment?a.data[c][d]=(a.data[c].attributes[d]-b[d].minimum)/b[d].increment+1:a.data[c][d]=1;return a.data})},b.getOffline=function(){return a.get(c+"/sites/_offline").then(function(a){return a.data})},b.getTags=function(){return a.get(c+"/sites/_tags").then(function(a){var b=[];for(var c in a.data)b.push(a.data[c].key[1]);return b})},b.setTags=function(b){var d={tags:b.tags};return a.put(c+"/sites/"+b.sid,d).then(function(a){return a.data})},b}]),factories.factory("userFactory",["$http",function(a){var b={},c="http://dewy.io/api";return b.get=function(){return a.get(c+"/users").then(function(a){return a.data})},b.resetKey=function(b){var d={key:!0};return a.put(c+"/users/"+b,d).then(function(a){return a.data.apikey})},b}]);
//# sourceMappingURL=factories.js.map