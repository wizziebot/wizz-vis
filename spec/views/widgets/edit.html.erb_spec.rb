require 'rails_helper'

RSpec.describe "widgets/edit", type: :view do
  before(:each) do
    @widget = assign(:widget, Widget.create!(
      :name => "MyString",
      :title => "MyString",
      :row => 1,
      :col => 1,
      :size_x => 1,
      :size_y => 1,
      :dashboard => nil
    ))
  end

  it "renders the edit widget form" do
    render

    assert_select "form[action=?][method=?]", widget_path(@widget), "post" do

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
