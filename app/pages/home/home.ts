import {ViewChild} from '@angular/core';
import {Page, NavController, Platform} from 'ionic-angular';
import {Quiz} from '../../quiz/controller';
import {IGame} from '../../quiz/interfaces';
import {QuizPage} from '../quiz/quiz';
import {AudioControl} from '../../quiz/audio';
import {MyApp} from "../../app";



@Page({
    templateUrl: 'build/pages/home/home.html',
    directives: [AudioControl]
})
export class HomePage {
    private title: string = MyApp.title;
    Games: any[];
    nav: NavController;
    platform: Platform;

    @ViewChild(AudioControl, '') audioController: AudioControl;

    constructor(nav: NavController, platform: Platform) {
        this.nav = nav;
        this.Games = Quiz.getGames();
        this.platform = platform;
    }

    startGame(game:IGame) {
        //Mobile web site on smart phone need to activate
        //read more about the issue:
        //http://stackoverflow.com/questions/32424775/failed-to-execute-play-on-htmlmediaelement-api-can-only-be-initiated-by-a-u
        /*
        if (!this.platform.is("cordova")) {
            this.audioController.play();
        }
        */

        this.nav.push(QuizPage, {"game": game}, {"animate": true});
    }
}
