import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

const Overlay = (props) => {
  return (
    <div className="overlay">
      <div className="selection">
        <DropdownButton
          id="dropdown-basic-button"
          style={{ maxHeight: "300px" }}
          title={
            props.state.currentState ? props.state.currentState : "Select State"
          }
        >
          {Object.keys(props.state.states).map((state, index) => {
            return (
              <Dropdown.Item
                key={index}
                onClick={() => {
                  props.selectState(state);
                }}
              >
                {state}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
        {props.state.currentState ? (
          <DropdownButton
            id="dropdown-basic-button"
            style={{ maxHeight: "300px" }}
            title={
              props.state.currentCounty
                ? props.state.currentCounty
                : "Select County"
            }
          >
            {props.state.states[props.state.currentState].map((data, index) => {
              return (
                <Dropdown.Item
                  key={index}
                  onClick={() =>
                    props.selectCounty(data.county, [
                      data.coordinates.latitude,
                      data.coordinates.longitude,
                    ])
                  }
                >
                  {data.county}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        ) : null}
      </div>
    </div>
  );
};

export default Overlay;
