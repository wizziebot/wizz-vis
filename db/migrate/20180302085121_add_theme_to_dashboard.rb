class AddThemeToDashboard < ActiveRecord::Migration[5.2]
  def change
    add_column :dashboards, :theme, :string
  end
end
