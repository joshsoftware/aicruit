# frozen_string_literal: true

require 'aws-sdk-s3'

module AwsService
  class S3Download < Base
    attr_reader :s3_url, :bucket_name, :file_name

    def initialize(s3_url)
      super()
      @s3_url = s3_url
      @bucket_name, @file_name = parse_s3_url(s3_url)
    end

    def call
      begin
        options = {
          access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', nil),
          secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', nil),
          region: ENV.fetch('AWS_REGION', 'us-east-1')
        }
        if ENV['AWS_ENDPOINT'].present?
          options[:endpoint] = ENV['AWS_ENDPOINT']
          options[:force_path_style] = true
        end

        s3_client = Aws::S3::Client.new(options)
        
        # Download the file content from S3
        response = s3_client.get_object(
          bucket: bucket_name,
          key: file_name
        )

        content_type = response.content_type || 'application/octet-stream'
        filename = File.basename(file_name)

        success_response(
          'File downloaded successfully',
          { content: response.body.read, filename: filename, content_type: content_type }
        )
      rescue Aws::S3::Errors::ServiceError => e
        failure_response("S3 service error: #{e.message}")
      rescue StandardError => e
        failure_response("Error downloading file: #{e.message}")
      end
    end

    private

    def parse_s3_url(url)
      unless url.to_s.start_with?('s3://')
        raise ArgumentError, "Invalid S3 URL format: #{url}"
      end
      
      parts = url.to_s.gsub('s3://', '').split('/', 2)
      [parts[0], parts[1]]
    end
  end
end
