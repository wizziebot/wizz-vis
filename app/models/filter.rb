class Filter < ApplicationRecord
  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :dimension
  belongs_to :filterable, polymorphic: true

  # ==========================================================
  # Validations
  # ==========================================================
  validates :operator, presence: true
  validates :operator,
            inclusion: { in: %w[eq neq > <= < <= in nin in_rec in_circ regex] }
end
