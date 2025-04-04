# frozen_string_literal: true

class CreateResumes < ActiveRecord::Migration[6.1]
  def change
    create_table :resumes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :company, null: false, foreign_key: true
      t.references :job_description, null: false, foreign_key: true
      t.references :referred_by, foreign_key: { to_table: :users }, null: true
      t.string :candidate_email, null: false
      t.string :candidate_first_name, null: false
      t.string :candidate_last_name, null: false
      t.json :primary_skills, default: []
      t.json :secondary_skills, default: []
      t.json :domain_expertise, default: []
      t.json :matching_skills, default: []
      t.json :missing_skills, default: []
      t.integer :years_of_experience
      t.string :link_to_file
      t.integer :status, default: 0, null: false

      t.timestamps
    end

    add_index :resumes, %i[candidate_email job_description_id], unique: true
  end
end
