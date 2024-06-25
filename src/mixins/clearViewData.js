export default {
    methods: {
        /**
         * Used to clear the viewData after it's been pushed to the database.
         * @param {object} viewData
         * @return {void}
         */
        clearViewData(viewData) {
            const defaultValues = {
                images: [],
                date: new Date().toISOString(),
                documentedModsFile: null,
                documentedModsDocName: null,
                documentedModsUrl: null,
            };

            Object.keys(viewData).forEach(key => {
                if (key in defaultValues) {
                    viewData[key] = defaultValues[key];
                } else {
                    viewData[key] = "";
                }
            });
        }
    }
}
