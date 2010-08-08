$(document).ready(function() {

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
    
});
