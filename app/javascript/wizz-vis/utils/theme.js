const THEMES = {
  light: {
    text: '#555',
    grid: '#f0f0f0',
    map: {
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }
  },
  dark: {
    text: '#d8d9da',
    grid: '#444343',
    map: {
      url: "https://api.mapbox.com/styles/v1/pikislabis/cjeb0cztza0k32snr6abbjd81/tiles/256/{z}/{x}/{y}?access_token=" + process.env.MAPBOX_TOKEN,
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> &copy; <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>'
    }
  }
}

export default {
  text(theme) {
    return THEMES[theme].text;
  },

  grid(theme) {
    return THEMES[theme].grid;
  },

  map(theme) {
    return THEMES[theme].map;
  }
}
