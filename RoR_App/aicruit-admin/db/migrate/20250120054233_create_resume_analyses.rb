class CreateResumeAnalyses < ActiveRecord::Migration[8.0]
  def change
    create_table :resume_analyses do |t|
      t.string :ratings
      t.integer :jd_id
      t.integer :resume_id
      t.string :matching_skills
      t.string :missing_skills
      t.string :additional_skills

      t.timestamps
    end

    # Add foreign key constraints
    add_foreign_key :resume_analyses, :jds, column: :jd_id, primary_key: :id
    add_foreign_key :resume_analyses, :resumes, column: :resume_id, primary_key: :id
  end
end
