(function ($) {
  Drupal.behaviors.clientsideValidationHtml5 = {
    attach: function (context) {
      $(document).bind('clientsideValidationAddCustomRules', function(event){
        jQuery.validator.addMethod("Html5Min", function(value, element, param) {
          //param[0] = min, param[1] = step;
          var mismatch = 0;
          if (param[1] != 'any') {
            mismatch = (value-param[0])%param[1]
          }
          return this.optional(element) || (mismatch == 0 && value >= param[0]);
        }, jQuery.format('Value must be greater than {0} with steps of {1}.'));

        jQuery.validator.addMethod("Html5Max", function(value, element, param) {
          //param[0] = max, param[1] = step;
          var mismatch = 0;
          if (param[1] != 'any') {
            mismatch = (value)%param[1]
          }
          return this.optional(element) || (mismatch == 0 && value <= param[0]);
        }, jQuery.format('Value must be smaller than {0} and must be dividable by {1}.'));

        jQuery.validator.addMethod("Html5Range", function(value, element, param) {
          //param[0] = min, param[1] = max, param[2] = step;
          var mismatch = 0;
          if (param[2] != 'any') {
            mismatch = (value-param[0])%param[2]
          }
          return this.optional(element) || (mismatch == 0 && value >= param[0] && value <= param[1]);
        }, jQuery.format('Value must be greater than {0} with steps of {2} and smaller than {1}.'));

        jQuery.validator.addMethod("Html5Color", function(value, element, param) {
          return /^#([a-f]|[A-F]|[0-9]){6}$/.test(value);
        }, jQuery.format('Value must be a valid color code'));
      });
    }
  }
})(jQuery);
