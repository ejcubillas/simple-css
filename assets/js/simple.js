
var Simple = (function () {

  function addCSS (css = {}, element) {
    // adding css properties
    var cssProperties = Object.keys(css);
    cssProperties.forEach(function (property) {
      element.style[property] = css[property];
    });
  }

  function getCSSValue (property, element) {
    return element.style[property];
  }


  var inputField = document.querySelectorAll('.field');
  
  inputField.forEach(function (element) {
    // if .input-field clicked, focus input child 
    element.addEventListener('click', function () {
      var input = element.querySelector('input');
      
      if (input !== null) {
        input.focus();
        
        // icons in form
        try {
          var icons = element.querySelectorAll('i.field-icon');
          input.addEventListener('focusout', function () {
            icons.forEach(function(element) {
              addCSS({'opacity':.3}, element);  
            });
            
          });

          icons.forEach(function(element) {
            addCSS({'opacity':1}, element);  
          });

        } catch (error) {
        
        } // end try 
      }  
    });

    // removing padding of .input-field if child is select
    var select = element.querySelector('select');
    if (select !== null) {
      addCSS({
        'padding-right': 0,
        'padding-left': 0,
      }, select.parentElement);
      
      // height of select tag, should be equal to its parent  
      addCSS({
        'height': getCSSValue('height',select.parentElement),
      }, select);
    }

    var textarea = element.querySelector('textarea');
    if (textarea !== null) {
      addCSS({
        'padding': 0,
        'height': 'auto',
        'align-items': 'flex-start'
      }, textarea.parentElement);
    }
 
 }); // end forEach main

  


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

