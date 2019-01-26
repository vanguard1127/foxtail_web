import React from "react";
import Ad from "./Ad";
import ads from "../../docs/ads";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
const ad = ads[getRandomInt(0, ads.length)];

const AdManager = () => <Ad ad={ad} />;

export default AdManager;
