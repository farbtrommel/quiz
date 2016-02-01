import {Component, Directive, View, ElementRef, Input} from 'angular2/core';
import {Page, NavController, NavParams, Platform, Modal, Icon, ViewController, List, Item} from 'ionic-framework/ionic';
import {StorageService, GameStatsEntry} from '../../quiz/storage-service'
import {Quiz} from '../../quiz/controller';
import {Details} from '../quiz/details'


@Component({
    selector:'stats-entry',
    input: [
        'item: item',
        'game: game',
        'stats: stats'
    ],
    directives: [Icon, List, Item],
    templateUrl: 'build/pages/stats/stats-entry.html'
})
export class StatsEntry{
    element: ElementRef;
    @Input() game:Quiz.IGame;
    @Input() item:Quiz.IGameEntry;
    @Input() stats:any = {"wins": 0, "losses": 0};
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
    directives: [StatsEntry]
})
export class StatsPage {
    storageService: StorageService;
    nav: NavController;
    title: string = "Stadtnatur entdecken";
    Games: Quiz.IGame[];
    gameSet: Quiz.IGameEntry[];
    gameSetById: {[id:string]: Quiz.IGameEntry} = {};
    ratedSet: GameStatsEntry;
    topSet: Quiz.IGameEntry[];
    flopSet: Quiz.IGameEntry[];
    unratedSet: Quiz.IGameEntry[];
    gameNo:number = 0;
    gameId:string;
    showDetails:boolean = true;
    filterOption:string = "list";
    searchQuery:string = "";
    isAndroid:boolean;

    constructor(storageService: StorageService, nav: NavController, navParams: NavParams, platform: Platform) {
        this.title = "Stadtnatur entdecken";
        this.isAndroid = platform.is('android');
        this.gameNo = navParams.get("gameNo") || 0;
        this.showDetails= navParams.get("showDetails") || false;
        this.nav = nav;
        this.storageService = storageService;
        this.Games = Quiz.getGames();
        this.gameId = this.Games[this.gameNo].id;
        if (this.showDetails){
            this.title = this.Games[this.gameNo].Name;
            this.ratedSet = storageService.getGameStats().getGameById(this.gameId);
            this.initializeItems();
            for (var i in this.gameSet) {
                this.gameSetById[this.gameSet[i].id] = this.gameSet[i];
            }
            this.topSet = this.sort("wins");
            this.flopSet = this.sort("losses");
            this.unratedSet = this.sort("unrated");
        }

    }

    sort(sortBy:string) {
        var sortable = [];
        for (var key in this.ratedSet.stats) {
            sortable.push([key, this.ratedSet.getEntry(key)])
        }
        var result = [];
        if (sortBy == "unrated") {
            for (var i=0; i < sortable.length; i++){
                if (sortable[i][1].wins == 0 && sortable[i][1].losses == 0) {
                    result.push(sortable[i])
                }
            }
        } else {
            sortable.sort((a, b) => {
                return a[1][sortBy] - b[1][sortBy]
            });

            for (var i=0; i < sortable.length; i++){
                if (sortable[i][1][sortBy] > 0) {
                    result.push(sortable[i])
                }
            }
        }

        return result;
    }

    initializeItems() {
        this.gameSet = this.Games[this.gameNo].GamesSet;
    }

    onClickCategory(game:Quiz.IGame, no:number) {
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
            if (v.Name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })
    }

    showDetailsOnClick(game:Quiz.IGame, entry:Quiz.IGameEntry) {
        let modal = Modal.create(Details, {"gameId": game,"item": entry});
        this.nav.present(modal);
    }
}
