/* jshint esversion: 6 */
export default {
  chord(data, dim_origin, dim_destination, aggregator) {
    let groups = Object.create(null),
        to = [], from = [],
        matrix = [], full_list;

    data.forEach(item => {
      let dim0 = item[dim_origin]
      let dim1 = item[dim_destination]

      if (!groups[dim0]) groups[dim0] = {}
      groups[dim0][dim1] = item[aggregator.name]

      if(!from.includes(dim0)) from.push(dim0)
      if(!to.includes(dim1)) to.push(dim1)
    });

    full_list = from.concat(to.filter(d => !from.includes(d)))

    full_list.forEach(key => {
      let row = groups[key]
      let matrix_row = []
      full_list.forEach(col => {
        matrix_row.push(
          Object.is(row, undefined) || Object.is(row[col], undefined) ? 0 : row[col]
        )
      })
      matrix.push(matrix_row)
    })

    return {
      value: matrix,
      keys: full_list.map((key) => {
        return Object.is(key, null) ? 'N/A' : key
      })
    };
  },
}
