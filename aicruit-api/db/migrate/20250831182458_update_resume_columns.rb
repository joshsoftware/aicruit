class UpdateResumeColumns < ActiveRecord::Migration[7.2]
  def change
    remove_column :resumes, :rating, :string
    add_column :resumes, :matching_result, :jsonb, default: {}

    add_column :resumes, :matching_score, :float, default: 0.0

    remove_column :resumes, :primary_skills, :json, default: []
    remove_column :resumes, :secondary_skills, :json, default: []
    remove_column :resumes, :domain_expertise, :json, default: []
    remove_column :resumes, :matching_skills, :json, default: []
    remove_column :resumes, :missing_skills, :json, default: []
  end
end
