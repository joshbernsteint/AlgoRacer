import React from "react";

import styles from "./Tutorial.module.css";
import swap from "./gifs/swap.gif";
import diff from "./gifs/diff.gif";
import reset from "./gifs/reset.gif";

function GifField(props) {
  return (
    <div className={styles.gif_field}>
      <h3>{props.title}</h3>
      <img src={props.src} alt={props.title} className={styles.gif} />
      <p className={styles.text_field}>{props.body}</p>
    </div>
  );
}

export default function Tutorial() {
  return (
    <div className={styles.main}>
      <h1>Tutorial</h1>
      <div className={styles.steps}>
        <div className={styles.step}>
          <GifField
            title="Swap The Pieces"
            src={swap}
            body="Each step is simulated, so only go one at a time. Move around your pieces to solve."
          />
        </div>
        <div className={styles.step}>
          <GifField
            title="Reset The Pieces"
            src={reset}
            body="Reset your pieces if you forget what the order was. Press the “Reset Row” button to reset your pieces."
          />
        </div>
        <div className={styles.step}>
          <GifField
            title="Know The Difference"
            src={diff}
            body="On boards like selection sort, you may have a row that stays the same. Press the “No Diff” button to submit your current pieces."
          />
        </div>
      </div>
    </div>
  );
}