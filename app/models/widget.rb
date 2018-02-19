class Widget < ApplicationRecord
  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :dashboard

  # ==========================================================
  # Validations
  # ==========================================================
  validates :name, :row, :col, :size_x, :size_y, presence: true
end
