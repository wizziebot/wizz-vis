class RemoveNameInWidgets < ActiveRecord::Migration[5.2]
  def change
    remove_column :widgets, :name, :string
  end
end
