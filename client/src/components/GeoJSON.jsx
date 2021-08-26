import React from "react";
import { GeoJSON } from "react-leaflet";

const areEqual = (prevProps, nextProps) => true;

const GeoJson = React.memo((props) => {
  return (
    <GeoJSON
      data={props.data}
      style={props.style}
      onEachFeature={props.onEachFeature}
    />
  );
}, areEqual);

export default GeoJson;
