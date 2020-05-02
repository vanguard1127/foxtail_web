export interface IResponseData {
    getSettings: {
        distance: number
        distanceMetric: string
        ageRange: number[]
        lang: string
        interestedIn: string[]
        city: string
        visible: boolean
        newMsgNotify: boolean
        emailNotify: boolean
        showOnline: boolean
        likedOnly: boolean
        vibrateNotify: boolean
        profilePic: string
        profilePicUrl: string
        couplePartner: string
        includeMsgs: boolean
        lastActive: Date
        users: {
            username: string
            verifications: {
                photoVer: {
                    active: boolean
                }
                stdVer: {
                    active: boolean
                }
            }
        }
        publicPhotos: {
            smallUrl: string
            url: string
            key: string
            id: string
        }[]
        privatePhotos: {
            smallUrl: string
            url: string
            key: string
            id: string
        }[]
        about: string
        kinks: string[]
        sexuality: string
        password: string
        ccLast4: number
        verifications: {
            photo: string
            std: string
        }
        __typename: string;
    }
}
