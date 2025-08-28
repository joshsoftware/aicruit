# frozen_string_literal: true

class AddMobileAndRatingToResume < ActiveRecord::Migration[7.2]
  def change
    add_column :resumes, :candidate_mobile_no, :string
    add_column :resumes, :rating, :string
  end
end
