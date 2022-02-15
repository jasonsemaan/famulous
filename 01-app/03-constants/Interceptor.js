import fetchIntercept from 'fetch-intercept';

export const callIntercept = (api) => {
    console.log(api)
}

export const unregister = fetchIntercept.register({
    request: function (url, config) {
        console.log("Request url ", url)
        return [url, config];
    },
    requestError: function (error) {
        // Called when an error occured during another 'request' interceptor call
        return Promise.reject(error);
    },
    response: function (response) {
        // Modify the reponse object
        return response;
    },
    responseError: function (error) {
        // Handle an fetch error
        return Promise.reject(error);
    }
});