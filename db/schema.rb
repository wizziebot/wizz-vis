# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_03_07_194538) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "aggregators", force: :cascade do |t|
    t.string "name"
    t.string "aggregator_type"
    t.bigint "datasource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["datasource_id"], name: "index_aggregators_on_datasource_id"
  end

  create_table "aggregators_widgets", id: false, force: :cascade do |t|
    t.bigint "aggregator_id", null: false
    t.bigint "widget_id", null: false
  end

  create_table "dashboards", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "theme"
  end

  create_table "datasources", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "dimensions", force: :cascade do |t|
    t.string "name"
    t.string "dimension_type"
    t.bigint "datasource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["datasource_id"], name: "index_dimensions_on_datasource_id"
  end

  create_table "dimensions_widgets", id: false, force: :cascade do |t|
    t.bigint "dimension_id", null: false
    t.bigint "widget_id", null: false
  end

  create_table "widgets", force: :cascade do |t|
    t.string "title"
    t.integer "row"
    t.integer "col"
    t.integer "size_x"
    t.integer "size_y"
    t.bigint "dashboard_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type"
    t.bigint "datasource_id"
    t.string "range"
    t.datetime "start_time"
    t.datetime "end_time"
    t.string "granularity"
    t.integer "limit"
    t.jsonb "options", default: {}
    t.index ["dashboard_id"], name: "index_widgets_on_dashboard_id"
    t.index ["datasource_id"], name: "index_widgets_on_datasource_id"
    t.index ["options"], name: "index_widgets_on_options", using: :gin
  end

  add_foreign_key "aggregators", "datasources"
  add_foreign_key "dimensions", "datasources"
  add_foreign_key "widgets", "dashboards"
  add_foreign_key "widgets", "datasources"
end
