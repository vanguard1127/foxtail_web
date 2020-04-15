import React from "react";
import { Link } from "react-router-dom";

const PicsCompliance = () => (
  <div>
    <div>
      <Link to="/">
        <span className="back-to-home" />
      </Link>
      <h1
        style={{
          justifyContent: "center",
          display: "flex",
          flex: 1
        }}
      >
        18 USC 2257 Statement
      </h1>
    </div>
    <div style={{ margin: "5%" }}>
      FoxtailApp.com is not a producer (primary or secondary) of any or all of
      the content found on the website FoxtailApp.com. <br />
      <br />
      With respect to the records as per 18 USC 2257 for any and all content
      found on this site, please kindly direct your request to the site for
      which the content was produced.
      <br />
      <br /> FoxtailApp.com is a social site that allows for the uploading,
      sharing and general viewing of various types of user generated content,
      and while FoxtailApp.com does the best it can with verifying compliance,
      it may not be 100% accurate.
      <br />
      <br /> FoxtailApp.com abides by the following procedures to ensure
      compliance:
      <br />
      <ul>
        <li>
          Requiring all users to be 18 years of age to join to upload images
        </li>
        <li>
          When uploading, each user must verify they have permission to upload
          the content; and if required, comply with 18 USC 2257
        </li>
      </ul>
      <br />
      For further assistance and/or information in finding the content's
      originating site, please contact FoxtailApp.com at: support@foxtailapp.com
      <br />
      <br />
      FoxtailApp.com allows content to be reported as inappropriate. Should any
      content be reported as illegal, unlawful, harassing, harmful, offensive or
      various other reasons, FoxtailApp.com shall remove it from the site
      without delay.
      <br />
      <br /> Users of FoxtailApp.com who come across such content are urged to
      report it as inappropriate by clicking "Report" the button found on each
      page of the site containing user generated content.
    </div>
  </div>
);

export default PicsCompliance;
