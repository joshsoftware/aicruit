# frozen_string_literal: true

class JobDescriptionSerializer < ActiveModel::Serializer
  attributes :id, :title, :parsed_data, :status, :published_at
end
