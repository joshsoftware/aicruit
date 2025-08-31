# frozen_string_literal: true

module ResumeService
  class Upload < Base
    attr_reader :params, :current_user, :link_to_file, :message, :response

    def initialize(params, current_user)
      super()
      @params = params
      @current_user = current_user
    end

    def call
      return failure_response(message, errors) unless validate_user
      return failure_response(I18n.t('errors.file.missing')) unless pdf_file_present?
      return failure_response(I18n.t('errors.file.invalid_format')) unless valid_pdf_format?
      return failure_response(message, errors) unless upload_file_to_s3

      @response = create_resume
      set_data
      response[:success] ? success_response(message, data) : failure_response(message, errors)
    end

    private

    def validate_user
      unless current_user
        @message = I18n.t('model.found.failure', model_name: 'User')
        return false
      end
      true
    end

    def pdf_file_present?
      params[:pdf_file].present?
    end

    def valid_pdf_format?
      file = params[:pdf_file]
      file.content_type == 'application/pdf'
    end

    def upload_file_to_s3
      file = params[:pdf_file]
      service = AwsService::S3Upload.new(file, :resume)
      result = service.call

      if result[:success]
        # File uploaded successfully
        @link_to_file = result[:data][:file_url]
      else
        @message = I18n.t('aws.s3.upload.failure')
        @errors = result[:message]
        return false
      end
      true
    end

    def create_resume
      merged_params = params.merge(link_to_file:).except(:pdf_file)
      result = ResumeService::Create.new(merged_params, current_user).call
      if result[:success] && result[:data]
        # Enqueue background job for additional processing
        ResumeProcessingJob.perform_later(result[:data].object.id.to_s, result[:data].object.link_to_file)
      end
      result
    end

    def set_data
      @message = response[:message]
      @data = response[:data]
      @errors = response[:errors]
    end
  end
end
