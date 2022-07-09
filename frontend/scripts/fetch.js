// some fetch methods that can be used when sending and retreiving info from a server
// dont forget to encodeURIComponenet() the data if we are sending through the URL and it is required

export { FetchMethod }

class FetchMethod{

    // https://developer.mozilla.org/en-US/docs/Web/API/fetch
    #request;

    constructor(){
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_your_own_request_object
        this.#request = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            arguments: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Content-Type': 'application/json',
                // 'Content-Type': 'multipart/form-data',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: "" // body data type must match "Content-Type" header
        }
    }

    // set the type of data that might be sent to the server
    // object data gets turned into from data
    // text data gets kept the same
    #setData(dataName = "", data = {}){
        let setData = data;
        let formData = new FormData();
        formData.append(dataName, JSON.stringify(data));
        setData = formData;
        //console.log(setData);
        return setData;
    }

    /**
     * // Create and return a request of some kind to use in fetchMethod or a custom fetch method
     * @param {String} method - GET, POST, PUT, DELETE, etc.
     * @param {String} mode - no-cors, cors, same-origin
     * @param {String} cache - default, no-cache, reload, force-cache, only-if-cached
     * @param {String} credentials - include, same-origin, omit
     * @param {Object} arg - arguments, 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Type': 'application/json', 'Content-Type': 'multipart/form-data' there are more than this but these are commonly used
     * @param {String} redirect - manual, follow, error
     * @param {String} referrerPolicy - no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
     * @param {String} bodyName - name of body that will be recieved serverside in php
     * @param {Object|String} body - body of data that will be sent (will be json formatted)
     */
    createRequest(method = "POST", 
                  mode = "cors", 
                  cache = "no-cache", 
                  credentials = "same-origin", 
                  arg = {'Content-Type': 'application/x-www-form-urlencoded'}, 
                  redirect = 'follow', 
                  referrerPolicy = 'no-referrer',
                  bodyName = "data", 
                  body = { property : "property" }
                  ){

        let createdRequest = {};

        // since body is primarily used for PUT, POST, and PATCH, have a request that allows for those
        // PUT method gets changed into a GET method by default
        if (method == "PUT" || method == "POST" || method == "PATCH"){
            let bodyData = this.#setData(bodyName, body);
            createdRequest = {
                method : method, 
                mode : mode, 
                cache : cache,
                credentials: credentials,
                arguments : arg,
                redirect : redirect,
                referrerPolicy : referrerPolicy,
                body : bodyData
            }
        }
        // and have a request for the other methods that do not have those
        else{
            createdRequest = {
                method : method, 
                mode : mode, 
                cache : cache,
                credentials: credentials,
                arguments : arg,
                redirect : redirect,
                referrerPolicy : referrerPolicy,
            }
        }

        return createdRequest;
    }

    // return some type of response data given the desired returnType
    #responseType(response, responseType = "json"){
        if (responseType == "json"){
            return response.json();
        }
        if (responseType == "text"){
            return response.text();
        }
        return response;
    }

    /**
     * Creates a method to communicate with serverside (php), this is asyncronous so you can call .then and .catch following up fetchMethod.
     * @param {String} url - url string to connect with php (http://example.php)
     * @param {Object} request = the kind of request the fetch will use
     * @param {String} responseType - what type of data should the fetch call return (text | json | nothing for info)
     * @param {String} specificKey - a key we can use to check for a match case in global php for specific function calling during $_SOMETHING['key']. $_PUT methods that get sent with a body are changed to $_GET requests and the sent info must be part of the specificKey i.e. "key='item'"
     */
    async fetchMethod(url = "", request = {}, responseType = 'json', specificKey = ""){
        let setUrl = url;
        if (specificKey){
            setUrl = setUrl + "/?" + specificKey;
        }
        const response = await fetch(setUrl, request);
        return this.#responseType(response, responseType);
    }

}