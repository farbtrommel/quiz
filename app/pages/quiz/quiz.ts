import {Component, Directive, View, ElementRef, Input, ViewChild} from 'angular2/core';
import {Http} from 'angular2/http'
import {Page, NavController, NavParams} from 'ionic-framework/ionic';
import {Quiz, IQuizSet, IGame, IGameEntry} from '../../quiz/controller';
import {AudioControl} from '../../quiz/audio';
import {Summary} from './summary';
import {HomePage} from '../home/home';
import {StorageService} from '../../quiz/storage-service'

@Component({
    selector:'quiz-question',
    input: [
        'item: item',
        'quizset: quizset'
    ],
    templateUrl: 'build/pages/quiz/quiz-question.html'
})
export class QuizQuestion{
    element: ElementRef;
    @Input() item: IGameEntry;
    @Input() quizset: IQuizSet;

    constructor(element: ElementRef){
        this.element = element;
    }
}

@Page({
    templateUrl: 'build/pages/quiz/quiz.html',
    directives: [QuizQuestion, AudioControl]
})
export class QuizPage {
    quizSet: IQuizSet;
    game: IGame;
    storageService: StorageService;
    private timeout;
    private nav: NavController;

    @ViewChild(AudioControl) audioController: AudioControl;


    constructor(storageService: StorageService, nav: NavController, navParams: NavParams, http: Http) {
        this.nav = nav;
        this.storageService = storageService;
        this.game = <IGame>navParams.get("game");
        this.quizSet = Quiz.createQuizSet(this.game, storageService, http);
    }

    onClick(no:number) {
        var item: IGameEntry = this.quizSet.Set[this.quizSet.CrtQuestion][no];
        if (this.quizSet.RoundFinished) {
            return;
        }
        this.quizSet.answerQuestion(item, no);

        this.timeout = setTimeout(() => {
            if (!this.quizSet.nextQuestion()) {
                this.nav.setPages([HomePage, {componentType: Summary, params:{"quizSet": this.quizSet}}],
                    {"animate": true});
            }
        }, 1500);

    }

    onPageDidEnter() {
        this.audioController.play();
    }

    onPageWillLeave () {
        try {
            this.nav.pop();
            this.audioController.stop();
        } catch (e) {

        }

    }
}


