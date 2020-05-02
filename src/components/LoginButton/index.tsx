import React, { memo, useEffect } from "react";
import { toast } from "react-toastify";

import FirebaseAuth from "components/common/FirebaseAuth";

interface ILoginButtonProps {
    toggleResetPhone: () => void,
    toggleResetPass: () => void;
    ErrorHandler: any,
    lang: string,
    reactga: any,
    history: any,
    t: any,
}

const LoginButton: React.FC<ILoginButtonProps> = memo(({
    toggleResetPhone,
    toggleResetPass,
    ErrorHandler,
    lang,
    reactga,
    history,
    t,
}) => {

    useEffect(() => {
        return () => {
            toast.dismiss();
        }
    }, [])

    const loadingToast = () => {
        toast("Logging in...", { toastId: "loginPop", hideProgressBar: false });
    };

    const success = data => {
        if (!data.fbResolve || data.fbResolve.length === 0) {
            reactga.event({ category: "Login", action: "Fail" });
            toast.dismiss("loginPop");
            alert(t("invalid-login"));
            return;
        } else {
            reactga.event({ category: "Login", action: "Success" });
            const token = data.fbResolve.find(token => token.access === "auth").token;
            const refreshToken = data.fbResolve.find(token => token.access === "refresh").token;
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);
            history.push("/members");
        }
    };

    const fail = err => {
        toast.dismiss("loginPop");
        ErrorHandler.catchErrors(err);
        alert(t("common:error"));
        window.location.reload();
    };

    return (
        <FirebaseAuth
            language={lang}
            ErrorHandler={ErrorHandler}
            title={t("welcomeback")}
            t={t}
            toggleResetPhone={toggleResetPhone}
            toggleResetPass={toggleResetPass}
            loadingCB={loadingToast}
            success={success}
            fail={fail}
        >
            <a className="login-btn" id="login-btn">
                {t("loginBtn")}
            </a>
        </FirebaseAuth>
    );
});

export default LoginButton;
