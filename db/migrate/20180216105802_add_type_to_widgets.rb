class AddTypeToWidgets < ActiveRecord::Migration[5.2]
  def change
    add_column :widgets, :type, :string
  end
end
