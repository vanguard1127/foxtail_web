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
  history,
  ReactGA,
  refetch
}) => {
  const [about, setAbout] = useState("");
  const [kinks, setKinks] = useState([]);
  const [photoList, setPhotoList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(undefined);
  const [kinkPopupVisible, setKinkPopupVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [signs3] = useMutation(SIGNS3);
  const [updateSettings] = useMutation(UPDATE_SETTINGS);

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

  const handleUpload = file => {
    ErrorHandler.setBreadcrumb("Onboarding upload");
    if (!file) {
      ErrorHandler.setBreadcrumb("no file");
      return;
    }
    setPhotoFile(file);
    setPhotoList(photoList => {
      photoList.push({
        uid: Date.now(),
        url: file.dataURL,
        id: Date.now()
      });
      return photoList;
    });

    toast.dismiss();
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSaving(true);
    if (photoList.length < 1 || photoFile === undefined) {
      alert("Please upload an image");
    }

    handleUploadToS3(photoFile.filebody)
      .then(key => {
        updateSettings({
          variables: {
            publicPhotoList: photoList.map(file => {
              file.url = undefined;
              file.key = key;
              return JSON.stringify(file);
            }),
            profilePic: photoList[0].key,
            about,
            kinks
          }
        })
          .then(({ data }) => {
            if (data.updateSettings) {
              ReactGA.event({
                category: "Onboarding",
                action: "Complete"
              });
              refetch();
              history.push({
                pathname: "/members",
                state: { initial: true }
              });
            } else {
              setSaving(false);
              ErrorHandler.catchErrors("Onboarding error occured");
            }
          })
          .catch(res => {
            setSaving(false);
          });
      })
      .catch(res => {
        setSaving(false);
        ErrorHandler.catchErrors(res);
      });
  };

  async function handleUploadToS3(filebody) {
    if (filebody === "") {
      return;
    }
    try {
      const { data } = await signs3({
        variables: {
          filetype: filebody.type
        }
      });

      const { signedRequest, key } = data.signS3;
      await uploadToS3(filebody, signedRequest);

      return key;
    } catch (res) {
      ErrorHandler.catchErrors(res);
    }
  }

  const uploadToS3 = async (filebody, signedRequest) => {
    try {
      //ORIGINAL
      const options = {
        headers: {
          "Content-Type": filebody.type
        }
      };

      const resp = await axios.put(signedRequest, filebody, options);
      if (resp.status !== 200) {
        this.props.toast.error(this.props.t("uplerr"));
      }
    } catch (e) {
      console.error(e);
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

  let body, description;
  if (!tReady) {
    return null;
  }
  if (currentPage === 0) {
    description =
      "Please upload a picture of yourself. (Tip: The Mask feature conceals your identity)";

    body = (
      <div className="content">
        <div className="content">
          <UploadBox
            single
            t={t}
            ErrorHandler={ErrorHandler}
            photos={photoList}
            handleUpload={handleUpload}
          />
        </div>
        <div className="item">
          <div className="submit">
            <button onClick={nextPage} className="color" disabled={!photoFile}>
              {t("common:Next")}
            </button>
          </div>
        </div>
      </div>
    );
  } else if (currentPage === 1) {
    description = "What are you into or curious to try? (At least 1)";
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
            <button
              onClick={nextPage}
              className="color"
              disabled={!kinks || kinks.length < 1}
            >
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
    description = "What's your story?";
    body = (
      <div className="content">
        <div className="item">
          <div className="textarea">
            <textarea
              tabIndex="3"
              placeholder={
                "Who are you? What are you looking for on Foxtail? Likes/Dislikes? Fantasies? (Must be at least 20 characters)"
              }
              onChange={el => setAbout(el.target.value)}
              value={about}
            />
          </div>
        </div>

        <div className="item">
          <div className="submit">
            <button
              onClick={handleSubmit}
              className="color"
              disabled={!about || about.length < 20}
            >
              {!saving ? "Complete" : "Saving..."}
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
