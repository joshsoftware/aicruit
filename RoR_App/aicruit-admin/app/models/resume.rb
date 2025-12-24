class Resume < ApplicationRecord
    # Associations
    # belongs_to :jd
    # belongs_to :uploaded_by_user, class_name: 'User', foreign_key: 'uploaded_by'

    # Validations
    validates :jd_id, presence: true
    validates :candidate_name, presence: true
    validates :link_to_file, presence: true
    validates :years_of_experience, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
    validates :primary_skills, presence: true
    validates :secondary_skills, presence: true

end
