class AddIntervalToDashboard < ActiveRecord::Migration[5.2]
  def change
    add_column :dashboards, :interval, :integer
  end
end
