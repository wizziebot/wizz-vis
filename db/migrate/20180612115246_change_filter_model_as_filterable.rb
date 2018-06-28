class ChangeFilterModelAsFilterable < ActiveRecord::Migration[5.2]
  def change
    remove_index :filters, :widget_id
    remove_foreign_key :filters, :widgets
    rename_column :filters, :widget_id, :filterable_id
    add_column :filters, :filterable_type, :string, default: 'Widget'
    add_index :filters, %i[filterable_id filterable_type]
  end
end
