class Company < ApplicationRecord
    has_many :users
    # has_many :jds, foreign_key: 'company_id'
end