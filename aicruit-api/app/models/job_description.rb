# frozen_string_literal: true

class JobDescription < ApplicationRecord
  acts_as_tenant(:company)

  include AASM

  belongs_to :user
  belongs_to :company

  enum status: { draft: 0, unpublished: 1, published: 2, closed: 3 }

  validates :title, presence: true
  validates :user, presence: true
  validates :company, presence: true
  validates :status, presence: true
  validates :parsed_data, presence: true

  after_initialize :set_default_status, if: :new_record?

  aasm column: :status, enum: true, whiny_transitions: false do
    state :draft, initial: true
    state :unpublished
    state :published, before_enter: :set_published_at
    state :closed

    event :submit do
      transitions from: :draft, to: :unpublished
    end

    event :publish do
      transitions from: %i[draft unpublished closed], to: :published
    end

    event :close do
      transitions from: :published, to: :closed
    end
  end

  private

  def set_default_status
    self.status ||= :draft
  end

  def set_published_at
    self.published_at = Time.current
  end
end
