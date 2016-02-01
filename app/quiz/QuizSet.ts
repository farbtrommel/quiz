import {StorageService} from './storage-service'
import {IGame, IQuizSet, IGameEntry} from "./interfaces";
import {GenerateQuizSet} from "./GenerateQuizSet";

/**
 * The Quiz Set provide a number of Games.
 * The amount of the rounds can be provide from the user.
 * No correct answer will appear twice.
 */
export class QuizSet implements  IQuizSet {
    wins:number=0;
    losses:number=0;
    Answers: number[] = [];
    AnswersId: string[] = [];
    StartRound:Date = new Date();
    EndRound:Date = null;

    RoundFinished:boolean;
    GameFinished:boolean;
    GameId:string;
    CrtQuestion:number = -1;
    CrtCorrectAnswerId:string = "";
    CrtCorrectAnswer:number = 0;
    Set:IGameEntry[][] = [];
    CorrectAnswer:Number[] = [];
    NumberOfGames:number = 3;

    constructor(game: IGame, numberOfGames:number) {
        this.GameId = game.id;
        this.NumberOfGames = numberOfGames || this.NumberOfGames;
        //The number of games need be lower then the game set itself.
        if (this.NumberOfGames > game.GamesSet.length) {
            //if number of games higher then the game set itself.
            //provide every game entry as quiz round.
            this.NumberOfGames = game.GamesSet.length;
        }
        new GenerateQuizSet(this);
        this.nextQuestion();
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