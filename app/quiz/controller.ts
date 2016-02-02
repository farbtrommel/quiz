import QuizData = require('./data');
import {IGame, IGameEntry, IQuizSet} from './interfaces';
import {QuizSet} from "./QuizSet";
import {Http} from 'angular2/http'


export class Quiz {
    static getGames(): IGame[] {
        //noinspection TypeScriptValidateTypes
        return QuizData();
    }
    static getGameSetById(id: string): IGame {
        for (var game:IGame in Quiz.getGames()) {
            if (game.id == id) {
                return game;
            }
        }
    }

    static createQuizSetByGameId(gameId: string, http: Http, numberOfGames?: number): IQuizSet {
        var gameSet:IGame = Quiz.getGameSetById(gameId);
        return new QuizSet(gameSet, numberOfGames, http);
    }

    static createQuizSet(game: IGame, http: Http, numberOfGames?: number): IQuizSet {
        return new QuizSet(game, numberOfGames, http);
    }
}

