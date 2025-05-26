# frozen_string_literal: true

require 'google-id-token'

module UserService
  class GoogleSignIn < Base
    attr_reader :token, :user

    def initialize(token)
      super()
      @token = token
    end

    def call
      return failure_response('Invalid token') unless token.present?

      validator = GoogleIDToken::Validator.new
      payload = validator.check(token, ENV.fetch('GOOGLE_CLIENT_ID', nil))

      return failure_response('Invalid Google token') unless payload

      @user = User.find_or_initialize_by(email: payload['email'])
      @user.first_name ||= payload['given_name']
      @user.last_name ||= payload['family_name']
      @user.google_token = token
      @user.password ||= SecureRandom.hex(10)

      if @user.save
        set_data
        success_response('Signed in with Google successfully', @data)
      else
        failure_response(@user.errors.full_messages.join(', '))
      end
    rescue StandardError => e
      failure_response(e.message)
    end

    def set_data
      jwt = jwt_encode({ user_id: @user.id })
      @data = { token: jwt, user: UserSerializer.new(@user).as_json }
    end
  end
end
