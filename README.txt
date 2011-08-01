$Id:

Description
===========
This module allows you to add clientside validation to forms and webforms.

Usage
=====
The only thing this module will do is translate validation rules defined in php to javascript counter parts,
if you mark a field as required it will create a javascript rule that checks the field on submit. This means
no configuration is needed. You can however configure the prefix and suffix used for the field names in the
error messages (e.g.: prefix:", suffix:" or prefix:<<, suffix:>>) and whether or not to use the minified version
of jquery.validate.js.

You can find an example here: http://drupal.org/sandbox/jelles/1193994

Dependencies
============
- Clientside Validation (Main module): none
- Clientside Validation Webform:
  * Clientside Validation
  * Webform (http://drupal.org/project/webform)
- Clientside Validation Form:
  * Clientside Validation
- Clientside Validation FAPI:
  * Clientside Validation
  * FAPI Validation (http://drupal.org/project/fapi_validation)

TODO
====
- Allow user to select to which forms the validation has to be added
- Add settings to control position and behaviour of the error messages
