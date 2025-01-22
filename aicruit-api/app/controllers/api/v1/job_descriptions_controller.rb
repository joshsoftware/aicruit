# frozen_string_literal: true

class Api::V1::JobDescriptionsController < ApplicationController
  def create
    authorize! :create, JobDescription
    result = JobDescriptionService::Create.new(params[:job_description], current_user).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def index
    authorize! :read, JobDescription
    result = JobDescriptionService::Index.new(params, current_user).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def update
    authorize! :update, JobDescription
    result = JobDescriptionService::Update.new(params[:id], params[:job_description]).call
    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def destroy
    authorize! :destroy, JobDescription
    result = JobDescriptionService::Destroy.new(params[:id]).call
    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end
end
