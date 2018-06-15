class AggregatorWidget < ApplicationRecord
  self.table_name = 'aggregators_widgets'

  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :aggregator
  belongs_to :widget
  has_many :filters, as: :filterable, dependent: :destroy

  accepts_nested_attributes_for :filters

  delegate :name, to: :aggregator
  delegate :aggregator_type, to: :aggregator
end
