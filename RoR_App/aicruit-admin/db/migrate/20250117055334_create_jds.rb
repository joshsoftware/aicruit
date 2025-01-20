class CreateJds < ActiveRecord::Migration[8.0]
  def change
    create_table :jds do |t|
      t.integer :user_id
      t.integer :company_id
      t.string :title
      t.string :link_to_file
      t.string :status, default: 'open'
      t.json :parsed_data, default: {}

      t.timestamps
    end

    # Adding foreign key constraints
    add_foreign_key :jds, :users, column: :user_id, primary_key: :id
    add_foreign_key :jds, :companies, column: :company_id, primary_key: :id

  end
end
