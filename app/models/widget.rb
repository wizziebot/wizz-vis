require 'druid'

class Widget < ApplicationRecord
  include Intervalable
  include Api::WidgetApi

  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :dashboard, touch: true
  belongs_to :datasource
  has_and_belongs_to_many :dimensions
  has_many :filters, as: :filterable, dependent: :destroy
  has_many :aggregator_widgets, dependent: :destroy
  has_many :aggregators, through: :aggregator_widgets
  has_many :post_aggregators, dependent: :destroy

  accepts_nested_attributes_for :aggregator_widgets
  accepts_nested_attributes_for :post_aggregators
  accepts_nested_attributes_for :filters

  # ==========================================================
  # Validations
  # ==========================================================
  validates :row, :col, :size_x, :size_y, presence: true

  def data(override_filters = nil, override_options = {})
    query = Datastore::Query.new(
      datasource: datasource.name,
      properties: attributes.merge(intervals: intervals).merge(override_options),
      dimensions: dimensions,
      aggregators: aggregator_widgets.includes(:aggregator, :filters),
      post_aggregators: post_aggregators,
      filters: override_filters || filters,
      options: options
    )

    query.run
  end

  private

  def compare_data
    intervals.map do |i|
      Widget.instance_method(:data)
            .bind(self).call([], granularity: 'all', intervals: [i])
    end.flatten
  end
end
