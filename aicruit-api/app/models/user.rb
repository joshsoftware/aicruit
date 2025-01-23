# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  belongs_to :company
  belongs_to :role
  has_many :job_descriptions

  validates :first_name, :last_name, presence: true, length: { maximum: 150 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, format: { with: PASSWORD_REGEX }, length: { minimum: 8 }, allow_blank: true

  after_initialize :set_default_role, if: :new_record?

  def super_admin?
    role.name == 'Super Admin'
  end

  def company_admin?
    role.name == 'Company Admin'
  end

  def hr_admin?
    role.name == 'HR Admin'
  end

  def hr?
    role.name == 'HR'
  end

  private

  def set_default_role
    self.role ||= Role.find_by(name: 'HR')
  end
end
