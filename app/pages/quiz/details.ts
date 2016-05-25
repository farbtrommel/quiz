import {Page, NavController, NavParams, ViewController, Platform} from 'ionic-angular';
import {Quiz} from '../../quiz/controller';
import {IGameEntry} from '../../quiz/interfaces';
import {AudioControl} from '../../quiz/audio';

@Page({
    templateUrl: 'build/pages/quiz/details.html',
    directives: [AudioControl]
})
export class Details {
    private item:IGameEntry;
    private gameId: number;
    private currentPlatform: string;
    private viewCtrl: ViewController;

    private quotation: boolean = false;

    constructor(navController:NavController, navParams: NavParams, platform: Platform, viewCtrl: ViewController) {
        this.viewCtrl = viewCtrl;
        if (platform.is('android')) {
            this.currentPlatform = 'android';
        } else {
            this.currentPlatform = 'ios';
        }
        this.item = navParams.get("item");
        this.gameId = navParams.get("gameId");

    }

    dismiss() {
        //noinspection TypeScriptValidateTypes
        this.viewCtrl.dismiss();
    }

    toggleQuotation() {
        this.quotation = !this.quotation;
    }


    openLink(url:string, otherwise:string) {
        if (url && url.substr(0,4) == "http") {
            window.open(url, "_system");
        } else if (otherwise && url.substr(0,4) == "http") {
            window.open(otherwise, "_system");
        }
        return true;
    }
}