<?php

/**
 * Form callback for normal fapi elements.
 */
function clientside_validation_testswarm_fapi($form, $form_state) {
  $form = array();
  $form['info'] = array(
    '#type' => 'markup',
    '#value' => '<p><strong>' . t('Clientside validation example - form api.') . '</strong></p>',
  );

  $form['yourname'] = array(
    '#type' => 'textfield',
    '#title' => t('Your name'),
    '#default_value' => '',
    '#required' => TRUE,
    '#maxlength' => 20,
    '#description' => t('Required textfield, max length 20 characters.'),
  );

  $form['copy'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Select at least one'),
    '#required' => TRUE,
    '#options' => array(
      'status' => t('Published'),
      'moderate' => t('In moderation queue'),
      'promote' => t('Promoted to front page'),
      'sticky' => t('Sticky at top of lists'),
      'revision' => t('Create new revision'),
    ),
    '#description' => t('Required checkboxes'),
  );

  $form['yourdob'] = array(
    '#type' => 'date',
    '#title' => t('DOB'),
    '#required' => TRUE,
    '#description' => t('Required date field'),
  );

  $form['pass'] = array(
    '#type' => 'password',
    '#title' => t('Password'),
    '#maxlength' => 20,
    '#size' => 25,
    '#required' => TRUE,
    '#description' => t('Required password field, max length 20 characters.'),
  );

  $form['posting_settings'] = array(
    '#type' => 'radios',
    '#title' => t('Preview comment'),
    '#options' => array(t('Optional'), t('Required')),
    '#required' => TRUE,
    '#description' => t('Required radios'),
  );

  $form['feed'] = array(
    '#type' => 'select',
    '#title' => t('Display of XML feed items'),
    '#required' => TRUE,
    '#options' => array(
      '' => t('--select--'),
      'title' => t('Titles only'),
      'teaser' => t('Titles plus teaser'),
      'fulltext' => t('Full text'),
    ),
    '#description' => t('Required selectbox'),
  );

  $form['feed2'] = array(
    '#type' => 'select',
    '#title' => t('Multiple items'),
    '#multiple' => 3,
    '#required' => TRUE,
    '#options' => array(
      '' => t('--select--'),
      'title' => t('Titles only'),
      'teaser' => t('Titles plus teaser'),
      'fulltext' => t('Full text'),
    ),
    '#description' => t('Required multiple selectbox.'),
  );

  $form['body'] = array(
    '#type' => 'textarea',
    '#title' => t('Body'),
    '#required' => TRUE,
    '#maxlength' => 50,
    '#description' => t('Required textarea, max length 50 characters.'),
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Send'),
    '#weight' => 100
  );

  return $form;
}