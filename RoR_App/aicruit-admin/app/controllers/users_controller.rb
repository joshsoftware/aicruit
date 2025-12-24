class UsersController < ApplicationController
    before_action :authenticate_user!, :check_admin
    load_and_authorize_resource

    def new
        @user = User.new
        render 'user/_form'
    end

    def create
        @user = User.new(user_params)
        if @user.save
            redirect_to admin_dashboard_index_path, notice: 'Customer account created successfully'
        else
            render 'user/_form'  # Render form for the same page to show errors
        end
    end

    def show
        @user = User.find(params[:id])
        render 'user/_show', locals: { user: @user }  # Instead of rendering a partial, render the full 'show' view
    end

    def edit
        @user = User.find(params[:id])
        render 'user/_form'  # Use the same form for editing
    end

    def update
        @user = User.find(params[:id])
        if @user.update(user_params)
            redirect_to admin_dashboard_index_path, notice: 'Profile updated successfully'
        else
            render 'user/_form'  # Render form to show errors
        end
    end

    def destroy
        @user = User.find(params[:id])
        if @user
            @user.destroy
            redirect_to admin_dashboard_index_path, notice: 'Customer account deleted successfully'
        else
            redirect_to aadmin_dashboard_index_path, alert: 'Customer not found'
        end
    end

    private

    def check_admin
        redirect_to root_path, alert: 'Not authorized' unless current_user.admin?
    end

    def user_params
        params.require(:user).permit(:first_name, :last_name, :email, :password, :phone_number, :address, :role)
    end
end
