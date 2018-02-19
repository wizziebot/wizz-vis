require 'rails_helper'

RSpec.describe "dashboards/edit", type: :view do
  before(:each) do
    @dashboard = assign(:dashboard, Dashboard.create!(
      :name => "MyString"
    ))
  end

  it "renders the edit dashboard form" do
    render

    assert_select "form[action=?][method=?]", dashboard_path(@dashboard), "post" do

      assert_select "input[name=?]", "dashboard[name]"
    end
  end
end
