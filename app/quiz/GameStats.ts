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
     * Sorted list by
     * @param gameId Game Id
     * @param sortBy "wins", "losses", "unrated"
     * @returns {Array}
     */
    sort(gameId: string, sortBy:string) {
        var set: GameStatsEntry = this.getGameById(gameId);
        var sortable = [];
        for (var key in set.getStats()) {
            sortable.push([key, set.getEntry(key)])
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