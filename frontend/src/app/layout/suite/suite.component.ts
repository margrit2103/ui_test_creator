import { Component, ViewChild } from '@angular/core';
import { routerTransition } from '@animations';
import { TestSuite } from '@models';
import { BackendService } from '@backend';
import { FormControl } from '@angular/forms';
import { screenRender } from '@screens';
import { GlobalService } from '@global';

@Component({
    selector: 'app-suite',
    templateUrl: './suite.component.html',
    styleUrls: ['./suite.component.scss'],
    animations: [routerTransition()]
})

export class SuiteComponent {
    suites: Array<TestSuite> = [];
    session_id: string = null;
    selectedSuite: TestSuite = null;
    selectedSuites: Array<TestSuite> = [];
    openSuite: boolean = false;
    @ViewChild('suiteScreen') suiteScreen: screenRender;
    @ViewChild('testResultScreen') testResultScreen: screenRender;
    @ViewChild('clientSelectionScreen') ClientSelectionScreen: screenRender;

    constructor(private backend: BackendService, public globalService: GlobalService) { }

    ngOnInit() {
        this.refreshSuites();
        this.suiteScreen.closed.subscribe(() => this.refreshSuites());
        this.suiteScreen.saved.subscribe(() => this.refreshSuites());
    }

    refreshSuites(): void {
        this.backend.getSuites().then(e => {
            if (e.result && e.data) {
                this.suites = e.data.map(x => new TestSuite(x));
            }
        });
    }

    runTestSuite() {
        const test = this.selectedSuites.map(x => {
            return { name: x.name, type: 'suite' };
        })
        this.ClientSelectionScreen.open(null, {
            save: model => {
                const data = { model: {client: model, tests: test} }
                // this.testResultScreen.open(data);
                this.globalService.registerSub('client', 'ws',
                    this.globalService.wsMessage.subscribe(data => this.testResultScreen.open(data, {
                        save: () => this.globalService.unregisterSub('client', 'ws'),
                        close: () => this.globalService.unregisterSub('client', 'ws')
                    })));
            }
        });
    }

    newTest() {
        this.selectedSuite = new TestSuite;
        this.suiteScreen.open(this.selectedSuite);
    }

    searchSuites(searchTerm) {
        if (searchTerm.length >= 3 || searchTerm.length === 0) {
            this.backend.searchTests(searchTerm)
                .then(res => {
                    console.log(res);
                    if (res.result && res.data) {
                        this.suites = res.data.map(x => new TestSuite(x));
                    }
                })
        }
    }

    testClicked(suite: TestSuite): void {
        if (suite === this.selectedSuite) {
            this.selectedSuite.load();
            this.suiteScreen.open(this.selectedSuite);
        } else {
            this.selectedSuite = suite;
        }
    }
}
