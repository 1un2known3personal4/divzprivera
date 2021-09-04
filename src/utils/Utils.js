class Utils {
    static capitalize(str) {
        return str.chatAt(0).toUpperCase() + str.slice(1);
    }

    static sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
}

module.exports = Utils;