# frozen_string_literal: true

class DeviseCreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      ## Database authenticatable
      t.string :email, null: false, default: ''
      t.integer :doorkeeper_uid
      t.string :doorkeeper_access_token
      t.timestamps null: false
    end

    add_index :users, :email, unique: true
  end
end
