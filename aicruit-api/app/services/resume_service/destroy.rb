# frozen_string_literal: true

module ResumeService
  class Destroy < Base
    attr_reader :params, :current_user, :resume

    def initialize(params, current_user)
      super()
      @params = params
      @current_user = current_user
    end

    def call
      return failure_response(message, errors) unless find_resume
      return failure_response(message, errors) unless destroy_resume

      success_response(message, data)
    end

    private

    def find_resume
      @resume = Resume.find_by(id: params[:id], company_id: current_user.company_id)
      unless @resume
        @message = I18n.t('model.found.failure', model_name: 'Resume')
        return false
      end
      true
    end

    def destroy_resume
      if @resume.destroy
        @message = I18n.t('model.destroy.success', model_name: 'Resume')
        @data = {}
        true
      else
        @message = I18n.t('model.destroy.failure', model_name: 'Resume')
        @errors = @resume.errors.full_messages
        false
      end
    end
  end
end
