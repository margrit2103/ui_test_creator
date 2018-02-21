import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestScreen, SuiteScreen, screenRender, TestResultScreen, ImagesScreen, ClientSelectionScreen } from '@screens';
import { FormsModule } from '@angular/forms';
import { BackendService } from '@backend';
import { AutocompleteComponent } from '@utils';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        screenRender,
        TestScreen,
        SuiteScreen,
        TestResultScreen,
        AutocompleteComponent,
        ImagesScreen,
        ClientSelectionScreen,
    ],
    providers: [
        BackendService
    ],
    entryComponents: [
        TestScreen,
        SuiteScreen,
        TestResultScreen,
        ImagesScreen,
        ClientSelectionScreen
    ],
    exports: [
        screenRender,
        TestScreen,
        SuiteScreen,
        TestResultScreen,
        AutocompleteComponent,
        ImagesScreen,
        ClientSelectionScreen
    ]
})

export class ScreenModule { }
