# frozen_string_literal: true

class JobDescriptionSerializer < ActiveModel::Serializer
  attributes :id, :title, :file_url, :parsed_data, :status, :published_at
end
