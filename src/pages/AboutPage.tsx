import React from "react";
import { Button } from "reactstrap";

import "./css-classes.scss";
import styles from "./common.module.scss";
import styles2 from "./common2.module.css";

const AboutPage = () => {
  const handleClick = () => {
    console.log("Save button clicked");
  };

  return (
    <>
      <div className="yellowText">This is about page</div>
      <div className={styles.redText}>This is page description</div>
      <div className={styles2.blueText}>This is page footer</div>
      <div>
        <Button color="danger" onClick={handleClick}>
          Save
        </Button>
      </div>
    </>
  );
};

export default AboutPage;
