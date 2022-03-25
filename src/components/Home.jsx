import React from "react";
import Notes from "./Notes";

const Home = (props) => {
  const { showAlert } = props;
  return (
    <div >
      <Notes showAlert={showAlert} />
      {/* Here we are doing prop drilling from app.js to Home.js to Notes  */}
    </div>
  );
};

export default Home;
