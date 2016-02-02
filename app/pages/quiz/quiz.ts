import {Component, Directive, View, ElementRef, Input} from 'angular2/core';
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

    onClick(item: IGameEntry) {
        if (item.id == this.quizset.CrtCorrectAnswerId) {
            console.log('right');
        } else {
            console.log('wrong');
        }
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


    constructor(storageService: StorageService, nav: NavController, navParams: NavParams, http: Http) {
        this.nav = nav;
        this.storageService = storageService;
        this.game = <IGame>navParams.get("game");
        this.quizSet = Quiz.createQuizSet(this.game, http, storageService.getNumberOfRounds());
    }

    onClick(no:number) {
        if (this.quizSet.RoundFinished) {
            return;
        }
        this.quizSet.answerQuestion(no, this.storageService);

        this.timeout = setTimeout(() => {
            if (!this.quizSet.nextQuestion()) {
                this.nav.setPages([HomePage,{componentType: Summary, params:{"quizSet": this.quizSet}}], {"animate": true});
            }
        }, 1500);

    }
}


