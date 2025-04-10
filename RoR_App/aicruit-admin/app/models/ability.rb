# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)

    user ||= User.new 
    if user.role&.name == "super_admin"
      can :manage, :all
    elsif user.role&.name == "admin"
      can :manage, User
      can :manage, Company
    elsif user.role&.name == "hr_admin"
      can :read, :all
    end
  end
end
