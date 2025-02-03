# frozen_string_literal: true

module JobDescriptionService
  class Update < Base
    attr_reader :params, :id, :job_description

    def initialize(id, params)
      super()
      @id = id
      @params = params
    end

    def call
      return failure_response(message, errors) unless set_job_description
      return failure_response(message, errors) unless update_job_description

      set_data
      success_response(message, data)
    end

    private

    def set_job_description
      @job_description = JobDescription.find_by(id:)
      unless job_description
        @message = I18n.t('model.found.failure', model_name: 'Job description')
        return false
      end
      true
    end

    def update_job_description
      unless job_description.update(job_description_params)
        @message = I18n.t('model.update.failure', model_name: 'Job description')
        @errors = job_description.errors.full_messages
        return false
      end
      true
    end

    def set_data
      @message = I18n.t('model.update.success', model_name: 'Job description')
      @data = JobDescriptionSerializer.new(job_description)
    end

    def job_description_params
      params.permit(
        :title,
        :file_url,
        :status,
        parsed_data: {}
      )
    end
  end
end
