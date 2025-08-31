# frozen_string_literal: true

module JobDescriptionService
  class ApplicantResumes < Base
    attr_reader :job_description

    def initialize(job_description)
      super()
      @job_description = job_description
    end

    def call
      set_resumes
      set_data
      success_response(message, data)
    end

    private

    def set_resumes
      @resumes = job_description.resumes
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
