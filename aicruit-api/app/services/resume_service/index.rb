# frozen_string_literal: true

module ResumeService
  class Index < Base
    attr_reader :params, :current_user, :resumes

    def initialize(params, current_user)
      super()
      @params = params
      @current_user = current_user
    end

    def call
      return failure_response(message, errors) unless validate_user

      set_resumes
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

    def set_resumes
      @resumes = Resume.where(company_id: current_user.company_id).order(rating: :desc)
      @resumes = @resumes.where(job_description_id: params[:job_description_id]) if params[:job_description_id].present?

      if params[:search_key].present?
        key = "%#{params[:search_key].downcase}%"
        @resumes = @resumes.where(
          "LOWER(candidate_email) LIKE :key OR LOWER(candidate_first_name) LIKE :key OR LOWER(candidate_last_name) LIKE :key OR LOWER(CONCAT(candidate_first_name, ' ', candidate_last_name)) LIKE :key",
          key: key
        )
      end

      return unless params[:sort_key].present?

      sort_field, sort_dir = params[:sort_key].split('_')

      sort_column_map = {
        'firstname' => 'candidate_first_name',
        'lastname' => 'candidate_last_name',
        'email' => 'candidate_email',
        'experience' => 'years_of_experience',
        'status' => 'status'
      }

      return unless sort_column_map.key?(sort_field) && %w[asc desc].include?(sort_dir)

      @resumes = @resumes.order("#{sort_column_map[sort_field]} #{sort_dir.upcase}")
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
