module Api::WidgetApi
  # When datasource is referenced by its name in the widget initialization,
  # it's neccessary to fetch the dashboard instance to make the relation.
  # Also, dimensions and aggregators are arrays of names, so it's neccessary
  # to fetch them to be referenced by the relation.
  def initialize(params)
    if params
      datasource_from_params(params)
      dimensions_from_params(params)
      aggregators_from_params(params)
      filters_from_params(params)

      super(params)
    else
      super
    end
  end

  def update_self_and_relations(attributes, dimension_names, aggregators, filters)
    relations = {}
    datasource =
      if attributes[:datasource_id]
        Datasource.find(attributes[:datasource_id])
      else
        self.datasource
      end

    if dimension_names
      relations[:dimension_ids] = datasource.dimensions.where(name: dimension_names).map(&:id)
    end

    if aggregators
      self.aggregator_widgets = []
      relations[:aggregator_widgets_attributes] = []

      aggregators.each do |agg|
        aggregator_id = datasource.aggregators.find_by(name: agg[:aggregator]).id
        aw_fields = { aggregator_id: aggregator_id, aggregator_name: agg[:aggregator_name] }

        if agg[:filters]&.any?
          agg_filters = []
          agg['filters'].each do |filter|
            dimension = Dimension.find_by(datasource: datasource, name: filter[:dimension_name])
            agg_filters << {
              dimension_id: dimension.id,
              operator: filter[:operator],
              value: filter[:value]
            }
          end

          aw_fields[:filters_attributes] = agg_filters
        end

        relations[:aggregator_widgets_attributes] << aw_fields
      end
    end

    relations[:filters_attributes] = [] if filters

    (filters || []).each do |filter|
      dimension = Dimension.find_by(datasource: datasource, name: filter[:dimension_name])
      relations[:filters_attributes] << {
        dimension_id: dimension.id,
        operator: filter[:operator],
        value: filter[:value]
      }
    end

    update(attributes.merge(relations))
  end

  private

  def datasource_from_params(params)
    return unless params[:datasource_id]
    @datasource = Datasource.find(params[:datasource_id])
    params[:datasource_id] = @datasource.id
    params.delete(:datasource_name)
  end

  def dimensions_from_params(params)
    return unless params[:dimensions]
    params[:dimension_ids] = []
    params[:dimensions].each do |dimension_name|
      params[:dimension_ids] << @datasource.dimensions.find_by(name: dimension_name).id
    end
    params.delete(:dimensions)
  end

  def aggregators_from_params(params)
    return unless params[:aggregators]
    params[:aggregators].each do |agg|
      aggregator_id = @datasource.aggregators.find_by(name: agg[:aggregator]).id
      aw_fields = { aggregator_id: aggregator_id, aggregator_name: agg[:aggregator_name] }

      if agg[:filters]&.any?
        agg_filters = build_filter_params(agg[:filters])
        aw_fields[:filters_attributes] = agg_filters
      end
      params[:aggregator_widgets_attributes] ||= []
      params[:aggregator_widgets_attributes] << ActionController::Parameters.new(aw_fields).permit!
    end
    params.delete(:aggregators)
  end

  def filters_from_params(params)
    return unless params[:filters]
    params[:filters_attributes] = build_filter_params(params[:filters]).map do |filter|
      ActionController::Parameters.new(filter).permit!
    end
    params.delete(:filters)
  end

  def build_filter_params(filters = [])
    filters.map do |filter|
      dimension = Dimension.find_by(datasource: @datasource, name: filter[:dimension_name])
      {
        dimension_id: dimension.id,
        operator: filter[:operator],
        value: filter[:value]
      }
    end
  end
end
