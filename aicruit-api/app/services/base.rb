# frozen_string_literal: true

require 'base64'

class Base
  include ActiveModel::Model

  attr_reader :errors, :data, :message

  def initialize
    @errors   = []
    @data     = []
    @message  = ''
  end

  def success_response(message = nil, data = [])
    { success: true, data:, message: }
  end

  def failure_response(message, errors = [])
    { success: false, errors:, message: }
  end

  def encode_hash(hash)
    Base64.urlsafe_encode64(hash.to_json)
  end

  def decode_hash(encoded_hash)
    JSON.parse(Base64.decode64(encoded_hash))
  rescue JSON::ParserError
    false
  end

  def jwt_encode(payload, exp = 1.days.from_now)
    secret_key = Rails.application.credentials.secret_key_base
    payload[:exp] = exp.to_i
    JWT.encode(payload, secret_key)
  end

  def jwt_decode(token)
    JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
  rescue JWT::DecodeError
    false
  end

  def generate_secure_password
    special_chars = "!@\#$%^&*()-_=+[]{}|;:,.<>?/"
    password = [
      ('a'..'z').to_a.sample,
      ('A'..'Z').to_a.sample,
      ('0'..'9').to_a.sample,
      special_chars.chars.sample
    ].shuffle.join + SecureRandom.base64(6).tr('+/=', special_chars.chars.sample)

    password.length < 8 ? "#{password}Aa1!" : password
  end
end
