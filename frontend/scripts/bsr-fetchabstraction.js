// Fetch abstraction calls for interacting during bsr runtime
import { BsrFetch, BsrFetchMethods } from "./bsr-fetch.js";
import { Helper } from "./helper.js";

export { BsrFetchAbstraction };


class BsrFetchAbstraction{

    #fetch;

    constructor(gameCode =""){

        this.#fetch = new BsrFetchMethods(gameCode);

    }



}