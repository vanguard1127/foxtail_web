import React, { Component } from "react";
import PhotoWall from "./PhotoWall";

class PhotoGrid extends Component {
  state = {};

  render() {
    const photos = this.props.photos;
    const publicPics = photos.slice(0, 4);
    const privatePics = photos.slice(4, 8);
    return (
      <table style={{ width: "30vw" }}>
        <tbody>
          <tr>
            <th colSpan="4"> Public Photos (No nudity please)</th>
          </tr>
          <tr>
            <td>
              <PhotoWall fileList={publicPics} private={false} />
            </td>
          </tr>
          <tr>
            <th colSpan="4">
              Private Photos (Nudity is OK. Will only show to matches.)
            </th>
          </tr>
          <tr>
            <td>
              <PhotoWall fileList={privatePics} private={true} />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default PhotoGrid;
