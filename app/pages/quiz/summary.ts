import {Page, NavController, NavParams, Modal, ViewController, Platform} from 'ionic-angular';
import {Quiz} from '../../quiz/controller';
import {IQuizSet, IGameEntry} from '../../quiz/interfaces';
import {Details} from './details';

@Page({
    templateUrl: 'build/pages/quiz/summary.html'
})
export class Summary {
    private nav: NavController;
    private quizSet: IQuizSet;

    constructor(nav:NavController, navParams: NavParams) {
        this.nav = nav;
        this.quizSet = navParams.get("quizSet");
    }

    clickViewDetails(entry:IGameEntry) {
        let modal = Modal.create(Details, {"gameId": this.quizSet.GameId ,"item": entry});
        this.nav.present(modal);
    }
}