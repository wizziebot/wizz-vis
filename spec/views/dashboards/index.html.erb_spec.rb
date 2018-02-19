require 'rails_helper'

RSpec.describe "dashboards/index", type: :view do
  before(:each) do
    assign(:dashboards, [
      Dashboard.create!(
        :name => "Name"
      ),
      Dashboard.create!(
        :name => "Name"
      )
    ])
  end

  it "renders a list of dashboards" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
  end
end
