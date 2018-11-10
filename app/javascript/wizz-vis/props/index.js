/* jshint esversion: 6 */

import PropTypes from 'prop-types';

export const BASE = {
  error: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.object),
      compare: PropTypes.arrayOf(PropTypes.object)
    })
  ])
};

export const SIZE = {
  height: PropTypes.number,
  width: PropTypes.number
};

export const PLANE = {
  image: PropTypes.string,
  gps_markers: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      latitude: PropTypes.number,
      longitude: PropTypes.number
    })
  )
};

export const THRESHOLDS = {
  thresholds: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      color: PropTypes.string,
      label: PropTypes.string
    })
  )
};

export const COMPARE = {
  compare: PropTypes.shape({
    range: PropTypes.string,
    amount: PropTypes.number,
    aggregators: PropTypes.arrayOf(PropTypes.string)
  })
};

export const SERIE_TYPE = {
  type: PropTypes.oneOf(['line', 'area', 'bar'])
};
