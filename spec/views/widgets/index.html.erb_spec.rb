require 'rails_helper'

RSpec.describe "widgets/index", type: :view do
  before(:each) do
    assign(:widgets, [
      Widget.create!(
        :name => "Name",
        :title => "Title",
        :row => 2,
        :col => 3,
        :size_x => 4,
        :size_y => 5,
        :dashboard => nil
      ),
      Widget.create!(
        :name => "Name",
        :title => "Title",
        :row => 2,
        :col => 3,
        :size_x => 4,
        :size_y => 5,
        :dashboard => nil
      )
    ])
  end

  it "renders a list of widgets" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => "Title".to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
    assert_select "tr>td", :text => 3.to_s, :count => 2
    assert_select "tr>td", :text => 4.to_s, :count => 2
    assert_select "tr>td", :text => 5.to_s, :count => 2
    assert_select "tr>td", :text => nil.to_s, :count => 2
  end
end
