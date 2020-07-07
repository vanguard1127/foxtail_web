import axios from "axios";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { catchErrors } from "components/common/ErrorHandler";

const uploadToS3 = async ({ filebody, signedRequest, t }) => {
  try {
    //ORIGINAL
    const options = {
      headers: {
        "Content-Type": filebody.type
      }
    };
    const resp = await axios.put(signedRequest, filebody, options);
    if (resp.status !== 200) {
      toast.error(t("uplerr"));
    }
  } catch (e) {
    console.error(e);
    catchErrors(e);
  }
};

export default withTranslation("common")(uploadToS3);
