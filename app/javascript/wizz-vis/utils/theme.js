const THEMES = {
  light: {
    text: "#555",
    grid: '#f0f0f0'
  },
  dark: {
    text: "#d8d9da",
    grid: '#444343'
  }
}

export default {
  text(theme) {
    return THEMES[theme].text;
  },

  grid(theme) {
    return THEMES[theme].grid;
  }
}
