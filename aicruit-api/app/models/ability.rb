# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    @user = user || User.new
    send @user.role.name.downcase.gsub(' ', '_') unless @user.role.nil?
  end

  def super_admin
    can :manage, :all
  end

  def candidate
    can :read, JobDescription, status: 'published'
  end

  def hr_admin
    can :manage, JobDescription
  end

  def hr
    can :read, JobDescription
  end
end
