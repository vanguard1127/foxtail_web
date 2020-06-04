import React from "react";
import Ad from "./Ad";

import getRandomInt from "utils/getRandomInt";

import ads from "../../../docs/ads";

const ad = ads[getRandomInt(0, ads.length)];

const AdManager = ({ t, goToBlk, goToCpl }) => {
  return <Ad ad={ad} t={t} goToBlk={goToBlk} goToCpl={goToCpl} />;
};

export default AdManager;
