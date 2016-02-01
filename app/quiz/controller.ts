import QuizData = require('./data');
import {IGame, IGameEntry, IQuizSet} from './interfaces';
import {QuizSet} from "./QuizSet";

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

    static createQuizSetByGameId(gameId: string, numberOfGames?: number): IQuizSet {
        var gameSet:IGame = Quiz.getGameSetById(gameId);
        return new QuizSet(gameSet, numberOfGames);
    }

    static createQuizSet(game: IGame, numberOfGames?: number): IQuizSet {
        return new QuizSet(game, numberOfGames);
    }
}

