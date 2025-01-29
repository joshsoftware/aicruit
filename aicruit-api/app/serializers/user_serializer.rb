# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :email, :role_id, :company_id, :role_name

  attribute :role_name do
    object.role.name
  end
end
