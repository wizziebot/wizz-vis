class CreateWidgets < ActiveRecord::Migration[5.2]
  def change
    create_table :widgets do |t|
      t.string :name
      t.string :title
      t.integer :row
      t.integer :col
      t.integer :size_x
      t.integer :size_y
      t.references :dashboard, foreign_key: true

      t.timestamps
    end
  end
end
