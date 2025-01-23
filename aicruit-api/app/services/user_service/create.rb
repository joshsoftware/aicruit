# frozen_string_literal: true

module UserService
  class Create < Base
    attr_reader :params, :company

    def initialize(params)
      super()
      @params = params
    end

    def call
      return failure_response(message, errors) unless set_company
      return failure_response(message, errors) unless create_user

      set_data
      success_response(message, data)
    end

    private

    def set_company
      @company = Company.find_by(id: params[:company_id]) || Company.first

      unless @company
        @message = I18n.t('model.found.failure', model_name: 'Company')
        return false
      end
      true
    end

    def set_data
      @message = I18n.t('model.create.success', model_name: 'User')
      @data = UserSerializer.new(@user)
    end

    def create_user
      @user = User.new(user_params.merge(company_id: company.id))
      unless @user.save
        @message = I18n.t('model.create.failure', model_name: 'User')
        @errors = @user.errors.full_messages
        return false
      end

      true
    end

    def user_params
      params.permit(%i[first_name last_name email password role_id company_id])
    end
  end
end
