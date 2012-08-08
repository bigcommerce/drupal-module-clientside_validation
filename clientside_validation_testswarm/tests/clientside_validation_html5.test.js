(function ($, Drupal, window, document, undefined) {
  /**
 * Collapsible fields.
 */
  var formid = 'clientside-validation-testswarm-html5';
  var validator = {};
  $(document).bind('clientsideValidationInitialized', function (event){
    validator = Drupal.myClientsideValidation.validators[formid];
  });
  Drupal.tests.cvfapi = {
    getInfo: function() {
      return {
        name: Drupal.t('Clientside Validation HTML5'),
        description: Drupal.t('Test Clientside Validation on HTML5 elements.'),
        group: Drupal.t('Clientside Validation')
      };
    },
    tests: {
      html5Numeric: function ($, Drupal, window, document, undefined) {
        return function() {
          expect(3);
          // Validate the empty form.
          validator.form();

          // Check for the "HTML 5 number element" error.
          equal($('label[for=edit-mynumber].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 number element "'));

          // Fill in the "HTML 5 number element" textfield with a letter
          $('#edit-mynumber').val("a");

          // Validate the form.
          validator.form();

          // Check for the "HTML 5 number element" error.
          equal($('label[for=edit-mynumber].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 number element"'));

          // Fill in the "HTML 5 number element" textfield with a valid number
          $('#edit-mynumber').val("1.5");

          // Validate the form.
          validator.form();

          // Check for the "HTML 5 number element" error.
          equal($('label[for=edit-mynumber].error:visible').length, 0, Drupal.t('Error label not found for "HTML 5 number element"'));
        }
      },
      html5Url: function ($, Drupal, window, document, undefined) {
        return function() {
          expect(3);
          // Validate the form.
          validator.form();

          // Check for the error.
          equal($('label[for=edit-myurl].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 url element"'));

          // Fill in the field with an illegal URL
          $('#edit-myurl').val("oops");

          // Validate the form.
          validator.form();

          // Check for the error.
          equal($('label[for=edit-myurl].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 url element"'));

          // Fill in the field with an URL
          $('#edit-myurl').val("http://example.com");

          // Validate the form.
          validator.form();

          // Check for the "HTML 5 url element" error.
          equal($('label[for=edit-myurl].error:visible').length, 0, Drupal.t('Error label not found for "HTML 5 url element"'));
        }
      },
      html5Email: function ($, Drupal, window, document, undefined) {
        return function() {
          expect(3);

          // Validate the form.
          validator.form();

          // Check for the error.
          equal($('label[for=edit-myemail].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 email element"'));

          // Fill in the field with an illegal email
          $('#edit-myemail').val("oops");

          // Validate the form.
          validator.form();

          // Check for the error.
          equal($('label[for=edit-myemail].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 email element"'));

          // Fill in the field with an URL
          $('#edit-myemail').val("test@example.com");

          // Validate the form.
          validator.form();

          // Check for the "HTML 5 url element" error.
          equal($('label[for=edit-myemail].error:visible').length, 0, Drupal.t('Error label not found for "HTML 5 email element"'));
        }
      },
      html5Range: function ($, Drupal, window, document, undefined) {
        return function() {
          expect(6);

          // Replace the HTML5 range element with a textfield so we can actually fill in illegal values
          if ($.browser.msie === true) {
            var myrange = document.getElementById('edit-myrange');
            var el = document.createElement("input");
            el.setAttribute("type", "text");
            myrange.mergeAttributes(el, true);
          }
          else {
            var $oldrange = $('#edit-myrange')
            var $myrange = $oldrange.clone();
            $myrange.attr('type', 'text');
            $myrange.insertBefore($oldrange);
            $oldrange.remove();
          }

          // Clear the value, range elements always have a default.
          $('#edit-myrange').val('');

          // Validate the form.
          validator.form();

          // Check for the error.
          equal($('label[for=edit-myrange].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 range element"'));

          // Fill in the field with an illegal value
          $('#edit-myrange').val("oops");

          // Validate the form.
          validator.form();

          // Check for the error.
          equal($('label[for=edit-myrange].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 range element"'));

          // Fill in the field with an illegal number (wrong format according to the 'step' attribute).
          $('#edit-myrange').val("2.1");

          // Validate the form.
          validator.form();

          // Check for the error.
          equal($('label[for=edit-myrange].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 range element"'));

          // Fill in the field with an illegal number (smaller than minimum).
          $('#edit-myrange').val("1");

          // Validate the form.
          validator.form();

          // Check for the error.
          equal($('label[for=edit-myrange].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 range element"'));

          // Fill in the field with an illegal number (larger than maximum).
          $('#edit-myrange').val("6");

          // Validate the form.
          validator.form();

          // Check for the error.
          equal($('label[for=edit-myrange].error:visible').length, 1, Drupal.t('Error label found for "HTML 5 range element"'));

          // Fill in the field with an correct number.
          $('#edit-myrange').val("2.5");

          // Validate the form.
          validator.form();

          // Check for the error.
          equal($('label[for=edit-myrange].error:visible').length, 0, Drupal.t('Error label not found for "HTML 5 email element"'));
        }
      },
      html5NumericMin: function ($, Drupal, window, document, undefined) {
        return function () {
          expect(4);

          // Validate the empty field.
          $('#edit-mynumbermin').val("");
          validator.form();
          equal($('label[for=edit-mynumbermin].error:visible').length, 1, Drupal.t('Empty value'));

          // Enter a letter
          $('#edit-mynumbermin').val("a");
          validator.form();
          equal($('label[for=edit-mynumbermin].error:visible').length, 1, Drupal.t('Numbers only'));

          // Enter a number out of range
          $('#edit-mynumbermin').val("1");
          validator.form();
          equal($('label[for=edit-mynumbermin].error:visible').length, 1, Drupal.t('Number out of range'));

          // Enter a valid number
          $('#edit-mynumbermin').val("999");
          validator.form();
          equal($('label[for=edit-mynumbermin].error:visible').length, 0, Drupal.t('Valid value'));
        }
      },
      html5NumericMax: function ($, Drupal, window, document, undefined) {
        return function () {
          expect(4);

          // Validate the empty field.
          $('#edit-mynumbermax').val("");
          validator.form();
          equal($('label[for=edit-mynumbermax].error:visible').length, 1, Drupal.t('Empty value'));

          // Enter a letter
          $('#edit-mynumbermax').val("a");
          validator.form();
          equal($('label[for=edit-mynumbermax].error:visible').length, 1, Drupal.t('Numbers only'));

          // Enter a number out of range
          $('#edit-mynumbermax').val("999");
          validator.form();
          equal($('label[for=edit-mynumbermax].error:visible').length, 1, Drupal.t('Number out of range'));

          // Enter a valid number
          $('#edit-mynumbermax').val("1");
          validator.form();
          equal($('label[for=edit-mynumbermax].error:visible').length, 0, Drupal.t('Valid value'));
        }
      },
      html5NumericMinMax: function ($, Drupal, window, document, undefined) {
        return function () {
          expect(5);

          // Validate the empty field.
          $('#edit-mynumberminmax').val("");
          validator.form();
          equal($('label[for=edit-mynumberminmax].error:visible').length, 1, Drupal.t('Empty value'));

          // Enter a letter
          $('#edit-mynumberminmax').val("a");
          validator.form();
          equal($('label[for=edit-mynumberminmax].error:visible').length, 1, Drupal.t('Numbers only'));

          // Enter a number out of range
          $('#edit-mynumberminmax').val("1");
          validator.form();
          equal($('label[for=edit-mynumberminmax].error:visible').length, 1, Drupal.t('Number out of range'));

          // Enter a number out of range
          $('#edit-mynumberminmax').val("999");
          validator.form();
          equal($('label[for=edit-mynumberminmax].error:visible').length, 1, Drupal.t('Number out of range'));

          // Enter a valid number
          $('#edit-mynumberminmax').val("50.33");
          validator.form();
          equal($('label[for=edit-mynumberminmax].error:visible').length, 0, Drupal.t('Valid value'));
        }
      },
      html5NumericInteger: function ($, Drupal, window, document, undefined) {
        return function () {
          expect(6);

          // Validate the empty field.
          $('#edit-mynumberint').val("");
          validator.form();
          equal($('label[for=edit-mynumberint].error:visible').length, 1, Drupal.t('Empty value'));

          // Enter a letter
          $('#edit-mynumberint').val("a");
          validator.form();
          equal($('label[for=edit-mynumberint].error:visible').length, 1, Drupal.t('Numbers only'));

          // Enter a number out of range
          $('#edit-mynumberint').val("1");
          validator.form();
          equal($('label[for=edit-mynumberint].error:visible').length, 1, Drupal.t('Number out of range'));

          // Enter a number out of range
          $('#edit-mynumberint').val("1.5");
          validator.form();
          equal($('label[for=edit-mynumberint].error:visible').length, 1, Drupal.t('Number out of range'));

          // Enter an invalid number in range
          $('#edit-mynumberint').val("7.77");
          validator.form();
          equal($('label[for=edit-mynumberint].error:visible').length, 1, Drupal.t('Invalid number in range'));

          // Enter a valid number
          $('#edit-mynumberint').val("56");
          validator.form();
          equal($('label[for=edit-mynumberint].error:visible').length, 0, Drupal.t('Valid value'));
        }
      }

    }
  };
})(jQuery, Drupal, this, this.document);