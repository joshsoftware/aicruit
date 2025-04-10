class Admin::DashboardController < ApplicationController
    before_action :authenticate_user!, :check_admin
    # load_and_authorize_resource
    
    def index
        @users = User.all
        # if @users.present?
        #     render json: @users.to_h, status: :ok
        # else
        #     render json: {data: "No data"}, status: :unprocessable_entity
        # end
    end

    private

    def check_admin
        redirect_to root_path, alert: 'Not authorized' unless current_user.admin?
    end
end