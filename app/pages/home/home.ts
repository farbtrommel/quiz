import {Page, NavController} from 'ionic-framework/ionic';
import {Quiz, IGame} from '../../quiz/controller';
import {QuizPage} from '../quiz/quiz';
import {MyApp} from "../../app";


@Page({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    private title: string = MyApp.title;
    Games: any[];
    nav: NavController;

    constructor(nav: NavController) {
        this.nav = nav;
        this.Games = Quiz.getGames();
    }

    startGame(game:IGame) {
        this.nav.setRoot(QuizPage, {"game": game}, {"animate": true});
    }
}
