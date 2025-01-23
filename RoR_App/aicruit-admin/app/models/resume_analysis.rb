class ResumeAnalysis < ApplicationRecord
      # Associations
    belongs_to :job_description, foreign_key: :jd_id
    belongs_to :resume

    # Validations (optional)
    validates :ratings, presence: true
    validates :matching_skills, presence: true
    validates :missing_skills, presence: true
    validates :additional_skills, presence: true
end
