# frozen_string_literal: true

class JobDescriptionSerializer < ActiveModel::Serializer
  attributes :title, :file_url, :parsed_data, :status, :user_id, :company_id
end
