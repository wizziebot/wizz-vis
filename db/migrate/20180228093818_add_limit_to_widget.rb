class AddLimitToWidget < ActiveRecord::Migration[5.2]
  def change
    add_column :widgets, :limit, :integer
  end
end
