module Intervalable
  extend ActiveSupport::Concern

  RANGES = %w[second seconds minute minutes hour hours day days week weeks
              month months].freeze

  LAST_RANGE_REGEXP = /^last_(?<amount>(\d+(\.\d+)?))_(?<range>\w+)$/

  # ==========================================================
  # Validations
  # ==========================================================
  included do
    validate :validate_range
  end

  def compare?
    options&.[]('compare')
  end

  def interval
    @time_now ||= Time.now

    case range
    when /last_/
      interval_for_last
    when /current_/
      interval_for_current
    when /previous_/
      interval_for_previous
    else
      [start_time, end_time]
    end
  end

  def compare_interval
    return unless compare? && interval.any?
    [
      interval[0] - compare_difference,
      interval[1] - compare_difference
    ]
  end

  def intervals
    return [interval] unless compare?
    [compare_interval, interval]
  end

  private

  def interval_for_last
    m = range.match(LAST_RANGE_REGEXP)
    start_time = @time_now - m[:amount].to_f.send(m[:range])
    [start_time, @time_now]
  end

  def interval_for_current
    case range
    when 'current_day'
      [@time_now.beginning_of_day, (@time_now + 1.day).beginning_of_day]
    when 'current_week'
      [@time_now.beginning_of_week, (@time_now + 1.week).beginning_of_week]
    when 'current_month'
      [@time_now.beginning_of_month, (@time_now + 1.month).beginning_of_month]
    end
  end

  def interval_for_previous
    case range
    when 'previous_day'
      [@time_now.yesterday.beginning_of_day, @time_now.yesterday.end_of_day]
    when 'previous_week'
      [@time_now.prev_week, @time_now.prev_week.end_of_week]
    when 'previous_month'
      [@time_now.prev_month.beginning_of_month, @time_now.prev_month.end_of_month]
    end
  end

  def compare_difference
    case options['compare']['range']
    when 'previous_period'
      (interval[1] - interval[0])
    else
      options['compare']['amount'].to_i.send(options['compare']['range'])
    end
  end

  def validate_range
    return true unless range =~ /^last_/
    m = range.match(LAST_RANGE_REGEXP)
    errors.add(:range, 'invalid format') unless m && RANGES.include?(m[:range])
  end
end
