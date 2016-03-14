import {Inject} from 'angular2/core'
import {Http} from 'angular2/http'
import {StorageService} from './storage-service'
import {IGame, IQuizSet, IGameEntry} from "./interfaces";
import {QuizSetGenerate} from "./QuizSetGenerate";
import {ApiCalls} from "./ApiCalls";

/**
 * The Quiz Set provide a number of Games.
 * The amount of the rounds can be provide from the user.
 * No correct answer will appear twice.
 */
export class QuizSet implements  IQuizSet {
    /**
     * Game Id from the game set where the questions are generated from.
     */
    GameId:string;

    /**
     * For transmitting stats to server
     */
    http: Http;
    /**
     * Reference to Storage Service.
     */
    storageService: StorageService;

    /**
     * Tracking the wins over a game.
     * @type {number}
     */
    wins:number=0;

    /**
     * Tracking the losses over a game.
     * @type {number}
     */
    losses:number=0;

    /**
     * Given answer in a round by array id.
     * @type {Array}
     */
    Answers: IGameEntry[] = [];

    /**
     * Time at begin a question.
     * @type {Date}
     */
    StartRound:Date = new Date();

    /**
     * Time at end a question.
     * @type {null}
     */
    EndRound:Date = null;

    /**
     * Is the current round finished.
     * This is only for animation reasons here.
     */
    RoundFinished:boolean = false;

    /**
     * When the whole game is over, this turns to true.
     */
    GameFinished:boolean = false;

    /**
     * The set is a array of array of four GameEntries.
     * @type {Array}
     */
    Set:IGameEntry[][] = [];

    /**
     * Pointer to current question of the set.
     * @type {number}
     */
    CrtQuestion:number = -1;

    /**
     * The pointer of GameEntry item which is correct.
     * @type {number}
     */
    CrtCorrectAnswer:IGameEntry;
    /**
     * List of the correct answer
     * @type {Array}
     */
    CorrectAnswer:IGameEntry[] = [];
    /**
     * Number of asks questions.
     * @type {number}
     */
    NumberOfGames:number;


    /**
     * Init. game quiz set.
     * @param game Game Object for what the quiz will generate.
     * @param storageService Reference to storage. //TODO: @Inject()
     * @param http Reference to http. //TODO: @Inject()
     */
    constructor(game: IGame, storageService: StorageService, http: Http) {
        this.GameId = game.id;
        this.http = http;
        this.storageService = storageService;

        this.NumberOfGames = this.storageService.getNumberOfRounds() || this.NumberOfGames;
        //The number of games need be lower then the game set itself.
        if (this.NumberOfGames > game.GamesSet.length) {
            //if number of games higher then the game set itself.
            //provide every game entry as quiz round.
            this.NumberOfGames = game.GamesSet.length;
        }
        new QuizSetGenerate(this, game.GamesSet, storageService, () => {
            this.nextQuestion();
        });

    }

    public answerQuestion(item:IGameEntry, no:number): void {
        this.EndRound = new Date();
        this.RoundFinished = true;
        this.Answers.push(item);
        var won = (item.id === this.CrtCorrectAnswer.id);
        if (won) {
            this.wins++;
        } else {
            this.losses++;
        }
        this.storageService.increaseCounter(this.GameId, item.id, won);

        ApiCalls.postQuizRound(this.http, this.storageService, this);
    }

    public nextQuestion():boolean {
        //Track the time for a round
        this.StartRound = new Date();

        this.CrtQuestion++;
        if (this.CrtQuestion == this.Set.length) {
            this.GameFinished = true;
            return false;
        }
        this.CrtCorrectAnswer = this.CorrectAnswer[this.CrtQuestion];
        this.RoundFinished = false;
        return true;
    }

}