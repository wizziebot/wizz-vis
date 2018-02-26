class AddDatasourceToWidget < ActiveRecord::Migration[5.2]
  def change
    add_reference :widgets, :datasource, foreign_key: true
  end
end
