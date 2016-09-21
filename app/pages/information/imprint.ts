import {Page, NavController, NavParams, Modal, ViewController, Platform} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/information/imprint.html'
})
export class ImprintPage {
  private nav:NavController;

  constructor(nav:NavController, navParams:NavParams) {
    this.nav = nav;
  }
}
