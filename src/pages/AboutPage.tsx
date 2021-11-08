import React from "react";
import { Button } from 'reactstrap';
//import Button from 'react-bootstrap/Button'

import "./css-classes.scss";
import styles from "./common.module.scss";
import styles2 from "./common2.module.css";

const AboutPage = () => {
  return (
    <>
      <div className="yellowText">This is about page</div>
      <div className={styles.redText}>This is page description</div>
      <div className={styles2.blueText}>This is page footer</div>
      <div><Button color="danger">Save</Button> </div>
    </>
  );
};

export default AboutPage;
