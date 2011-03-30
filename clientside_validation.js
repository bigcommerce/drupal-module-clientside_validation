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
    // Add error container above the form, first look for standard message container
    var errorel = self.prefix + f + '-errors';
    if ($('div.messages').length) {
      if ($('div.messages').attr('id').length) {
        errorel = $('div.messages').attr('id');
      }
      else {
        $('div.messages').attr('id', errorel);
      }
    }
    else if (!$('#' + errorel).length) {
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
    
    // Remove class rules
    jQuery.validator.removeClassRules('number');

    // Bind all rules
    self.bindRules(f);
  });
}

Drupal.clientsideValidation.prototype.bindRules = function(formid){
  var self = this;
  if('checkboxrules' in self.forms[formid]){
    jQuery.each (self.forms[formid]['checkboxrules'], function(r) {
      $("#" + formid + ' :input[type="checkbox"]').addClass('require-one');
    });
    jQuery.each (self.forms[formid]['checkboxrules'], function(r) {
      // Check if element exist in DOM before adding the rule
      var i = 0;
      if ($("#" + formid + " .require-one").length) {
        $("#" + formid + " .require-one").each(function(){
          if(i>0){
            self.forms[formid]['checkboxrules'][r]['messages']['checkboxgroupminmax'] = ' ';
          }
          $(this).rules("add", self.forms[formid]['checkboxrules'][r]);
          i++;
        });
      }
    });
  }
  if('rules' in self.forms[formid]){
    jQuery.each (self.forms[formid]['rules'], function(r) {
      // Check if element exist in DOM before adding the rule
      if ($("#" + formid + " :input[name='" + r + "']").length) {
        $("#" + formid + " :input[name='" + r + "']").rules("add", self.forms[formid]['rules'][r]);
      }
    });
  }


}

Drupal.clientsideValidation.prototype.addExtraRules = function(){

  jQuery.validator.addMethod("numberDE", function(value, element) { 
    return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
  });
  
  // Min a and maximum b checkboxes from a group
  jQuery.validator.addMethod("checkboxgroupminmax", function(value, element, param) { 
    var validOrNot = $(param[2] + ' input:checked').length >= param[0] && $(param[2] + ' input:checked').length <= param[1];
    
    /* This gives problems */
    /*
    if(!$(element).data('being_validated')) {
      var fields = $(param[2] + ' input');
      fields.data('being_validated', true).valid();
      fields.data('being_validated', false);
    }
    */
    
    return validOrNot;
    
  }, jQuery.format('Minimum {0}, maximum {1}'));

  // Allow integers, same as digits but including a leading '-'
  jQuery.validator.addMethod("digits_negative", function(value, element, param) { 
    return this.optional(element) || /^-?\d+$/.test(value);
  }, jQuery.format('Please enter only digits.'));

  // One of the values
  jQuery.validator.addMethod("oneOf", function(value, element, param) { 
    for (var p in param) {
      if (param[p] == value) {
        return true;
        break;
      }
    }
    return false;
  }, jQuery.format(''));

  // Unique values
  jQuery.validator.addMethod("notEqualTo", function(value, element, param) { 
    var target = $(param).unbind(".validate-notEqualTo").bind("blur.validate-notEqualTo", function() {
      $(element).valid();
    });
    return value != target.val();
  }, jQuery.format('Please don\'t enter the same value again.'));
  
  // EAN code
  jQuery.validator.addMethod("validEAN", function(value, element, param) { 
    if (this.optional(element) && value == '') {
      return this.optional(element);
    }
    else {
      if (value.length > 13) {
        return false;
      }
      else if (value.length != 13) {
        value = '0000000000000'.substr(0, 13 - value.length).concat(value);
      }
      if (value == '0000000000000') {
        return false;
      }
      if (parseInt(value) == NaN || parseInt(value) == 0) {
        return false;
      }
      var runningTotal = 0;
      for (var c = 0; c < 12; c++) {
        if (c % 2 == 0) {
          runningTotal += 3 * parseInt(value.substr(c, 1));
        }
        else {
          runningTotal += parseInt(value.substr(c, 1));
        }
      }
      var rem = runningTotal % 10;
      if (rem != 0) {
        rem = 10 - rem;
      }
      
      return rem == parseInt(value.substr(12, 1));
      
    }
  }, jQuery.format('Not a valid EAN number.'));
  
}

})(jQuery);