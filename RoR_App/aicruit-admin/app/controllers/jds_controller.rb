class JdsController < ApplicationController
    before_action :authenticate_user!
    load_and_authorize_resource

    def index
        @jds = Jd.all
        render json: @jds, status: :ok
    end

    def show
        @jd = Jd.find_by(id: params[:id])
        if @jd
            render json: @jd, status: :ok
        else
            render json: { message: "No data found" }, status: :not_found
        end
    end

    def new
        @jd = Jd.new
        render json: @jd, status: :ok
    end

    def create
        @jd = Jd.new(jd_params)
        if @jd.save
            render json: @jd, status: :created # HTTP status code 201 for created
        else
            render json: { message: "Unable to create JD", errors: @jd.errors.full_messages }, status: :unprocessable_entity
        end
    end
    
    def edit
        @jd = Jd.find_by(id: params[:id])
        if @jd
            render json: @jd, status: :ok
        else
            render json: { message: "No data found" }, status: :not_found
        end
    end

    def update
        @jd = Jd.find_by(id: params[:id])
        if @jd&.update(jd_params)
            render json: @jd, status: :ok
        else
            render json: { message: "Unable to update JD", errors: @jd.errors.full_messages }, status: :not_found
        end
    end

    def destroy
        @jd = Jd.find_by(id: params[:id])
        if @jd
            @jd.destroy
            render json: { message: 'JD deleted successfully' }, status: :ok
        else
            render json: { message: "No data found" }, status: :not_found
        end
    end

    private

    def jd_params
        params.require(:jd).permit(:user_id, :company_id, :title, :link_to_file, :status, :parsed_data)
    end
end
