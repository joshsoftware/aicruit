# frozen_string_literal: true

class CreateJobDescriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :job_descriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :company, null: false, foreign_key: true
      t.string :title
      t.string :file_url
      t.text :parsed_data
      t.integer :status

      t.timestamps
    end
  end
end
