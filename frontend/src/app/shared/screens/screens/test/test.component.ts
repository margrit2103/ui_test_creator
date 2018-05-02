import { NgModule, Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { BackendService } from '@backend';
import * as $ from 'jquery';
import { AutocompleteComponent, Confirm } from '@utils';
import { Test } from '@models';
import { Screen, ImagesScreen, screenRender } from '@screens';

@Component({
    selector: 'test-screen',
    templateUrl: './test.component.html',
})

export class TestScreen extends Screen implements OnInit {
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('imagesScreen') imagesScreen: screenRender;
    model: Test;
    imageList: Array<{ name: string }> = [];

    constructor(private backend: BackendService) {
        super();
        this.screenName = 'Test Case Screen';
    }

    ngOnInit() {
        this.nameInput.nativeElement.focus();
        setTimeout(() => this.genActionImageName(), 100);
    }

    removeAction(action) {
        let popup = new Confirm('Are you sure you wish to remove this action ?', {
            header: 'Remove action Confirmation'
        }, (res) => {
            if (res) {
                this.model.actions.splice(this.model.actions.indexOf(action), 1);
            }
        });
        popup.open();
    }

    Images(action) {
        this.imagesScreen.open(null, {
            save: model => {
                action.data = model;
                this.genActionImageName()
            }
        });
    }

    moveActionIndex(action, type) {
        const currentActionIndex = this.model.actions.indexOf(action);
        console.log(currentActionIndex)
        if (type === 'decrease') {
            const previousActionIndex = this.model.actions.indexOf(action) - 1;
            this.model.actions.splice(previousActionIndex, 2, action, this.model.actions[previousActionIndex]);
        } else if (type === 'increase') {
            const nextActionIndex = this.model.actions.indexOf(action) + 1;
            this.model.actions.splice(currentActionIndex, 2, this.model.actions[nextActionIndex], action);
        }
    }

    filterTestName() {
        this.model.name = this.model.name.split(' ').map(x => x.toLowerCase()).join('_');
    }

    addAction() {
        this.model.addAction();
    }

    genActionImageName() {
        for (const action of this.model.actions) {
            action['imageName'] = 'No Image Selected'
            if (action.data && ['doubleclick', 'click', 'clickwait', 'rclick'].includes(action.action)) {
                this.backend.getImages({ method: 'specific_name', value: action.data }).then(res => {
                    action['imageName'] = res.data[0]['name']
                })
            }
        }
    }
}
