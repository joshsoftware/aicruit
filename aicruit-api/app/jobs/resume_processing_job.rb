# frozen_string_literal: true

class ResumeProcessingJob < ApplicationJob
  queue_as :default

  def perform(resume_id, resume_url)
    url = ENV.fetch('PYTHON_DOMAIN', 'http://127.0.0.1:8000')
    resource_url = '/parse-job-description'
    action = 'post'
    params_or_data = { id: resume_id, file_url: resume_url }
    ExternalService::HttpRequest.new(url, action, resource_url, params_or_data).call
  end
end
