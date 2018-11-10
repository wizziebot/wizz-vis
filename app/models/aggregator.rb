class Aggregator < ApplicationRecord
  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :datasource

  has_many :aggregator_widgets
  has_many :widgets, through: :aggregator_widgets

  def histogram?
    aggregator_type == 'approxHistogramFold'
  end

  def coordinate?
    name =~ /coordinate|latlong|latlng/
  end
end
