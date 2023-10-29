import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { audioFiles } from '../model';
import { IAudio, IAudioState } from '../interfaces';

@Injectable()
export class AudioService {
    private _stop$: Subject<void> = new Subject<void>();
    public stop$: Observable<void> = this._stop$.asObservable();

    private audioObj: HTMLAudioElement = new Audio();
    private audioEvents: string[] = ['play', 'playing', 'pause', 'timeupdate'];

    public state: IAudioState = {
        playing: false,
        currentTime: 0,
        duration: 0
    };

    get audioList(): IAudio[] {
        return audioFiles;
    }

    private streamObservable(url: string): Observable<unknown> {
        return new Observable(observer => {
            this.audioObj.src = url;
            this.audioObj.load();
            this.audioObj.play();

            const handler = (event: Event) => {
                this.updateStateEvents(event);
            };

            this.addEvents(this.audioObj, this.audioEvents, handler);

            return () => {
                this.audioObj.currentTime = 0;
                this.removeEvents(this.audioObj, this.audioEvents, handler);
                this.resetState();
            };
        });
    }

    private addEvents(
        obj: HTMLAudioElement,
        events: string[],
        handler: (event: Event) => void
    ): void {
        events.forEach((event: any) => {
            obj.addEventListener(event, handler);
        });
    }

    private removeEvents(
        obj: HTMLAudioElement,
        events: string[],
        handler: (event: Event) => void
    ): void {
        events.forEach((event: any) => {
            obj.removeEventListener(event, handler);
        });
    }

    playStream(url: string): Observable<unknown> {
        return this.streamObservable(url);
    }

    play(): void {
        this.audioObj.play();
    }

    pause(): void {
        this.audioObj.pause();
    }

    stop(): void {
        this._stop$.next();
    }

    seekTo(seconds: number): void {
        this.audioObj.currentTime = seconds;
        this.state.currentTime = seconds
    }

    private updateStateEvents(event: Event): void {
        switch (event.type) {
            case "timeupdate":
                this.state.currentTime = this.audioObj.currentTime;
                break;
            case 'playing':
                this.state.playing = true;
                this.state.duration = this.audioObj.duration;
                break;
            case 'pause':
                this.state.playing = false;
                break;
        }
    }

    private resetState(): void {
        this.state.currentTime = 0;
    }
}
