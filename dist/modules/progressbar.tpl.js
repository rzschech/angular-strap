/**
 * angular-strap
 * @version v2.2.4 - 2015-07-01
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.progressbar').run([ '$templateCache', function($templateCache) {
  $templateCache.put('progressbar/progressbar.tpl.html', '<div class="progress"><div class="progress-bar" ng-class="type ? \'progress-bar-\'+type : null" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100" ng-style="{width: value + \'%\', \'webkit-transition\': animate ? null : \'none\', \'transition\': animate ? null : \'none\'}"><div ng-transclude></div></div></div>');
} ]);