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

ActiveRecord::Schema[7.2].define(version: 2025_02_18_085133) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.string "website"
    t.string "contact_email"
    t.string "contact_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "subdomain"
    t.index ["subdomain"], name: "index_companies_on_subdomain", unique: true
  end

  create_table "job_descriptions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "company_id", null: false
    t.string "title"
    t.string "file_url"
    t.jsonb "parsed_data"
    t.integer "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "published_at"
    t.index ["company_id"], name: "index_job_descriptions_on_company_id"
    t.index ["user_id"], name: "index_job_descriptions_on_user_id"
  end

  create_table "resumes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "company_id", null: false
    t.bigint "job_description_id", null: false
    t.bigint "referred_by_id"
    t.string "candidate_email", null: false
    t.string "candidate_first_name", null: false
    t.string "candidate_last_name", null: false
    t.json "primary_skills", default: []
    t.json "secondary_skills", default: []
    t.json "domain_expertise", default: []
    t.json "matching_skills", default: []
    t.json "missing_skills", default: []
    t.integer "years_of_experience"
    t.string "link_to_file"
    t.integer "status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["candidate_email", "job_description_id"], name: "index_resumes_on_candidate_email_and_job_description_id", unique: true
    t.index ["company_id"], name: "index_resumes_on_company_id"
    t.index ["job_description_id"], name: "index_resumes_on_job_description_id"
    t.index ["referred_by_id"], name: "index_resumes_on_referred_by_id"
    t.index ["user_id"], name: "index_resumes_on_user_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "password_digest"
    t.bigint "role_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["role_id"], name: "index_users_on_role_id"
  end

  add_foreign_key "job_descriptions", "companies"
  add_foreign_key "job_descriptions", "users"
  add_foreign_key "resumes", "companies"
  add_foreign_key "resumes", "job_descriptions"
  add_foreign_key "resumes", "users"
  add_foreign_key "resumes", "users", column: "referred_by_id"
  add_foreign_key "users", "companies"
  add_foreign_key "users", "roles"
end
