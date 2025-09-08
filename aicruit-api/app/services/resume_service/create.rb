# frozen_string_literal: true

module ResumeService
  class Create < Base
    attr_reader :params, :job_description

    def initialize(params)
      super()
      @params = params
    end

    def call
      return failure_response(message, errors) unless set_job
      return failure_response(message, errors) unless set_candidate
      return failure_response(message, errors) unless create_resume

      # send_password_reset_email if @new_user

      set_data
      success_response(message, data)
    end

    private

    def set_job
      @job_description = JobDescription.find_by(id: resume_params[:job_description_id])
      if @job_description.nil?
        @message = I18n.t('model.found.failure', model_name: 'Job description')
        return false
      end
      true
    end

    def set_candidate
      @candidate = User.find_by(email: resume_params[:candidate_email])
      if @candidate.nil?
        @new_user = true
        temp_password = generate_secure_password
        @candidate = User.create!(email: resume_params[:candidate_email],
                                  first_name: resume_params[:candidate_first_name],
                                  last_name: resume_params[:candidate_last_name],
                                  company_id: job_description&.company_id,
                                  password: temp_password)
      end
      true
    end

    def create_resume
      merged_params = resume_params.merge(user_id: @candidate&.id, company_id: job_description&.company_id)
      @resume = Resume.new(merged_params)
      @resume.save!
    rescue ActiveRecord::RecordInvalid
      @message = I18n.t('model.create.failure', model_name: 'Resume')
      @errors = @resume.errors.full_messages
      false
    else
      true
    end

    def set_data
      @message = I18n.t('model.create.success', model_name: 'Resume')
      @data = ResumeSerializer.new(@resume)
    end

    def resume_params
      params.permit(:job_description_id, :candidate_email, :candidate_first_name, :candidate_last_name,
                    :link_to_file, :status, :company_id, :years_of_experience, :candidate_mobile_no, matching_result: {})
    end
  end
end
