import {useLoginStore} from "@/stores/LoginStore.js";

export function useLoginStoreComposable() {
    const loginStore = useLoginStore();
    const userInfo = () => {
        loginStore.getUserInfo();
    }
    const setLoadingStatus = (status) => {
        loginStore.setLoadingStatus(status);
    }
    return {
        userInfo,
        setLoadingStatus
    }
}
