export default {
    methods: {
        /**
         * Used to clear the viewData after it's been pushed to the database.
         * @param {array} viewDataAll
         * @return {void}
         */
        clearViewData(viewDataAll) {
            const defaultValues = {
                images: [],
                documentedModsFile: null,
                date: null,
                address: null,
                resetDate: true,
                inspectionId: null,
                documentedModsDocName: null,
                documentedModsUrl: null,
            };
            viewDataAll.forEach(viewData => {
                Object.keys(viewData).forEach(key => {
                    if (key in defaultValues) {
                        viewData[key] = defaultValues[key];
                    } else {
                        viewData[key] = "";
                    }
                });
            })

        }
    }
}
