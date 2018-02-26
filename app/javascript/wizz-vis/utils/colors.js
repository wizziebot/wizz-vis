const COLORS = ['#8884d8', '#3DCC91', '#FFB366', '#FF7373', '#FFCC00', '#3B22FF'];

export default {
  get(index) {
    return COLORS[index % COLORS.length];
  }
}
