# frozen_string_literal: true

class ChangeParsedDataToJsonbInJobDescriptions < ActiveRecord::Migration[7.0]
  def change
    change_column :job_descriptions, :parsed_data, :jsonb, using: 'parsed_data::jsonb'
  end
end
