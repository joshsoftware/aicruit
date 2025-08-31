# frozen_string_literal: true

class JobDescriptionSerializer < ActiveModel::Serializer
  attributes :id, :title, :file_url, :parsed_data, :status, :published_at, :total_applicants

  attribute :total_applicants do
    object.resumes.count
  end
end
