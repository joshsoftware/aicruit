# frozen_string_literal: true

class JobDescriptionSerializer < ActiveModel::Serializer
  attributes :id, :title, :file_url, :parsed_data, :status, :published_at, :total_applicants

  attribute :total_applicants do
    object.resumes.count
  end

  def file_url
    if object.file_url.present?
      api_url = ENV.fetch('RAILS_API_EXTERNAL_URL', 'http://joshsoftware.lvh.me:3000')
      "#{api_url}/api/v1/job_descriptions/#{object.id}/download"
    end
  end
end
