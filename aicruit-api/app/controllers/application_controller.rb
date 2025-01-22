class ApplicationController < ActionController::API
  include ActionController::Serialization

  before_action :authenticate!

  rescue_from CanCan::AccessDenied do |exception|
    render json: { message: I18n.t('exception.authorized')}, status: :unauthorized
  end

  rescue_from ActiveRecord::RecordInvalid, with: :handle_record_invalid

  rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

  def authenticate!
    header = request.headers['Authorization']
    header = header.split.last if header
    begin
      jwt_payload(header)
      raise ActiveRecord::RecordNotFound unless current_user
    rescue ActiveRecord::RecordNotFound
      render json: { message: I18n.t('exception.record_not_found')}, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { message: I18n.t('exception.token_not_found') }, status: :unauthorized
    end
  end

  def current_user
    if @jwt_payload
      @current_user ||= User.find_by_id(@jwt_payload["user_id"]) if @jwt_payload.has_key?('user_id')
    end
    @current_user
  end

  def jwt_payload(token)
    @jwt_payload ||= jwt_decode(token)
  end

  def current_ability
    @current_ability ||= Ability.new(current_user)
  end

  private

  def jwt_decode(token)
    JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
  end

  def handle_record_invalid(exception)
    action = exception.record.id ? 'update' : 'create'
    render json: { errors: exception.record.errors.full_messages, message: "Failed to #{action} #{exception.record.class.name}" }, status: :unprocessable_entity
  end

  def handle_record_not_found(exception)
    render json: { errors: [], message: exception.message }, status: :unprocessable_entity
  end
end
