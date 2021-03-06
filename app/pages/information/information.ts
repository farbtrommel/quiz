import {Page, NavController, NavParams, Modal, ViewController, Platform} from 'ionic-angular';
import {CredentialsPage} from './credentials';
import {PrivacyPage} from './privacy';
import {ImprintPage} from './imprint';
import {MyApp} from "../../app";

@Page({
  templateUrl: 'build/pages/information/information.html'
})
export class InformationPage {
  private title:string = MyApp.title;
  private nav:NavController;

  constructor(nav:NavController, private navParams:NavParams) {
    this.nav = nav;
  }

  onClickLoadPage(label:string) {
    if (label == "privacy") {
      this.nav.push(PrivacyPage, {}, {"animate": true});
    } else if (label == "imprint") {
      this.nav.push(ImprintPage, {}, {"animate": true});
    } else if (label == "credentials") {
      this.nav.push(CredentialsPage, {}, {"animate": true});
    }
  }
}
