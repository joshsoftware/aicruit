# frozen_string_literal: true

class JobDescriptionSerializer < ActiveModel::Serializer
  attributes :id, :title, :file_url, :parsed_data, :status, :user_id, :company_id

  def parsed_data
    object.parsed_data.presence || {}
  end
end
