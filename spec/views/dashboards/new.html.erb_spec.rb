require 'rails_helper'

RSpec.describe "dashboards/new", type: :view do
  before(:each) do
    assign(:dashboard, Dashboard.new(
      :name => "MyString"
    ))
  end

  it "renders new dashboard form" do
    render

    assert_select "form[action=?][method=?]", dashboards_path, "post" do

      assert_select "input[name=?]", "dashboard[name]"
    end
  end
end
