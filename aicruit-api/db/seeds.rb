# Ensure the existence of records required to run the application in every environment

# Create Company
company = Company.find_or_create_by!(
  name: 'Josh Software Private Limited',
  website: 'www.joshsoftware.com',
  contact_email: 'contact@joshsoftware.com',
  contact_number: '+91 1234567890',
  subdomain: 'joshsoftware'
)

# Create Roles: Super Admin | Company Admin | HR Admin | HR
roles = ['Super Admin', 'Company Admin', 'HR Admin', 'HR', 'Candidate']
roles.each do |role_name|
  Role.find_or_create_by!(name: role_name)
end

company_id = company.id

# Create Users
users_data = [
  { first_name: 'superadmin', last_name: 'one', email: 'superadmin.one@gmail.com', password: 'Superadmin@12345', role_name: 'Super Admin' },
  { first_name: 'superadmin', last_name: 'two', email: 'superadmin.two@gmail.com', password: 'Superadmin@12345', role_name: 'Super Admin' },
  { first_name: 'companyadmin', last_name: 'one', email: 'companyadmin.one@gmail.com', password: 'Companyadmin@12345', role_name: 'Company Admin' },
  { first_name: 'companyadmin', last_name: 'two', email: 'companyadmin.two@gmail.com', password: 'Companyadmi n@12345', role_name: 'Company Admin'},
  { first_name: 'hradmin', last_name: 'one', email: 'hradmin.one@gmail.com', password: 'Hradmin@12345', role_name: 'HR Admin' },
  { first_name: 'hradmin', last_name: 'two', email: 'hradmin.two@gmail.com', password: 'Hradmin@12345', role_name: 'HR Admin' },
  { first_name: 'hr', last_name: 'one', email: 'hr.one@gmail.com', password: 'Hr@12345', role_name: 'HR' },
  { first_name: 'hr', last_name: 'two', email: 'hr.two@gmail.com', password: 'Hr@12345', role_name: 'HR' },
  { first_name: 'candidate', last_name: 'one', email: 'candidate.one@gmail.com', password: 'Candidate@12345', role_name: 'Candidate' },
  { first_name: 'candidate', last_name: 'two', email: 'candidate.two@gmail.com', password: 'Candidate@12345', role_name: 'Candidate' }

]

# If a user already exists with the given email, only their attributes will be updated.
# If the user does not exist, a new one will be created and saved.

users_data.each do |user_data|
  role = Role.find_by!(name: user_data[:role_name])
  user = User.find_or_initialize_by(email: user_data[:email])
  user.update!(
    first_name: user_data[:first_name],
    last_name: user_data[:last_name],
    password: user_data[:password],
    role_id: role.id,
    company_id: company_id
  )
end
