module ApplicationHelper
  def layout_theme
    action_name == 'show' && @dashboard&.theme
  end

  def nav_logos
    capture do
      concat primary_logo
      concat secondary_logo
    end
  end

  def primary_logo
    link_to root_path, class: 'brand-logo menu-smooth-scroll' do
      if ENV['PRIMARY_LOGO_URL']
        image_tag(ENV['PRIMARY_LOGO_URL'])
      else
        image_tag(asset_path('logo.png'))
      end
    end
  end

  def secondary_logo
    if ENV['SECONDARY_LOGO_URL']
      content_tag :div, class: 'brand-logo secondary-logo right' do
        image_tag(ENV['SECONDARY_LOGO_URL'])
      end
    end
  end
end
