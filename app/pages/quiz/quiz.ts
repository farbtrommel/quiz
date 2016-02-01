import {Component, Directive, View, ElementRef, Input} from 'angular2/core';
import {Page, NavController, NavParams} from 'ionic-framework/ionic';
import {Quiz} from '../../quiz/controller';
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
    @Input() item: Quiz.IGameEntry;
    @Input() quizset: Quiz.IQuizSet;

    constructor(element: ElementRef){
        this.element = element;
    }

    onClick(item:Quiz.IGameEntry) {
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
    quizSet: Quiz.IQuizSet;
    game: Quiz.IGame;
    storageService: StorageService;
    private timeout;
    private nav: NavController;


    constructor(storageService: StorageService, nav: NavController, navParams: NavParams) {
        this.nav = nav;
        this.storageService = storageService;
        this.game = <Quiz.IGame>navParams.get("game");
        this.quizSet = Quiz.createQuizSet(this.game, storageService.getNumberOfRounds());
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


