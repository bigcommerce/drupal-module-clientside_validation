<?php
// $Id$
/**
 * @file Admin settings for Clientside Validation
 */

function clientside_validation_admin_settings() {

  //jquery.validate.js settings
  $form['clientside_validation_min'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('Use minified version of jquery.validate.js'),
    '#description' => t('You can use the minified version of the library.'),
  );

  $form['clientside_validation_min']['clientside_validation_use_minified'] = array(
    '#type' => 'radios',
    '#options' => array(
      '1' => t('Yes'),
      '0' => t('No'),
    ),
    '#default_value' => variable_get('clientside_validation_use_minified', 0),
    '#title' => t('Use minified version?'),
  );

   //Validate options
  $form['clientside_validation_validate_options'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('Validate options'),
    '#description' => t('Set the validate options for Clientside Validation.'),
  );

  $form['clientside_validation_validate_options']['clientside_validation_disable_html5'] = array(
    '#type' => 'radios',
    '#options' => array(
      '1' => t('Yes'),
      '0' => t('No'),
    ),
    '#title' => t('Replace HTML5 validation with Clientside Validation'),
    '#default_value' => variable_get('clientside_validation_disable_html5', 1),
    '#description' => t('Replace HTML5 validation with Clientside Validation on forms that have Clientside Validation enabled'),
  );

  $form['clientside_validation_validate_options']['clientside_validation_validate_onsubmit'] = array(
    '#type' => 'radios',
    '#options' => array(
      '1' => t('Yes'),
      '0' => t('No'),
    ),
    '#title' => t('Validate fields on submit'),
    '#description' => t('"No" disables onsubmit validation, allowing the user to submit whatever he wants, while still validating on keyup/blur/click events (if not specified otherwise).'),
    '#default_value' => variable_get('clientside_validation_validate_onsubmit', 1),
  );

  $form['clientside_validation_validate_options']['clientside_validation_validate_onblur'] = array(
    '#type' => 'radios',
    '#options' => array(
      '1' => t('Yes'),
      '0' => t('No'),
    ),
    '#title' => t('Validate fields on blur'),
    '#description' => t('Validate elements (except checkboxes/radio buttons) on blur. <strong>If nothing is entered, all rules are skipped, except when the field was already marked as invalid.</strong>'),
    '#default_value' => variable_get('clientside_validation_validate_onblur', 1),
  );

  $form['clientside_validation_validate_options']['clientside_validation_validate_onkeyup'] = array(
    '#type' => 'radios',
    '#options' => array(
      '1' => t('Yes'),
      '0' => t('No'),
    ),
    '#title' => t('Validate fields on key up'),
    '#description' => t('Validate elements on keyup. <strong>As long as the field is not marked as invalid, nothing happens</strong>. Otherwise, all rules are checked on each key up event.'),
    '#default_value' => variable_get('clientside_validation_validate_onkeyup', 1),
  );

  //Error message settings
  $form['clientside_validation_error'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('Error message settings'),
    '#description' => t('Change error message related settings.'),
  );

  $form['clientside_validation_error']['clientside_validation_prefix'] = array(
    '#title' => t('Field name prefix'),
    '#description' => t('The prefix of the field name in the error messages.'),
    '#type' => 'textfield',
    '#default_value' => variable_get('clientside_validation_prefix', ''),
  );

  $form['clientside_validation_error']['clientside_validation_suffix'] = array(
    '#title' => t('Field name suffix'),
    '#description' => t('The suffix of the field name in the error messages.'),
    '#type' => 'textfield',
    '#default_value' => variable_get('clientside_validation_suffix', ''),
  );

  $form['clientside_validation_error']['example_image'] = array(
    '#type' => 'item',
    '#title' => t('Example'),
    '#markup' => '<img id="clientside_validation_example_image" src="' . base_path() . drupal_get_path('module', 'clientside_validation') . '/errormsg.png" alt="' . t('Error message example') . '" />',
    '#description' => t('Filling in double quotes in both the above fields will give this result.'),
  );

  $form['clientside_validation_error']['clientside_validation_scrollto_errormessage'] = array(
    '#title' => t('Scroll to error message'),
    '#description' => t('If checked, the page will automatically scroll to the error messages when validation fails.'),
    '#type' => 'checkbox',
    '#default_value' => variable_get('clientside_validation_scrollto_errormessage', 1),
  );

  $form['clientside_validation_error']['clientside_validation_scroll_speed'] = array(
    '#title' => t('Scroll speed'),
    '#description' => t('The scroll speed in milliseconds'),
    '#type' => 'textfield',
    '#default_value' => variable_get('clientside_validation_scroll_speed', 1000),
    '#states' => array(
      'visible' => array(
        'input[name="clientside_validation_scrollto_errormessage"]' => array('checked' => TRUE),
      ),
    ),
  );

  if (module_exists('fapi_validation') && module_exists('clientside_validation_fapi')) {
    $form['clientside_validation_error']['clientside_validation_scroll_speed'] += array('#rules' => array('numeric'));
  }

  //Page settings
  $form['clientside_validation_pages'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('Paths'),
    '#description' => t('Include or exclude paths for Clientside Validation.'),
  );

  $form['clientside_validation_pages']['clientside_validation_filter_paths'] = array(
    '#type' => 'radios',
    '#options' => array(
      CLIENTSIDE_VALIDATION_EXCLUDE_PATHS => t('Add Clientside Validation on all paths except those specified below'),
      CLIENTSIDE_VALIDATION_INCLUDE_PATHS => t('Only add Clientside Validation on the paths specified below'),
    ),
    '#default_value' => variable_get('clientside_validation_filter_paths', CLIENTSIDE_VALIDATION_EXCLUDE_PATHS),
    '#title' => t('Include or exclude paths'),
  );

  $form['clientside_validation_pages']['clientside_validation_path_list'] = array(
    '#type' => 'textarea',
    '#default_value' => variable_get('clientside_validation_path_list', ''),
    '#title' => t("Enter paths"),
    '#description' => t("Enter one page per line as Drupal paths.
      The '*' character is a wildcard. Example paths are %blog for the blog page and
      %blog-wildcard for every personal blog. %front is the front page.",
      array('%blog' => 'blog', '%blog-wildcard' => 'blog/*', '%front' => '<front>')),
  );

  //Hidden fields and vertical tabs
  $form['clientside_validation_include_hidden'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('Hidden field and vertical tabs'),
  );

  $form['clientside_validation_include_hidden']['clientside_validation_include_hidden'] = array(
    '#type' => 'textarea',
    '#default_value' => variable_get('clientside_validation_include_hidden', ''),
    '#title' => t("Don't ignore hidden fields on the following forms"),
    '#description' => t('You can specify form IDs (one per line) of forms that should have hidden elements validated.'),
  );

  $form['clientside_validation_include_hidden']['clientside_validation_validate_tabs'] = array(
    '#type' => 'checkbox',
    '#default_value' => variable_get('clientside_validation_validate_tabs', 1),
    '#title' => t('Validate all vertical tabs'),
    '#description' => t('If you check this, all tabs will be validated on submit
                      (including the hidden ones). Warning: if there are other hidden
                      fields (e.g. conditional fields), those will be validated too.'),
  );

  //Form settings
  $form['clientside_validation_validate_forms'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('Forms to validate'),
  );

  $form['clientside_validation_validate_forms']['clientside_validation_validate_all'] = array(
    '#type' => 'radios',
    '#default_value' => variable_get('clientside_validation_validate_all', CLIENTSIDE_VALIDATION_VALIDATE_ALL),
    '#title' => t('Select the forms to validate'),
    '#options' => array(
      CLIENTSIDE_VALIDATION_VALIDATE_ALL => t('Validate all forms'),
      CLIENTSIDE_VALIDATION_VALIDATE_SPECIFIC => t('Only validate forms listed below'),
      CLIENTSIDE_VALIDATION_VALIDATE_ALL_EXCEPT => t('Validate all forms except those listed below')
    )
  );

  $form['clientside_validation_validate_forms']['clientside_validation_validate_specific'] = array(
    '#type' => 'textarea',
    '#default_value' => variable_get('clientside_validation_validate_specific', ''),
    '#title' => t("Enter form IDs below"),
    '#description' => t('You can specify form IDs (one per line) of forms that should or should not be validated.'),
    '#states' => array(
      'invisible' => array(
       'input[name="clientside_validation_validate_all"]' => array('value' => (string)CLIENTSIDE_VALIDATION_VALIDATE_ALL),
      ),
    ),
  );

  return system_settings_form($form);
}