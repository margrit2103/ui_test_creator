export default class Action {
    constructor(data = {}) {
        this.type = data.type || null;
        this.data = data.data || null;
        this.delay = data.delay || null;
    }
}
