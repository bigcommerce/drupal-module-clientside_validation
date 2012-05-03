<?php
/**
 * @file
 * Admin settings for Clientside Validation
 */

function clientside_validation_general_settings_form($form_id, $form_state) {

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
  $form = system_settings_form($form);
  return $form;
}

function clientside_validation_settings_form($form, $form_state, $cvsid = NULL, $type = 'default') {
  $default_settings = clientside_validation_settings_load(NULL, 'default');
  $settings = clientside_validation_settings_load($cvsid, $type);
  $form['#tree'] = TRUE;
  if ($settings && $settings['type'] != 'default') {
    $form['cvsid'] = array(
      '#type' => 'value',
      '#value' => $settings['cvsid'],
    );

    $form['form_id'] = array(
      '#type' => 'value',
      '#value' => $settings['form_id'],
    );
  }
  
  $form['type'] = array(
    '#type' => 'value',
    '#value' => $type,
  );

  //Validate options
  $form['validate_options'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('Validate options'),
  );

  if (module_exists('clientside_validation_html5')) {
    $form['validate_options']['disable_html5'] = array(
      '#type' => 'radios',
      '#options' => array(
        '1' => t('Yes'),
        '0' => t('No'),
      ),
      '#title' => t('Replace HTML5 validation with Clientside Validation'),
      '#default_value' => variable_get('disable_html5', 1),
      '#description' => t('Replace HTML5 validation with Clientside Validation on forms that have Clientside Validation enabled'),
    );
  }

  $form['validate_options']['validate_onsubmit'] = array(
    '#type' => 'radios',
    '#options' => array(
      '1' => t('Yes'),
      '0' => t('No'),
    ),
    '#title' => t('Validate fields on submit'),
    '#description' => t('"No" disables onsubmit validation, allowing the user to submit whatever he wants, while still validating on keyup/blur/click events (if not specified otherwise).'),
    '#default_value' => variable_get('validate_onsubmit', 1),
  );

  $form['validate_options']['validate_onblur'] = array(
    '#type' => 'radios',
    '#options' => array(
      '1' => t('Yes'),
      '0' => t('No'),
    ),
    '#title' => t('Validate fields on blur'),
    '#description' => t('Validate elements (except checkboxes/radio buttons) on blur. <strong>If nothing is entered, all rules are skipped, except when the field was already marked as invalid.</strong>'),
    '#default_value' => variable_get('validate_onblur', 1),
  );

  $form['validate_options']['validate_onblur_always'] = array(
    '#type' => 'radios',
    '#options' => array(
      '1' => t('Yes'),
      '0' => t('No'),
    ),
    '#title' => t('Always validate fields on blur'),
    '#description' => t('Validate elements (except checkboxes/radio buttons) on blur, <strong>even nothing is entered before or if the fields hasn\'t been marked as invalid before.</strong>'),
    '#default_value' => variable_get('validate_onblur_always', 0),
    '#states' => array(
      'visible' => array(
        ':input[name="validate_options[validate_onblur]"]' => array('value' => 1),
      ),
    ),
  );

  $form['validate_options']['validate_onkeyup'] = array(
    '#type' => 'radios',
    '#options' => array(
      '1' => t('Yes'),
      '0' => t('No'),
    ),
    '#title' => t('Validate fields on key up'),
    '#description' => t('Validate elements on keyup. <strong>As long as the field is not marked as invalid, nothing happens</strong>. Otherwise, all rules are checked on each key up event.'),
    '#default_value' => variable_get('validate_onkeyup', 1),
  );

  $form['validate_options']['show_messages'] = array(
    '#type' => 'radios',
    '#options' => array(
      '0' => t('Show all error messages'),
      '1' => t('Show only first error message'),
      '2' => t('Show only last error message'),
    ),
    '#title' => t('Show these error messages on validation'),
    '#default_value' => variable_get('show_messages', 0),
    '#description' => t('Warning: Showing only the first or last message only works if the error messages are displayed on top of the form. When they are displayed inline this setting has some bugs.'),
  );

  //Error message settings
  $form['error'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('Error message settings'),
  );

  $form['error']['prefix'] = array(
    '#title' => t('Field name prefix'),
    '#description' => t('The prefix of the field name in the error messages.'),
    '#type' => 'textfield',
    '#default_value' => variable_get('prefix', ''),
  );

  $form['error']['suffix'] = array(
    '#title' => t('Field name suffix'),
    '#description' => t('The suffix of the field name in the error messages.'),
    '#type' => 'textfield',
    '#default_value' => variable_get('suffix', ''),
  );

  $form['error']['example_image'] = array(
    '#type' => 'item',
    '#title' => t('Example'),
    '#markup' => '<img id="example_image" src="' . base_path() . drupal_get_path('module', 'clientside_validation') . '/errormsg.png" alt="' . t('Error message example') . '" />',
    '#description' => t('Filling in double quotes in both the above fields will give this result.'),
  );

  $form['error']['scrollto_errormessage'] = array(
    '#title' => t('Scroll to error message'),
    '#description' => t('If checked, the page will automatically scroll to the error messages when validation fails.'),
    '#type' => 'checkbox',
    '#default_value' => variable_get('scrollto_errormessage', 1),
  );

  $form['error']['scroll_speed'] = array(
    '#title' => t('Scroll speed'),
    '#description' => t('The scroll speed in milliseconds'),
    '#type' => 'textfield',
    '#default_value' => variable_get('scroll_speed', 1000),
    '#states' => array(
      'visible' => array(
        ':input[name="error[scrollto_errormessage]"]' => array('checked' => TRUE),
      ),
    ),
  );

  $form['error']['error_element'] = array(
    '#title' => t('Error Element'),
    '#description' => t('The HTML element to wrap the errors in. Defaults to label.'),
    '#type' => 'select',
    '#options' => drupal_map_assoc(array('label', 'span', 'div')),
    '#default_value' => variable_get('error_element', 'label'),
  );

  if (module_exists('fapi_validation') && module_exists('fapi')) {
    $form['error']['scroll_speed'] += array('#rules' => array('numeric'));
  }

  //Error Placement
  $form['error_placement'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('Error message placement'),
  );

  $form['error_placement']['error_placement_default'] = array(
    '#type' => 'select',
    '#title' => t('Default location'),
    '#description' => t('Default location to show the error messages.
      If you choose "jQuery selector", provide a valid jQuery selector in the appropriate textfield.
      If you choose "Custom function", provide the name of the custom javascript function.
      The function needs to be declared on the Drupal.clientsideValidation object prototype. You can find
      further details in the clientside_validation.api.js file.
      This function will be given to !errorPlacement.',
      array(
        '!errorPlacement' =>
        l(t('the errorPlacement option of jQuery.validate()'), 'http://docs.jquery.com/Plugins/Validation/validate#options')
      )
    ),
    '#options' => array(
      CLIENTSIDE_VALIDATION_JQUERY_SELECTOR => t('jQuery selector'),
      CLIENTSIDE_VALIDATION_TOP_OF_FORM => t('Top of form'),
      CLIENTSIDE_VALIDATION_BEFORE_LABEL => t('Before label'),
      CLIENTSIDE_VALIDATION_AFTER_LABEL => t('After label'),
      CLIENTSIDE_VALIDATION_BEFORE_INPUT => t('Before input'),
      CLIENTSIDE_VALIDATION_AFTER_INPUT => t('After input'),
      CLIENTSIDE_VALIDATION_TOP_OF_FIRST_FORM => t('Top of first form'),
      CLIENTSIDE_VALIDATION_CUSTOM_ERROR_FUNCTION => t('Custom function'),
    ),
    '#default_value' => variable_get('error_placement_default', CLIENTSIDE_VALIDATION_TOP_OF_FIRST_FORM),
  );

  $form['error_placement']['jquery_selector'] = array(
    '#type' => 'textfield',
    '#title' => t('jQuery selector'),
    '#description' => t('Enter a jQuery selector here if you selected "jQuery selector" in the previous step.
                      The error messages will be shown in this div if it exists.
                      If it doesn\'t, error messages will be shown above the first form on the page.'),
    '#default_value' => variable_get('jquery_selector', ''),
    '#states' => array(
      'visible' => array(
        ':input[name="error_placement[error_placement_default]"]' => array('value' => CLIENTSIDE_VALIDATION_JQUERY_SELECTOR),
      ),
    ),
  );

  $form['error_placement']['custom_error_function'] = array(
    '#type' => 'textfield',
    '#title' => t('Custom function name'),
    '#description' => t('If you selected "Custom function" in the previous step, provide the name of the custom javascript function.
      This function will be given to !errorPlacement',
      array(
        '!errorPlacement' =>
        l(t('the errorPlacement option of jQuery.validate()'), 'http://docs.jquery.com/Plugins/Validation/validate#options')
      )),
    '#default_value' => variable_get('custom_error_function', ''),
    '#states' => array(
      'visible' => array(
        ':input[name="error_placement[error_placement_default]"]' => array('value' => CLIENTSIDE_VALIDATION_CUSTOM_ERROR_FUNCTION),
      ),
    ),
  );

  //Hidden fields and vertical tabs
  $form['include_hidden'] = array(
    '#type' => 'fieldset',
    '#title' => t('Hidden fields and vertical tabs'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  $form['include_hidden']['include_hidden'] = array(
    '#type' => 'textarea',
    '#default_value' => variable_get('include_hidden', ''),
    '#title' => t("Don't ignore hidden fields on the following forms"),
    '#description' => t('You can specify form IDs (one per line) of forms that should have hidden elements validated.'),
  );

  $form['include_hidden']['validate_tabs'] = array(
    '#type' => 'checkbox',
    '#default_value' => variable_get('validate_tabs', 1),
    '#title' => t('Validate all vertical tabs'),
    '#description' => t('If you check this, all tabs will be validated on submit
                      (including the hidden ones). Warning: if there are other hidden
                      fields (e.g. conditional fields), those will be validated too.'),
  );
  if ($type != 'default') {
    foreach (array('validate_options', 'error', 'error_placement', 'include_hidden') as $fieldset) {
      $statefield = ':input[name="' . $fieldset . '[override_default]"]';
      foreach($form[$fieldset] as $fieldkey => $field) {
        if (is_array($form[$fieldset][$fieldkey]) && isset($form[$fieldset][$fieldkey]['#type'])) {
          if (!is_array($form[$fieldset][$fieldkey]['#states'])) {
            $form[$fieldset][$fieldkey]['#states'] = array();
          }
          $form[$fieldset][$fieldkey]['#states'] += array(
            'visible' => array(
              $statefield => array('checked' => TRUE),
            ),
          );
        }
      }
      $form[$fieldset]['override_default'] = array(
        '#type' => 'checkbox',
        '#title' => t('Override default options'),
        '#description' => t('Check this to override the default validate options'),
        '#default_value' => isset($settings['validate_options']),
        '#weight' => -30,
      );
    }
  }
dpm($form);
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save configuration'),
  );

  return $form;
}

function clientside_validation_settings_form_submit($form, &$form_state) {
  $values = $form_state['values'];
  $type = $values['type'];
  $form_id = $values['form_id'];
  $cvsid = NULL;
  if (isset($values['cvsid'])) {
    $cvsid = $values['cvsid'];
    unset($values['cvsid']);
  }
  unset($values['type']);
  unset($values['id']);
  if ($type == 'default') {
    variable_set('clientside_validation_default_settings', $values);
  }
  else {
    $values = array_filter($values, '_cv_filter_settings');
    foreach($values as $key => $value) {
      unset($values[$key]['override_default']);
    }
    $values = serialize($values);
    db_merge('clientside_validation_settings')
      ->key(array('form_id' => $form_id))
      ->fields(array(
        'type' => $type,
        'status' => $status,
      ));
  }
}

function _cv_filter_settings($val) {
  return isset($val['override_default']) && $val['overrride_default'];
}

function _cv_setting_status($status) {
  if ($status) {
    return t('Enabled');
  }
  return t('Disabled');
}

function clientside_validation_settings_overview($form, $form_state, $type) {
  $form = array();
  $content_types = node_type_get_types();
  $settings = clientside_validation_settings_load(NULL, $type);
  dpm($content_types);
  dpm($settings);
  
  $destination = array('destination' => 'admin/config/validation/clientside_validation/content-types');
  $settinguri = 'admin/config/validation/clientside_validation/content-types/';
  $rows = array();
  if ($content_types) {
    foreach ($content_types as $content_type) {
      $row = array();
      $row[] = check_plain($content_type->name);
      if (isset($settings[$content_type->type]) && $settings[$content_type->type]->status) {
        $cvsid = $settings[$content_type->type]->cvsid;
        $row[] = _cv_setting_status(TRUE);
        $actions = array(
          'edit' => array(
            'title' => t('edit'),
            'href' => $settinguri . $cvsid . '/edit',
            'query' => $destination,
          ),
          'disable' => array(
            'title' => t('disable'),
            'href' => $settinguri . $cvsid . '/disable',
            'query' => $destination,
          ),
          'delete' => array(
            'title' => t('delete'),
            'href' => $settinguri . $cvsid . '/delete',
            'query' => $destination,
          ),
        );
      }
      else {
        $row[] = _cv_setting_status(FALSE);
        if (isset($settings[$content_type->type])) {
          $actions = array(
            'edit' => array(
              'title' => t('edit'),
              'href' => $settinguri . $cvsid . '/edit',
              'query' => $destination,
            ),
            'enable' => array(
              'title' => t('enable'),
              'href' => $settinguri . $cvsid . '/enable',
              'query' => $destination,
            ),
            'delete' => array(
              'title' => t('delete'),
              'href' => $settinguri . $cvsid . '/delete',
              'query' => $destination,
            ),
          );
        }
        else {
          $actions = array(
            'edit' => array(
              'title' => t('create'),
              'href' => $settinguri . $cvsid . '/edit',
              'query' => $destination,
            ),
          );
        }
      }
      $row[] = array(
        'data' => array(
          '#theme' => 'links__node_operations',
          '#links' => $actions,
          '#attributes' => array('class' => array('links', 'inline')),
        ),
      );
      $rows[] = $row;
    }
  }

  $header = array(
    t('Content type'),
    t('Status'),
    t('Actions'),
  );
  $form['contenttypes'] = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $rows,
    '#empty' => t('No content types available.'),
  );
  
  return $form;
}

function clientside_validation_settings_confirmation_form($form, &$form_state, $cvsid, $type, $action) {
  $settings = clientside_validation_settings_load();
  $form['#cvaction'] = $action;
  $form['#cvtype'] = $type;
  $form['#cvsid'] = $cvsid;

  switch ($action) {
    case 'delete':
      $question = 'Are you sure you want to delete these settings';
    case 'enable':
      $question = 'Are you sure you want to enable these settings';
    case 'disable':
      $question = 'Are you sure you want to disable these settings';
  }
  
  return confirm_form(
    $form,
    $question,
    'admin/config/validation/clientside_validation', // destination is used
    t('This action cannot be undone.'),
    t(ucfirst($action)),
    t('Cancel')
  );
}

function clientside_validation_settings_confirmation_form_submit($form, &$form_state) {
  if ($form_state['values']['confirm']) {
    $action = $form['#cvaction'];
    $type = $form['#cvtype'];
    $cvsid = $form['#cvsid'];

    switch ($action) {
      case 'delete':
        clientside_validation_settings_delete($cvsid);
      case 'enable':
        clientside_validation_settings_enable($cvsid);
      case 'disable':
        //clientside_validation_settings_disable($cvsid);
    }
    $form_state['redirect'] = 'admin/config/validation/clientside_validation/' . $type;
  }
}
