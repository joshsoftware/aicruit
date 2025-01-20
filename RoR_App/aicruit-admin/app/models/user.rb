class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  belongs_to :company #, default: -> { Company.find_by(id: 1) }
  belongs_to :role #, default: -> { Role.find_by(id: 1) }
  # has_many :jds, foreign_key: 'user_id'
  # has_many :resumes, foreign_key: 'uploaded_by'

  # Validations (optional)
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :contact_number, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true

  # Optional: Define a custom admin? method
  def admin?
    role_id == 1 or role_id == 2
  end

  def customer?
      role == 'customer'
  end
end
