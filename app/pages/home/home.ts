import {Page, NavController} from 'ionic-framework/ionic';
import {Quiz} from '../../quiz/controller';
import {QuizPage} from '../quiz/quiz';


@Page({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    Games: any[];
    nav: NavController;

    constructor(nav: NavController) {
        this.nav = nav;
        this.Games = Quiz.getGames();
    }

    startGame(game:Quiz.IGame) {
        this.nav.setRoot(QuizPage, {"game": game}, {"animate": true});
    }
}
