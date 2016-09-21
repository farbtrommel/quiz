import {Page, NavController, NavParams, Modal, ViewController, Platform} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/information/privacy.html'
})
export class PrivacyPage {
  private nav:NavController;

  constructor(nav:NavController, navParams:NavParams) {
    this.nav = nav;
  }
}
