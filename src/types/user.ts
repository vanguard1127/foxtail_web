interface IBlackMember {
    active: boolean;
    renewalDate: string | null;
    __typename: string;
}

export interface IUser {
    username: string;
    userID: string;
    profileID: string;
    profilePic: string;
    blackMember: IBlackMember;
    isProfileOK: boolean;
    isEmailOK: boolean;
    announcement: string | null;
    distanceMetric: string;
    coupleProfileName: string | null;
    location: { city: string };
    active: boolean;
    captchaReq: false;
    likesSent: number;
    createdAt: string;
    __typename: string;
}

export interface ISession {
    currentuser: IUser
}