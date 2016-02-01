import QuizData = require('./data');
import {StorageService} from './storage-service'
import {Optional} from "angular2/core";

export namespace Quiz {

    export interface IGame {
        id: string;
        Name: string;
        Teaser: ITeaserObject;
        GamesSet: IGameEntry[];
    }

    /**
     * A possible question of a game.
     */
    export interface IGameEntry {
        id: string;
        Name: string;
        Sciname: string;
        Abstract: string;
        Link: string;
        Categories: string;
        Audio: ISourceObject;
        Image: ISourceObject;
    }

    export interface IQuizSet {
        GameId: string;
        Set: IGameEntry[][];
        NumberOfGames: number;
        wins:number;
        losses:number;
        CorrectAnswer:Number[];
        //Current Game Set
        CrtQuestion: number;
        CrtCorrectAnswerId: string;
        CrtCorrectAnswer: number;
        StartRound:Date;
        EndRound:Date;
        Answers: number[];
        AnswersId: string[];
        answerQuestion(no:number, storageService: StorageService): void
        nextQuestion():boolean;

        RoundFinished: boolean;
        GameFinished: boolean;
    }

    export interface ITeaserObject {
        Text: String;
        Image: ISourceObject;
    }

    export interface ISourceObject {
        Src: string;
        Link: string;
        Licence: ILink;
        Author: ILink;
    }

    export interface ILink {
        Name: string;
        Link: string;
    }


    export function getGames(): IGame[] {
        //noinspection TypeScriptValidateTypes
        return QuizData();
    }

    export function getGameSetById(id: string): IGame {
        for(var game:IGame in getGames()) {
            if (game.id == id) {
                return game;
            }
        }
    }

    export function createQuizSetByGameId(gameId: string, @Optional() numberOfGames: number): IQuizSet {
        var gameSet:IGame = getGameSetById(gameId);
        return new QuizSet(gameSet, numberOfGames);
    }

    export function createQuizSet(game: IGame, @Optional() numberOfGames: number): IQuizSet {
        return new QuizSet(game, numberOfGames);
    }


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
        excludeGameEntries:string[] = [];

        constructor(game: IGame, numberOfGames:number) {
            this.GameId = game.id;
            this.NumberOfGames = numberOfGames || this.NumberOfGames;
            //The number of games need be lower then the game set itself.
            if (this.NumberOfGames > game.GamesSet.length) {
                //if number of games higher then the game set itself.
                //provide every game entry as quiz round.
                this.NumberOfGames = game.GamesSet.length;
            }
            this.createSet(game.GamesSet);
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

        /**
         * Create the Quiz question with the respect to 'numberOfGame' and 'excludeGameEntries'.
         * @param gameSet
         */
        private createSet(gameSet:IGameEntry[]) {
            for(var i=0; i < this.NumberOfGames; i++) {
                var quizRound:IGameEntry[] = [];
                for (var s=0; s < 4; s++) {
                    quizRound.push(this.chooseRandomElement(gameSet, this.excludeGameEntries));
                }
                var correct = QuizSet.chooseCorrectAnswer();
                this.CorrectAnswer.push(correct);
                this.excludeGameEntries.push(quizRound[correct].id);
                this.Set.push(quizRound);
            }
        }

        /**
         * Pick randomly a element from the game set with constraint no id from `excludeGameEntries`.
         * @param gameSet
         * @param excludeId
         * @returns {IGameEntry}
         */
        private chooseRandomElement(gameSet:IGameEntry[], excludeId:string[]): IGameEntry {
            var random:number = Math.floor(Math.random() * gameSet.length);
            var element:IGameEntry = gameSet[random];
            //This could be improved O(|excludeGameEntries|) to O(log(|excludeGameEntries|))
            for(var id:string in excludeId) {
                if (id === element.id) {
                    return this.chooseRandomElement(gameSet, excludeId);
                }
            }
            excludeId.push(element.id);
            return element;
        }

        private static chooseCorrectAnswer():number {
            return Math.floor(Math.random() * 4);
        }
    }
}
