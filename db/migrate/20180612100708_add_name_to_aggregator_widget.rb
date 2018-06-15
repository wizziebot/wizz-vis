class AddNameToAggregatorWidget < ActiveRecord::Migration[5.2]
  def change
    add_column :aggregators_widgets, :aggregator_name, :string
  end
end
