import {Storage} from 'ionic-framework/ionic'
import {GameStatsEntry} from "./GameStatsEntry";
import {IGame} from "./interfaces";
import {Quiz} from "./controller";

/**
 * GameStats Class handle all Stats related operations.
 * As well the persistent storage of the stats data.
 * @author Simon Koennecke <simon@farbtrommel.de>
 */
export class GameStats {
    private wins: number = 0;
    private losses: number = 0;
    private game:{[gameId:string]: GameStatsEntry} = {};
    private storage: Storage;

    constructor(storage: Storage, gameStats?: GameStats){
        this.storage = storage;
        if (gameStats) {
            this.wins = gameStats.wins;
            this.losses = gameStats.losses;
        }
        var games :IGame[] = Quiz.getGames();
        for (var i:number=0; i < games.length; i++) {
            this.game[games[i].id] = new GameStatsEntry(storage, games[i]);
        }
    }

    /**
     * Save the current stats.
     */
    save(saveAll?:boolean):void {
        this.storage.set('stats', JSON.stringify({
            'wins': this.wins,
            'losses': this.losses
        }));
        if (saveAll) {
            var ids = Object.keys(this.game);
            for (var id:string in ids) {
                this.getGameById(id).save();
            }
        }
    }

    increaseCounter(gameId:string, entryId:string, won:boolean) {
        if (won) {
            this.wins++;
        } else {
            this.losses++;
        }
        this.game[gameId].increaseCounter(entryId, won);
    }

    getStats(gameId:string, entryId:string): any {
        return this.game[gameId].getEntry(entryId);
    }

    getGameById(id: string): GameStatsEntry {
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