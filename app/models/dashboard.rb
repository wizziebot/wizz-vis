class Dashboard < ApplicationRecord
  include Defaults

  # ==========================================================
  # Default values
  # ==========================================================
  default :theme, 'light'

  # ==========================================================
  # Relations
  # ==========================================================
  has_many :widgets, dependent: :destroy

  # ==========================================================
  # Validations
  # ==========================================================
  validates :name, presence: true
  validates :theme, inclusion: { in: %w[light dark] }
end
