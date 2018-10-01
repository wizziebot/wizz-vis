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

  accepts_nested_attributes_for :widgets

  # ==========================================================
  # Validations
  # ==========================================================
  validates :name, presence: true
  validates :theme, inclusion: { in: %w[light dark] }

  def self.search(search)
    if search
      where(
        'name ILIKE ?',
        "%#{search.split.join('%')}%"
      )
    else
      all
    end
  end
end
