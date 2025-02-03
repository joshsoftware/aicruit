# frozen_string_literal: true

module JobDescriptionService
  class Show < Base
    attr_reader :id

    def initialize(id)
      super()
      @id = id
    end

    def call
      return failure_response(message, errors) unless set_job_description

      set_data
      success_response(message, data)
    end

    private

    def set_job_description
      @job_description = JobDescription.find_by(id:)
      unless @job_description
        @message = I18n.t('model.found.failure', model_name: 'Job Description')
        return false
      end
      true
    end

    def set_data
      @message = I18n.t('model.found.success', model_name: 'Job Description')
      @data = JobDescriptionSerializer.new(@job_description)
    end
  end
end
