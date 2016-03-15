import {Component, Directive, View, ElementRef, Input, ViewEncapsulation} from 'angular2/core';
import {Page, NavController, NavParams, Platform, Modal, Icon, ViewController, List, Item} from 'ionic-framework/ionic';
import {StorageService} from '../../quiz/storage-service'
import {GameStats, GameStatsEntry} from '../../quiz/GameStats'
import {Quiz, IGame, IGameEntry} from '../../quiz/controller';
import {Details} from '../quiz/details'
import {MyApp} from "../../app";


@Component({
    selector:'stars',
    directives: [Icon, List, Item],
    templateUrl: 'build/pages/stats/stars.html',
    encapsulation: ViewEncapsulation.None
})
export class Stars{
    @Input() value:number;
    listOfStars:string[] = ["star-outline", "star-outline", "star-outline", "star-outline", "star-outline"];

    ngOnChanges() {
        this.refreshStars();
    }

    ngOnChanges(changes: {[propertyName: string]}){
        if (changes['value']) {
            this.refreshStars();
        }
    }

    refreshStars() {
        var until:number = Math.floor(this.value/2);
        var i:number=0;
        for (; i < until; i++) {
            this.listOfStars[i] = "star";
        }

        if (i < 5 && this.value % 2 == 1) {
            this.listOfStars[i] = "star-half";
            i++;
        }

        while (i < 5) {
            this.listOfStars[i] = "star-outline";
            i++;
        }
    }

}

@Component({
    selector:'stats-entry',
    input: [
        'item: item',
        'game: game',
        'stats: stats',
        'stars: stars'
    ],
    directives: [Icon, List, Item, Stars],
    templateUrl: 'build/pages/stats/stats-entry.html'
})
export class StatsEntry{
    element: ElementRef;
    @Input() game:IGame;
    @Input() item:IGameEntry;
    @Input() stats:any = {"wins": 0, "losses": 0};
    @Input() stars:number;
    viewCtrl: ViewController;
    nav: NavController;

    constructor(element: ElementRef, viewCtrl: ViewController, nav: NavController){
        this.element = element;
        this.viewCtrl = viewCtrl;
        this.nav = nav;
    }

    showDetailsOnClick() {
        let modal = Modal.create(Details, {"gameId": this.game.id,"item": this.item});
        this.nav.present(modal);
    }
}

@Page({
    templateUrl: 'build/pages/stats/stats.html',
    directives: [StatsEntry, Stars]
})
export class StatsPage {
    storageService: StorageService;
    nav: NavController;
    title: string = MyApp.title;
    Games: IGame[];
    gameSet: IGameEntry[];
    topSet: IGameEntry[];
    flopSet: IGameEntry[];
    //unratedSet: IGameEntry[];
    gameSetById: {[id:string]: IGameEntry} = {};
    gameNo:number = 0;
    gameId:string;
    showDetails:boolean = true;
    filterOption:string = "list";
    searchQuery:string = "";
    isAndroid:boolean;


    constructor(storageService: StorageService, nav: NavController, navParams: NavParams, platform: Platform) {
        this.title = MyApp.title;
        this.isAndroid = platform.is('android');
        this.gameNo = navParams.get("gameNo") || 0;
        this.showDetails= navParams.get("showDetails") || false;
        this.nav = nav;
        this.storageService = storageService;
        this.Games = Quiz.getGames();
        this.gameId = this.Games[this.gameNo].id;
    }

    onPageWillEnter() {
        if (this.showDetails){
            this.title = this.Games[this.gameNo].Name;
            this.initializeItems();
            for (var i:number in this.gameSet) {
                this.gameSetById[this.gameSet[i].id] = this.gameSet[i];
            }
            this.topSet = this.storageService.getGameStats().sort(this.gameId, "wins");
            this.flopSet = this.storageService.getGameStats().sort(this.gameId, "losses");
            //this.unratedSet = storageService.getGameStats().sort(this.gameId, "unrated");
        }
    }

    initializeItems() {
        this.gameSet = this.Games[this.gameNo].GamesSet;
    }

    onClickCategory(game:IGame, no:number) {
        this.nav.push(StatsPage, {"gameNo": no, "showDetails": true}, {"animate": true}, null);
    }

    getItems(searchbar):void {
        // Reset items back to all of the items
        this.initializeItems();

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.gameSet = this.gameSet.filter((v) => {
            return (v.Name.toLowerCase().indexOf(q.toLowerCase()) > -1);
        })
    }

    showDetailsOnClick(game:IGame, entry:IGameEntry) {
        let modal = Modal.create(Details, {"gameId": game,"item": entry});
        this.nav.present(modal);
    }
}
