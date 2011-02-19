$Id:

Description
===========
This module allows you to add clientside validation to forms and webforms.

Added support for http://drupal.org/project/webform_validation, for the moment only for:
- Numeric values
- Minimum length
- Maximum length
- Equal values
- Unique values
- Specific value(s)
- Minimum number of selections required
- Maximum number of selections allowed
- Exact number of selections required

Must be empty, not implemented because it can be used as anti-spam

Still todo:
- Require at least one of two fields
- Require at least one of several fields
- Plain text (disallow tags)
- Regular expression
- Words blacklist

Dependencies
============
- none

Known problems
==============

CCK Multivalue checkboxes cannot be checked, see code
