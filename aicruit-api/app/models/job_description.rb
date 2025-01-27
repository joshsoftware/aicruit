# frozen_string_literal: true

class JobDescription < ApplicationRecord
  belongs_to :user
  belongs_to :company

  enum status: { draft: 0, unpublished: 1, published: 2, closed: 3 }

  validates :title, presence: true
  validates :user, presence: true
  validates :company, presence: true
  validates :status, presence: true
  validates :parsed_data, presence: true
  validate :validate_parsed_data_format

  after_initialize :set_default_status, if: :new_record?
  after_initialize :set_default_parsed_data, if: :new_record?

  private

  def set_default_status
    self.status ||= :draft
  end

  def set_default_parsed_data
    self.parsed_data ||= {}
  end

  def validate_parsed_data_format
    return if parsed_data.is_a?(Hash)

    errors.add(:parsed_data, 'must be a valid JSON object')
  end
end
