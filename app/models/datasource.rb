class Datasource < ApplicationRecord
  # ==========================================================
  # Relations
  # ==========================================================
  has_many :dimensions, dependent: :destroy
  has_many :aggregators, dependent: :destroy
end
