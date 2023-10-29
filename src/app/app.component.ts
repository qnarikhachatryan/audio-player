import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from "@angular/material/toolbar";

import { AudioPlayerComponent } from "@pages/audio-player";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [AudioPlayerComponent, MatToolbarModule],
})

export class AppComponent {
}
