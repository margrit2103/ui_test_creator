import { NgModule, Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '@backend';
import * as $ from 'jquery';
import { AutocompleteComponent } from '@utils';
import { Screen } from '@screens';

@Component({
    selector: 'images-screen',
    templateUrl: './images.component.html'
})

export class ImagesScreen extends Screen implements OnInit {
    @Input() buttonIcon: string = "fa fa-plus";
    @Input() buttonName: string = "Add File";
    @Input() acceptFileType: Array<string> = [];

    acceptString: string = "";
    images: any;
    selectedImage: any;
    constructor(private backend: BackendService) {
        super();
    }

    ngOnInit() {
        this.backend.getImages({ method: 'last', value: '10' }).then(e => {
            if (e.result && e.data) {
                this.images = e.data
            }
        })
    }

    saveFile() {
        let file = $('#filePath');
        file = file[0].files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.backend.saveImage(
                {
                    image: {
                        name: file.name.substr(0, file.name.lastIndexOf('.')),
                        file: reader.result
                    }
                }).then(res => {
                    this.backend.getImages({ method: 'last', value: '10' }).then(e => {
                        if (e.result && e.data) {
                            this.images = e.data
                        }
                    });
                });
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    selectImage(image) {
        this.model = String(image);
    }
}
