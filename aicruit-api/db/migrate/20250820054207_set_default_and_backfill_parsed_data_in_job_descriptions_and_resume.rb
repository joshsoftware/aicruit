class SetDefaultAndBackfillParsedDataInJobDescriptionsAndResume < ActiveRecord::Migration[7.2]
  def up
    # JobDescriptions table
    change_column_default :job_descriptions, :parsed_data, from: nil, to: {}
    JobDescription.where(parsed_data: nil).update_all(parsed_data: {})

    # Resumes table
    change_column_default :resumes, :parsed_data, from: nil, to: {}
    Resume.where(parsed_data: nil).update_all(parsed_data: {})
  end

  def down
    # Revert JobDescriptions table
    change_column_default :job_descriptions, :parsed_data, from: {}, to: nil

    # Revert Resumes table
    change_column_default :resumes, :parsed_data, from: {}, to: nil
  end
end
