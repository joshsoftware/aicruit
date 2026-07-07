# frozen_string_literal: true

class ResumeSerializer < ActiveModel::Serializer
  attributes :id, :job_description_id, :candidate_email, :candidate_first_name, :candidate_last_name,
             :candidate_mobile_no, :link_to_file, :years_of_experience, :status, :referred_by, :matching_score,
             :matching_result, :parsed_data

  attribute :referred_by, if: -> { object.referred_by.present? } do
    "#{object.referred_by.first_name} #{object.referred_by.last_name}"
  end

  def link_to_file
    if object.link_to_file.present?
      api_url = ENV.fetch('RAILS_API_EXTERNAL_URL', 'http://joshsoftware.lvh.me:3000')
      "#{api_url}/api/v1/resumes/#{object.id}/download"
    end
  end
end
