class AddParsedDataToResumes < ActiveRecord::Migration[7.2]
  def change
    add_column :resumes, :parsed_data, :jsonb
  end
end
