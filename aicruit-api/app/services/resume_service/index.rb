# frozen_string_literal: true

module ResumeService
  class Index < Base
    attr_reader :params, :current_user, :resumes

    def initialize(params, current_user)
      super()
      @params = params
      @current_user = current_user
    end

    def call
      return failure_response(message, errors) unless validate_user

      set_resumes
      set_data
      success_response(message, data)
    end

    private

    def validate_user
      unless current_user
        @message = I18n.t('model.found.failure', model_name: 'User')
        return false
      end
      true
    end

    def set_resumes
      @resumes = Resume.where(company_id: current_user.company_id)
      @resumes = @resumes.where(job_description_id: params[:job_description_id]) if params[:job_description_id].present?
    end

    def set_data
      if @resumes.exists?
        @message = I18n.t('model.found.success', model_name: 'Resume')
        @data = ActiveModelSerializers::SerializableResource.new(
          @resumes, each_serializer: ResumeSerializer
        )
      else
        @message = I18n.t('model.found.failure', model_name: 'Resume')
        @data = []
      end
    end
  end
end
