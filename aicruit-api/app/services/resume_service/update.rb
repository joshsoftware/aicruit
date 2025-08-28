# frozen_string_literal: true

module ResumeService
  class Update < Base
    attr_reader :params, :current_user, :resume

    def initialize(params, current_user)
      super()
      @params = params
      @current_user = current_user
    end

    def call
      return failure_response(message, errors) unless find_resume
      return failure_response(message, errors) unless update_resume

      set_data
      success_response(message, data)
    end

    private

    def find_resume
      @resume = Resume.find_by(id: params[:id], company_id: current_user.company_id)
      unless @resume
        @message = I18n.t('model.found.failure', model_name: 'Resume')
        return false
      end
      true
    end

    def update_resume
      if @resume.update(resume_params)
        true
      else
        @message = I18n.t('model.update.failure', model_name: 'Resume')
        @errors = @resume.errors.full_messages
        false
      end
    end

    def set_data
      @message = I18n.t('model.update.success', model_name: 'Resume')
      @data = ResumeSerializer.new(@resume)
    end

    def resume_params
      params.permit(:candidate_email, :candidate_first_name, :candidate_last_name,
                    :years_of_experience, :link_to_file, :status, :candidate_mobile_no, :rating,
                    primary_skills: [], secondary_skills: [], domain_expertise: [],
                    matching_skills: [], missing_skills: [])
    end
  end
end
