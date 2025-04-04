# frozen_string_literal: true

class Resume < ApplicationRecord
  belongs_to :user
  belongs_to :company
  belongs_to :job_description
  belongs_to :referred_by, class_name: 'User', optional: true

  enum status: { applied: 0, shortlisted: 1, technical1interviewed: 2, technical2interviewed: 3, hrinterviewed: 4 }, _default: 'applied'

  validates :candidate_email, presence: true, uniqueness: { scope: :job_description_id }
  validates :candidate_first_name, :candidate_last_name, :primary_skills, presence: true
end
