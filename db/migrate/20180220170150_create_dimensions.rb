class CreateDimensions < ActiveRecord::Migration[5.2]
  def change
    create_table :dimensions do |t|
      t.string :name
      t.string :dimension_type
      t.references :datasource, foreign_key: true

      t.timestamps
    end
  end
end
