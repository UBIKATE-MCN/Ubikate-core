class APIConnector {
    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    fetchMadridOpenData(endpoint) { return {}; }
    checkStatus() { return true; }
}
module.exports = APIConnector;