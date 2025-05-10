class Jd < ApplicationRecord
    # Enum for the status field
    enum status: { open: 'open', close: 'close' }

    # Associations
    # belongs_to :user
    # belongs_to :company
    # has_many :resumes, foreign_key: 'jd_id'

    # Validations
    validates :user_id, presence: true
    validates :company_id, presence: true
    validates :title, presence: true
    validates :link_to_file, presence: true
    validates :status, inclusion: { in: statuses.keys }
end
