# frozen_string_literal: true

class ResumeSerializer < ActiveModel::Serializer
  attributes :id, :job_description_id, :candidate_email, :candidate_first_name, :candidate_last_name, :primary_skills,
             :secondary_skills, :domain_expertise, :matching_skills, :missing_skills, :years_of_experience,
             :link_to_file, :status, :referred_by, :parsed_data

  attribute :referred_by, if: -> { object.referred_by.present? } do
    "#{object.referred_by.first_name} #{object.referred_by.last_name}"
  end
end
