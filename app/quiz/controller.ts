import {IGame, IGameEntry, IQuizSet} from './interfaces';
import {QuizSet} from "./QuizSet";
import {Http} from '@angular/http'
import {StorageService} from "./storage-service";
declare var require: any;
var data = require("./data.json");

export class Quiz {
  static getGames():IGame[] {
    return data;
  }

  static getGameSetById(id:number):IGame {
    var games = Quiz.getGames();
    for (var i = 0; i < games.length; i++) {
      if (games[i].id == id) {
        return games[i];
      }
    }
  }

  static createQuizSetByGameId(gameId:number, storageService:StorageService, http:Http):IQuizSet {
    var gameSet:IGame = Quiz.getGameSetById(gameId);
    return new QuizSet(gameSet, storageService, http);
  }

  static createQuizSet(game:IGame, storageService:StorageService, http:Http):IQuizSet {
    return new QuizSet(game, storageService, http);
  }
}

