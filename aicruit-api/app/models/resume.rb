# frozen_string_literal: true

class Resume < ApplicationRecord
  belongs_to :user
  belongs_to :company
  belongs_to :job_description
  belongs_to :referred_by, class_name: 'User', optional: true

  before_update { self.matching_score = matching_result&.[]('match_score').to_f if matching_result.present? }
  before_update { self.years_of_experience = parsed_data&.[]('years_of_experience').to_f if parsed_data.present? }

  enum status: { processing: 0, applied: 1, shortlisted: 2, technical1interviewed: 3, technical2interviewed: 4, hrinterviewed: 5, hired: 6, rejected: 7 }, _default: 'applied'

  validates :candidate_email, presence: true, uniqueness: { scope: :job_description_id, message: 'has already been used for this job'}
  validates :candidate_first_name, :candidate_last_name, presence: true
end
