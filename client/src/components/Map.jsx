import React, { useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
  Circle,
  LayersControl,
} from "react-leaflet";
import ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import GeoJson from "./GeoJSON.jsx";
import statesData from "../states.js";

const Map = (props) => {
  const [onSelect, setonSelect] = useState({});
  const [legend, showLegend] = useState(false);

  const { BaseLayer } = LayersControl;
  const iconMarkup = renderToStaticMarkup(
    <i className="fa fa-briefcase-medical fa-1x" style={{ color: "blue" }} />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });

  const fillYellowOptions = { fillColor: "yellow" };
  const fillOrangeOptions = { fillColor: "orange" };
  const fillRedOptions = { fillColor: "red" };
  const fillPurpleOptions = { fillColor: "purple" };

  const fillColorOptions = (cases) => {
    if (cases >= 0 && cases < props.highestConfirmed * 0.05) {
      return fillYellowOptions;
    } else if (
      cases >= props.highestConfirmed * 0.05 &&
      cases < props.highestConfirmed * 0.1
    ) {
      return fillOrangeOptions;
    } else if (
      cases >= props.highestConfirmed * 0.1 &&
      cases < props.highestConfirmed * 0.5
    ) {
      return fillRedOptions;
    } else {
      return fillPurpleOptions;
    }
  };

  const getColor = (d) => {
    return d > 0.65 * props.highestTotalCases
      ? "#800026"
      : d > 0.55 * props.highestTotalCases
      ? "#BD0026"
      : d > 0.45 * props.highestTotalCases
      ? "#E31A1C"
      : d > 0.35 * props.highestTotalCases
      ? "#FF7F7F"
      : d > 0.25 * props.highestTotalCases
      ? "#FD8D3C"
      : d > 0.15 * props.highestTotalCases
      ? "#FEB24C"
      : d > 0.05 * props.highestTotalCases
      ? "#FED976"
      : "#FFEDA0";
  };

  const style = (features) => {
    return {
      fillColor: getColor(props.state.cases[features.properties.name]),
      weight: 3,
      opacity: 1,
      color: "white",
      dashArray: "2",
      fillOpacity: 0.5,
    };
  };

  const highlightFeature = (e) => {
    var layer = e.target;
    const { name, density } = e.target.feature.properties;
    setonSelect({
      name: name,
      density: density,
      totalInfection: props.state.cases[name],
    });
    layer.setStyle({
      weight: 3,
      color: "black",
      dashArray: "",
      fillOpacity: 0.6,
    });
    layer.bringToFront();
  };

  const resetHighlight = (e) => {
    setonSelect({});
    e.target.setStyle(style(e.target.feature));
  };

  const zoomToFeature = (e) => {
    e.target._map.fitBounds(e.target.getBounds());
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    });
  };

  const accessToken = process.env.REACT_APP_API_KEY;

  console.log(process.env);

  props.state.map
    ? props.state.map.on("overlayadd", () => showLegend(true))
    : null;

  props.state.map
    ? props.state.map.on("overlayremove", () => showLegend(false))
    : null;

  return (
    <MapContainer
      center={props.position}
      zoom={4}
      scrollWheelZoom={true}
      whenCreated={props.setmap}
    >
      <LayersControl>
        <BaseLayer checked name="Open Street Map">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        <BaseLayer name="Outdoor Street Map">
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`}
          />
        </BaseLayer>
        <BaseLayer name="Dark Street Map">
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`}
          />
        </BaseLayer>
        <BaseLayer name="Satellite Street Map">
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`}
          />
        </BaseLayer>
        <LayersControl.Overlay name="Choropleth">
          <GeoJson
            data={statesData.features}
            style={style}
            onEachFeature={onEachFeature}
          />
          {legend ? (
            <>
              <div>
                {!onSelect.name ? (
                  <div className="census-info-hover">
                    <strong>United States Covid Report</strong>
                    <p>Hover on each state for more details</p>
                  </div>
                ) : null}
                {onSelect.name ? (
                  <ul className="census-info">
                    <li>
                      <strong>{onSelect.name}</strong>
                    </li>
                    <br />
                    <li>
                      Population Density: {onSelect.density} people <br /> per
                      square km
                    </li>
                    <br></br>
                    <li>Total Confirmed Cases: {onSelect.totalInfection}</li>
                  </ul>
                ) : null}
              </div>
              <div className="legend">
                <div style={{ "--color": "#800026" }}>
                  {Math.ceil(0.65 * props.highestTotalCases)} -{" "}
                  {props.highestTotalCases}
                </div>
                <div style={{ "--color": "#BD0026" }}>
                  {Math.ceil(0.55 * props.highestTotalCases)} -{" "}
                  {Math.ceil(0.65 * props.highestTotalCases)}
                </div>
                <div style={{ "--color": "#E31A1C" }}>
                  {Math.ceil(0.45 * props.highestTotalCases)} -{" "}
                  {Math.ceil(0.55 * props.highestTotalCases)}
                </div>
                <div style={{ "--color": "#FF7F7F" }}>
                  {Math.ceil(0.35 * props.highestTotalCases)} -{" "}
                  {Math.ceil(0.45 * props.highestTotalCases)}
                </div>
                <div style={{ "--color": "#FD8D3C" }}>
                  {Math.ceil(0.25 * props.highestTotalCases)} -{" "}
                  {Math.ceil(0.35 * props.highestTotalCases)}
                </div>
                <div style={{ "--color": "#FEB24C" }}>
                  {Math.ceil(0.15 * props.highestTotalCases)} -{" "}
                  {Math.ceil(0.25 * props.highestTotalCases)}
                </div>
                <div style={{ "--color": "#FED976" }}>
                  {Math.ceil(0.05 * props.highestTotalCases)} -{" "}
                  {Math.ceil(0.15 * props.highestTotalCases)}
                </div>
                <div style={{ "--color": "#FFEDA0" }}>
                  0 - {Math.ceil(0.05 * props.highestTotalCases)}
                </div>
              </div>
            </>
          ) : null}
        </LayersControl.Overlay>
      </LayersControl>
      {props.state.states[props.state.currentState]
        ? props.state.states[props.state.currentState].map((county, index) => {
            return (
              <LayerGroup key={index}>
                <Circle
                  center={[
                    county.coordinates.latitude,
                    county.coordinates.longitude,
                  ]}
                  pathOptions={fillColorOptions(county.stats.confirmed)}
                  fillOpacity={0.9}
                  radius={15000}
                  stroke={false}
                />
                <Marker
                  position={[
                    county.coordinates.latitude,
                    county.coordinates.longitude,
                  ]}
                  icon={customMarkerIcon}
                >
                  <Popup>
                    <div className="popup">
                      <span>
                        <b>{county.county}</b>
                      </span>
                      <br></br>
                      <span>Confirmed Cases: {county.stats.confirmed}</span>
                      <br></br>
                      <span>Confirmed Death: {county.stats.deaths}</span>
                    </div>
                  </Popup>
                </Marker>
              </LayerGroup>
            );
          })
        : null}
    </MapContainer>
  );
};

export default Map;
