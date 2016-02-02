import {StorageService} from './storage-service'
import {IGame, IQuizSet, IGameEntry} from "./interfaces";
import {QuizSet} from "./QuizSet";

/**
 * Class to generate random quiz sets based on IGame.GamesSet
 */
export class GenerateQuizSet {

    private quizSet: QuizSet;
    private excludeGameEntries:string[] = [];
    private callback: () => void;

    constructor(quizSet: QuizSet, gameSet:IGameEntry[], callback: () => void) {
        this.quizSet = quizSet;
        this.createSet(gameSet);
        this.callback = callback;
    }

    /**
     * Create the Quiz question with the respect to 'numberOfGame' and 'excludeGameEntries'.
     * @param gameSet
     */
    private createSet(gameSet:IGameEntry[]) {
        for(var i=0; i < this.quizSet.NumberOfGames; i++) {
            var quizRound:IGameEntry[] = [];
            for (var s=0; s < 4; s++) {
                quizRound.push(this.chooseRandomElement(gameSet));
            }
            var correct = GenerateQuizSet.chooseCorrectAnswer();
            this.quizSet.CorrectAnswer.push(correct);
            this.excludeGameEntries.push(quizRound[correct].id);
            this.quizSet.Set.push(quizRound);
        }

        if (this.callback) {
            this.callback();
        }
    }

    /**
     * Pick randomly a element from the game set with constraint no id from `excludeGameEntries`.
     * @param gameSet
     * @returns {IGameEntry}
     */
    private chooseRandomElement(gameSet:IGameEntry[]): IGameEntry {
        var random:number = Math.floor(Math.random() * gameSet.length);
        var element:IGameEntry = gameSet[random];
        //This could be improved O(|excludeGameEntries|) to O(log(|excludeGameEntries|))
        for(var id:string in this.excludeGameEntries) {
            if (id === element.id) {
                return this.chooseRandomElement(gameSet);
            }
        }
        this.excludeGameEntries.push(element.id);
        return element;
    }

    private static chooseCorrectAnswer():number {
        return Math.floor(Math.random() * 4);
    }
}