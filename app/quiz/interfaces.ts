import {StorageService} from './storage-service'

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
    answerQuestion(no:number, storageService:StorageService): void
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