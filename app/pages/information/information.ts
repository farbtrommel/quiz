import {Page, NavController, NavParams, Modal, ViewController, Platform} from 'ionic-framework/ionic';
import {CredentialsPage} from './credentials';
import {PrivacyPage} from './privacy';
import {ImprintPage} from './imprint';

@Page({
    templateUrl: 'build/pages/information/information.html'
})
export class InformationPage {
    private nav: NavController;


    constructor(nav:NavController, navParams: NavParams) {
        this.nav = nav;

    }

    onClickLoadPage(label: string) {
        if (label == "privacy") {
            this.nav.push(PrivacyPage, {}, {"animate": true}, null);
        } else if (label == "imprint") {
            this.nav.push(ImprintPage, {}, {"animate": true}, null);
        } else if (label == "credentials") {
            this.nav.push(CredentialsPage, {}, {"animate": true}, null);
        }
    }
}
