import React, { useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
  Circle,
} from "react-leaflet";
import GeoJson from "./GeoJSON.jsx";
import statesData from "../states.js";

const Map = (props) => {
  const [onSelect, setonSelect] = useState({});

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
      ? "#FC4E2A"
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

  return (
    <MapContainer
      center={props.position}
      zoom={4}
      scrollWheelZoom={true}
      whenCreated={props.setmap}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJson
        data={statesData.features}
        style={style}
        onEachFeature={onEachFeature}
      />
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
              Population Density: {onSelect.density} people <br /> per square km
            </li>
            <br></br>
            <li>Total Confirmed Cases: {onSelect.totalInfection}</li>
          </ul>
        ) : null}
      </div>
      <div className="legend">
        <div style={{ "--color": "#a50f15" }}>3023 - 6247</div>
        <div style={{ "--color": "#de2d26" }}>676 - 3022</div>
        <div style={{ "--color": "#fb6a4a" }}>428 - 675</div>
        <div style={{ "--color": "#fc9272" }}>236 - 427</div>
        <div style={{ "--color": "#fcbba1" }}>23 - 235</div>
        <div style={{ "--color": "#fee5d9" }}>6 - 22</div>
      </div>
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
