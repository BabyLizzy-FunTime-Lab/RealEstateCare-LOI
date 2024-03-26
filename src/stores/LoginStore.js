import {defineStore} from "pinia";
import axios from "axios";

// Default variables.
// const baseDbUrl = "https://my-json-server.typicode.com/BabyLizzy-FunTime-Lab/RealEstateCare";
const baseDbUrl = "https://real-estate-care-json-1205608aa6ef.herokuapp.com";
// const knowledgeBase = {
//     testProcedure: "https://res.cloudinary.com/babylizzyevee/image/upload/v1711289986/CV-images/LOI-cursus/pdf/Test_Procedure.pdf",
//     companyStandards: "https://res.cloudinary.com/babylizzyevee/image/upload/v1710855977/CV-images/LOI-cursus/pdf/Company_Standards.pdf",
//     basicContract: "https://res.cloudinary.com/babylizzyevee/image/upload/v1710855968/CV-images/LOI-cursus/pdf/Basic_Contract.pdf",
//     emergencyProcedure: "https://res.cloudinary.com/babylizzyevee/image/upload/v1710855728/CV-images/LOI-cursus/pdf/Emergency_Procedure.pdf"
// };
const knowledgeBase = [
    {
        name: "Test Procedure",
        url: "https://res.cloudinary.com/babylizzyevee/image/upload/v1711289986/CV-images/LOI-cursus/pdf/Test_Procedure.pdf"
    },
    {
        name: "Company Standards",
        url: "https://res.cloudinary.com/babylizzyevee/image/upload/v1710855977/CV-images/LOI-cursus/pdf/Company_Standards.pdf"
    },
    {
        name: "Basic Contract",
        url: "https://res.cloudinary.com/babylizzyevee/image/upload/v1710855968/CV-images/LOI-cursus/pdf/Basic_Contract.pdf"
    },
    {
        name: "Emergency Procedure",
        url: "https://res.cloudinary.com/babylizzyevee/image/upload/v1710855728/CV-images/LOI-cursus/pdf/Emergency_Procedure.pdf"
    }
];
const defaultAvatar = "/icons/toolbar/toolbar-default-avatar.svg";

// A fetch is needed to get general app information like basic URL and the knowledge base.

export const useLoginStore = defineStore('login', {
    state: () => {
        return {
            checkLoginStore: 'Store works',
            loadingStatus: false,
            loginStatus: false,
            userInfo: Object,
            userAvatar: defaultAvatar,
            errorMessage: null,
        }
    },
    actions: {
        fetchUser(inputName, inputPassword) {
            this.loadingStatus = true
            // This should happen on the server.
            axios.get(baseDbUrl + "/user_inspector?name=" + inputName + "&password=" + inputPassword)
                .then(result => {
                    // The JSON server returns 200 even if it didn't find a match so we have to check the
                    // return data length to see if any matches were found.
                    if(result.data.length) {
                        let data = result.data[0];
                        this.loginStatus = true;
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
        fetchKnowledgeBase() {
            return knowledgeBase;
        },
        fetchBaseDbUrl() {
            return baseDbUrl;
        },
        fetchKnowledgeBaseDocumentUrl(documentName) {
            knowledgeBase.forEach((document) => {
                if(document.name === documentName) {
                    console.log(document.url);
                    return "https://res.cloudinary.com/babylizzyevee/image/upload/v1711289986/CV-images/LOI-cursus/pdf/Test_Procedure.pdf";
                    // return document.url;
                }
            })
        },
        setErrorMessage(errValue) {
            this.errorMessage = errValue;
        },
        logoutUser() {
            console.log("Logging out...");
            this.loginStatus = false;
            this.loadingStatus = false;
            this.userInfo = {};
            this.errorMessage = null;
            console.log("Logout complete.");
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
    }
})
