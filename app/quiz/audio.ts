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
                this.play();
            }
        }

    }
    ngOnDestroy() {
        this.stop();
    }

    onPageDidEnter() {
        if (this.autoplay == "true") {
            this.play();
        }
    }

    onPageWillLeave () {
        this.stop();
    }

    onClick(event: EventListenerObject) {
        this.toggle();
    }

    changeAudio(){
        this.isPlaying = !this.audioElement.nativeElement.paused;
        console.log("Audio Status changed " + this.isPlaying);
    }


    /**
     * Stop when the audio is playing and play when the audio is stopped.
     */
    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    }

    stop() {
        if (this.isBrowser) {
            this.audioElement.nativeElement.pause();
        } else {
            if(this.media) {
                this.media.stop();
            }
        }
        this.isPlaying = false;
    }

    play() {
        if (this.isBrowser) {
            this.audioElement.nativeElement.play();
        } else {
            var mp3URL = this.getMediaURL(this.src);
            this.media = new Media(mp3URL, msg => this.mediaSuccess(msg), err => this.mediaError(err));
            this.media.play();
        }
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
            this.play();
        }
    }

    mediaError(e) {
        this.isPlaying = false;
        console.log('Media Error');
        console.log(JSON.stringify(e));
    }
}