/* jshint esversion: 6 */

export default {
  getDimensionsAggregators(dimensions, aggregators, options) {
    const coordinate_dimension =
      dimensions.find((e) => (
        /coordinate|latlong|latlng/.test(e.name)
      ));

    const coordinate_aggregator =
      aggregators.find((e) => (
        /coordinate|latlong|latlng/.test(e.name)
      ));

    const coordinate_field = (coordinate_dimension || {}).name ||
                            (coordinate_aggregator || {}).name;

    const grouped_dimensions = dimensions.filter((e) => (
      e.name !== (coordinate_dimension || {}).name
    ));

    const selected_aggregators =
      (options.metrics && castArray(options.metrics)) ||
       aggregators.filter((a) => (a !== coordinate_aggregator))
                             .map((a) => (a.name));

    return [
      coordinate_field,
      grouped_dimensions,
      selected_aggregators
    ];
  }
};
