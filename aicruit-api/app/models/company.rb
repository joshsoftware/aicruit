# frozen_string_literal: true

class Company < ApplicationRecord
  has_many :users
  has_many :job_descriptions

  validates :subdomain, presence: true, uniqueness: true, format: { with: /\A[a-z0-9\-]+\z/, message: 'only allows lowercase letters, numbers, and hyphens' }
end
