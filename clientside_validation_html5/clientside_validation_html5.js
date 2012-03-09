(function ($) {
  Drupal.behaviors.clientsideValidationHtml5 = {
    attach: function (context) {
      $(document).bind('clientsideValidationAddCustomRules', function(event){
        jQuery.validator.addMethod("Html5Min", function(value, element, param) {
          var exp = 0;
          if (value.indexOf('.')) {
            exp = value.length - value.indexOf('.') - 1;
          }
          var multiplier = Math.pow(10, exp);

          value = parseInt(parseFloat(value) * multiplier);
          var min = parseInt(parseFloat(param[0]) * multiplier);

          //param[0] = min, param[1] = step;
          var mismatch = 0;
          if (param[1] != 'any') {
            var step = parseInt(parseFloat(param[1]) * multiplier);
            mismatch = (value-min)%step
          }
          return this.optional(element) || (mismatch == 0 && value >= min);
        }, jQuery.format('Value must be greater than {0} with steps of {1}.'));

        jQuery.validator.addMethod("Html5Max", function(value, element, param) {
          var exp = 0;
          if (value.indexOf('.')) {
            exp = value.length - value.indexOf('.') - 1;
          }
          var multiplier = Math.pow(10, exp);

          value = parseInt(parseFloat(value) * multiplier);
          var max = parseInt(parseFloat(param[0]) * multiplier);

          //param[0] = max, param[1] = step;
          var mismatch = 0;
          if (param[1] != 'any') {
            var step = parseInt(parseFloat(param[1]) * multiplier);
            mismatch = (value)%step
          }
          return this.optional(element) || (mismatch == 0 && value <= max);
        }, jQuery.format('Value must be smaller than {0} and must be dividable by {1}.'));

        jQuery.validator.addMethod("Html5Range", function(value, element, param) {
          var exp = 0;
          if (value.indexOf('.')) {
            exp = value.length - value.indexOf('.') - 1;
          }
          var multiplier = Math.pow(10, exp);

          value = parseInt(parseFloat(value) * multiplier);
          var min = parseInt(parseFloat(param[0]) * multiplier);
          var max = parseInt(parseFloat(param[1]) * multiplier);
          
          var mismatch = 0;
          if (param[2] != 'any') {
            var step = parseInt(parseFloat(param[2]) * multiplier);
            mismatch = (value-min)%step;
          }
          return this.optional(element) || (mismatch == 0 && value >= min && value <= max);
        }, jQuery.format('Value must be greater than {0} with steps of {2} and smaller than {1}.'));

        jQuery.validator.addMethod("Html5Color", function(value, element, param) {
          return /^#([a-f]|[A-F]|[0-9]){6}$/.test(value);
        }, jQuery.format('Value must be a valid color code'));
      });
    }
  }
})(jQuery);
