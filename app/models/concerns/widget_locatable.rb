module WidgetLocatable
  extend ActiveSupport::Concern

  included do
    # ==========================================================
    # Validations
    # ==========================================================
    validate :validate_aggregators
  end

  def data
    result = super

    return result if aggregators.any?(&:coordinate?)

    group_dimension = dimensions.detect { |d| !d.coordinate? }
    result.sort_by { |r| r['timestamp'] }
          .reverse
          .uniq { |r| r[group_dimension.name] }
  end

  private

  def validate_aggregators
    errors.add(:aggregators, 'at least one is needed') if aggregators.size.zero?
  end
end
