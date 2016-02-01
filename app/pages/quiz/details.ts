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

    openLink(url:string) {
        window.open(url, "_system");
    }

    playSound() {

    }
}