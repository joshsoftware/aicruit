# frozen_string_literal: true

class AddGoogleTokenToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :google_token, :string
  end
end
