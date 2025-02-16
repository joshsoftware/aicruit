# frozen_string_literal: true

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins %r{\Ahttps?://.*\.aicruit\.com(:5173)?\z}

    resource '*',
             headers: :any,
             methods: :any,
             credentials: true
  end
end
