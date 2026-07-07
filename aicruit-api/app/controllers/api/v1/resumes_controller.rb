# frozen_string_literal: true

class Api::V1::ResumesController < ApplicationController
  skip_before_action :authenticate!, only: %i[upload]
  def create
    result = ResumeService::Create.new(params, current_user).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def index
    result = ResumeService::Index.new(params, current_user).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def update
    result = ResumeService::Update.new(params[:id], params[:resume]).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def show
    result = ResumeService::Show.new(params[:id]).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def upload
    result = ResumeService::Upload.new(params).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def download
    resume = Resume.find(params[:id])
    if resume.link_to_file.present?
      result = AwsService::S3Download.new(resume.link_to_file).call
      if result[:success]
        send_data result[:data][:content], filename: result[:data][:filename], type: result[:data][:content_type], disposition: 'inline'
      else
        render json: result.to_h, status: :unprocessable_entity
      end
    else
      render json: { success: false, message: "No file associated with this resume" }, status: :not_found
    end
  end
end
