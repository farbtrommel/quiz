import QuizData = require('./data');
import {IGame, IGameEntry, IQuizSet} from './interfaces';
import {QuizSet} from "./QuizSet";
import {Http} from '@angular/http'
import {StorageService} from "./storage-service";


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

    static createQuizSetByGameId(gameId: string, storageService: StorageService, http: Http): IQuizSet {
        var gameSet:IGame = Quiz.getGameSetById(gameId);
        return new QuizSet(gameSet, storageService, http);
    }

    static createQuizSet(game: IGame, storageService: StorageService, http: Http): IQuizSet {
        return new QuizSet(game, storageService, http);
    }
}

