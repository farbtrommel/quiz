import {Page, NavController, NavParams, Modal, ViewController, Platform} from 'ionic-framework/ionic';


@Page({
    templateUrl: 'build/pages/information/imprint.html'
})
export class ImprintPage {
    private nav: NavController;

    constructor(nav:NavController, navParams: NavParams) {
        this.nav = nav;
    }
}
