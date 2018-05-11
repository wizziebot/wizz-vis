class CreatePostAggregators < ActiveRecord::Migration[5.2]
  def change
    create_table :post_aggregators do |t|
      t.string :output_name
      t.string :operator
      t.string :field_1
      t.string :field_2
      t.integer :order
      t.references :widget, foreign_key: true

      t.timestamps
    end
  end
end
