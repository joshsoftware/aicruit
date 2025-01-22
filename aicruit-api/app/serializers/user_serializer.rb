# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :email, :role_id, :company_id, :full_name, :company_name, :role_name

  attribute :full_name do
    "#{object.first_name} #{object.last_name}"
  end

  attribute :company_name do
    object.company.name
  end

  attribute :role_name do
    object.role.name
  end
end
