# frozen_string_literal: true

module UserService
  class SignIn < Base
    attr_reader :params, :user

    def initialize(params)
      super()
      @params = params
    end

    def call
      return failure_response(message) unless validate_user
      return failure_response(message) unless authenticate_user

      set_data
      success_response(message, data)
    end

    def validate_user
      @user = User.find_by(email: sign_in_params[:email])
      return true if @user.present?

      @message = I18n.t('user.errors.not_found')
      false
    end

    def authenticate_user
      return true if @user.authenticate(sign_in_params[:password])

      @message = I18n.t('user.errors.invalid_password')
      false
    end

    def set_data
      token = jwt_encode({ user_id: @user.id })
      @data = { token:, user: UserSerializer.new(@user).as_json }
      @message = I18n.t('user.login.success')
    end

    def sign_in_params
      params.is_a?(ActionController::Parameters) ? params.permit(:email, :password) : params.slice(:email, :password)
    end
  end
end
