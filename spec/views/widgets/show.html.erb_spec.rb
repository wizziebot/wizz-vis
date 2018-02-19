require 'rails_helper'

RSpec.describe "widgets/show", type: :view do
  before(:each) do
    @widget = assign(:widget, Widget.create!(
      :name => "Name",
      :title => "Title",
      :row => 2,
      :col => 3,
      :size_x => 4,
      :size_y => 5,
      :dashboard => nil
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/Title/)
    expect(rendered).to match(/2/)
    expect(rendered).to match(/3/)
    expect(rendered).to match(/4/)
    expect(rendered).to match(/5/)
    expect(rendered).to match(//)
  end
end
