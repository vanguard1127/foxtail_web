import React, { Component } from "react";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import { withTranslation } from "react-i18next";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileRename from "filepond-plugin-file-rename";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileRename
);
//https://pqina.nl/filepond/docs/patterns/api/filepond-instance/#labels --- LABELS
// Our app
class PhotoUpload extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.photos.name !== nextProps.photos.name ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }
  render() {
    const { photos, setPhotos, t } = this.props;

    return (
      <FilePond
        server={{
          process: (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            abort
          ) => {
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
        labelFileTypeNotAllowed={t("onlyformat")}
        maxFileSize="10MB"
        labelIdle={
          t("drag") +
          " " +
          `<span class="filepond--label-action">` +
          t("browse") +
          `</span>.`
        }
        // fileRenameFunction={file => t("selimage")}
        labelFileProcessing={t("upload")}
        labelFileProcessingComplete={t("uploadcomp")}
        labelFileProcessingAborted={t("uploadcan")}
        labelFileProcessingError={t("uploaderror")}
        labelTapToCancel={t("tapcancel")}
        labelMaxFileSizeExceeded={t("toolarge")}
        onupdatefiles={fileItems => {
          // Set current file objects to this.state
          fileItems[0] &&
            fileItems[0].file.name &&
            setPhotos(fileItems.map(fileItem => fileItem.file));
        }}
        files={photos}
      />
    );
  }
}

export default withTranslation("common")(PhotoUpload);
