// <reference path="../../typings/cordova/cordova.d.ts"/>
import {App, Platform, Config, Icon} from 'ionic-framework/ionic';
import {Component, Directive, View, ElementRef, Input, ViewChild, ViewChildFactory} from 'angular2/core';

@Component({
    selector:'ion-audio',
    input: [
        'src: src',
        'autoplay: autoplay',
        'loop: loop',
        'controls: controls',
        'htmlcontrols: htmlcontrols'
    ],
    directives: [Icon],
    templateUrl: 'build/quiz/audio-control.html'
})
export class AudioControl {
    element: ElementRef;
    platform: Platform;

    @ViewChild('player') audioElement: ElementRef;

    @Input() src: string;
    @Input() autoplay: string;
    @Input() loop: string;
    @Input() controls: string;
    @Input() htmlcontrols: string;

    isBrowser: boolean = true;
    isPlaying: boolean = false;

    media:Media = null;

    constructor(element: ElementRef, platform: Platform){
        this.element = element;
        this.platform = platform;

        if (this.platform.is("WebView") && !element.nativeElement.getAttribute("src").startsWith("http")) {
            this.isBrowser = false;
        }
    }
    ngAfterViewInit() {
        if (this.isBrowser) {
            this.audioElement.nativeElement.controls = (this.htmlcontrols == "true");
            this.audioElement.nativeElement.autoplay = (this.autoplay == "true");
            this.audioElement.nativeElement.loop = (this.loop == "true");
        } else {
            if (this.autoplay == "true") {
                this.playMP3();
            }
        }

    }
    ngOnDestroy() {
        if (this.isBrowser) {
            this.audioElement.nativeElement.pause();
        } else {
            this.stopMP3();
        }
    }

    onClick(event: EventListenerObject) {
        if (this.isBrowser) {
            this.changeAudioBrowser();
        } else {
            this.changeAudioCordova();
        }
    }

    changeAudio(){
        this.isPlaying = !this.audioElement.nativeElement.paused;
        console.log("Audio Status changed " + this.isPlaying);
    }

    changeAudioBrowser() {
        if (this.isPlaying) {
            this.audioElement.nativeElement.pause();
            console.log("Stop sound.");
        } else {
            this.audioElement.nativeElement.play();
            console.log("Play sound.");
        }
        this.isPlaying = !this.audioElement.nativeElement.paused;
    }

    changeAudioCordova() {
        if (this.isPlaying) {
            this.stopMP3();
        } else {
            this.playMP3();
        }
    }

    stopMP3() {
        if(this.media) {
            this.media.stop();
            this.isPlaying = false;
        }
    }
    playMP3() {
        var mp3URL = this.getMediaURL(this.src);
        this.media = new Media(mp3URL, msg => this.mediaSuccess(msg), err => this.mediaError(err));
        this.media.play();
        this.isPlaying = true;
    }

    getMediaURL(s) {
        if(this.platform.is("android")) {
            return "/android_asset/www/" + s;
        }
        return s;
    }
    mediaSuccess(e) {
        this.isPlaying = false;
        if (this.loop == "true") {
            this.playMP3();
        }
    }

    mediaError(e) {
        this.isPlaying = false;
        console.log('Media Error');
        console.log(JSON.stringify(e));
    }
}