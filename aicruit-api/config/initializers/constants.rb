# frozen_string_literal: true

EMAIL_REGEX = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
PASSWORD_REGEX = /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}\z/

ROLE = ['Super Admin', 'Company Admin', 'HR Admin', 'HR'].freeze
