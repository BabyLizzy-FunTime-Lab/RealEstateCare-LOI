
export const sanitizer = () => {
    /**
     * Removes all characters that are not letters (not including accented), numbers, or spaces
     * @param {string} characterString
     * @return {string}
     */
    const inputSanitizer = (characterString) => {
        return characterString.normalize("NFD").replace(/[^a-zA-Z0-9\s\u00C0-\u017F\-+]/g, '');
    };

    return {
        inputSanitizer
    }
}
