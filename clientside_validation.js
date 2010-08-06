$(document).ready(function() {

  jQuery.validator.addMethod("checkboxgroupminmax", function(value, element, param) { 
    var validOrNot = $(param[2] + ' input:checked').length >= param[0] && $(param[2] + ' input:checked').length <= param[1];
    
    if(!$(element).data('being_validated')) {
      var fields = $(param[2] + ' input');
      fields.data('being_validated', true).valid();
      fields.data('being_validated', false);
    }
    
    return validOrNot;
    
  }, jQuery.format('Minimum {0}, maximum {1}'));

});
