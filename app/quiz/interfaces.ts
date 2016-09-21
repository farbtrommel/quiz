import {StorageService} from './storage-service'

export interface IGame {
  id: number;
  Name: string;
  Teaser: ITeaserObject;
  GamesSet: IGameEntry[];
}

/**
 * A possible question of a game.
 */
export interface IGameEntry {
  id: number;
  Name: string;
  Sciname: string;
  Abstract: IAbstract;
  Link: string;
  Categories: number[];
  Audio: IAudioSourceObject;
  Image: IImageSourceObject;
}

export interface IAbstract {
  Text: string;
  Quotation: string;
  Author: ILink;
  Licence: ILink;
}

export interface IQuizSet {
  GameId: number;
  Set: IGameEntry[][];
  NumberOfGames: number;
  wins:number;
  losses:number;
  CorrectAnswer:IGameEntry[];
  //Current Game Set
  CrtQuestion: number;
  CrtCorrectAnswer: IGameEntry;
  StartRound:Date;
  EndRound:Date;
  Answers: IGameEntry[];
  answerQuestion(item:IGameEntry, no:number): void
  nextQuestion():boolean;

  RoundFinished: boolean;
  GameFinished: boolean;
}

export interface ITeaserObject {
  Text: String;
  Image: IImageSourceObject;
}

export interface IAudioSourceObject {
  Src: string;
  Link: string;
  Licence: ILink;
  Author: ILink;
}
export interface IImageSourceObject {
  Src: string;
  Link: string;
  Licence: ILink;
  Author: ILink;
  Crop: any;
}

export interface ILink {
  Name: string;
  Link: string;
}
