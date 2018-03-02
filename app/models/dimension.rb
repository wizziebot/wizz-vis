class Dimension < ApplicationRecord
  # ==========================================================
  # Relations
  # ==========================================================
  belongs_to :datasource
  has_and_belongs_to_many :widgets

  def coordinate?
    name =~ /coordinate|latlong|latlng/
  end
end
