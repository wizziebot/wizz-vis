class CreateJoinTableDimensionWidget < ActiveRecord::Migration[5.2]
  def change
    create_join_table :dimensions, :widgets do |t|
      t.index [:dimension_id, :widget_id]
      t.index [:widget_id, :dimension_id]
    end
  end
end
