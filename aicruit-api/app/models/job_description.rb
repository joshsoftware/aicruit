# frozen_string_literal: true

class JobDescription < ApplicationRecord
  belongs_to :user
  belongs_to :company

  enum status: { draft: 0, unpublished: 1, published: 2, closed: 3 }.freeze

  validates :title, presence: true
  validates :user, presence: true
  validates :company, presence: true
  validates :status, presence: true

  attribute :status, :integer, default: 0
end
