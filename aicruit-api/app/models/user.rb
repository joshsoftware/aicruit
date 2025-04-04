# frozen_string_literal: true

class User < ApplicationRecord
  acts_as_tenant(:company)

  has_secure_password

  belongs_to :company
  belongs_to :role
  has_many :job_descriptions
  has_many :resumes

  validates :first_name, :last_name, presence: true, length: { maximum: 150 }
  validates :email, presence: true, uniqueness: { scope: :company_id }, format: { with: URI::MailTo::EMAIL_REGEXP }

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

  def candidate?
    role.name == 'Candidate'
  end

  private

  def set_default_role
    self.role ||= Role.find_by(name: 'Candidate')
  end
end
