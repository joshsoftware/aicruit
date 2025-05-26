# frozen_string_literal: true

require 'google/apis/calendar_v3'
require 'googleauth'

class GoogleCalendarService
  def initialize(user)
    @user = user
  end

  def create_event(title:, start_time:, end_time:)
    return nil unless @user.google_token.present?

    authorizer = Signet::OAuth2::Client.new(
      access_token: @user.google_token
    )

    calendar = Google::Apis::CalendarV3::CalendarService.new
    calendar.authorization = authorizer

    event = Google::Apis::CalendarV3::Event.new(
      summary: title,
      start: Google::Apis::CalendarV3::EventDateTime.new(date_time: start_time.to_datetime.rfc3339),
      end: Google::Apis::CalendarV3::EventDateTime.new(date_time: end_time.to_datetime.rfc3339),
      conference_data: {
        create_request: {
          request_id: SecureRandom.uuid,
          conference_solution_key: { type: 'hangoutsMeet' }
        }
      }
    )

    created_event = calendar.insert_event('primary', event, conference_data_version: 1)
    created_event.conference_data.entry_points.first.uri
  rescue StandardError => e
    Rails.logger.error("Google Calendar error: #{e.message}")
    nil
  end
end
