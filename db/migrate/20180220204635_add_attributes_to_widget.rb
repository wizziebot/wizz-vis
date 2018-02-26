class AddAttributesToWidget < ActiveRecord::Migration[5.2]
  def change
    add_column :widgets, :range, :string
    add_column :widgets, :start_time, :datetime
    add_column :widgets, :end_time, :datetime
    add_column :widgets, :granularity, :string
  end
end
