import Action from '../Action/Action';

export default class TestCase {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || null;
        this.description = data.description || null;
        this.actions = data.actions || [];
    }

    stuff() {
        Object.defineProperties(TestCase.prototype, {
            actions: {
                set: val => {
                    this.actions.push(new Action(val));
                }
            }
        });
    }
    addAction() {
        this.actions.push(new Action());
    }
}
