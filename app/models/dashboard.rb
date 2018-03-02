class Dashboard < ApplicationRecord
  include Defaults

  # ==========================================================
  # Default values
  # ==========================================================
  default :theme, 'light'

  # ==========================================================
  # Relations
  # ==========================================================
  has_many :widgets

  # ==========================================================
  # Validations
  # ==========================================================
  validates :name, presence: true
  validates :theme, inclusion: { in: %w[light dark] }
end
