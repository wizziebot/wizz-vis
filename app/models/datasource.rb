class Datasource < ApplicationRecord
  # ==========================================================
  # Relations
  # ==========================================================
  has_many :dimensions
  has_many :aggregators
end
