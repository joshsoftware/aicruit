# frozen_string_literal: true

class Api::V1::JobDescriptionsController < ApplicationController
  skip_before_action :authenticate!, only: %i[published]

  def create
    authorize! :create, JobDescription
    result = JobDescriptionService::Create.new(params, current_user).call

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
    authorize! :update, JobDescription.find_by(id: params[:id])
    result = JobDescriptionService::Update.new(params[:id], params[:job_description]).call
    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def destroy
    authorize! :destroy, JobDescription.find_by(id: params[:id])
    result = JobDescriptionService::Destroy.new(params[:id]).call
    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def show
    authorize! :read, JobDescription.find_by(id: params[:id])
    result = JobDescriptionService::Show.new(params[:id]).call
    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def published
    authorize! :read, JobDescription
    result = JobDescriptionService::PublishedJobDescriptions.new.call
    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end
end
