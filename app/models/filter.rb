class Filter < ApplicationRecord
  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :dimension
  belongs_to :widget

  # ==========================================================
  # Validations
  # ==========================================================
  validates :operator, :value, presence: true
end
