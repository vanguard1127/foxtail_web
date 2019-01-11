import React from "react";
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
const PhotoUpload = ({ photos, setPhotos }) => {
  return (
    <FilePond
      server={{
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          // fieldName is the name of the input field
          // file is the actual file object to send
          load(file);
          // Should expose an abort method so the request can be cancelled
          return {
            abort: () => {
              // This function is entered if the user has tapped the cancel button

              // Let FilePond know the request has been cancelled
              abort();
            }
          };
        }
      }}
      acceptedFileTypes={["image/png", "image/jpeg"]}
      labelFileTypeNotAllowed="Only jpgs and pngs allowed"
      maxFileSize="5MB"
      labelMaxFileSizeExceeded="File is too large. (5MB Max)"
      onupdatefiles={fileItems => {
        // Set current file objects to this.state
        setPhotos(fileItems.map(fileItem => fileItem.file));
      }}
    >
      {/* Update current files  */}
      {photos.map(file => (
        <File key={file} src={file} origin="local" />
      ))}
    </FilePond>
  );
};

export default PhotoUpload;
