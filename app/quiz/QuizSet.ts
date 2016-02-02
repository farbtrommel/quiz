import {StorageService} from './storage-service'
import {IGame, IQuizSet, IGameEntry} from "./interfaces";
import {GenerateQuizSet} from "./GenerateQuizSet";

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
    Answers: number[] = [];

    /**
     * Given answer in a round by GameEntry.id.
     * @type {Array}
     */
    AnswersId: string[] = [];

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
     * The id of GameEntry item which is correct.
     * @type {string}
     */
    CrtCorrectAnswerId:string = "";
    /**
     * The pointer of GameEntry item which is correct.
     * @type {number}
     */
    CrtCorrectAnswer:number = 0;
    /**
     * History of given answers.
     * @type {Array}
     */
    CorrectAnswer:Number[] = [];
    /**
     * Number of asks questions.
     * @type {number}
     */
    NumberOfGames:number;

    /**
     * Init. game quiz set.
     * @param game
     * @param numberOfGames
     */
    constructor(game: IGame, numberOfGames:number) {
        this.GameId = game.id;

        this.NumberOfGames = numberOfGames || this.NumberOfGames;
        //The number of games need be lower then the game set itself.
        if (this.NumberOfGames > game.GamesSet.length) {
            //if number of games higher then the game set itself.
            //provide every game entry as quiz round.
            this.NumberOfGames = game.GamesSet.length;
        }
        new GenerateQuizSet(this, game.GamesSet, function(){
            this.nextQuestion();
        });

    }

    public answerQuestion(no:number, storageService: StorageService): void {
        this.EndRound = new Date();
        this.RoundFinished = true;
        this.Answers.push(no);
        this.AnswersId.push(this.Set[this.CrtQuestion][no].id);
        var won = no == this.CrtCorrectAnswer;
        if (won) {
            this.wins++;
        } else {
            this.losses++;
        }
        storageService.increaseCounter(this.GameId,
            this.Set[this.CrtQuestion][no].id, won);
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
        this.CrtCorrectAnswerId = this.Set[this.CrtQuestion][this.CrtCorrectAnswer].id;
        this.RoundFinished = false;
        return true;
    }

}