# frozen_string_literal: true

module JobDescriptionService
  class Create < Base
    attr_reader :params, :current_user

    def initialize(params, current_user)
      super()
      @params = params
      @current_user = current_user
    end

    def call
      return failure_response(message, errors) unless validate_user
      return failure_response(message, errors) unless create_job_description

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

    def create_job_description
      permitted_params = params.require(:job_description).permit(:title, :file_url, parsed_data: {})

      merged_params = permitted_params.merge(user_id: current_user.id, company_id: current_user.company_id)
      @job_description = JobDescription.new(merged_params)
      @job_description.save!
    rescue ActiveRecord::RecordInvalid
      @message = I18n.t('model.create.failure', model_name: 'Job Description')
      @errors = @job_description.errors.full_messages
      false
    else
      true
    end

    def set_data
      @message = I18n.t('model.create.success', model_name: 'JobDescription')
      @data = JobDescriptionSerializer.new(@job_description)
    end
  end
end
