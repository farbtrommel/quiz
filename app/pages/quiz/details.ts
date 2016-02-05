import {Page, NavController, NavParams, ViewController, Platform} from 'ionic-framework/ionic';
import {Quiz, IGameEntry} from '../../quiz/controller';
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
    private playSound: boolean = false;

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
        if (url && url.startsWith("http")) {
            window.open(url, "_system");
        } else if (otherwise && otherwise.startsWith("http")) {
            window.open(otherwise, "_system");
        }
        return true;
    }

    playSound() {

    }
}