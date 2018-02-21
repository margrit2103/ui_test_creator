import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '@backend';
import { Screen } from '@screens';


@Component({
    selector: 'client-selection-screen',
    templateUrl: './clientSelection.component.html'
})

export class ClientSelectionScreen extends Screen implements OnInit {
    clientList: any;

    constructor(private backend: BackendService) {
        super();
        this.screenName = 'Client Selection Screen'
    }

    ngOnInit() {
        this.backend.getClients().then(e => {
            if (e.result && e.data) {
                this.clientList = e.data
            }
        })
    }

    selectedClient(client) {
        this.model = client;
    }
}
