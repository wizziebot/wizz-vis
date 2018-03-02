module ApplicationHelper
  def layout_theme
    action_name == 'show' && @dashboard&.theme
  end
end
