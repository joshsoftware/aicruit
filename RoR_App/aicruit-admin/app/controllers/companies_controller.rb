class CompaniesController < ApplicationController
    before_action :authenticate_user!, :check_admin
    load_and_authorize_resource

    def index
        @companies = Company.all
        render json: @companies, status: :ok
    end

    def new
        @company = Company.new
        # No need to check for present? on a new record, just render a new empty object
        render json: @company, status: :ok
    end

    def create 
        @company = Company.new(company_params)
        if @company.save
            render json: @company, status: :created # HTTP status code 201 for created
        else
            render json: { data: "No data", errors: @company.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def show 
        @company = Company.find_by(id: params[:id])
        if @company
            render json: @company, status: :ok
        else
            render json: { data: "No data found" }, status: :not_found
        end
    end

    def edit
        @company = Company.find_by(id: params[:id])
        if @company
            render json: @company, status: :ok
        else
            render json: { data: "No data found" }, status: :not_found
        end
    end 

    def update
        @company = Company.find_by(id: params[:id])
        if @company&.update(company_params)
            render json: @company, status: :ok
        else
            render json: { data: "No data found", errors: @company.errors.full_messages }, status: :not_found
        end
    end

    def delete
        @company = Company.find_by(id: params[:id])
        if @company
          @company.destroy
          render json: { message: 'Company deleted successfully' }, status: :ok
        else
          render json: { data: "No data found" }, status: :not_found
        end
    end

    private

    # Ensure that the company_params method is defined correctly.
    def company_params
        params.require(:company).permit(:name, :address, :contact_email, :phone_number)
    end
end
