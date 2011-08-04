(function ($) {
  Drupal.behaviors.clientsideValidation = {
    attach: function (context) {
      if (!Drupal.myClientsideValidation) {
        Drupal.myClientsideValidation = new Drupal.clientsideValidation();
      }
      else {
        // Update the settings
        Drupal.myClientsideValidation.data = Drupal.settings.clientsideValidation;
        Drupal.myClientsideValidation.forms = Drupal.myClientsideValidation.data['forms'];
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
    this.groups = {};
    this.addExtraRules();
    this.bindForms();
  };

  Drupal.clientsideValidation.prototype.findVerticalTab = function(element) {
    element = $(element);

    // Check for the vertical tabs fieldset and the verticalTab data
    var fieldset = element.parents('fieldset.vertical-tabs-pane');
    if ((fieldset.size() > 0) && (typeof(fieldset.data('verticalTab')) != 'undefined')) {
      var tab = $(fieldset.data('verticalTab').item[0]).find('a');
      if (tab.size()) {
        return tab;
      }
    }

    // Return null by default
    return null;
  }

  Drupal.clientsideValidation.prototype.bindForms = function(){
    var self = this;
    jQuery.each (self.forms, function(f) {
      self.groups[f] = {};
      // Add error container above the form, first look for standard message container
      var errorel = self.prefix + f + '-errors';
      if ($('div.messages.error').length) {
        if ($('div.messages.error').attr('id').length) {
          errorel = $('div.messages.error').attr('id');
        }
        else {
          $('div.messages.error').attr('id', errorel);
        }
      }
      else if (!$('#' + errorel).length) {
        $('<div id="' + errorel + '" class="messages error clientside-error"><ul></ul></div>').insertBefore('#' + f).hide();
      }

      // Remove any existing validation stuff
      if (self.validators[f]) {
        // Doesn't work :: $('#' + f).rules('remove');
        var form = $('#' + f).get(0);
        if (typeof(form) != 'undefined') {
          jQuery.removeData(form, 'validator');
        }
      }

      if('checkboxrules' in self.forms[f]){
        groupkey = "";
        jQuery.each (self.forms[f]['checkboxrules'], function(r) {
          groupkey = r + '_group';
          self.groups[f][groupkey] = "";
          jQuery.each(this, function(){
            i = 0;
            $(this[2] + ' input[type=checkbox]').each(function(){
              if(i > 0){
                self.groups[f][groupkey] += ' ';
              }
              self.groups[f][groupkey] += $(this).attr('name');
              i++;
            });
          });
        });
      }

      // Add basic settings
      //@todo: find cleaner fix
      // ugly fix for nodes in colorbox
      if(typeof $('#' + f).validate == 'function') {
        var validate_options = {
          errorClass: 'error',
          errorContainer: '#' + errorel,
          errorLabelContainer: '#' + errorel + ' ul',
          wrapper: 'li',
          groups: self.groups[f],
          unhighlight: function(element, errorClass, validClass) {
            // Default behavior
            $(element).removeClass(errorClass).addClass(validClass);

            // Sort the classes out for the tabs - we only want to remove the
            // highlight if there are no inputs with errors...
            var fieldset = $(element).parents('fieldset.vertical-tabs-pane');
            if (fieldset.size() && fieldset.find('.' + errorClass).size() == 0) {
              var tab = self.findVerticalTab(element);
              if (tab) {
                tab.removeClass(errorClass).addClass(validClass);
              }
            }
          },
          highlight: function(element, errorClass, validClass) {
            // Default behavior
            $(element).addClass(errorClass).removeClass(validClass);

            // Sort the classes out for the tabs
            var tab = self.findVerticalTab(element);
            if (tab) {
              tab.addClass(errorClass).removeClass(validClass);
            }
      		},
          invalidHandler: function(form, validator) {
            if (validator.errorList.length > 0) {
              // Check if any of the errors are in the selected tab
              var errors_in_selected = false;
              for (var i = 0; i < validator.errorList.length; i++) {
                var tab = self.findVerticalTab(validator.errorList[i].element);
                if (tab && tab.parent().hasClass('selected')) {
                  errors_in_selected = true;
                  break;
                }
              }

              // Only focus the first tab with errors if the selected tab doesn't have
              // errors itself. We shouldn't hide a tab that contains errors!
              if (!errors_in_selected) {
                var tab = self.findVerticalTab(validator.errorList[0].element);
                if (tab) {
                  tab.click();
                }
              }
            }
          }
        };

        if (!self.forms[f].includeHidden) {
          validate_options.ignore = ':input:hidden';
        }
        if(self.data.general.validateTabs) {
          validate_options.ignore += ' :not(.vertical-tabs-pane:input)';
        }
        self.validators[f] = $('#' + f).validate(validate_options);

        // Remove class rules
        jQuery.validator.removeClassRules('number');
        jQuery.validator.removeClassRules('required');
        jQuery.validator.removeClassRules('email');
        jQuery.validator.removeClassRules('url');
        jQuery.validator.removeClassRules('date');
        jQuery.validator.removeClassRules('dateISO');
        jQuery.validator.removeClassRules('dateDE');
        jQuery.validator.removeClassRules('digits');
        jQuery.validator.removeClassRules('creditcard');

        // Bind all rules
        self.bindRules(f);

      }
    });
  }

  Drupal.clientsideValidation.prototype.bindRules = function(formid){
    var self = this;
    if('checkboxrules' in self.forms[formid]){
      jQuery.each (self.forms[formid]['checkboxrules'], function(r) {
        $("#" + formid + " " + this['checkboxgroupminmax'][2] + ' :input[type="checkbox"]').addClass('require-one');
      });
      jQuery.each (self.forms[formid]['checkboxrules'], function(r) {
        // Check if element exist in DOM before adding the rule
        if ($("#" + formid + " " + this['checkboxgroupminmax'][2] + " .require-one").length) {
          $("#" + formid + " " + this['checkboxgroupminmax'][2] +  " .require-one").each(function(){
            $(this).rules("add", self.forms[formid]['checkboxrules'][r]);
            $(this).change(function(){
              //wait just one milisecond until the error div is updated
              window.setTimeout(function(){
                var visibles = 0;
                $("div.messages.error ul li").each(function(){
                  if($(this).is(':visible')){
                    visibles++;
                  }
                  else {
                    $(this).remove();
                  }
                });
                if(visibles < 1){
                  $("div.messages.error").hide();
                }
              }, 1);
            });
          });
        }
      });
    }
    if('rules' in self.forms[formid]){
      jQuery.each (self.forms[formid]['rules'], function(r) {
        // Check if element exist in DOM before adding the rule
        if ($("#" + formid + " :input[name='" + r + "']").length) {
          $("#" + formid + " :input[name='" + r + "']").rules("add", self.forms[formid]['rules'][r]);
          $("#" + formid + " :input[name='" + r + "']").change(function(){
            //wait just one millisecond until the error div is updated
            window.setTimeout(function(){
              var visibles = 0;
              $("div.messages.error ul li").each(function(){
                if($(this).is(':visible')){
                  visibles++;
                }
                else {
                  $(this).remove();
                }
              });
              if(visibles < 1){
                $("div.messages.error").hide();
              }
            }, 1);
          });
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

      /*if(!$(element).data('being_validated')) {
      var fields = $(param[2] + ' input');
      fields.data('being_validated', true).valid();
      fields.data('being_validated', false);
    }*/


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

    jQuery.validator.addMethod("specificVals", function(value, element, param){
      for (var i in value){
        if(param.indexOf(value[i]) == -1) {
          return false;
        }
      }
      return true;
    });

    jQuery.validator.addMethod("regexMatchPCRE", function(value, element, param) {
      var result = false;
      jQuery.ajax({
        'url': Drupal.settings.basePath + 'clientside_validation/ajax',
        'type': "POST",
        'data': {
          'value': value,
          'param': param
        },
        'dataType': 'json',
        'async': false,
        'success': function(res){
          result = res;
        }
      });
      if (result['result'] === false) {
        if (result['message'].length) {
          jQuery.extend(jQuery.validator.messages, {
            "regexMatchPCRE": result['message']
          });
        }
      }
      return result['result'];
    }, jQuery.format('The value does not match the expected format.'));

    // Unique values
    jQuery.validator.addMethod("notEqualTo", function(value, element, param) {
      var target = $(param).unbind(".validate-notEqualTo").bind("blur.validate-notEqualTo", function() {
        $(element).valid();
      });
      return value != target.val();
    }, jQuery.format('Please don\'t enter the same value again.'));

    jQuery.validator.addMethod("regexMatch", function(value, element, param) {
      if (this.optional(element) && value == '') {
        return this.optional(element);
      }
      else {
        var regexp = new RegExp(param[0], param[1]);
        if(regexp.test(value)){
          return true;
        }
        return false;
      }

    }, jQuery.format('The value does not match the expected format.'));

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
