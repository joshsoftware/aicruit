# frozen_string_literal: true

module JobDescriptionService
  class PublishedJobDescriptions < Base
    attr_reader :job_descriptions

    def call
      return failure_response(message, errors) unless set_job_descriptions

      set_data
      success_response(message, data)
    end

    private

    def set_job_descriptions
      @job_descriptions = JobDescription.where(status: 'published')
      if @job_descriptions.empty?
        @message = I18n.t('model.found.failure', model_name: 'Published job descriptions')
        return false
      end
      true
    end

    def set_data
      @message = I18n.t('model.found.success', model_name: 'Published job descriptions')
      @data = ActiveModelSerializers::SerializableResource.new(@job_descriptions, each_serializer: JobDescriptionSerializer)
    end
  end
end
