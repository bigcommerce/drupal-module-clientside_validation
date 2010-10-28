(function ($) {
  Drupal.behaviors.clientsideValidation = {
    attach: function (context) {
      if (!Drupal.myClientsideValidation) {
        Drupal.myClientsideValidation = new Drupal.clientsideValidation();
      }
      else {
        Drupal.myClientsideValidation.bindForms();
      }
    }
  }

  Drupal.clientsideValidation = function() {
    var self = this;
    this.prefix = 'clientsidevalidation-';
    this.data = Drupal.settings.clientsideValidation;
    this.forms = this.data['forms'];
    this.validators = {};
    this.addExtraRules();
    this.bindForms();
  };

  Drupal.clientsideValidation.prototype.bindForms = function(){
    var self = this;
    jQuery.each (self.forms, function(f) {
      // Add error container above the form
      var errorel = self.prefix + f + '-errors';
      if (!$('#' + errorel).length) {
        $('<div id="' + errorel + '" class="messages error clientside-error"><ul></ul></div>').insertBefore('#' + f).hide();
      }
      
      // Remove any existing validation stuff
      if (self.validators[f]) {
        // Doesn't work :: $('#' + f).rules('remove');
        var form = $('#' + f).get(0); 
        jQuery.removeData(form, 'validator');
      }
      
      // Add basic settings
      self.validators[f] = $('#' + f).validate({
        errorClass: 'error',
        errorContainer: '#' + errorel,
        errorLabelContainer: '#' + errorel + ' ul',
        wrapper: 'li'
      });

      // Bind all rules
      self.bindRules(f);
    });
  }

  Drupal.clientsideValidation.prototype.bindRules = function(formid){
    var self = this;
    jQuery.each (self.forms[formid]['rules'], function(r) {
      // Check if element exist in DOM before adding the rule
      if ($("#" + formid + " :input[name='" + r + "']").length) {
        $("#" + formid + " :input[name='" + r + "']").rules("add", self.forms[formid]['rules'][r]);
      }
    });
  }

  Drupal.clientsideValidation.prototype.addExtraRules = function(){

    // Min a and maximum b checkboxes from a group
    jQuery.validator.addMethod("checkboxgroupminmax", function(value, element, param) { 
      var validOrNot = $(param[2] + ' input:checked').length >= param[0] && $(param[2] + ' input:checked').length <= param[1];
      
      if(!$(element).data('being_validated')) {
        var fields = $(param[2] + ' input');
        fields.data('being_validated', true).valid();
        fields.data('being_validated', false);
      }
      
      return validOrNot;
      
    }, jQuery.format('Minimum {0}, maximum {1}'));

    // Allow integers, same as digits but including a leading '-'
    jQuery.validator.addMethod("digits_negative", function(value, element, param) { 
      return this.optional(element) || /^-?\d+$/.test(value);
    }, jQuery.format('Please enter only digits.'));
      
  }
})(jQuery);