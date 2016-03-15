import {Page, Alert, NavController, NavParams} from 'ionic-framework/ionic';
import {StorageService} from '../../quiz/storage-service';
import {MyApp} from "../../app";
import {PrivacyPage} from '../information/privacy';

@Page({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage {
    private title: string = MyApp.title;
    private nav:NavController;
    private storageService: StorageService;
    private expertMode: boolean;
    private showCorrectAnswer: boolean;
    private sendStats: boolean;

    constructor(storageService: StorageService, nav: NavController, navParams: NavParams) {
        this.nav = nav;
        this.storageService = storageService;
        this.expertMode = this.storageService.getExpertMode();
        this.showCorrectAnswer = this.storageService.getShowCorrectAnswer();
        this.sendStats = this.storageService.getSendStats();
    }

    clickShowCorrectAnswer() {
        console.log("toggle show correct answer");
        this.showCorrectAnswer = !this.showCorrectAnswer;
        this.storageService.setShowCorrectAnswer(this.showCorrectAnswer)
    }

    clickSendStats() {
        console.log("toggle send stats mode");
        this.sendStats = !this.sendStats;
        this.storageService.setSendStats(this.sendStats)
    }

    clickExpertMode() {
        console.log("toggle expert mode");
        this.expertMode = !this.expertMode;
        this.storageService.setExpertMode(this.expertMode)
    }

    showDataPrivacy() {
        //dirty hack:
        //when privacy button get hit, avoid toggle send stats
        this.clickSendStats();

        this.nav.push(PrivacyPage, {}, {"animate": true}, null);
    }

    openPrompt() {
        let prompt = Alert.create({
            body: "Bitte geben Sie eine Anzahl der Runden ein",
            inputs: [
                {
                    name: 'numberRounds',
                    placeholder: 'Rundenanzahl',
                    type: 'number',
                    value: this.storageService.getNumberOfRounds()
                },
            ],
            buttons: [
                {
                    text: 'Abbrechen',
                    handler: data => {
                        //console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Speichern',
                    handler: data => {
                        this.storageService.setNumberOfRounds(data.numberRounds);
                    }
                }
            ]
        });
        this.nav.present(prompt);
    }
}
