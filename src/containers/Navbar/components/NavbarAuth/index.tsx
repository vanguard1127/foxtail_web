import React, { useState, useEffect } from "react";
import { RouteChildrenProps, Link } from "react-router-dom";
import { WithTranslation } from "react-i18next";
import { withApollo } from "react-apollo";
import { useQuery } from '@apollo/react-hooks';
import CircularProgress from "@material-ui/core/CircularProgress";

import * as ErrorHandler from "components/common/ErrorHandler";
import deleteFromCache from "utils/deleteFromCache";
import { ISession } from "types/user";

import subscribe from "./subscribe";
import MobileMenu from "./MobileMenu";
import MobileNavLinks from "./MobileNavLinks";
import NavLinks from "./NavLinks";
import UserToolbar from "../UserToolbar";

const msgAudio = new Audio(msgSound);
import msgSound from "assets/audio/msg.mp3";

import { GET_COUNTS } from "queries";

export interface IAlertData {
    id: number;
    type: any;
    text: string;
}
export interface IGetCountsData {
    msgsCount: number
    noticesCount: number
    newMsg: boolean
    alert: IAlertData;
    __typename: string;
}

interface IGetCountsResponceData {
    getCounts: IGetCountsData;
}

interface INavbarProps extends WithTranslation, RouteChildrenProps {
    session: ISession;
    dayjs: any;
    client: any;
}

const NavbarAuth: React.FC<INavbarProps> = ({ session, history, t, dayjs, client }) => {
    const { data, loading, error, subscribeToMore } = useQuery<IGetCountsResponceData>(GET_COUNTS);
    const [mobileMenu, setMobileMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        subscribe({ subscribeToMore, msgAudio, currentUserId: session.currentuser.userID });
    }, [])

    const toggleMobileMenu = () => {
        if (!mobileMenu) {
            document.body.classList.add("menu-shown");
        } else {
            document.body.classList.remove("menu-shown");
        }
        setMobileMenuOpen(!mobileMenu);
    };

    const openInbox = () => {
        const { cache } = client;
        deleteFromCache({ cache, query: "getInbox" });

        const { getCounts } = cache.readQuery({
            query: GET_COUNTS
        });

        let newCounts = { ...getCounts };

        newCounts.newMsg = false;

        cache.writeQuery({
            query: GET_COUNTS,
            data: { getCounts: { ...newCounts } }
        });
        if (window.location.pathname !== "/inbox") {
            history.push("/inbox");
        }
        toggleMobileMenu();
    };

    const isBlack = session.currentuser.blackMember.active ? true : false;
    const isCouple = session.currentuser.coupleProfileName !== null ? true : false;

    if (loading || !data) {
        return (
            <div className="function">
                <CircularProgress size={30} color="secondary" />
            </div>
        );
    }

    if (error) {
        return (
            <ErrorHandler.report
                error={error}
                calledName={"getCounts"}
                userID={session.currentuser.userID}
            />
        );
    }

    const messagesCount: number = data.getCounts.msgsCount;
    const showCount: boolean = !!(messagesCount && messagesCount > 0 && !mobileMenu);
    const newMsg: boolean = data.getCounts.newMsg;

    return (
        <div className="container">
            <div className="col-md-12">
                <div className="row no-gutters">
                    <div>
                        <MobileMenu
                            mobileMenu={mobileMenu}
                            onClick={toggleMobileMenu}
                            showCount={showCount}
                            messageCount={messagesCount}
                        />
                        <MobileNavLinks
                            mobileMenu={mobileMenu}
                            openInbox={openInbox}
                            toggleMobileMenu={toggleMobileMenu}
                            messagesCount={messagesCount}
                            history={history}
                            isBlack={isBlack}
                            isCouple={isCouple}
                            t={t}
                        />
                    </div>
                    <NavLinks t={t} />
                    <div className="col-md-2 col-12">
                        <Link to="/members" className={mobileMenu === true ? "logo white" : "logo"} >
                            <span />
                        </Link>
                    </div>
                    <div className="col-md-5 flexible">
                        {session && session.currentuser && (
                            <UserToolbar
                                currentUser={session.currentuser}
                                counts={data.getCounts}
                                ErrorHandler={ErrorHandler}
                                blinkInbox={newMsg}
                                history={history}
                                dayjs={dayjs}
                                t={t}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withApollo(NavbarAuth);
