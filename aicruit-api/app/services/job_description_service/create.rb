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
      merged_params = job_description_params.merge(user_id: current_user.id, company_id: current_user.company_id)
      @job_description = JobDescription.new(merged_params)
      @job_description.save!
    rescue ActiveRecord::RecordInvalid
      @message = I18n.t('model.create.failure', model_name: 'Job Description')
      @errors = @medication.errors.full_messages
      false
    else
      true
    end

    def set_data
      @message = I18n.t('model.create.success', model_name: 'JobDescription')
      @data = JobDescriptionSerializer.new(@job_description)
    end

    def job_description_params
      params.permit(
        :title,
        :file_url,
        :parsed_data,
        :status,
        :user_id,
        :company_id
      )
    end
  end
end
