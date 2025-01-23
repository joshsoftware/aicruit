# frozen_string_literal: true

module JobDescriptionService
  class Destroy < Base
    attr_reader :id, :job_description

    def initialize(id)
      super()
      @id = id
    end

    def call
      return failure_response(message, errors) unless set_job_description
      return failure_response(message, errors) unless destroy_job_description

      set_data
      success_response(message, data)
    end

    private

    def set_job_description
      @job_description = JobDescription.find_by(id:)
      unless @job_description
        @message = I18n.t('model.found.failure', model_name: 'Job description')
        return false
      end
      true
    end

    def destroy_job_description
      unless job_description.destroy
        @message = I18n.t('model.delete.failure', model_name: 'Job description')
        @errors = job_description.errors.full_messages
        return false
      end
      true
    end

    def set_data
      @message = I18n.t('model.delete.success', model_name: 'Job description')
    end
  end
end
