import {defineStore} from "pinia";
import {dataBase} from "@/services/dataBase.js";

const {
    fetchBaseSiteInformation,
    loginNamePassword,
    twoFactorAuthenticator,
    userInfo
} = dataBase();


export const useLoginStore = defineStore('login', {
    state: () => {
        return {
            loadingStatus: false,
            loginStatus: false,
            loginStepOne: false,
            userInfo: Object,
            loginError: {
                value: {
                    status: false,
                    subHeader: String,
                    message: String
                },
                default: null
            },
            baseSiteInformation: Object
        }
    },
    actions: {
        closeLoginError() {
            this.getLoginError.status = false;
            this.getLoginError.subHeader = "";
            this.getLoginError.message = "";
        },
        setLoadingStatus(status) {
            this.loadingStatus = status;
        },
        logoutUser() {
            console.log("Logging out...");
            this.loginStatus = false;
            this.loadingStatus = false;
            this.loginStepOne = false;
            this.userInfo = {};
            this.closeLoginError();
            console.log("Logout complete.");
        },
        deployLoginErrorAlert(status, subHeader, message) {
            this.getLoginError.status = status;
            this.getLoginError.subHeader = subHeader;
            this.getLoginError.message = message;
        },
        async twoFactorAuthenticationCheck(inputCode) {
            this.loadingStatus = true;
            return await twoFactorAuthenticator(inputCode).then(result => {
                // Then clear inputs.
                if(result) {
                    this.loginStatus = true;
                    console.log("2-Factor Authentication Success!!")
                    // Call userinfo source userinfo bank.
                    this.userInfo = {
                        id: userInfo.value.id,
                        name: userInfo.value.name,
                        access: userInfo.value.access,
                        avatar: userInfo.value.avatar
                    }
                    // It's not working.
                    // We can't call the other stores without breaking the app.
                    if(this.userInfo.avatar === "" || this.userInfo.avatar === null) {
                        this.userInfo.avater = this.baseSiteInformation.defaultAvatar ;
                    }
                    this.loadingStatus = false;
                    return true;
                } else {
                    this.loadingStatus = false;
                    this.deployLoginErrorAlert(
                        true,
                        "There was a Two Way Authentication issue",
                        "The entered code in incorrect."
                    );
                    console.warn("There was a problem verifying the 2way Authentication code.")
                    return false;
                }
            })
        },
        async loginUser(inputName, inputPassword) {
            this.loadingStatus = true

            // Here we get the general information about the site.
            await this.fetchBaseSiteInformation();

            // This should happen on the server.
            // Here we fetch the User data if it's available.
            await loginNamePassword(inputName, inputPassword)
                .then(result => {
                    // The JSON server returns 200 even if it didn't find a match, so we have to check the
                    // return data length to see if any matches were found.
                    if(result) {
                        // userInfoStorage = result;
                        this.loginStepOne = true;
                        this.loadingStatus = false;
                        this.getLoginError.status = false;
                        console.log("Username & Password match!!");
                    } else {
                        this.loadingStatus = false;
                        this.deployLoginErrorAlert(
                            true,
                            "There was a login issue",
                            "User was not found or the password is incorrect."
                        );
                        console.warn("Login problem: User was not found or password incorrect");
                    }
                })
                .catch(err => {
                    this.loadingStatus = false;
                    this.userInfo = {};
                    this.errorMessage = err.message;
                    console.warn("We got an error on login", this.errorMessage);
                })
        },
        async fetchBaseDocument(documentName) {
            return new Promise((resolve, reject) => {
                const document = this.getBaseSiteInfo.knowledgeBase.find(doc => doc.name === documentName);
                if(document) {
                    resolve(document);
                } else {
                    reject(new Error('Document not found is BasSiteInformation'));
                }
            })
        },
        async fetchBaseSiteInformation() {
            try {
                this.baseSiteInformation = await fetchBaseSiteInformation();
            } catch (error) {
                console.error("Error fetching base site information:", error);
                throw error;
            }
        }
    },
    getters: {
        getLoginStatus(state) {
            return state.loginStatus;
        },
        getUserInfo(state) {
            return {
                id: state.userInfo.id,
                name: state.userInfo.name,
                access: state.userInfo.access
            }
        },
        getUserAvatar(state) {
            return state.userInfo.avatar;
        },
        getBaseSiteInfo(state) {
            return state.baseSiteInformation;
        },
        getAllBaseDocuments(state) {
            return state.baseSiteInformation.knowledgeBase;
        },
        getLoginError(state) {
            return state.loginError;
        },
        getLoginPhase(state) {
            // Step one is true when user and password match.
            return state.loginStepOne;
        }
    }
})
