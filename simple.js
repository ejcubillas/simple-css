
var Simple = (function () {

  function whichTransitionEvent(){
    // function to choose what animation/ tranistion event will be binded
    var t,
        el = document.createElement("fakeelement");

    var transitions = {
      "animation":"animationend",
      "transition"      : "transitionend",
      "OTransition"     : "oTransitionEnd",
      "MozTransition"   : "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions){
      if (el.style[t] !== undefined){
        return transitions[t];
      }
    }
  }

  function getOffset (element) {
    // get (x,y) position of an element
    return {left: element.offsetLeft, top: element.offsetTop};
    
  }

  function endOfAnimation (el, callback = function () {}) {
    // function to detect the end of the animation
    var transitionEvent = whichTransitionEvent();
    transitionEvent && el.addEventListener(transitionEvent, callback);
  }

  function addClass (className, element) {
    // css
    element.classList.add(className);
  }
  
  function removeClass (className, element) {
    // css
    element.classList.remove(className);
  }

  function hasClass (className, element) {
    // check if en element has the selected class
    if (element.classList.contains(className)) {
      return 1;
    }
    return 0;
  }


  function addCSS (css = {}, element) {
    // adding css properties
    var cssProperties = Object.keys(css);
    cssProperties.forEach(function (property) {
      element.style[property] = css[property];
    });
  }

  function getCSSValue (property, element) {
    var style = window.getComputedStyle(element);
    // top = ;
    return style.getPropertyValue(property);
    // return element.style[];
  }

  // MODALS
  var Modals = {
    init: function () {
      Modals.modalTriggers = document.querySelectorAll('[data-trigger="modal"]');
      Modals.modalCloseBtn = document.querySelectorAll('div.modal [data-action="modal-close"]');
      
      Modals.events();

    
    }, 

    events: function () {
      // events, run, bind auto
      Array.prototype.forEach.call(Modals.modalTriggers, function (triggers) {
        // event for all buttons that opens the modal
        triggers.addEventListener('click', function (e) {
          e.preventDefault();
          Modals.methods.show(triggers.getAttribute('data-target'));
          
        });
      });
      // Modals.modalTriggers.forEach();

    }, // END EVENTS

    bindEvents: {
      // events or methods
      // call to bind
      bindCloseModal: function (closeBtn) {
        // console.log(typeof closeBtn);
        if (typeof closeBtn == 'object') {
          closeBtn.forEach(function (btn) {
            bind(btn);
          });
        }

        function bind (btn) {
          btn.addEventListener('click', function (e) {
            Modals.methods.hide();
            e.preventDefault();
          });
        }
        
      },

      setModalContentHeight: function (element) {
        var elementBaseHeight = parseInt(getCSSValue('height', element), 10);
        function setHeight () {
          var content = element.querySelector('div.modal-content');
          var header = element.querySelector('div.modal-header');
          var footer = element.querySelector('div.modal-footer');
          var elementHeight = (element === null) ? 0 : parseInt(getCSSValue('height', element), 10);
          var headerHeight = (header === null) ? 0 : parseInt(getCSSValue('height', header), 10);
          var footerHeight = (footer === null) ? 0 : parseInt(getCSSValue('height', footer), 10);
          var totalHeight = 0;

          if (!element.classList.contains('fixed-footer')) {
            footerHeight = 0;
            if (footer !== null) {
              content.appendChild(footer);  
            }
            
            
            addCSS({
              'padding-bottom': '0px'
            }, content);
            // footer.remove();
          }

          var body = document.body,
          html = document.documentElement;
          var height = Math.max( body.scrollHeight, body.offsetHeight);
          // console.log(height);
          if (height >= elementBaseHeight) {
            addCSS({
              'height': elementBaseHeight
            }, element); 
          }

          totalHeight  = elementHeight - headerHeight - footerHeight;
          
          addCSS({
            'height' : totalHeight
          }, content);
        }
        setHeight();
        window.addEventListener('resize', function () {
          setHeight();
        });
          

      }
    },
   
    methods: {

      show: function (targetSelector) {
        // method for showing modal
        var body = document.querySelector('body');
        var targetModal = document.querySelector('div.modal' + targetSelector).outerHTML;
        var modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = targetModal;
        body.insertBefore(modalOverlay, body.firstChild);
        
        document.querySelector('body').classList.add('modal-open');
        
        addCSS({
          'display':'block'
        }, modalOverlay);
        
        addCSS({
          'display':'block'
        }, modalOverlay.querySelector('div.modal'));

        // modal animation -- entrance
        var selectedAnimation = modalOverlay.querySelector('div.modal').getAttribute('data-animate-entrance');
        if (selectedAnimation === null || selectedAnimation === '') {
          selectedAnimation = 'animate';
          addClass(selectedAnimation, modalOverlay.querySelector('div.modal'));
        }else if (selectedAnimation === 'none') {

        }else {
          console.log(selectedAnimation);
          addClass(selectedAnimation, modalOverlay.querySelector('div.modal'));
        }
        endOfAnimation(modalOverlay.querySelector('div.modal'), function () {
          removeClass(selectedAnimation, modalOverlay.querySelector('div.modal'));
        });
        // end modal animation

        Modals.bindEvents.bindCloseModal(modalOverlay.querySelectorAll('[data-action="modal-close"]'));
        
        Modals.bindEvents.setModalContentHeight(modalOverlay.querySelector('div.modal'));

      },

      hide: function () {
        // method for hiding modal
        // modal animation -- exit
        var modalOverlay = document.querySelector('div.modal-overlay');
        var selectedAnimation = modalOverlay.querySelector('div.modal').getAttribute('data-animate-exit');
        if (selectedAnimation === null || selectedAnimation === '') {
          addClass('animate-exit', modalOverlay.querySelector('div.modal'));
        }else if (selectedAnimation === 'none') {

        }else {
          addClass(selectedAnimation, modalOverlay.querySelector('div.modal'));
        }

        addClass('animate-exit', modalOverlay);
        endOfAnimation(modalOverlay.querySelector('div.modal'), function () {
          modalOverlay.remove();
          document.querySelector('body').classList.remove('modal-open');
          
        });
        // end modal animation

        
      }
    } // end methods

  }; // END Modals

  Modals.init();


  var SideNav = {
    triggers: document.querySelectorAll('[data-trigger="sidenav"]'),
    init: function () {
      console.log(SideNav.triggers);
      SideNav.events();
    },
    events: function () {
      Array.prototype.forEach.call(SideNav.triggers, function (trigger) {
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          SideNav.methods.toggle(trigger.getAttribute('data-target'));
        });
      });
      // SideNav.triggers.forEach();

    }, // end events

    bindEvents: {
      clickSidenavOverlay: function (overlay, sidenav) {
        overlay.addEventListener('click', function () {
          SideNav.methods.hide(sidenav);
        });
      }

    },

    methods: {
      toggle: function (selector) {
        var sidenav = document.querySelector(selector);
        if (sidenav !== null) {
          if (!hasClass('open', sidenav)) {
            console.log('good');
            SideNav.methods.show(sidenav);
          }else {
            SideNav.methods.hide(sidenav);
          }
          
        } // end if
      },
      show: function (sidenav) {
        
        var body = document.querySelector('body');
        var overlay = document.createElement('div');
        overlay.className = 'overlay-edit fadeIn';

        overlay.setAttribute('id','sidenav-overlay');
        addCSS({
          'display':'block',
        }, overlay);
        body.insertBefore(overlay, sidenav);
        SideNav.bindEvents.clickSidenavOverlay(overlay,sidenav);
        addClass('open', sidenav);
        addClass('no-scroll', body);
      },

      hide: function (sidenav) {
        removeClass('open', sidenav);
        addClass('fadeOut', document.querySelector('#sidenav-overlay'));
        endOfAnimation(document.querySelector('#sidenav-overlay'), function () {
          // removeClass(selectedAnimation, modalOverlay.querySelector('div.modal'));
          removeClass('no-scroll', document.querySelector('body'));
          document.querySelector('#sidenav-overlay').remove();
        });
      }
    } // end methods
  }; // end sidenav

  SideNav.init();

  
  var Dropdown = {
    
    init: function () {
      Dropdown.dropdownBtns = document.querySelectorAll('.dropdown');
      Dropdown.events();
    },
    
    events: function () {
      Array.prototype.forEach.call(Dropdown.dropdownBtns, function (btn) {
        var content = document.querySelector('#' + btn.getAttribute('data-target'));
      
        btn.addEventListener('focusout', function (e) {
          Dropdown.methods.hide(btn, content);
        });
        btn.addEventListener('keyup', function (e) {
          if (e.key.toLowerCase() === 'escape') {
            Dropdown.methods.hide(btn, content); 
          }
        });
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          if (getCSSValue('visibility', content) === 'hidden') {
            Dropdown.methods.show(btn, content);
          }else {
              Dropdown.methods.hide(btn, content);
              
          }
          
        });
      });
      // .forEach();

    }, // end events

    methods: {
      show: function (btn, content) {
        
        addCSS({
          top: getOffset(btn).top + parseInt(getCSSValue('height', btn), 10),
          left: getOffset(btn).left,
          visibility:'visible'
        }, content);

      },

      hide: function (btn, content) {
        addCSS({visibility:'hidden'}, content);
      }

    }
  };

  Dropdown.init();


  // selector
  return (function (selector = '') {
    var q = {};
    q.selector = selector;
    q.element = document.querySelectorAll(selector);
    q.css = function (css) {
      q.element.forEach(function (element) {
        addCSS(css, element);
      });
      
    }; 
    return q;
  });

})();


/// other methods here

