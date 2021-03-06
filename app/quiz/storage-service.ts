import {Storage, SqlStorage, LocalStorage} from 'ionic-angular'
import {Injectable, Inject} from '@angular/core'
import {Http} from '@angular/http'
import {Quiz} from './controller';
import {GameStats} from './GameStats';
import {IGame} from "./interfaces";

/**
 * Storage Service handles all related things to persistent storage.
 */
@Injectable()
export class StorageService {
  private storage:Storage;

  private stats:GameStats;
  private numberOfRounds:number;
  private expertMode:boolean;
  private showCorrectAnswer:boolean;
  private sendStats:boolean;

  constructor() {
    //console.log("===========> STORAGE CLASS INIT <===========");
    this.storage = new Storage(LocalStorage, {});
    this.storage.get('stats').then(data => {
      this.stats = new GameStats(this.storage, JSON.parse(data)) || new GameStats(this.storage)
    });
    this.storage.get('expertMode').then(data => {
      this.expertMode = (data === "true");
    });
    this.storage.get('showCorrectAnswer').then(data => {
      if (typeof data === "undefined" || data === null) {
        this.showCorrectAnswer = true;
      } else {
        this.showCorrectAnswer = (data === "true");
      }
    });
    this.storage.get('sendStats').then(data => {
      if (typeof data === "undefined" || data === null) {
        this.sendStats = true;
      } else {
        this.sendStats = (data === "true" || data == true);
      }
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
    this.numberOfRounds = parseInt((new String(value)).toString());
    var games:IGame[] = Quiz.getGames();
    var min:number = games[0].GamesSet.length;
    for (var i = 1; i < games.length; i++) {
      if (games[i].GamesSet.length > 0 && games[i].GamesSet.length < min) {
        min = games[i].GamesSet.length;
      }
    }
    if (this.numberOfRounds > min) {
      this.numberOfRounds = min;
    }

    this.storage.set('numberOfRounds', this.numberOfRounds);
  }

  /**
   * Return the number of Games.
   * @returns {number}
   */
  getNumberOfRounds():number {
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
  getExpertMode():boolean {
    return this.expertMode;
  }

  /**
   * Return the initialized GameStats object.
   * @returns {GameStats}
   */
  getGameStats():GameStats {
    return this.stats;
  }

  /**
   * Store the current GameStats.
   */
  setGameStats() {
    this.stats.save(true);
  }

  /**
   * Wrapper to increase a counter of a game entry.
   * @param gameId
   * @param entryId
   * @param won
   */
  increaseCounter(gameId:number, entryId:number, won:boolean) {
    this.stats.increaseCounter(gameId, entryId, won);
    this.stats.save(false);
  }

  /**
   * Show the correct answer after a finish round
   * @returns {boolean}
   */
  getShowCorrectAnswer():boolean {
    return this.showCorrectAnswer
  }

  /**
   * Set true for showing the correct answer and false for not showing the correct answer
   * Default: true.
   * @param value
   */
  setShowCorrectAnswer(value:boolean):void {
    this.showCorrectAnswer = value;
    this.storage.set('showCorrectAnswer', value);
  }

  /**
   * Send stats to the REST Api, if true.
   * Default: true.
   * @returns {boolean}
   */
  getSendStats():boolean {
    return this.sendStats;
  }

  /**
   * Send stats if true otherwise not.
   * @param value
   */
  setSendStats(value:boolean):void {
    this.sendStats = value;
    this.storage.set('sendStats', value);
  }
}
