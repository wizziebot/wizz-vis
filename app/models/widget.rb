require 'druid'

class Widget < ApplicationRecord
  include Intervalable

  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :dashboard
  belongs_to :datasource
  has_and_belongs_to_many :dimensions
  has_and_belongs_to_many :aggregators

  # ==========================================================
  # Validations
  # ==========================================================
  validates :name, :row, :col, :size_x, :size_y, presence: true

  def data
    data_source = Druid::DataSource.new(datasource.name, ENV['DRUID_URL'])
    data_source.post(query_execution)
  end

  private

  def query_execution
    query = Druid::Query::Builder.new
    query.interval(*interval)
    query.long_sum([:events])
    query.granularity(granularity || :all)
    if dimensions.count == 1
      query.topn(dimensions.first.name.to_sym, aggregators.first.name.to_sym, 5)
    elsif dimensions.count > 1
      query.group_by(dimensions.map(&:name).map(&:to_sym))
    end

    query
  end
end
