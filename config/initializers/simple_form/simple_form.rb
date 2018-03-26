# Use this setup block to configure all options available in SimpleForm.
SimpleForm.setup do |config|
  config.wrappers :materialize, class: 'input-field', error_class: 'has_error' do |b|
    b.use :html5
    b.use :placeholder
    b.use :input
    b.use :label
    b.use :error, wrap_with: { tag: 'p', class: 'error-text'}
    b.use :hint,  wrap_with: { tag: 'p', class: 'help-block' }
  end
  config.error_notification_class = 'card-content red-text'
  config.button_class = 'btn waves-effect waves-light input-field'
  # Wrappers for forms and inputs using the Materialize toolkit.
  config.default_wrapper = :materialize
  config.wrappers :checkbox, tag: 'div', error_class: 'has-error' do |b|
    b.use :input
    b.use :label
    b.use :error, wrap_with: { tag: 'span', class: 'help-block' }
    b.use :hint,  wrap_with: { tag: 'p', class: 'help-block' }
  end
end
