import React from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import Map from "./Map.jsx";
import Overlay from "./Overlay.jsx";

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      states: null,
      cases: null,
      currentState: null,
      currentCounty: null,
      map: null,
    };

    this.position = [37.09, -95.71];
    this.setMap = this.setMap.bind(this);
    this.selectState = this.selectState.bind(this);
    this.selectCounty = this.selectCounty.bind(this);
    this.highestConfirmed = 0;
    this.highestTotalCases = 0;
  }

  componentDidMount() {
    this.getCovidData();
  }

  getCovidData() {
    axios
      .get("https://corona.lmao.ninja/v2/jhucsse/counties")
      .then((response) => {
        const state = {};
        const cases = {};
        response.data.forEach((data) => {
          data.stats.confirmed > this.highestConfirmed
            ? (this.highestConfirmed = data.stats.confirmed)
            : null;
          if (!state[data.province]) {
            state[data.province] = [];
            cases[data.province] = 0;
            state[data.province].push({
              county: data.county,
              stats: data.stats,
              coordinates: data.coordinates,
            });
            cases[data.province] += data.stats.confirmed;
          } else {
            state[data.province].push({
              county: data.county,
              stats: data.stats,
              coordinates: data.coordinates,
            });
            cases[data.province] += data.stats.confirmed;
            cases[data.province] > this.highestTotalCases
              ? (this.highestTotalCases = cases[data.province])
              : null;
          }
        });
        this.setState({
          states: state,
          cases: cases,
        });
      });
  }

  setMap(map) {
    this.setState({ map });
  }

  selectState(state) {
    this.setState({
      currentState: state,
      currentCounty: null,
    });
    const { map } = this.state;
    if (map) map.flyTo([37.09, -95.71], 4);
  }

  selectCounty(county, pos) {
    this.setState({
      currentCounty: county,
    });
    const { map } = this.state;
    if (map) map.flyTo(pos, 10);
  }

  render() {
    if (!this.state.states) return null;

    return (
      <Container fluid>
        <Map
          state={this.state}
          position={this.position}
          setmap={this.setMap}
          highestConfirmed={this.highestConfirmed}
          highestTotalCases={this.highestTotalCases}
        />
        <Overlay
          state={this.state}
          selectState={this.selectState}
          selectCounty={this.selectCounty}
        />
      </Container>
    );
  }
}
