# frozen_string_literal: true

module ResumeService
  class Create < Base
    attr_reader :params, :current_user

    def initialize(params, current_user)
      super()
      @params = params
      @current_user = current_user
    end

    def call
      return failure_response(message, errors) unless set_candidate
      return failure_response(message, errors) unless create_resume

      # send_password_reset_email if @new_user

      set_data
      success_response(message, data)
    end

    private

    def set_candidate
      @candidate = User.find_by(email: resume_params[:candidate_email])
      if @candidate.nil?
        @new_user = true
        temp_password = generate_secure_password
        @candidate = User.create!(email: resume_params[:candidate_email],
                                  first_name: resume_params[:candidate_first_name],
                                  last_name: resume_params[:candidate_last_name],
                                  password: temp_password)
      end
      true
    end

    def create_resume
      referred_by = resume_params[:candidate_email] == current_user.email ? nil : current_user
      merged_params = resume_params.merge(user_id: @candidate.id, referred_by: referred_by, company_id: current_user.company_id)
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
                    :years_of_experience, :link_to_file, :status, :company_id, :candidate_mobile_no, :rating,
                    primary_skills: [], secondary_skills: [], domain_expertise: [],
                    matching_skills: [], missing_skills: [])
    end
  end
end
