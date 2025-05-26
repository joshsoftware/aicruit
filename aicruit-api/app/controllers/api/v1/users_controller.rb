# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate!

  def create
    result = UserService::Create.new(params[:user]).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def sign_in
    result = UserService::SignIn.new(params[:user]).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unprocessable_entity
    end
  end

  def google_sign_in
    result = UserService::GoogleSignIn.new(params[:token]).call

    if result[:success]
      render json: result.to_h, status: :ok
    else
      render json: result.to_h, status: :unauthorized
    end
  end
end
