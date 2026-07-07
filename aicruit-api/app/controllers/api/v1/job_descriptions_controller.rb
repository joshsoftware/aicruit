# frozen_string_literal: true

class Api::V1::JobDescriptionsController < ApplicationController
  skip_before_action :authenticate!, only: %i[published index show download]
  before_action :authenticate_optional!, only: %i[published index show download]

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
    result = JobDescriptionService::Index.new(params).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def update
    authorize! :update, JobDescription.find_by(id: params[:id]), @current_service
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

  def applicant_resumes
    job = JobDescription.find_by(id: params[:id])
    authorize! :read, job
    result = JobDescriptionService::ApplicantResumes.new(job).call
    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def upload
    authorize! :create, JobDescription
    result = JobDescriptionService::Upload.new(params, current_user).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def download
    job_description = JobDescription.find(params[:id])
    unless job_description.published?
      authorize! :read, job_description
    end

    if job_description.file_url.present?
      result = AwsService::S3Download.new(job_description.file_url).call
      if result[:success]
        send_data result[:data][:content], filename: result[:data][:filename], type: result[:data][:content_type], disposition: 'inline'
      else
        render json: result.to_h, status: :unprocessable_entity
      end
    else
      render json: { success: false, message: "No file associated with this job description" }, status: :not_found
    end
  end
end
