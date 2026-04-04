import React from "react";
import Welcome from "./homeSections/Welcome";
import Advertising from "./homeSections/Advertising";

const HomePage = () => {
  return (
    <div>
      <Advertising />
      <Welcome />
    </div>
  );
};

export default HomePage;
