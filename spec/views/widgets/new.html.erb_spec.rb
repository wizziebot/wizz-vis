require 'rails_helper'

RSpec.describe "widgets/new", type: :view do
  before(:each) do
    assign(:widget, Widget.new(
      :name => "MyString",
      :title => "MyString",
      :row => 1,
      :col => 1,
      :size_x => 1,
      :size_y => 1,
      :dashboard => nil
    ))
  end

  it "renders new widget form" do
    render

    assert_select "form[action=?][method=?]", widgets_path, "post" do

      assert_select "input[name=?]", "widget[name]"

      assert_select "input[name=?]", "widget[title]"

      assert_select "input[name=?]", "widget[row]"

      assert_select "input[name=?]", "widget[col]"

      assert_select "input[name=?]", "widget[size_x]"

      assert_select "input[name=?]", "widget[size_y]"

      assert_select "input[name=?]", "widget[dashboard_id]"
    end
  end
end
