import {Storage, SqlStorage} from 'ionic-framework/ionic'
import {Injectable, Inject} from 'angular2/core'
import {Http} from 'angular2/http'
import {Quiz} from './controller';

class GameStats {
    wins: number = 0;
    losses: number = 0;
    game:{[gameId:string]: GameStatsEntry} = {};


    constructor(gameStats?: GameStats){
        if (gameStats) {
            this.wins = gameStats.wins;
            this.losses = gameStats.losses;

            var keys = Object.keys(gameStats.game);
            for (var key:String in keys) {
                this.game[key] = new GameStatsEntry(gameStats.game[key]);
            }
        }
    }

    increaseCounter(gameId:string, entryId:string, won:boolean) {
        if (!this.game[gameId]) {
            this.game[gameId] = new GameStatsEntry();
        }
        if (won) {
            this.wins++;
        } else {
            this.losses++;
        }
        this.game[gameId].increaseCounter(entryId, won);
    }

    getStats(gameId:string, entryId:string): any {
        if (!this.game[gameId]) {
            this.game[gameId] = new GameStatsEntry();
        }
    }

    getGameById(id: string): GameStatsEntry {
        if (!this.game[id]) {
            this.game[id] = new GameStatsEntry();
        }
        return this.game[id];
    }

    /**
     * Flat list
     */
    convert():[{[gameEntryId:string]: {won:number, lost: number, gameId: string, entryId: string}}] {
        var flat:[{[gameEntryId:string]: {won:number, lost: number, gameId: string, entryId: string}}] = [];
        var ids = Object.keys(this.game);
        for (var id:string in ids) {
            var data:GameStatsEntry = this.getGameById(id);
            var keys = data.getKeys();
            for (var key:String in ids) {
                var k = id + "-" + key;
                var v = data.getEntry(key);
                v.gameId = id;
                v.entryId = key;
                flat.push({t: v});
            }
        }
    }


}

export class GameStatsEntry {
    wins: number = 0;
    losses: number = 0;
    stats:{[entryId:string]: {wins:number, losses:number}} = {};

    constructor(gamesStatsEntry?:GameStatsEntry) {
        if (gamesStatsEntry) {
            this.wins = gamesStatsEntry.wins;
            this.losses = gamesStatsEntry.losses;
            this.stats = gamesStatsEntry.stats;
        }
    }

    increaseCounter(entryId:string, won:boolean) {
        if (typeof this.stats[entryId] == "undefined") {
            this.stats[entryId] = {wins: 0, losses: 0};
        }
        if (won) {
            this.wins++;
            this.stats[entryId].wins++;
        } else {
            this.losses++;
            this.stats[entryId].losses++;
        }
    }

    getKeys(): string[] {
        return Object.keys(this.stats);
    }

    getEntry(entryId:string): any{
        if (!this.stats[entryId]) {
            this.stats[entryId] = {wins: 0, losses: 0};
        }
        return this.stats[entryId];
    }
}

@Injectable()
export class StorageService {
    private storage:Storage;

    private stats:GameStats;
    private numberOfRounds: number;
    private expertMode: boolean;

    constructor(@Inject(Http) http:Http) {
        console.log("===========> STORAGE CLASS INIT <===========");
        this.storage = new Storage(SqlStorage, {});
        this.storage.get('stats').then(data => this.stats = new GameStats(JSON.parse(data)) || new GameStats());
        this.storage.get('expertMode').then(data => this.expertMode = data || false);
        this.storage.get('numberOfRounds').then(data => this.numberOfRounds = parseInt(<string>data) || 10);
    }
    setNumberOfRounds(value:number) {
        this.numberOfRounds = parseInt(<string>value);
        var max:number = 0;
        var games:Quiz.IGame[] = Quiz.getGames();
        for (var i=0; i < games.length; i++) {
            if (games[i].GamesSet.length > max) {
                max = games[i].GamesSet.length;
            }
        }
        if (this.numberOfRounds  > max) {
            this.numberOfRounds  = max;
        }

        this.storage.set('numberOfRounds', this.numberOfRounds);
    }
    getNumberOfRounds(): number {
        return this.numberOfRounds;
    }
    setExpertMode(value:boolean) {
        this.expertMode = value;
        this.storage.set('expertMode', value);
    }
    getExpertMode(): boolean {
        return this.expertMode;
    }

    getGameStats(): GameStats{
        return this.stats;
    }

    setGameStats(){
        this.storage.set('stats', JSON.stringify(this.stats));
    }

    increaseCounter(gameId: string, entryId: string, won:boolean) {
        this.stats.increaseCounter(gameId, entryId, won);
        this.setGameStats();
    }
}