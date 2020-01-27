import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { withTranslation } from "react-i18next";
import axios from "axios";
import KinksModal from "../Kinks/Modal";
import { UPDATE_SETTINGS, SIGNS3 } from "../../../queries";
import KinksSelector from "../../Modals/Kinks/Selector";
import Modal from "../../common/Modal";
import UploadBox from "../../common/UploadBox";
import Stepper from "./Stepper";
import { toast } from "react-toastify";

const Onboard = ({
  close,
  t,
  ErrorHandler,
  tReady,
  refetch,
  history,
  ReactGA
}) => {
  const [about, setAbout] = useState("");
  const [kinks, setKinks] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [kinkPopupVisible, setKinkPopupVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [errors] = useState({});

  const [signs3] = useMutation(SIGNS3);
  const [updateSettings] = useMutation(UPDATE_SETTINGS);

  const InputFeedback = error =>
    error ? (
      <div className="input-feedback" style={{ color: "red" }}>
        {error}
      </div>
    ) : null;

  const toggleKinksPopup = () => {
    setKinkPopupVisible(!kinkPopupVisible);
  };
  const toggleKinks = ({ checked, value }) => {
    if (checked) {
      setKinks([...kinks, value]);
    } else {
      setKinks(kinks.filter(kink => kink !== value));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // if (await validateForm()) {
    //photos[0].url = undefined;
    updateSettings({
      variables: {
        publicPhotoList: JSON.stringify(photos[0]),
        profilePic: photos[0].key,
        about,
        kinks
      }
    })
      .then(data => {
        if (data.updateSettings) {
          console.log("OJOJOJ");
          ReactGA.event({
            category: "Onboarding",
            action: "Complete"
          });
          history.push("/members");
        } else {
          ErrorHandler.catchErrors("Onboarding error occured");
        }
      })
      .catch(res => {
        console.log(res);
        ErrorHandler.catchErrors(res);
      });
  };

  const handleUpload = file => {
    if (file === "") {
      return;
    }

    signs3({ variables: { filename: file.filename, filetype: file.filetype } })
      .then(({ data }) => {
        const { signedRequest, key } = data.signS3;
        uploadToS3(file, signedRequest);
        handlePhotoListChange({ file, key });
      })
      .catch(res => {
        console.log(res);
        ErrorHandler.catchErrors(res);
      });
  };

  const uploadToS3 = async (file, signedRequest) => {
    try {
      //ORIGINAL
      const options = {
        headers: {
          "Content-Type": file.type
        }
      };
      const resp = await axios.put(signedRequest, file, options);
      if (resp.status !== 200) {
        toast.error(t("uploaderror"));
      }
    } catch (e) {
      ErrorHandler.catchErrors(e);
    }
  };

  const nextPage = e => {
    e.preventDefault();
    setCurrentPage(currentPage + 1);
  };

  const prevPage = e => {
    e.preventDefault();

    setCurrentPage(currentPage - 1);
  };

  const handlePhotoListChange = ({ file, key, isDeleted }) => {
    ErrorHandler.setBreadcrumb("isDeleted:" + isDeleted + "key:" + key);
    if (!file) {
      ErrorHandler.setBreadcrumb("no file");
      return;
    }

    if (isDeleted) {
      setPhotos([]);

      toast.success(t("photodel"));
    } else {
      setPhotos([
        {
          uid: Date.now(),
          key,
          url: file.dataURL,
          id: Date.now()
        }
      ]);
      toast.dismiss();
    }
  };

  let body, description;
  if (!tReady) {
    return null;
  }
  if (currentPage === 0) {
    description = "What's your story?";
    body = (
      <div className="content">
        <div className="item">
          <div className="textarea">
            <textarea
              tabIndex="3"
              placeholder={
                "What are you looking for on Foxtail? Likes/Dislikes? Fantasies?..."
              }
              onChange={el => setAbout(el.target.value)}
              value={about}
            />
          </div>
          {InputFeedback(t(errors.about))}
        </div>

        <div className="item">
          <div className="submit">
            <button onClick={nextPage} className="color">
              {t("common:Next")}
            </button>
          </div>
        </div>
      </div>
    );
  } else if (currentPage === 1) {
    description = "What are you into or curious to try?";
    body = (
      <div className="content">
        <div className="item">
          <KinksSelector
            kinks={kinks}
            togglePopup={toggleKinksPopup}
            ErrorBoundary={ErrorHandler.ErrorBoundary}
            t={t}
          />
        </div>
        <div className="item">
          <div className="submit">
            <button onClick={nextPage} className="color">
              {t("common:Next")}
            </button>
            <span className="border" onClick={prevPage}>
              {t("Back")}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    description =
      "Please upload a picture of yourself. (Tip: Use the mask feature to conceal your identity)";
    body = (
      <div className="content">
        <div className="content">
          <UploadBox
            single
            t={t}
            ErrorHandler={ErrorHandler}
            photos={photos}
            handlePhotoListChange={handlePhotoListChange}
            handleUpload={handleUpload}
          />
        </div>
        <div className="item">
          <div className="submit">
            <button onClick={handleSubmit} className="color">
              Complete
            </button>
            <span className="border" onClick={prevPage}>
              {t("Back")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section>
      <Modal
        header={"Complete Your Profile"}
        close={close}
        disableOffClick
        width="50%"
      >
        <ErrorHandler.ErrorBoundary>
          <div className="m-body">
            <div className="page">
              <Stepper activeStep={currentPage} />
              <div className="description">{description}</div>
              <div className="settings-content">{body}</div>
            </div>
          </div>
        </ErrorHandler.ErrorBoundary>
      </Modal>

      {kinkPopupVisible && (
        <KinksModal
          close={toggleKinksPopup}
          onChange={e => toggleKinks(e)}
          kinks={kinks}
          ErrorBoundary={ErrorHandler.ErrorBoundary}
        />
      )}
    </section>
  );
};
export default withTranslation("modals")(Onboard);
