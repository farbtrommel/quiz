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
    Abstract: IAbstract;
    Link: string;
    Categories: number[];
    Audio: ISourceObject;
    Image: ISourceObject;
}

export interface IAbstract {
    Text: string;
    Quotation: string;
    Author: ILink;
    Licence: ILink;
}

export interface IQuizSet {
    GameId: string;
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
    answerQuestion(item: IGameEntry, no:number): void
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