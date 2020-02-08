import React from "react";
import ContentLoader from "react-content-loader";
export const ProfileLoader = () => (
  <ContentLoader
    height={145}
    width={390}
    speed={2}
    primarycolor="#f3f3f3"
    secondarycolor="#ecebeb"
    style={{ width: "100%", height: "100%" }}
  >
    <rect x="1.05" y="0.00" rx="0" ry="0" width="125.2" height="141.89" />
    <rect x="143.44" y="13.67" rx="0" ry="0" width="139" height="21" />
    <rect x="143.44" y="40.67" rx="0" ry="0" width="108" height="13" />
    <rect x="143.44" y="62.67" rx="0" ry="0" width="56" height="19" />
    <rect x="143.44" y="94.67" rx="0" ry="0" width="84.89" height="32.57" />
    <rect x="208.44" y="62.67" rx="0" ry="0" width="56" height="19" />
    <rect x="273.44" y="62.67" rx="0" ry="0" width="56" height="19" />
    <rect x="243.44" y="94.67" rx="0" ry="0" width="84.89" height="32.57" />
  </ContentLoader>
);

export const EventLoader = () => (
  <ContentLoader
    height={202}
    width={545}
    speed={2}
    primarycolor="#f3f3f3"
    secondarycolor="#ecebeb"
  >
    <rect x="0.69" y="1.67" rx="0" ry="0" width="222" height="202" />
    <rect x="244.69" y="27.67" rx="0" ry="0" width="195" height="22" />
    <rect x="244.69" y="52.67" rx="0" ry="0" width="89" height="22" />
    <rect x="243.69" y="94.67" rx="0" ry="0" width="147" height="33" />
    <rect x="393.69" y="101.67" rx="0" ry="0" width="88" height="19" />
    <rect x="246.69" y="139.67" rx="0" ry="0" width="270" height="41" />
    <rect x="104.69" y="78.67" rx="0" ry="0" width="0" height="0" />
  </ContentLoader>
);

export const InboxLoader = () => (
  <ContentLoader
    height={80}
    width={441}
    speed={2}
    primarycolor="#f3f3f3"
    secondarycolor="#ecebeb"
  >
    <rect x="104.69" y="78.67" rx="0" ry="0" width="0" height="0" />
    <circle cx="44.19" cy="40.17" r="26.5" />
    <rect x="80.69" y="23.67" rx="0" ry="0" width="81" height="13" />
    <rect x="80.69" y="43.67" rx="0" ry="0" width="183" height="15" />
    <rect x="375.69" y="22.67" rx="0" ry="0" width="48" height="14" />
  </ContentLoader>
);
