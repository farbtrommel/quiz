import {Storage, SqlStorage, LocalStorage} from 'ionic-framework/ionic'
import {Injectable, Inject} from 'angular2/core'
import {Http} from 'angular2/http'
import {Quiz} from './controller';
import {GameStats} from './GameStats';

@Injectable()
export class StorageService {
    private storage:Storage;

    private stats:GameStats;
    private numberOfRounds: number;
    private expertMode: boolean;

    constructor() {
        //console.log("===========> STORAGE CLASS INIT <===========");
        this.storage = new Storage(LocalStorage, {});
        this.storage.get('stats').then(data => {
            this.stats = new GameStats(this.storage, JSON.parse(data)) || new GameStats(this.storage)
        });
        this.storage.get('expertMode').then(data => {
            this.expertMode = data || false
        });
        this.storage.get('numberOfRounds').then(data => {
            this.numberOfRounds = parseInt(<string>data) || 10
        });
    }

    /**
     * Set number of rounds, before save check if round number less then min game set length.
     * @param value
     */
    setNumberOfRounds(value:number) {
        this.numberOfRounds = parseInt(<string>value);
        var games:Quiz.IGame[] = Quiz.getGames();
        var min:number = games[0].GamesSet.length;
        for (var i=1; i < games.length; i++) {
            if (games[i].GamesSet.length > 0 && games[i].GamesSet.length < min) {
                min = games[i].GamesSet.length;
            }
        }
        if (this.numberOfRounds  > min) {
            this.numberOfRounds  = min;
        }

        this.storage.set('numberOfRounds', this.numberOfRounds);
    }

    /**
     * Return the number of Games.
     * @returns {number}
     */
    getNumberOfRounds(): number {
        return this.numberOfRounds;
    }

    /**
     * Set expert mode
     * @param value true export mode active and false for deactive.
     */
    setExpertMode(value:boolean) {
        this.expertMode = value;
        this.storage.set('expertMode', value);
    }

    /**
     * Get current state of expert mode.
     * @returns {boolean}
     */
    getExpertMode(): boolean {
        return this.expertMode;
    }

    /**
     * Return the initialized GameStats object.
     * @returns {GameStats}
     */
    getGameStats(): GameStats{
        return this.stats;
    }

    /**
     * Store the current GameStats.
     */
    setGameStats(){
        this.stats.save(true);
    }

    /**
     * Wrapper to increase a counter of a game entry.
     * @param gameId
     * @param entryId
     * @param won
     */
    increaseCounter(gameId: string, entryId: string, won:boolean) {
        this.stats.increaseCounter(gameId, entryId, won);
        this.stats.save(false);
    }
}