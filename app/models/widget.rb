require 'druid'

class Widget < ApplicationRecord
  include Intervalable

  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :dashboard, touch: true
  belongs_to :datasource
  has_and_belongs_to_many :dimensions
  has_and_belongs_to_many :aggregators
  has_many :filters, dependent: :destroy

  # ==========================================================
  # Validations
  # ==========================================================
  validates :row, :col, :size_x, :size_y, presence: true

  def data
    query = Datastore::Query.new(
      datasource: datasource.name,
      properties: attributes.merge(interval: interval),
      dimensions: dimensions,
      aggregators: aggregators
    )

    query.run
  end
end
