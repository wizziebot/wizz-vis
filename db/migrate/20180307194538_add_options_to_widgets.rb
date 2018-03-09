class AddOptionsToWidgets < ActiveRecord::Migration[5.2]
  def change
    add_column :widgets, :options, :jsonb, default: {}
    add_index  :widgets, :options, using: :gin
  end
end
