import React, { Component } from "react";
// Import React FilePond
import { FilePond, File, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
);

// Our app
export default class PhotoUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files
      files: []
    };
  }

  render() {
    return (
      <FilePond
        maxFiles={3}
        server="/api"
        acceptedFileTypes={["image/png", "image/jpeg"]}
        labelFileTypeNotAllowed="Only jpgs and pngs allowed"
        maxFileSize="5MB"
        labelMaxFileSizeExceeded="File is too large. (5MB Max)"
        onupdatefiles={fileItems => {
          // Set current file objects to this.state
          this.setState({
            files: fileItems.map(fileItem => fileItem.file)
          });
        }}
      >
        {/* Update current files  */}
        {this.state.files.map(file => (
          <File key={file} src={file} origin="local" />
        ))}
      </FilePond>
    );
  }
}
