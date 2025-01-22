# frozen_string_literal: true

class CreateCompanies < ActiveRecord::Migration[7.0]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :website
      t.string :contact_email
      t.string :contact_number

      t.timestamps
    end
  end
end
