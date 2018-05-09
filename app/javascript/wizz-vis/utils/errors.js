/* jshint esversion: 6 */

export default {
  handleErrors(response) {
    const data = response.json();
    if (!response.ok) {
      return data.then(err => { throw err; });
    }
    return data;
  }
};
