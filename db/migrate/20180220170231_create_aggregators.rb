class CreateAggregators < ActiveRecord::Migration[5.2]
  def change
    create_table :aggregators do |t|
      t.string :name
      t.string :aggregator_type
      t.references :datasource, foreign_key: true

      t.timestamps
    end
  end
end
