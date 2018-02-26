class Aggregator < ApplicationRecord
  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :datasource
  has_and_belongs_to_many :widgets
end
