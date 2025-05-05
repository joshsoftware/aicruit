# frozen_string_literal: true

module ResumeService
  class Show < Base
    attr_reader :id

    def initialize(id)
      super()
      @id = id
    end

    def call
      return failure_response(message, errors) unless set_resume
      
      set_data
      success_response(message, data);
    end

    private

    def set_resume
      @resume = Resume.find(@id)
      unless @resume
        @message = I18n.t('model.found.failure', model_name: 'Resume')
        return false
      end
      true
    end

    def set_data
      @message = I18n.t('model.found.success', model_name: 'Resume')
      @data = ResumeSerializer.new(@resume)
    end
  end
end
