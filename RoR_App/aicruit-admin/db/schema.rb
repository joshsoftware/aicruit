# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_01_20_054233) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "jds", force: :cascade do |t|
    t.integer "user_id"
    t.integer "company_id"
    t.string "title"
    t.string "link_to_file"
    t.string "status", default: "open"
    t.json "parsed_data", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "resume_analyses", force: :cascade do |t|
    t.string "ratings"
    t.integer "jd_id"
    t.integer "resume_id"
    t.string "matching_skills"
    t.string "missing_skills"
    t.string "additional_skills"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "resumes", force: :cascade do |t|
    t.integer "jd_id"
    t.string "candidate_name"
    t.string "link_to_file"
    t.boolean "is_interviewed", default: false
    t.string "primary_skills"
    t.string "secondary_skills"
    t.string "responsibilities"
    t.integer "years_of_experience"
    t.string "projects"
    t.json "parsed_data", default: {}
    t.integer "uploaded_by"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.bigint "company_id", null: false
    t.bigint "role_id", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "contact_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role_id"], name: "index_users_on_role_id"
  end

  add_foreign_key "jds", "companies"
  add_foreign_key "jds", "users"
  add_foreign_key "resume_analyses", "jds"
  add_foreign_key "resume_analyses", "resumes"
  add_foreign_key "resumes", "jds"
  add_foreign_key "resumes", "users", column: "uploaded_by"
  add_foreign_key "users", "companies"
  add_foreign_key "users", "roles"
end
