/*!
 * AdminLTE v3.2.0 (https://adminlte.io)
 * Copyright 2014-2022 Colorlib <https://colorlib.com>
 * Licensed under MIT (https://github.com/ColorlibHQ/AdminLTE/blob/master/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.adminlte = {}, global.jQuery));
})(this, (function (exports, $) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);


  /**
   * --------------------------------------------
   * AdminLTE CardWidget.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$d = 'CardWidget';
  var DATA_KEY$d = 'lte.cardwidget';
  var EVENT_KEY$6 = "." + DATA_KEY$d;
  var JQUERY_NO_CONFLICT$d = $__default["default"].fn[NAME$d];
  var EVENT_EXPANDED$3 = "expanded" + EVENT_KEY$6;
  var EVENT_COLLAPSED$4 = "collapsed" + EVENT_KEY$6;
  var EVENT_MAXIMIZED = "maximized" + EVENT_KEY$6;
  var EVENT_MINIMIZED = "minimized" + EVENT_KEY$6;
  var EVENT_REMOVED$1 = "removed" + EVENT_KEY$6;
  var CLASS_NAME_CARD = 'card';
  var CLASS_NAME_COLLAPSED$1 = 'collapsed-card';
  var CLASS_NAME_COLLAPSING = 'collapsing-card';
  var CLASS_NAME_EXPANDING = 'expanding-card';
  var CLASS_NAME_WAS_COLLAPSED = 'was-collapsed';
  var CLASS_NAME_MAXIMIZED = 'maximized-card';
  var SELECTOR_DATA_REMOVE = '[data-card-widget="remove"]';
  var SELECTOR_DATA_COLLAPSE = '[data-card-widget="collapse"]';
  var SELECTOR_DATA_MAXIMIZE = '[data-card-widget="maximize"]';
  var SELECTOR_CARD = "." + CLASS_NAME_CARD;
  var SELECTOR_CARD_HEADER = '.card-header';
  var SELECTOR_CARD_BODY = '.card-body';
  var SELECTOR_CARD_FOOTER = '.card-footer';
  var Default$b = {
    animationSpeed: 'normal',
    collapseTrigger: SELECTOR_DATA_COLLAPSE,
    removeTrigger: SELECTOR_DATA_REMOVE,
    maximizeTrigger: SELECTOR_DATA_MAXIMIZE,
    collapseIcon: 'fa-minus',
    expandIcon: 'fa-plus',
    maximizeIcon: 'fa-expand',
    minimizeIcon: 'fa-compress'
  };

  var CardWidget = /*#__PURE__*/function () {
    function CardWidget(element, settings) {
      this._element = element;
      this._parent = element.parents(SELECTOR_CARD).first();

      if (element.hasClass(CLASS_NAME_CARD)) {
        this._parent = element;
      }

      this._settings = $__default["default"].extend({}, Default$b, settings);
    }

    var _proto = CardWidget.prototype;

    _proto.collapse = function collapse() {
      var _this = this;

      this._parent.addClass(CLASS_NAME_COLLAPSING).children(SELECTOR_CARD_BODY + ", " + SELECTOR_CARD_FOOTER).slideUp(this._settings.animationSpeed, function () {
        _this._parent.addClass(CLASS_NAME_COLLAPSED$1).removeClass(CLASS_NAME_COLLAPSING);
      });

      this._parent.find("> " + SELECTOR_CARD_HEADER + " " + this._settings.collapseTrigger + " ." + this._settings.collapseIcon).addClass(this._settings.expandIcon).removeClass(this._settings.collapseIcon);

      this._element.trigger($__default["default"].Event(EVENT_COLLAPSED$4), this._parent);
    };

    _proto.expand = function expand() {
      var _this2 = this;

      this._parent.addClass(CLASS_NAME_EXPANDING).children(SELECTOR_CARD_BODY + ", " + SELECTOR_CARD_FOOTER).slideDown(this._settings.animationSpeed, function () {
        _this2._parent.removeClass(CLASS_NAME_COLLAPSED$1).removeClass(CLASS_NAME_EXPANDING);
      });

      this._parent.find("> " + SELECTOR_CARD_HEADER + " " + this._settings.collapseTrigger + " ." + this._settings.expandIcon).addClass(this._settings.collapseIcon).removeClass(this._settings.expandIcon);

      this._element.trigger($__default["default"].Event(EVENT_EXPANDED$3), this._parent);
    };

    _proto.remove = function remove() {
      this._parent.slideUp();

      this._element.trigger($__default["default"].Event(EVENT_REMOVED$1), this._parent);
    };

    _proto.toggle = function toggle() {
      if (this._parent.hasClass(CLASS_NAME_COLLAPSED$1)) {
        this.expand();
        return;
      }

      this.collapse();
    };

    _proto.maximize = function maximize() {
      this._parent.find(this._settings.maximizeTrigger + " ." + this._settings.maximizeIcon).addClass(this._settings.minimizeIcon).removeClass(this._settings.maximizeIcon);

      this._parent.css({
        height: this._parent.height(),
        width: this._parent.width(),
        transition: 'all .15s'
      }).delay(150).queue(function () {
        var $element = $__default["default"](this);
        $element.addClass(CLASS_NAME_MAXIMIZED);
        $__default["default"]('html').addClass(CLASS_NAME_MAXIMIZED);

        if ($element.hasClass(CLASS_NAME_COLLAPSED$1)) {
          $element.addClass(CLASS_NAME_WAS_COLLAPSED);
        }

        $element.dequeue();
      });

      this._element.trigger($__default["default"].Event(EVENT_MAXIMIZED), this._parent);
    };

    _proto.minimize = function minimize() {
      this._parent.find(this._settings.maximizeTrigger + " ." + this._settings.minimizeIcon).addClass(this._settings.maximizeIcon).removeClass(this._settings.minimizeIcon);

      this._parent.css('cssText', "height: " + this._parent[0].style.height + " !important; width: " + this._parent[0].style.width + " !important; transition: all .15s;").delay(10).queue(function () {
        var $element = $__default["default"](this);
        $element.removeClass(CLASS_NAME_MAXIMIZED);
        $__default["default"]('html').removeClass(CLASS_NAME_MAXIMIZED);
        $element.css({
          height: 'inherit',
          width: 'inherit'
        });

        if ($element.hasClass(CLASS_NAME_WAS_COLLAPSED)) {
          $element.removeClass(CLASS_NAME_WAS_COLLAPSED);
        }

        $element.dequeue();
      });

      this._element.trigger($__default["default"].Event(EVENT_MINIMIZED), this._parent);
    };

    _proto.toggleMaximize = function toggleMaximize() {
      if (this._parent.hasClass(CLASS_NAME_MAXIMIZED)) {
        this.minimize();
        return;
      }

      this.maximize();
    } // Private
    ;

    _proto._init = function _init(card) {
      var _this3 = this;

      this._parent = card;
      $__default["default"](this).find(this._settings.collapseTrigger).click(function () {
        _this3.toggle();
      });
      $__default["default"](this).find(this._settings.maximizeTrigger).click(function () {
        _this3.toggleMaximize();
      });
      $__default["default"](this).find(this._settings.removeTrigger).click(function () {
        _this3.remove();
      });
    } // Static
    ;

    CardWidget._jQueryInterface = function _jQueryInterface(config) {
      var data = $__default["default"](this).data(DATA_KEY$d);

      var _options = $__default["default"].extend({}, Default$b, $__default["default"](this).data());

      if (!data) {
        data = new CardWidget($__default["default"](this), _options);
        $__default["default"](this).data(DATA_KEY$d, typeof config === 'string' ? data : config);
      }

      if (typeof config === 'string' && /collapse|expand|remove|toggle|maximize|minimize|toggleMaximize/.test(config)) {
        data[config]();
      } else if (typeof config === 'object') {
        data._init($__default["default"](this));
      }
    };

    return CardWidget;
  }();
  /**
   * Data API
   * ====================================================
   */


  $__default["default"](document).on('click', SELECTOR_DATA_COLLAPSE, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardWidget._jQueryInterface.call($__default["default"](this), 'toggle');
  });
  $__default["default"](document).on('click', SELECTOR_DATA_REMOVE, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardWidget._jQueryInterface.call($__default["default"](this), 'remove');
  });
  $__default["default"](document).on('click', SELECTOR_DATA_MAXIMIZE, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardWidget._jQueryInterface.call($__default["default"](this), 'toggleMaximize');
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default["default"].fn[NAME$d] = CardWidget._jQueryInterface;
  $__default["default"].fn[NAME$d].Constructor = CardWidget;

  $__default["default"].fn[NAME$d].noConflict = function () {
    $__default["default"].fn[NAME$d] = JQUERY_NO_CONFLICT$d;
    return CardWidget._jQueryInterface;
  };

 

  /**
   * --------------------------------------------
   * AdminLTE Fullscreen.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$8 = 'Fullscreen';
  var DATA_KEY$8 = 'lte.fullscreen';
  var JQUERY_NO_CONFLICT$8 = $__default["default"].fn[NAME$8];
  var SELECTOR_DATA_WIDGET$2 = '[data-widget="fullscreen"]';
  var SELECTOR_ICON = SELECTOR_DATA_WIDGET$2 + " i";
  var EVENT_FULLSCREEN_CHANGE = 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange';
  var Default$8 = {
    minimizeIcon: 'fa-compress-arrows-alt',
    maximizeIcon: 'fa-expand-arrows-alt'
  };
  /**
   * Class Definition
   * ====================================================
   */

  var Fullscreen = /*#__PURE__*/function () {
    function Fullscreen(_element, _options) {
      this.element = _element;
      this.options = $__default["default"].extend({}, Default$8, _options);
    } // Public


    var _proto = Fullscreen.prototype;

    _proto.toggle = function toggle() {
      if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        this.windowed();
      } else {
        this.fullscreen();
      }
    };

    _proto.toggleIcon = function toggleIcon() {
      if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        $__default["default"](SELECTOR_ICON).removeClass(this.options.maximizeIcon).addClass(this.options.minimizeIcon);
      } else {
        $__default["default"](SELECTOR_ICON).removeClass(this.options.minimizeIcon).addClass(this.options.maximizeIcon);
      }
    };

    _proto.fullscreen = function fullscreen() {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    };

    _proto.windowed = function windowed() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } // Static
    ;

    Fullscreen._jQueryInterface = function _jQueryInterface(config) {
      var data = $__default["default"](this).data(DATA_KEY$8);

      if (!data) {
        data = $__default["default"](this).data();
      }

      var _options = $__default["default"].extend({}, Default$8, typeof config === 'object' ? config : data);

      var plugin = new Fullscreen($__default["default"](this), _options);
      $__default["default"](this).data(DATA_KEY$8, typeof config === 'object' ? config : data);

      if (typeof config === 'string' && /toggle|toggleIcon|fullscreen|windowed/.test(config)) {
        plugin[config]();
      } else {
        plugin.init();
      }
    };

    return Fullscreen;
  }();
  /**
    * Data API
    * ====================================================
    */


  $__default["default"](document).on('click', SELECTOR_DATA_WIDGET$2, function () {
    Fullscreen._jQueryInterface.call($__default["default"](this), 'toggle');
  });
  $__default["default"](document).on(EVENT_FULLSCREEN_CHANGE, function () {
    Fullscreen._jQueryInterface.call($__default["default"](SELECTOR_DATA_WIDGET$2), 'toggleIcon');
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default["default"].fn[NAME$8] = Fullscreen._jQueryInterface;
  $__default["default"].fn[NAME$8].Constructor = Fullscreen;

  $__default["default"].fn[NAME$8].noConflict = function () {
    $__default["default"].fn[NAME$8] = JQUERY_NO_CONFLICT$8;
    return Fullscreen._jQueryInterface;
  };


  /**
   * --------------------------------------------
   * AdminLTE Toasts.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$2 = 'Toasts';
  var DATA_KEY$2 = 'lte.toasts';
  var EVENT_KEY$1 = "." + DATA_KEY$2;
  var JQUERY_NO_CONFLICT$2 = $__default["default"].fn[NAME$2];
  var EVENT_INIT = "init" + EVENT_KEY$1;
  var EVENT_CREATED = "created" + EVENT_KEY$1;
  var EVENT_REMOVED = "removed" + EVENT_KEY$1;
  var SELECTOR_CONTAINER_TOP_RIGHT = '#toastsContainerTopRight';
  var SELECTOR_CONTAINER_TOP_LEFT = '#toastsContainerTopLeft';
  var SELECTOR_CONTAINER_BOTTOM_RIGHT = '#toastsContainerBottomRight';
  var SELECTOR_CONTAINER_BOTTOM_LEFT = '#toastsContainerBottomLeft';
  var CLASS_NAME_TOP_RIGHT = 'toasts-top-right';
  var CLASS_NAME_TOP_LEFT = 'toasts-top-left';
  var CLASS_NAME_BOTTOM_RIGHT = 'toasts-bottom-right';
  var CLASS_NAME_BOTTOM_LEFT = 'toasts-bottom-left';
  var POSITION_TOP_RIGHT = 'topRight';
  var POSITION_TOP_LEFT = 'topLeft';
  var POSITION_BOTTOM_RIGHT = 'bottomRight';
  var POSITION_BOTTOM_LEFT = 'bottomLeft';
  var Default$2 = {
    position: POSITION_TOP_RIGHT,
    fixed: true,
    autohide: false,
    autoremove: true,
    delay: 1000,
    fade: true,
    icon: null,
    image: null,
    imageAlt: null,
    imageHeight: '25px',
    title: null,
    subtitle: null,
    close: true,
    body: null,
    class: null
  };
  /**
   * Class Definition
   * ====================================================
   */

  var Toasts = /*#__PURE__*/function () {
    function Toasts(element, config) {
      this._config = config;

      this._prepareContainer();

      $__default["default"]('body').trigger($__default["default"].Event(EVENT_INIT));
    } // Public


    var _proto = Toasts.prototype;

    _proto.create = function create() {
      var toast = $__default["default"]('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true"/>');
      toast.data('autohide', this._config.autohide);
      toast.data('animation', this._config.fade);

      if (this._config.class) {
        toast.addClass(this._config.class);
      }

      if (this._config.delay && this._config.delay != 500) {
        toast.data('delay', this._config.delay);
      }

      var toastHeader = $__default["default"]('<div class="toast-header">');

      if (this._config.image != null) {
        var toastImage = $__default["default"]('<img />').addClass('rounded mr-2').attr('src', this._config.image).attr('alt', this._config.imageAlt);

        if (this._config.imageHeight != null) {
          toastImage.height(this._config.imageHeight).width('auto');
        }

        toastHeader.append(toastImage);
      }

      if (this._config.icon != null) {
        toastHeader.append($__default["default"]('<i />').addClass('mr-2').addClass(this._config.icon));
      }

      if (this._config.title != null) {
        toastHeader.append($__default["default"]('<strong />').addClass('mr-auto').html(this._config.title));
      }

      if (this._config.subtitle != null) {
        toastHeader.append($__default["default"]('<small />').html(this._config.subtitle));
      }

      if (this._config.close == true) {
        var toastClose = $__default["default"]('<button data-dismiss="toast" />').attr('type', 'button').addClass('ml-2 mb-1 close').attr('aria-label', 'Close').append('<span aria-hidden="true">&times;</span>');

        if (this._config.title == null) {
          toastClose.toggleClass('ml-2 ml-auto');
        }

        toastHeader.append(toastClose);
      }

      toast.append(toastHeader);

      if (this._config.body != null) {
        toast.append($__default["default"]('<div class="toast-body" />').html(this._config.body));
      }

      $__default["default"](this._getContainerId()).prepend(toast);
      var $body = $__default["default"]('body');
      $body.trigger($__default["default"].Event(EVENT_CREATED));
      toast.toast('show');

      if (this._config.autoremove) {
        toast.on('hidden.bs.toast', function () {
          $__default["default"](this).delay(200).remove();
          $body.trigger($__default["default"].Event(EVENT_REMOVED));
        });
      }
    } // Static
    ;

    _proto._getContainerId = function _getContainerId() {
      if (this._config.position == POSITION_TOP_RIGHT) {
        return SELECTOR_CONTAINER_TOP_RIGHT;
      }

      if (this._config.position == POSITION_TOP_LEFT) {
        return SELECTOR_CONTAINER_TOP_LEFT;
      }

      if (this._config.position == POSITION_BOTTOM_RIGHT) {
        return SELECTOR_CONTAINER_BOTTOM_RIGHT;
      }

      if (this._config.position == POSITION_BOTTOM_LEFT) {
        return SELECTOR_CONTAINER_BOTTOM_LEFT;
      }
    };

    _proto._prepareContainer = function _prepareContainer() {
      if ($__default["default"](this._getContainerId()).length === 0) {
        var container = $__default["default"]('<div />').attr('id', this._getContainerId().replace('#', ''));

        if (this._config.position == POSITION_TOP_RIGHT) {
          container.addClass(CLASS_NAME_TOP_RIGHT);
        } else if (this._config.position == POSITION_TOP_LEFT) {
          container.addClass(CLASS_NAME_TOP_LEFT);
        } else if (this._config.position == POSITION_BOTTOM_RIGHT) {
          container.addClass(CLASS_NAME_BOTTOM_RIGHT);
        } else if (this._config.position == POSITION_BOTTOM_LEFT) {
          container.addClass(CLASS_NAME_BOTTOM_LEFT);
        }

        $__default["default"]('body').append(container);
      }

      if (this._config.fixed) {
        $__default["default"](this._getContainerId()).addClass('fixed');
      } else {
        $__default["default"](this._getContainerId()).removeClass('fixed');
      }
    } // Static
    ;

    Toasts._jQueryInterface = function _jQueryInterface(option, config) {
      return this.each(function () {
        var _options = $__default["default"].extend({}, Default$2, config);

        var toast = new Toasts($__default["default"](this), _options);

        if (option === 'create') {
          toast[option]();
        }
      });
    };

    return Toasts;
  }();
  /**
   * jQuery API
   * ====================================================
   */


  $__default["default"].fn[NAME$2] = Toasts._jQueryInterface;
  $__default["default"].fn[NAME$2].Constructor = Toasts;

  $__default["default"].fn[NAME$2].noConflict = function () {
    $__default["default"].fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return Toasts._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE Treeview.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME = 'Treeview';
  var DATA_KEY = 'lte.treeview';
  var EVENT_KEY = "." + DATA_KEY;
  var JQUERY_NO_CONFLICT = $__default["default"].fn[NAME];
  var EVENT_EXPANDED = "expanded" + EVENT_KEY;
  var EVENT_COLLAPSED = "collapsed" + EVENT_KEY;
  var EVENT_LOAD_DATA_API = "load" + EVENT_KEY;
  var SELECTOR_LI = '.nav-item';
  var SELECTOR_LINK = '.nav-link';
  var SELECTOR_TREEVIEW_MENU = '.nav-treeview';
  var SELECTOR_OPEN = '.menu-open';
  var SELECTOR_DATA_WIDGET = '[data-widget="treeview"]';
  var CLASS_NAME_OPEN = 'menu-open';
  var CLASS_NAME_IS_OPENING = 'menu-is-opening';
  var CLASS_NAME_SIDEBAR_COLLAPSED = 'sidebar-collapse';
  var Default = {
    trigger: SELECTOR_DATA_WIDGET + " " + SELECTOR_LINK,
    animationSpeed: 300,
    accordion: true,
    expandSidebar: false,
    sidebarButtonSelector: '[data-widget="pushmenu"]'
  };
  /**
   * Class Definition
   * ====================================================
   */

  var Treeview = /*#__PURE__*/function () {
    function Treeview(element, config) {
      this._config = config;
      this._element = element;
    } // Public


    var _proto = Treeview.prototype;

    _proto.init = function init() {
      $__default["default"]("" + SELECTOR_LI + SELECTOR_OPEN + " " + SELECTOR_TREEVIEW_MENU + SELECTOR_OPEN).css('display', 'block');
      
      this._setupListeners();
    };

    _proto.expand = function expand(treeviewMenu, parentLi) {
      var _this = this;

      var expandedEvent = $__default["default"].Event(EVENT_EXPANDED);

      if (this._config.accordion) {
        var openMenuLi = parentLi.siblings(SELECTOR_OPEN).first();
        var openTreeview = openMenuLi.find(SELECTOR_TREEVIEW_MENU).first();
        this.collapse(openTreeview, openMenuLi);
      }

      parentLi.addClass(CLASS_NAME_IS_OPENING);
      treeviewMenu.stop().slideDown(this._config.animationSpeed, function () {
        parentLi.addClass(CLASS_NAME_OPEN);
        $__default["default"](_this._element).trigger(expandedEvent);
      });

      if (this._config.expandSidebar) {
        this._expandSidebar();
      }
    };

    _proto.collapse = function collapse(treeviewMenu, parentLi) {
      var _this2 = this;

      var collapsedEvent = $__default["default"].Event(EVENT_COLLAPSED);
      parentLi.removeClass(CLASS_NAME_IS_OPENING + " " + CLASS_NAME_OPEN);
      treeviewMenu.stop().slideUp(this._config.animationSpeed, function () {
        $__default["default"](_this2._element).trigger(collapsedEvent);
        treeviewMenu.find(SELECTOR_OPEN + " > " + SELECTOR_TREEVIEW_MENU).slideUp();
        treeviewMenu.find(SELECTOR_OPEN).removeClass(CLASS_NAME_IS_OPENING + " " + CLASS_NAME_OPEN);
      });
    };

    _proto.toggle = function toggle(event) {
      var $relativeTarget = $__default["default"](event.currentTarget);
      var $parent = $relativeTarget.parent();
      var treeviewMenu = $parent.find("> " + SELECTOR_TREEVIEW_MENU);

      if (!treeviewMenu.is(SELECTOR_TREEVIEW_MENU)) {
        if (!$parent.is(SELECTOR_LI)) {
          treeviewMenu = $parent.parent().find("> " + SELECTOR_TREEVIEW_MENU);
        }

        if (!treeviewMenu.is(SELECTOR_TREEVIEW_MENU)) {
          return;
        }
      }

      event.preventDefault();
      var parentLi = $relativeTarget.parents(SELECTOR_LI).first();
      var isOpen = parentLi.hasClass(CLASS_NAME_OPEN);

      if (isOpen) {
        this.collapse($__default["default"](treeviewMenu), parentLi);
      } else {
        this.expand($__default["default"](treeviewMenu), parentLi);
      }
    } // Private
    ;

    _proto._setupListeners = function _setupListeners() {
      var _this3 = this;
      var elementId = this._element.attr('id') !== undefined ? "#" + this._element.attr('id') : '';
    //  console.log( elementId + this._config.trigger)
     $('#main-slidebar-menu[data-widget="treeview"] .nav-link').on('click', function (event) {
      
        _this3.toggle(event);
      });
    };

    _proto._expandSidebar = function _expandSidebar() {
      if ($__default["default"]('body').hasClass(CLASS_NAME_SIDEBAR_COLLAPSED)) {
        $__default["default"](this._config.sidebarButtonSelector).PushMenu('expand');
      }
    } // Static
    ;

    Treeview._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $__default["default"](this).data(DATA_KEY);

        var _options = $__default["default"].extend({}, Default, $__default["default"](this).data());

        if (!data) {
          data = new Treeview($__default["default"](this), _options);
          $__default["default"](this).data(DATA_KEY, data);
        }

        if (config === 'init') {
          data[config]();
        }
      });
    };

    return Treeview;
  }();
  /**
   * Data API
   * ====================================================
   */


  // $__default["default"](window).on(EVENT_LOAD_DATA_API, function () {
  //   $__default["default"](SELECTOR_DATA_WIDGET).each(function () {
  //     Treeview._jQueryInterface.call($__default["default"](this), 'init');
  //   });
  // });
  /**
   * jQuery API
   * ====================================================
   */

  $__default["default"].fn[NAME] = Treeview._jQueryInterface;
  $__default["default"].fn[NAME].Constructor = Treeview;

  $__default["default"].fn[NAME].noConflict = function () {
    $__default["default"].fn[NAME] = JQUERY_NO_CONFLICT;
    return Treeview._jQueryInterface;
  };

/**
 * --------------------------------------------
 * AdminLTE PushMenu.js
 * License MIT
 * --------------------------------------------
 */
/**
 * Constants
 * ====================================================
 */
var NAME$5 = "PushMenu";
var DATA_KEY$5 = "lte.pushmenu";
var EVENT_KEY$2 = "." + DATA_KEY$5;
var JQUERY_NO_CONFLICT$5 = $__default["default"].fn[NAME$5];
var EVENT_COLLAPSED$1 = "collapsed" + EVENT_KEY$2;
var EVENT_COLLAPSED_DONE = "collapsed-done" + EVENT_KEY$2;
var EVENT_SHOWN = "shown" + EVENT_KEY$2;
var SELECTOR_TOGGLE_BUTTON$1 = '[data-widget="pushmenu"]';
var SELECTOR_BODY = "body";
var SELECTOR_OVERLAY = "#sidebar-overlay";
var SELECTOR_WRAPPER = ".wrapper";
var CLASS_NAME_COLLAPSED = "sidebar-collapse";
var CLASS_NAME_OPEN$3 = "sidebar-open";
var CLASS_NAME_IS_OPENING$1 = "sidebar-is-opening";
var CLASS_NAME_CLOSED = "sidebar-closed";
var Default$5 = {
  autoCollapseSize: 992,
  enableRemember: false,
  noTransitionAfterReload: true,
  animationSpeed: 300,
};
var PushMenu = /*#__PURE__*/ (function () {
  function PushMenu(element, options) {
    this._element = element;
    this._options = $__default["default"].extend({}, Default$5, options);

    if ($__default["default"](SELECTOR_OVERLAY).length === 0) {
      this._addOverlay();
    }

    this._init();
  } // Public

  var _proto = PushMenu.prototype;

  _proto.expand = function expand() {
    var $bodySelector = $__default["default"](SELECTOR_BODY);

    if (
      this._options.autoCollapseSize &&
      $__default["default"](window).width() <= this._options.autoCollapseSize
    ) {
      $bodySelector.addClass(CLASS_NAME_OPEN$3);
    }
    $bodySelector
      .addClass(CLASS_NAME_IS_OPENING$1)
      .removeClass(CLASS_NAME_COLLAPSED + " " + CLASS_NAME_CLOSED)
      .delay(50)
      .queue(function () {
        $bodySelector.removeClass(CLASS_NAME_IS_OPENING$1);
        $__default["default"](this).dequeue();
      });

    if (this._options.enableRemember) {
      localStorage.setItem("remember" + EVENT_KEY$2, CLASS_NAME_OPEN$3);
    }

    $__default["default"](this._element).trigger(
      $__default["default"].Event(EVENT_SHOWN)
    );
   
  };

  _proto.collapse = function collapse() {
    var _this = this;

    var $bodySelector = $__default["default"](SELECTOR_BODY);

    if (
      this._options.autoCollapseSize &&
      $__default["default"](window).width() <= this._options.autoCollapseSize
    ) {
      $bodySelector.removeClass(CLASS_NAME_OPEN$3).addClass(CLASS_NAME_CLOSED);
    }

    $bodySelector.addClass(CLASS_NAME_COLLAPSED);

    if (this._options.enableRemember) {
      localStorage.setItem("remember" + EVENT_KEY$2, CLASS_NAME_COLLAPSED);
    }

    $__default["default"](this._element).trigger(
      $__default["default"].Event(EVENT_COLLAPSED$1)
    );
    setTimeout(function () {
      $__default["default"](_this._element).trigger(
        $__default["default"].Event(EVENT_COLLAPSED_DONE)
      );
    }, this._options.animationSpeed);
  };

  _proto.toggle = function toggle() {
    if ($__default["default"](SELECTOR_BODY).hasClass(CLASS_NAME_COLLAPSED)) {
      this.expand();
    } else {
      this.collapse();
    }
  };

  _proto.autoCollapse = function autoCollapse(resize) {
    if (resize === void 0) {
      resize = false;
    }

    if (!this._options.autoCollapseSize) {
      return;
    }

    var $bodySelector = $__default["default"](SELECTOR_BODY);

    if (
      $__default["default"](window).width() <= this._options.autoCollapseSize
    ) {
      if (!$bodySelector.hasClass(CLASS_NAME_OPEN$3)) {
        this.collapse();
      }
    } else if (resize === true) {
      if ($bodySelector.hasClass(CLASS_NAME_OPEN$3)) {
        $bodySelector.removeClass(CLASS_NAME_OPEN$3);
      } else if ($bodySelector.hasClass(CLASS_NAME_CLOSED)) {
        this.expand();
      }
    }
  };

  _proto.remember = function remember() {
    if (!this._options.enableRemember) {
      return;
    }

    var $body = $__default["default"]("body");
    var toggleState = localStorage.getItem("remember" + EVENT_KEY$2);

    if (toggleState === CLASS_NAME_COLLAPSED) {
      if (this._options.noTransitionAfterReload) {
        $body
          // .addClass("hold-transition")
          .addClass(CLASS_NAME_COLLAPSED)
          .delay(50)
          .queue(function () {
            $__default["default"](this).removeClass("hold-transition");
            $__default["default"](this).dequeue();
          });
      } else {
        $body.addClass(CLASS_NAME_COLLAPSED);
      }
    } else if (this._options.noTransitionAfterReload) {
      $body
        // .addClass("hold-transition")
        .removeClass(CLASS_NAME_COLLAPSED)
        .delay(50)
        .queue(function () {
          $__default["default"](this).removeClass("hold-transition");
          $__default["default"](this).dequeue();
        });
    } else {
      $body.removeClass(CLASS_NAME_COLLAPSED);
    }
  }; // Private

  _proto._init = function _init() {
    var _this2 = this;

    this.remember();
    this.autoCollapse();
    $__default["default"](window).resize(function () {
      _this2.autoCollapse(true);
    });
  };

  _proto._addOverlay = function _addOverlay() {
    var _this3 = this;

    var overlay = $__default["default"]("<div />", {
      id: "sidebar-overlay",
    });
    overlay.on("click", function () {
      _this3.collapse();
    });
    $__default["default"](SELECTOR_WRAPPER).append(overlay);
  }; // Static

  PushMenu._jQueryInterface = function _jQueryInterface(operation) {
    return this.each(function () {
      var data = $__default["default"](this).data(DATA_KEY$5);

      var _options = $__default["default"].extend(
        {},
        Default$5,
        $__default["default"](this).data()
      );

      if (!data) {
        data = new PushMenu(this, _options);
        $__default["default"](this).data(DATA_KEY$5, data);
      }

      if (
        typeof operation === "string" &&
        /collapse|expand|toggle/.test(operation)
      ) {
        data[operation]();
      }
    });
  };

  return PushMenu;
})();
/**
 * Data API
 * ====================================================
 */

$__default["default"](document).on(
  "click",
  SELECTOR_TOGGLE_BUTTON$1,
  function (event) {
    event.preventDefault();
    var button = event.currentTarget;

    if ($__default["default"](button).data("widget") !== "pushmenu") {
      button = $__default["default"](button).closest(SELECTOR_TOGGLE_BUTTON$1);
    }

    PushMenu._jQueryInterface.call($__default["default"](button), "toggle");
  }
);
$__default["default"](window).on("load", function () {
  PushMenu._jQueryInterface.call(
    $__default["default"](SELECTOR_TOGGLE_BUTTON$1)
  );
});
/**
 * jQuery API
 * ====================================================
 */
$__default["default"].fn[NAME$5] = PushMenu._jQueryInterface;
$__default["default"].fn[NAME$5].Constructor = PushMenu;

$__default["default"].fn[NAME$5].noConflict = function () {
  $__default["default"].fn[NAME$5] = JQUERY_NO_CONFLICT$5;
  return PushMenu._jQueryInterface;
};

   /**
     * --------------------------------------------
     * AdminLTE Layout.js
     * License MIT
     * --------------------------------------------
     */
    /**
     * Constants
     * ====================================================
     */
  
    var NAME$6 = 'Layout';
    var DATA_KEY$6 = 'lte.layout';
    var JQUERY_NO_CONFLICT$6 = $__default["default"].fn[NAME$6];
    var SELECTOR_HEADER = '.main-header';
    var SELECTOR_MAIN_SIDEBAR = '.main-sidebar';
    var SELECTOR_SIDEBAR$1 = '.main-sidebar .sidebar';
    var SELECTOR_CONTENT = '.content-wrapper';
    var SELECTOR_CONTROL_SIDEBAR_CONTENT = '.control-sidebar-content';
    var SELECTOR_CONTROL_SIDEBAR_BTN = '[data-widget="control-sidebar"]';
    var SELECTOR_FOOTER = '.main-footer';
    var SELECTOR_PUSHMENU_BTN = '[data-widget="pushmenu"]';
    var SELECTOR_LOGIN_BOX = '.login-box';
    var SELECTOR_REGISTER_BOX = '.register-box';
    var SELECTOR_PRELOADER = '.preloader';
    var CLASS_NAME_SIDEBAR_COLLAPSED$1 = 'sidebar-collapse';
    var CLASS_NAME_SIDEBAR_FOCUSED = 'sidebar-focused';
    var CLASS_NAME_LAYOUT_FIXED = 'layout-fixed';
    var CLASS_NAME_CONTROL_SIDEBAR_SLIDE_OPEN = 'control-sidebar-slide-open';
    var CLASS_NAME_CONTROL_SIDEBAR_OPEN = 'control-sidebar-open';
    var CLASS_NAME_IFRAME_MODE = 'iframe-mode';
    var Default$6 = {
      scrollbarTheme: 'os-theme-light',
      scrollbarAutoHide: 'l',
      panelAutoHeight: true,
      panelAutoHeightMode: 'min-height',
      preloadDuration: 200,
      loginRegisterAutoHeight: true
    };
    /**
     * Class Definition
     * ====================================================
     */
  
    var Layout = /*#__PURE__*/function () {
      function Layout(element, config) {
        this._config = config;
        this._element = element;
      } // Public
  
  
      var _proto = Layout.prototype;
  
      _proto.fixLayoutHeight = function fixLayoutHeight(extra) {
        if (extra === void 0) {
          extra = null;
        }
  
        var $body = $__default["default"]('body');
        var controlSidebar = 0;
  
        if ($body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE_OPEN) || $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN) || extra === 'control_sidebar') {
          controlSidebar = $__default["default"](SELECTOR_CONTROL_SIDEBAR_CONTENT).outerHeight();
        }
  
        var heights = {
          window: $__default["default"](window).height(),
          header: $__default["default"](SELECTOR_HEADER).length > 0 ? $__default["default"](SELECTOR_HEADER).outerHeight() : 0,
          footer: $__default["default"](SELECTOR_FOOTER).length > 0 ? $__default["default"](SELECTOR_FOOTER).outerHeight() : 0,
          sidebar: $__default["default"](SELECTOR_SIDEBAR$1).length > 0 ? $__default["default"](SELECTOR_SIDEBAR$1).height() : 0,
          controlSidebar: controlSidebar
        };
  
        var max = this._max(heights);
  
        var offset = this._config.panelAutoHeight;
  
        if (offset === true) {
          offset = 0;
        }
  
        var $contentSelector = $__default["default"](SELECTOR_CONTENT);
  
        if (offset !== false) {
          if (max === heights.controlSidebar) {
            $contentSelector.css(this._config.panelAutoHeightMode, max + offset);
          } else if (max === heights.window) {
            $contentSelector.css(this._config.panelAutoHeightMode, max + offset - heights.header - heights.footer);
          } else {
            $contentSelector.css(this._config.panelAutoHeightMode, max + offset - heights.header);
          }
  
          if (this._isFooterFixed()) {
            $contentSelector.css(this._config.panelAutoHeightMode, parseFloat($contentSelector.css(this._config.panelAutoHeightMode)) + heights.footer);
          }
        }
  
        if (!$body.hasClass(CLASS_NAME_LAYOUT_FIXED)) {
          return;
        }
  
        if (typeof $__default["default"].fn.overlayScrollbars !== 'undefined') {
          $__default["default"](SELECTOR_SIDEBAR$1).overlayScrollbars({
            className: this._config.scrollbarTheme,
            sizeAutoCapable: true,
            scrollbars: {
              autoHide: this._config.scrollbarAutoHide,
              clickScrolling: true
            }
          });
        } else {
          $__default["default"](SELECTOR_SIDEBAR$1).css('overflow-y', 'auto');
        }
      };
  
      _proto.fixLoginRegisterHeight = function fixLoginRegisterHeight() {
        var $body = $__default["default"]('body');
        var $selector = $__default["default"](SELECTOR_LOGIN_BOX + ", " + SELECTOR_REGISTER_BOX);
  
        if ($body.hasClass(CLASS_NAME_IFRAME_MODE)) {
          $body.css('height', '100%');
          $__default["default"]('.wrapper').css('height', '100%');
          $__default["default"]('html').css('height', '100%');
        } else if ($selector.length === 0) {
          $body.css('height', 'auto');
          $__default["default"]('html').css('height', 'auto');
        } else {
          var boxHeight = $selector.height();
  
          if ($body.css(this._config.panelAutoHeightMode) !== boxHeight) {
            $body.css(this._config.panelAutoHeightMode, boxHeight);
          }
        }
      } // Private
      ;
  
      _proto._init = function _init() {
        var _this = this;
  
        // Activate layout height watcher
        this.fixLayoutHeight();
  
        if (this._config.loginRegisterAutoHeight === true) {
          this.fixLoginRegisterHeight();
        } else if (this._config.loginRegisterAutoHeight === parseInt(this._config.loginRegisterAutoHeight, 10)) {
          setInterval(this.fixLoginRegisterHeight, this._config.loginRegisterAutoHeight);
        }
  
        $__default["default"](SELECTOR_SIDEBAR$1).on('collapsed.lte.treeview expanded.lte.treeview', function () {
          _this.fixLayoutHeight();
        });
        $__default["default"](SELECTOR_MAIN_SIDEBAR).on('mouseenter mouseleave', function () {
          if ($__default["default"]('body').hasClass(CLASS_NAME_SIDEBAR_COLLAPSED$1)) {
            _this.fixLayoutHeight();
          }
        });
        $__default["default"](SELECTOR_PUSHMENU_BTN).on('collapsed.lte.pushmenu shown.lte.pushmenu', function () {
          setTimeout(function () {
            _this.fixLayoutHeight();
          }, 300);
        });
        $__default["default"](SELECTOR_CONTROL_SIDEBAR_BTN).on('collapsed.lte.controlsidebar', function () {
          _this.fixLayoutHeight();
        }).on('expanded.lte.controlsidebar', function () {
          _this.fixLayoutHeight('control_sidebar');
        });
        $__default["default"](window).resize(function () {
          _this.fixLayoutHeight();
        });
        setTimeout(function () {
          $__default["default"]('body.hold-transition').removeClass('hold-transition');
        }, 50);
        setTimeout(function () {
          var $preloader = $__default["default"](SELECTOR_PRELOADER);
  
          if ($preloader) {
            $preloader.css('height', 0);
            setTimeout(function () {
              $preloader.children().hide();
            }, 200);
          }
        }, this._config.preloadDuration);
      };
  
      _proto._max = function _max(numbers) {
        // Calculate the maximum number in a list
        var max = 0;
        Object.keys(numbers).forEach(function (key) {
          if (numbers[key] > max) {
            max = numbers[key];
          }
        });
        return max;
      };
  
      _proto._isFooterFixed = function _isFooterFixed() {
        return $__default["default"](SELECTOR_FOOTER).css('position') === 'fixed';
      } // Static
      ;
  
      Layout._jQueryInterface = function _jQueryInterface(config) {
        if (config === void 0) {
          config = '';
        }
  
        return this.each(function () {
          var data = $__default["default"](this).data(DATA_KEY$6);
  
          var _options = $__default["default"].extend({}, Default$6, $__default["default"](this).data());
  
          if (!data) {
            data = new Layout($__default["default"](this), _options);
            $__default["default"](this).data(DATA_KEY$6, data);
          }
  
          if (config === 'init' || config === '') {
            data._init();
          } else if (config === 'fixLayoutHeight' || config === 'fixLoginRegisterHeight') {
            data[config]();
          }
        });
      };
  
      return Layout;
    }();
    /**
     * Data API
     * ====================================================
     */
  
  
    $__default["default"](window).on('load', function () {
      Layout._jQueryInterface.call($__default["default"]('body'));
    });
    $__default["default"](SELECTOR_SIDEBAR$1 + " a").on('focusin', function () {
      $__default["default"](SELECTOR_MAIN_SIDEBAR).addClass(CLASS_NAME_SIDEBAR_FOCUSED);
    }).on('focusout', function () {
      $__default["default"](SELECTOR_MAIN_SIDEBAR).removeClass(CLASS_NAME_SIDEBAR_FOCUSED);
    });
    /**
     * jQuery API
     * ====================================================
     */
  
    $__default["default"].fn[NAME$6] = Layout._jQueryInterface;
    $__default["default"].fn[NAME$6].Constructor = Layout;
  
    $__default["default"].fn[NAME$6].noConflict = function () {
      $__default["default"].fn[NAME$6] = JQUERY_NO_CONFLICT$6;
      return Layout._jQueryInterface;
    };

  exports.CardWidget = CardWidget;
  exports.Fullscreen = Fullscreen;
  exports.Toasts = Toasts;
  exports.Treeview = Treeview;
  exports.PushMenu = PushMenu;
  exports.Layout = Layout;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=adminlte.js.map