# frozen_string_literal: true

class JobDescriptionProcessingJob < ApplicationJob
  queue_as :default

  def perform(jd_id, jd_file_url)
    url = ENV.fetch('PYTHON_DOMAIN', 'http://127.0.0.1:8000')
    resource_url = ENV.fetch('PYTHON_JD_PARSE', nil)
    action = 'post'
    params_or_data = { id: jd_id, file_url: jd_file_url }
    ExternalService::HttpRequest.new(url, action, resource_url, params_or_data).call
  end
end
