class AddRangesToDashboard < ActiveRecord::Migration[5.2]
  def change
    add_column :dashboards, :range, :string
    add_column :dashboards, :start_time, :datetime
    add_column :dashboards, :end_time, :datetime
  end
end
