/*jshint esversion: 6 */

const core = require('mathjs/core');
const math = core.create();

math.import(require('mathjs/lib/type/matrix'));
math.import(require('mathjs/lib/function/arithmetic/multiply'));
math.import(require('mathjs/lib/function/arithmetic/subtract'));
math.import(require('mathjs/lib/function/matrix/inv'));

export default {
  /**
   * Obtain the matrices for conversions between latitude-longitude
   * to x-y.
   *
   * @param {Object[]} gps_points
   * @param {number} gps_points[].x
   * @param {number} gps_points[].y
   * @param {number} gps_points[].latitude
   * @param {number} gps_points[].longitude
   * @param {number} width
   * @param {number} height
   * @returns {Object} transformation and offset matrices {m_trans:, m_offset:}
   */
  latlngToPointMatrices(gps_points, width, height) {
    const matrix = math.matrix(
      [
        [gps_points[0].x, gps_points[0].y, 0,        0,        1, 0],
        [0,        0,        gps_points[0].x, gps_points[0].y, 0, 1],
        [gps_points[1].x, gps_points[1].y, 0,        0,        1, 0],
        [0,        0,        gps_points[1].x, gps_points[1].y, 0, 1],
        [gps_points[2].x, gps_points[2].y, 0,        0,        1, 0],
        [0,        0,        gps_points[2].x, gps_points[2].y, 0, 1]
      ]
    );

    const lat_lng_column = math.matrix(
      [
        [gps_points[0].longitude], [gps_points[0].latitude], [gps_points[1].longitude],
        [gps_points[1].latitude], [gps_points[2].longitude], [gps_points[2].latitude]
      ]
    );

    const sol = math.multiply(math.inv(matrix), lat_lng_column);

    const m_trans = math.matrix(
      [
        [sol.get([0, 0]), sol.get([1, 0])],
        [sol.get([2, 0]), sol.get([3, 0])]
      ]
    );

    const m_offset = math.matrix(
      [
        [sol.get([4, 0])],
        [sol.get([5, 0])]
      ]
    );

    return { m_trans: math.inv(m_trans), m_offset: m_offset };
  },

  /**
   * Convert point from latitude-longitude reference to x-y referenced
   * by a square using matrices for transformation and offset.
   *
   * @param {number} latitude
   * @param {number} longitude
   * @param {number} width
   * @param {number} height
   * @param {Matrix} m_trans
   * @param {Matrix} m_offset
   * @returns {Object} x and y entries
   */
  latlngToPoint(latitude, longitude, width, height, m_trans, m_offset) {
    var points =
      math.multiply(m_trans,
                    math.subtract(math.matrix([[longitude], [latitude]]),
                                  m_offset)
      );

    return {
      x: points.get([0, 0]),
      y: points.get([1, 0])
    };
  },

  /**
   * Convert point from latitude-longitude reference to percentages referenced
   * by a square using matrices for transformation and offset.
   *
   * @param {number} latitude
   * @param {number} longitude
   * @param {number} width
   * @param {number} height
   * @param {Matrix} m_trans
   * @param {Matrix} m_offset
   * @returns {Object} x and y entries representing percentage
   */
  latlngToPercent(latitude, longitude, width, height, m_trans, m_offset) {
    var points =
      math.multiply(m_trans,
                    math.subtract(math.matrix([[longitude], [latitude]]),
                                  m_offset)
      );

    return {
      x: points.get([0, 0]) / width * 100,
      y: points.get([1, 0]) / height * 100
    };
  },

  /**
   *
   * Translate points from latitude and longitude system to x and y.
   *
   * @param {number} latitude
   * @param {number} longitude
   * @param {Object} image
   * @param {number} image.naturalWidth
   * @param {number} image.naturalHeight
   * @param {number} image.clientWidth
   * @param {number} image.clientHeight
   * @param {Object[]} gps_points
   * @param {number} gps_points[].x
   * @param {number} gps_points[].y
   * @param {number} gps_points[].latitude
   * @param {number} gps_points[].longitude
   * @returns {Object} x and y entries representing percentage
   */
   translatePoint(latitude, longitude, image, gps_points) {
     if(image.naturalWidth == 0 || image.naturalHeight == 0)
       return {x: 0, y: 0};

     const {m_trans, m_offset} =
       this.latlngToPointMatrices(gps_points, image.naturalWidth, image.naturalHeight);

     var {x, y} = this.latlngToPoint(latitude, longitude, image.naturalWidth,
                                     image.naturalHeigh, m_trans, m_offset);

     // Transform the points to real image's width and height
     x = x * image.clientWidth / image.naturalWidth;
     y = y * image.clientHeight / image.naturalHeight;

     return {x, y};
   }
};
