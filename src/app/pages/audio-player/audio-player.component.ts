import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from "@angular/common";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { MaterialModule } from "@shared/material/material.module";

import { IAudioState, IAudio, ICurrentAudio } from "./interfaces";
import { AudioService } from "./services";

@Component({
    standalone: true,
    selector: 'app-audio-player',
    templateUrl: './audio-player.component.html',
    styleUrls: ['./audio-player.component.scss'],
    imports: [MaterialModule, NgIf],
    providers: [AudioService]
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
    audioService = inject(AudioService);

    audioList: IAudio[] = this.audioService.audioList;
    state: IAudioState = this.audioService.state;
    currentAudio!: ICurrentAudio;
    displayedColumns: string[] = [];

    private unsubscribe$: Subject<void> = new Subject<void>()

    ngOnInit(): void {
        this.displayedColumns = ['id', 'songName', 'artist'];
    }

    playStream(url: string): void {
        this.audioService.playStream(url)
            .pipe(takeUntil(this.audioService.stop$))
            .subscribe((state) => {
                if (state === 'ended') {
                    this.next();
                }
            });
    }

    openAudio(audio: IAudio, index: number): void {
        if (this.currentAudio && this.currentAudio.index === index) {
            if (this.state.playing) {
                this.pause();
            } else {
                this.play();
            }
        } else {
            this.currentAudio = { index, audio };
            this.audioService.stop();
            this.playStream(audio.url);
        }
    }

    pause(): void {
        this.audioService.pause();
    }

    play(): void {
        this.audioService.play();
    }

    next(): void {
        const index: number = this.currentAudio.index + 1 === this.audioList.length
            ? 0 : this.currentAudio.index + 1;
        const audio: IAudio = this.audioList[index];
        this.openAudio(audio, index);
        this.currentAudio = { index, audio };
    }

    previous(): void {
        const index: number = this.currentAudio?.index - 1;
        const audio: IAudio = this.audioList[index];
        this.openAudio(audio, index);
        this.currentAudio = { index, audio };
    }

    onSliderChangeEnd(change: any) {
        this.audioService.seekTo(change.target.value);
    }

    isFirstPlaying(): boolean {
        return this.currentAudio?.index === 0;
    }

    isLastPlaying(): boolean {
        return this.currentAudio?.index === this.audioList.length - 1;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
