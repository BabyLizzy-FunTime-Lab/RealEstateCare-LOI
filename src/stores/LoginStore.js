import {defineStore} from "pinia";
import axios from "axios";

// Default variables.
const baseDbUrl = "https://json-real-estate-care-3167f11da290.herokuapp.com";
const defaultAvatar = "/icons/toolbar/toolbar-default-avatar.svg";
// A fetch is needed to get general app information like basic URL and the knowledge base.

export const useLoginStore = defineStore('login', {
    state: () => {
        return {
            checkLoginStore: 'Store works',
            loadingStatus: false,
            loginStatus: false,
            loginStepOne: false,
            userInfo: Object,
            userAvatar: defaultAvatar,
            errorMessage: null,
            baseSiteInformation: null
        }
    },
    actions: {
        async fetchTwoWayAuthenticationCode() {
            return axios.get(baseDbUrl + "/2wayAuthenticator").then(result => {
                console.log(result.data.generatedCode);
                return result.data.generatedCode;
            }).catch(err => {
                console.error("Fetching 2way Authentication Code failed.", err)
            })
        },
        async TwoWayAuthenticationCheck(inputCode) {
            const fetchedCode = await this.fetchTwoWayAuthenticationCode();
            if(inputCode === fetchedCode && this.loginStepOne) {
                this.loginStatus = true;
            } else {
                console.warn("There was a problem verifying the 2way Authentication code.")
            }
        },
        async loginUser(inputName, inputPassword) {
            this.loadingStatus = true

            // Here we get the general information about the site.
            await this.fetchBaseSiteInformation();
            await this.fetchTwoWayAuthenticationCode();

            // This should happen on the server.
            // Here we fetch the User data if it's available.
            await axios.get(baseDbUrl + "/user_inspector?name=" + inputName + "&password=" + inputPassword)
                .then(result => {
                    // The JSON server returns 200 even if it didn't find a match, so we have to check the
                    // return data length to see if any matches were found.
                    if(result.data.length) {
                        let data = result.data[0];
                        this.loginStatus = true;
                        this.loginStepOne = true;
                        this.userInfo = {
                            id: data.id,
                            name: data.name,
                            access: data.access,
                            avatar: data.avatar
                        }
                        if(data.avatar !== "") {
                            this.userInfo.avater = defaultAvatar ;
                        }
                        this.errorMessage = null;
                        console.log("Login successful");
                    } else {
                        this.errorMessage = "User was not found or the password is incorrect.";
                        console.warn("Login problem: User was not found or password incorrect");
                    }
                    this.loadingStatus = false
                })
                .catch(err => {
                    this.loadingStatus = false;
                    this.userInfo = {};
                    this.errorMessage = err.message;
                    console.warn("We got an error on login", this.errorMessage);
                })
        },
        fetchBaseDbUrl() {
            return baseDbUrl;
        },
        setErrorMessage(errValue) {
            this.errorMessage = errValue;
        },
        setLoadingStatus(status) {
            this.loadingStatus = status;
        },
        logoutUser() {
            console.log("Logging out...");
            this.loginStatus = false;
            this.loadingStatus = false;
            this.userInfo = {};
            this.errorMessage = null;
            console.log("Logout complete.");
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
    }
})
