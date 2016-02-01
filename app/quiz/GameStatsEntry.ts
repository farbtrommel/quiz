import {Storage} from 'ionic-framework/ionic'
import {Quiz} from './controller';

/**
 * Stats Information about one game.
 */
export class GameStatsEntry {
    private wins: number = 0;
    private losses: number = 0;
    private stats:{[entryId:string]: {wins:number, losses:number}} = {};
    private storage:Storage;
    private game:Quiz.IGame;

    /**
     * Get data from persistent storage and init. all need objects.
     * @param storage
     * @param game
     */
    constructor(storage: Storage, game:Quiz.IGame) {
        this.storage = storage;
        this.game = game;

        this.storage.get("games-stats-entry-" + this.game.id).then(gamesStatsEntry => {
            if (gamesStatsEntry) {
                gamesStatsEntry = JSON.parse(gamesStatsEntry);
                this.wins = gamesStatsEntry.wins || 0;
                this.losses = gamesStatsEntry.losses || 0;
                this.stats = gamesStatsEntry.stats || {};
            }

            for(var i:number=0; i < this.game.GamesSet.length; i++) {
                if (!this.stats[this.game.GamesSet[i].id]) {
                    this.stats[this.game.GamesSet[i].id] = {wins: 0, losses: 0};
                }
            }
        });
    }

    /**
     * Save data to persistent storage.
     */
    save():void {
        this.storage.set("games-stats-entry-" + this.game.id, JSON.stringify({
            wins: this.wins,
            losses: this.losses,
            stats: this.stats
        }));
    }

    /**
     * Increase the counter for the Quiz.GameEntry by given entryId.
     * This function will save the changes to persistent storage.
     * @param entryId the id of a Quiz.GameEntry object.
     * @param won true game won and false game lost.
     */
    increaseCounter(entryId:string, won:boolean) {
        if (won) {
            this.wins++;
            this.stats[entryId].wins++;
        } else {
            this.losses++;
            this.stats[entryId].losses++;
        }
        this.save();
    }

    /**
     * Get all keys of stored Quiz.GameEntry.
     * @returns {string[]}
     */
    getKeys(): string[] {
        return Object.keys(this.stats);
    }

    /**
     * Return all stats.
     * @returns {{}}
     */
    getStats(): {[entryId:string]: {wins:number, losses:number}} {
        return this.stats;
    }

    /**
     * Get entry by id.
     * @param entryId
     * @returns {{wins: number, losses: number}}
     */
    getEntry(entryId:string): any{
        return this.stats[entryId];
    }
}