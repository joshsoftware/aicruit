# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.references :company, null: false, foreign_key: true
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :password_digest
      t.references :role, null: false, foreign_key: true

      t.timestamps
    end
  end
end
