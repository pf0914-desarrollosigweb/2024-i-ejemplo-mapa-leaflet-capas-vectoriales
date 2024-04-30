// Objeto mapa
var mapa = L.map("mapaid", {
  center: [9.5, -84],
  zoom: 7,
});

// Capa base Positron de Carto
positromap = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  }
).addTo(mapa);

// Capa base de OSM
osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

// Capa base de ESRI World Imagery
esriworld = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

// Capas base
var mapasbase = {
  "Carto Positron": positromap,
  OpenStreetMap: osm,
  "ESRI WorldImagery": esriworld,
};

// Control de capas
control_capas = L.control
  .layers(mapasbase, null, { collapsed: false })
  .addTo(mapa);

// Capa vectorial de polígonos en formato GeoJSON
$.getJSON("datos/asp.geojson", function (geodata) {
  var capa_asp = L.geoJson(geodata, {
    style: function (feature) {
      return { color: "green", weight: 2.5, fillOpacity: 0.0 };
    },
    onEachFeature: function (feature, layer) {
      var popupText =
        "<strong>Área protegida</strong>: " +
        feature.properties.nombre_asp +
        "<br>" +
        "<strong>Categoría</strong>: " +
        feature.properties.cat_manejo;
      layer.bindPopup(popupText);
    },
  }).addTo(mapa);

  control_capas.addOverlay(capa_asp, "ASP");
});

// Capa vectorial de líneas en formato GeoJSON
$.getJSON("datos/via_ferrea.geojson", function (geodata) {
  var capa_via_ferrea = L.geoJson(geodata, {
    style: function (feature) {
      return { color: "brown", weight: 5, fillOpacity: 0.0 };
    },
    onEachFeature: function (feature, layer) {
      var popupText =
        "<strong>Vía ferrea</strong>: " + feature.properties.nombre;
      layer.bindPopup(popupText);
    },
  }).addTo(mapa);

  control_capas.addOverlay(capa_via_ferrea, "Vía ferrea");
});

// Capa vectorial de puntos en formato GeoJSON
$.getJSON("datos/aerodromos.geojson", function (geodata) {
  var aerodromoIcon = L.divIcon({
    html: '<i class="fa fa-plane-departure" style="color: black; font-size: 18px;"></i>',
    iconSize: [20, 20], // Dimensiones del ícono
    iconAnchor: [10, 10], // Punto central del ícono
    className: "myDivIcon", // Clase personalizada para más estilos si es necesario
  });

  var capa_aerodromos = L.geoJson(geodata, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: aerodromoIcon });
    },
    style: function (feature) {
      return { color: "#013220", weight: 2.5 };
    },
    onEachFeature: function (feature, layer) {
      var popupText =
        "<strong>Aeródromo</strong>: " +
        feature.properties.nombre +
        "<br>" +
        "<strong>Categoría</strong>: " +
        feature.properties.categoria;
      layer.bindPopup(popupText);
    },
  }).addTo(mapa);

  control_capas.addOverlay(capa_aerodromos, "Aeródromos");
});

// Control de escala
L.control.scale().addTo(mapa);
