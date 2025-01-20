class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # require 'cancan/matchers'

  before_action :authenticate_user!
  

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_url, alert: exception.message
  end

  private

  def after_sign_in_path_for(resource)
    flash[:notice] = "Welcome back, #{resource.email}!"
    admin_dashboard_index_path # or any other path you'd like to redirect to after login
  end
end
