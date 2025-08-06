# frozen_string_literal: true

class Api::V1::ResumesController < ApplicationController
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
    result = ResumeService::Update.new(params, current_user).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def upload
    result = ResumeService::Upload.new(params, current_user).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end
end
