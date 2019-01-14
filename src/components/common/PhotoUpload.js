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

//TODO: How to translate words on filepond
// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
);
//https://pqina.nl/filepond/docs/patterns/api/filepond-instance/#labels --- LABELS
// Our app
const PhotoUpload = ({ photos, setPhotos, t }) => {
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
      labelFileTypeNotAllowed={t("Only jpgs and pngs allowed")}
      maxFileSize="5MB"
      labelIdle={
        t("Drag & Drop your image or") +
        `<span class="filepond--label-action">` +
        t("Browse") +
        `</span>.`
      }
      labelFileProcessing={t("Uploading")}
      labelFileProcessingComplete={t("Upload complete")}
      labelFileProcessingAborted={t("Upload cancelled")}
      labelFileProcessingError={t("Error during upload")}
      labelTapToCancel={t("tap to cancel")}
      labelMaxFileSizeExceeded={t("File is too large. (5MB Max)")}
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
