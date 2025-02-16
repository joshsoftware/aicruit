# frozen_string_literal: true

class AddSubdomainToCompanies < ActiveRecord::Migration[7.0]
  def change
    add_column :companies, :subdomain, :string
    add_index :companies, :subdomain, unique: true
  end
end
