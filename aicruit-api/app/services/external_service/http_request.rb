# frozen_string_literal: true

require 'httparty'

module ExternalService
  class HttpRequest
    include HTTParty
    attr_reader :resource_url, :action, :params_or_data

    def initialize(url, action, resource_url, params_or_data)
      self.class.base_uri url
      @action = action
      @resource_url = resource_url
      @params_or_data = params_or_data
      @headers = {
        'Content-Type' => 'application/json'
      }

    end

    def call
      send_request
    rescue Errno::ECONNREFUSED => e
      { 'errors' => I18n.t('exception.errors.detail', message: e.message.to_s) }
    end

    def send_request
      case action
      when 'get'
        self.class.get(resource_url, query: params_or_data, headers: @headers)
      when 'post'
        self.class.post(resource_url, body: JSON.generate(params_or_data), headers: @headers)
      when 'put'
        self.class.put(resource_url, body: JSON.generate(params_or_data), headers: @headers)
      when 'patch'
        self.class.patch(resource_url, body: JSON.generate(params_or_data), headers: @headers)
      when 'delete'
        self.class.delete(resource_url, query: params_or_data, headers: @headers)
      else
        raise ArgumentError, "Unsupported action: #{action}"
      end
    end

  end
end
