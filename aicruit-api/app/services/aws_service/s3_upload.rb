# frozen_string_literal: true

require 'aws-sdk-s3'

module AwsService
  class S3Upload < Base
    attr_reader :file, :bucket_name, :file_name

    def initialize(file, service_type = nil, file_name = nil)
      super()
      @file = file
      @service_type = service_type
      @file_name = file_name || generate_file_name(file, service_type)
      @bucket_name = ENV.fetch('AWS_BUCKET_NAME', nil)
    end

    def call
      begin
        s3_client = Aws::S3::Client.new(
          access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', nil),
          secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', nil),
          region: ENV.fetch('AWS_REGION', 'us-east-1')
        )
        # Upload the file to S3
        response = s3_client.put_object(
          bucket: bucket_name,
          key: file_name,
          body: file_content,
          content_type: content_type
        )
        # Return the S3 file path/URL
        file_url = "s3://#{bucket_name}/#{file_name}"
        success_response(I18n.t('aws.s3.upload.success'), { file_url: file_url, file_name: file_name })
      rescue Aws::S3::Errors::ServiceError => e
        failure_response("S3 service error: #{e.message}")
      rescue StandardError => e
        failure_response("Error uploading file: #{e.message}")
      end
    end

    private

    def file_content
      if file.respond_to?(:read)
        file.read
      elsif file.is_a?(String) && File.exist?(file)
        File.read(file)
      else
        file
      end
    end

    def content_type
      if file.respond_to?(:content_type)
        file.content_type
      else
        # Try to determine content type from file name or default to binary
        case File.extname(file_name).downcase
        when '.pdf'
          'application/pdf'
        when '.jpg', '.jpeg'
          'image/jpeg'
        when '.png'
          'image/png'
        when '.doc'
          'application/msword'
        when '.docx'
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        else
          'application/octet-stream'
        end
      end
    end

    def generate_file_name(file, service_type = nil)
      original_filename = if file.respond_to?(:original_filename)
                            file.original_filename
                          elsif file.respond_to?(:path)
                            File.basename(file.path)
                          else
                            "file_#{Time.now.to_i}"
                          end

      # Add timestamp to ensure uniqueness
      extension = File.extname(original_filename)
      basename = File.basename(original_filename, extension)

      # Add directory prefix based on service type
      prefix = determine_prefix(service_type)
      "#{prefix}#{basename}_#{Time.now.to_i}#{extension}"
    end

    def determine_prefix(service_type)
      case service_type
      when :resume, 'resume'
        'resume/'
      when :job_description, 'job_description'
        'job_description/'
      else
        '' # Default: no prefix
      end
    end
  end
end
