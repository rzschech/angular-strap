'use strict';

angular.module('mgcrea.ngStrap.dropdown', ['mgcrea.ngStrap.tooltip'])

  .provider('$dropdown', function () {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'dropdown',
      prefixEvent: 'dropdown',
      placement: 'bottom-left',
      templateUrl: 'dropdown/dropdown.tpl.html',
      trigger: 'click',
      container: false,
      keyboard: true,
      html: false,
      delay: 0
    };

    this.$get = function ($window, $rootScope, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);
      var matchesSelector = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;

      function DropdownFactory (element, config) {

        var $dropdown = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        /* var scope = */$dropdown.$scope = options.scope && options.scope.$new() || $rootScope.$new();

        if (options.inlineTemplate === true) {
          options.inlineTemplate = '.dropdown-menu';
        }
        if (options.inlineTemplate && !options.target) {
          options.target = element.parent();
        }

        $dropdown = $tooltip(element, options);

        // Protected methods

        $dropdown.$onKeyDown = function (evt) {
          if (!/(38|40)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();

          // Retrieve focused index
          var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
          if (!items.length) return;
          var index;
          angular.forEach(items, function (el, i) {
            if (matchesSelector && matchesSelector.call(el, ':focus')) index = i;
          });

          // Navigate with keyboard
          if (evt.keyCode === 38 && index > 0) index--;
          else if (evt.keyCode === 40 && index < items.length - 1) index++;
          else if (angular.isUndefined(index)) index = 0;
          items.eq(index)[0].focus();

        };

        // Overrides

        var show = $dropdown.show;
        $dropdown.show = function () {
          var target = getTarget();
          if (target.hasClass('dropdown') || target.hasClass('dropup')) target.addClass('open');
          show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function () {
            if (options.keyboard && $dropdown.$element) $dropdown.$element.on('keydown', $dropdown.$onKeyDown);
            bodyEl.on('click', onBodyClick);
          }, 0, false);
        };

        var hide = $dropdown.hide;
        $dropdown.hide = function () {
          var dropdownElement = $dropdown.$element;
          if (!$dropdown.$isShown) return;
          hide();
          if ($dropdown.$isShown) return; // support preventing hide
          if (options.keyboard && dropdownElement) dropdownElement.off('keydown', $dropdown.$onKeyDown);
          bodyEl.off('click', onBodyClick);
          var target = getTarget();
          if (target.hasClass('dropdown') || target.hasClass('dropup')) target.removeClass('open');
        };

        var destroy = $dropdown.destroy;
        $dropdown.destroy = function () {
          bodyEl.off('click', onBodyClick);
          destroy();
        };

        // Private functions

        function onBodyClick (evt) {
          if (evt.target === element[0]) return;
          return evt.target !== element[0] && $dropdown.hide();
        }

        function getTarget() {
          return options.target || element.parent();
        }

        return $dropdown;

      }

      return DropdownFactory;

    };

  })

  .directive('bsDropdown', function ($window, $sce, $dropdown) {

    return {
      restrict: 'EAC',
      scope: true,
      compile: function (tElement, tAttrs) {

        // Directive options
        var options = {};

        // Support for inlined template (next sibling)
        // It must be fetched before compilation
        if (!tAttrs.bsDropdown) {
          var nextSibling = tElement[0].nextSibling;
          while (nextSibling && nextSibling.nodeType !== 1) {
            nextSibling = nextSibling.nextSibling;
          }
          if (nextSibling && nextSibling.className.split(' ').indexOf('dropdown-menu') >= 0) {
            options.template = nextSibling.outerHTML;
            options.templateUrl = undefined;
            nextSibling.parentNode.removeChild(nextSibling);
          }
        }

        return function postLink (scope, element, attr) {

          // Directive options
          options.scope = scope;
          angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'target', 'trigger', 'keyboard', 'html', 'animation', 'id', 'autoClose', 'inlineTemplate'], function (key) {
            if (angular.isDefined(tAttrs[key])) options[key] = tAttrs[key];
          });

          // use string regex match boolean attr falsy values, leave truthy values be
          var falseValueRegExp = /^(false|0|)$/i;
          angular.forEach(['html', 'container'], function (key) {
            if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
          });

          // bind functions from the attrs to the show and hide events
          angular.forEach(['onBeforeShow', 'onShow', 'onBeforeHide', 'onHide'], function (key) {
            var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
            if (angular.isDefined(attr[bsKey])) {
              options[key] = scope.$eval(attr[bsKey]);
            }
          });

          // Support scope as an object
          scope.$watch(attr.bsDropdown, function (newValue, oldValue) {
            scope.content = newValue;
          }, true);

          // Initialize dropdown
          var dropdown = $dropdown(element, options);

          // Visibility binding support
          if (attr.bsShow) {
            scope.$watch(attr.bsShow, function (newValue, oldValue) {
              if (!dropdown || !angular.isDefined(newValue)) return;
              if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(dropdown),?/i);
              if (newValue === true) {
                dropdown.show();
              } else {
                dropdown.hide();
              }
            });
          }

          // Garbage collection
          scope.$on('$destroy', function () {
            if (dropdown) dropdown.destroy();
            options = null;
            dropdown = null;
          });

        };
      }
    };

  });
