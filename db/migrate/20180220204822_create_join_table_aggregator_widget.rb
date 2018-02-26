class CreateJoinTableAggregatorWidget < ActiveRecord::Migration[5.2]
  def change
    create_join_table :aggregators, :widgets do |t|
      t.index [:aggregator_id, :widget_id]
      t.index [:widget_id, :aggregator_id]
    end
  end
end
