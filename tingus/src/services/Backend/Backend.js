import axios from 'axios';
import TestCase from '../../models/TestCase/TestCase.js';

export default class Backend {
    constructor() {
        this.testCase = new TestCase();
        this.requests = axios.create({
            baseURL: 'http://127.0.0.1:9000/'
        });
    }

    getTestsCount() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/getTestsCount', {})
                .then(testCasesCount => {
                    testCasesCount.data.data
                    resolve(testCasesCount.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    getSuitesCount() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/getSuitesCount', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    getTests() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/getTests', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    getSuites() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/getSuites', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    getImages() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/getImages', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    saveTest() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/saveTest', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    saveTestSuite() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/saveTestSuite', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    loadTestSuite() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/loadTestSuite', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    loadTest() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/loadTest', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    runTestSuite() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/runTestSuite', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    runTest() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/runTest', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    searchTests() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/searchTests', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }

    searchSuites() {
        return new Promise((resolve, reject) => {
            this.requests
                .post('/searchSuites', {})
                .then(stuff => {
                    resolve(stuff.data);
                })
                .catch(error => {
                    reject(error.response);
                });
        });
    }
}
