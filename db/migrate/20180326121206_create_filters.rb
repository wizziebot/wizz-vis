class CreateFilters < ActiveRecord::Migration[5.2]
  def change
    create_table :filters do |t|
      t.references :dimension, foreign_key: true
      t.references :widget, foreign_key: true
      t.string :operator
      t.string :value

      t.timestamps
    end
  end
end
