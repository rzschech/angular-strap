/**
 * angular-strap
 * @version v2.2.4 - 2015-07-01
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.progressbar', []).provider('$progressbar', function() {
  var defaults = {
    type: '',
    animate: true
  };
  this.$get = function() {
    return {
      defaults: defaults
    };
  };
}).directive('bsProgressbar', [ '$progressbar', function($progressbar) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    templateUrl: 'progressbar/progressbar.tpl.html',
    scope: {
      value: '=',
      type: '@',
      animate: '=?'
    },
    link: function(scope, element, attr) {
      scope.type = scope.type || $progressbar.defaults.type;
      scope.animate = angular.isDefined(scope.animate) ? scope.animate : $progressbar.defaults.animate;
    }
  };
} ]);