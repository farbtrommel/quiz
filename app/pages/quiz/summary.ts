import {Page, NavController, NavParams, Modal, ViewController, Platform, ModalController} from 'ionic-angular';
import {Quiz} from '../../quiz/controller';
import {IQuizSet, IGameEntry} from '../../quiz/interfaces';
import {Details} from './details';

@Page({
  templateUrl: 'build/pages/quiz/summary.html'
})
export class Summary {
  private nav:NavController;
  private quizSet:IQuizSet;

  constructor(nav:NavController, navParams:NavParams, public modalCtrl:ModalController) {
    this.nav = nav;
    this.quizSet = navParams.get("quizSet");
  }

  clickViewDetails(entry:IGameEntry) {
    let modal = this.modalCtrl.create(Details, {"gameId": this.quizSet.GameId, "item": entry});
    modal.present();
  }
}
