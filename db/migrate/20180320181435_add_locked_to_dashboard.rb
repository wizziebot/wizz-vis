class AddLockedToDashboard < ActiveRecord::Migration[5.2]
  def change
    add_column :dashboards, :locked, :boolean, default: false
  end
end
