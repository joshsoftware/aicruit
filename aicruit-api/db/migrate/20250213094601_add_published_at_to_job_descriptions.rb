# frozen_string_literal: true

class AddPublishedAtToJobDescriptions < ActiveRecord::Migration[7.2]
  def change
    add_column :job_descriptions, :published_at, :datetime
  end
end
