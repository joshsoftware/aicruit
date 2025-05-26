# frozen_string_literal: true

class CreateInterviews < ActiveRecord::Migration[7.2]
  def change
    create_table :interviews do |t|
      t.string :title
      t.string :interview_type
      t.integer :candidate_id
      t.integer :interviewer_id
      t.string :date
      t.string :start_time
      t.string :meeting_url

      t.timestamps
    end
  end
end
