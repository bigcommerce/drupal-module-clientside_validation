(function ($, Drupal, window, document, undefined) {
  /**
   * FAPI Validation
   */
  var formid = 'clientside-validation-testswarm-fapi-validation';
  var validator = {};
  $(document).bind('clientsideValidationInitialized', function (event){
    validator = Drupal.myClientsideValidation.validators[formid];
  });
  Drupal.tests.cvfapi = {
    getInfo: function() {
      return {
        name: Drupal.t('Clientside Validation FAPI Validation'),
        description: Drupal.t('Test Clientside Validation on FAPI elements with FAPI Validation rules.'),
        group: Drupal.t('Clientside Validation')
      };
    },
    tests: {
    }
  };
})(jQuery, Drupal, this, this.document);