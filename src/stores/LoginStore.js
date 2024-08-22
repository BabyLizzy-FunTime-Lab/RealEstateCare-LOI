import {defineStore} from "pinia";
import axios from "axios";

// Default variables.
const baseDbUrl = "https://json-real-estate-care-3167f11da290.herokuapp.com";
const defaultAvatar = "/icons/toolbar/toolbar-default-avatar.svg";
let userInfoStorage = {
    id: String,
    name: String,
    access: String,
    avatar: null
};
// A fetch is needed to get general app information like basic URL and the knowledge base.

export const useLoginStore = defineStore('login', {
    state: () => {
        return {
            loadingStatus: false,
            loginStatus: false,
            loginStepOne: false,
            userInfo: Object,
            userAvatar: defaultAvatar,
            loginError: {
                value: {
                    status: false,
                    subHeader: String,
                    message: String
                },
                default: null
            },
            baseSiteInformation: null
        }
    },
    actions: {
        fetchBaseDbUrl() {
            return baseDbUrl;
        },
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
            userInfoStorage = {
                id: String,
                name: String,
                access: String,
                avatar: null
            };
            this.closeLoginError();
            // Reset all fetched inspection data here.
            console.log("Logout complete.");
        },
        deployLoginErrorAlert(status, subHeader, message) {
            this.getLoginError.status = status;
            this.getLoginError.subHeader = subHeader;
            this.getLoginError.message = message;
        },
        async fetchTwoWayAuthenticationCode() {
            return axios.get(baseDbUrl + "/2wayAuthenticator").then(result => {
                return result.data.generatedCode;
            }).catch(err => {
                console.error("Fetching 2way Authentication Code failed.", err)
            })
        },
        async twoFactorAuthenticationCheck(inputCode) {
            this.loadingStatus = true;
            await this.fetchTwoWayAuthenticationCode().then(result => {
                if(inputCode === result && this.loginStepOne) {
                    this.loginStatus = true;
                    console.log("2-Factor Authentication Success!!")
                    this.userInfo = {
                        id: userInfoStorage.id,
                        name: userInfoStorage.name,
                        access: userInfoStorage.access,
                        avatar: userInfoStorage.avatar
                    }
                    if(userInfoStorage.avatar !== "") {
                        this.userInfo.avater = defaultAvatar ;
                    }
                    this.loadingStatus = false;
                } else {
                    this.loadingStatus = false;
                    this.deployLoginErrorAlert(
                        true,
                        "There was a Two Way Authentication issue",
                        "The entered code in incorrect."
                    );
                    console.warn("There was a problem verifying the 2way Authentication code.")
                }
            })
        },
        async loginUser(inputName, inputPassword) {
            this.loadingStatus = true

            // Here we get the general information about the site.
            await this.fetchBaseSiteInformation();

            // This should happen on the server.
            // Here we fetch the User data if it's available.
            await axios.get(baseDbUrl + "/user_inspector?name=" + inputName + "&password=" + inputPassword)
                .then(result => {
                    // The JSON server returns 200 even if it didn't find a match, so we have to check the
                    // return data length to see if any matches were found.
                    if(result.data.length) {
                        userInfoStorage = result.data[0];
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
                const result = await axios.get(baseDbUrl + "/base_site_information");
                this.baseSiteInformation = result.data;
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
