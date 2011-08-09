(function ($) {
  Drupal.behaviors.clientsideValidationHtml5 = {
    attach: function (context) {
      $(document).bind('clientsideValidationAddCustomRules', function(event){
        jQuery.validator.addMethod("Html5Number", function(value, element, param) {

          
        }, jQuery.format('Please enter only digits.'));
      });
    }
  }
})(jQuery);

