# frozen_string_literal: true

module JobDescriptionService
  class Index < Base
    attr_reader :params, :current_user, :message, :data, :job_descriptions

    def initialize(params)
      super()
      @params = params
    end

    def call
      set_job_descriptions
      set_data
      success_response(message, data)
    end

    private

    def set_job_descriptions
      @job_descriptions = JobDescription.all
    end

    def set_data
      if @job_descriptions.exists?
        @message = I18n.t('model.found.success', model_name: 'Job Description')
        @data = ActiveModelSerializers::SerializableResource.new(@job_descriptions, each_serializer: JobDescriptionSerializer)
      else
        @message = I18n.t('model.found.failure', model_name: 'Job Description')
        @data = []
      end
    end
  end
end
