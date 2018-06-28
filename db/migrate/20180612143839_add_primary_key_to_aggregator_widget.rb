class AddPrimaryKeyToAggregatorWidget < ActiveRecord::Migration[5.2]
  def change
    add_column :aggregators_widgets, :id, :primary_key
  end
end
