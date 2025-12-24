class CreateResumes < ActiveRecord::Migration[8.0]
  def change
    create_table :resumes do |t|
      t.integer :jd_id
      t.string :candidate_name
      t.string :link_to_file
      t.boolean :is_interviewed, default: false
      t.string :primary_skills
      t.string :secondary_skills
      t.string :responsibilities
      t.integer :years_of_experience
      t.string :projects
      t.json :parsed_data, default: {}
      t.integer :uploaded_by

      t.timestamps
    end

    # Adding foreign key constraints
    add_foreign_key :resumes, :jds, column: :jd_id, primary_key: :id
    add_foreign_key :resumes, :users, column: :uploaded_by, primary_key: :id

  end
end
