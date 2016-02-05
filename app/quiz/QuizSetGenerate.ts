import {Inject} from 'angular2/core'
import {StorageService} from './storage-service'
import {IGame, IQuizSet, IGameEntry} from "./interfaces";
import {QuizSet} from "./QuizSet";
import {StorageService} from "./storage-service";
import {Quiz} from "./controller";

/**
 * Class to generate random quiz sets based on IGame.GamesSet
 */
export class QuizSetGenerate {
    /**
     * Parent Object
     */
    private quizSet: QuizSet;
    private flopSet: IGameEntry[];
    private pickRateFlop: number = 0.2;
    private pickedFlop: number = 0;
    private unratedSet: IGameEntry[];
    private pickRateUnrated: number = 0.8;
    private pickedUnrated: number = 0;
    private gameSet: IGameEntry[];
    private gameSetById: {[id:string]: IGameEntry} = {};
    private gameSetByCat: {[id:string]: IGameEntry[]} = {};
    /**
     * Helper
     * @type {Array}
     */
    private excludeGameEntries:string[] = [];
    /**
     * After finish quiz generation, call callback.
     */
    private callback: () => void;

    /**
     * Create more similar questions for the quiz set.
     */
    private expertMode: boolean;
    /**
     * Dependency load.
     */
    private storageService: StorageService;



    constructor(quizSet: QuizSet, gameSet:IGameEntry[], storageService: StorageService, callback: () => void) {
        this.storageService = storageService;
        this.quizSet = quizSet;
        this.gameSet = gameSet;
        this.callback = callback;
        this.expertMode = this.storageService.getExpertMode();
        this.loadStats();
        this.createSet();
    }

    private loadStats() {
        this.flopSet = this.storageService.getGameStats().sort(this.quizSet.GameId, "losses").slice(0,9);
        this.unratedSet = this.storageService.getGameStats().sort(this.quizSet.GameId, "unrated");
        for (var i:number=0; i < this.gameSet.length; i++) {
            this.gameSetById[this.gameSet[i].id] = this.gameSet[i];
        }
    }

    /**
     * Create the Quiz question. First step is to find the correct answers and afterwards to fill the the there others.
     */
    private createSet() {
        //Draw GameEntry
        while (this.quizSet.CorrectAnswer.length != this.quizSet.NumberOfGames) {
            //Get a random GameEntry item
            var element: IGameEntry = this.drawElement();

            //TODO: Assertion wouldn't be necessary when the code work probably...
            //Check Assertion: There are no entry twice in the list
            var insertElement:boolean = true;
            for (var i=0; i < this.quizSet.CorrectAnswer.length; i++) {
                if (element.id === this.quizSet.CorrectAnswer[i].id) {
                    insertElement = false;
                    break;
                }
            }
            if (insertElement) {
                this.quizSet.CorrectAnswer.push(element);
                //At first clean the list from already picked GameEntry items
                QuizSetGenerate.cleanSpecialGameEntryList(element, this.flopSet);
                QuizSetGenerate.cleanSpecialGameEntryList(element, this.unratedSet);
                this.cleanGameEntryList(element);
            }
        }

        //Create four quiz questions. Only need to add 3 other GameEntries.
        //The other GameEntries will selected by GameEntry.Category
        //By Expert Mode more similar ones and by simple mode not similar ones
        //@see fillQuizSet
        this.createGameEntryListByCategory();
        for (var i=0; i < this.quizSet.CorrectAnswer.length; i++) {
            this.quizSet.Set[i] = [this.quizSet.CorrectAnswer[i]];
            while (this.quizSet.Set[i].length != 4) {
                var element: IGameEntry = this.fillQuizSet(this.quizSet.CorrectAnswer[i].Categories);
                //Check element already in set
                var insertElement: boolean = true;
                for (var s=0; s < this.quizSet.Set[i].length; s++) {
                    if (element.id === this.quizSet.Set[i][s].id) {
                        insertElement = false;
                        break;
                    }
                }

                if (insertElement) {
                    //element is in set, so added to it
                    this.quizSet.Set[i].push(element);
                }
            }
            //shuffle so that the correct answer not will be always on first position.
            this.quizSet.Set[i] = QuizSetGenerate.shuffle(this.quizSet.Set[i]);
        }

        if (this.callback) {
            this.callback();
        }
    }

    /**
     * Pick randomly a GameEntry by respect to unrated, not good recognized items.
     * @returns {IGameEntry}
     */
    private drawElement(): IGameEntry {
        var random:number;
        var element:IGameEntry;
        if (this.unratedSet.length > 0 && (this.pickedUnrated / this.quizSet.NumberOfGames) < this.pickRateUnrated) {
            //draw elements from unratedSet until this.pickRateUnrated is reached
            random = Math.floor(Math.random() * this.unratedSet.length);
            element = this.gameSetById[this.unratedSet[random][0]];
            this.pickedUnrated++;
            //remove picked entry
            //this.unratedSet.splice(random, 1);
        } else if (this.flopSet.length > 0 && (this.pickedFlop / this.quizSet.NumberOfGames) < this.pickRateFlop) {
            //draw elements from flopSet until this.pickRateFlop is reached
            random = Math.floor(Math.random() * this.flopSet.length);
            element = this.gameSetById[this.flopSet[random][0]];
            this.pickedFlop++;
            //remove picked entry
            //this.flopSet.splice(random, 1);
        } else {
            //Otherwise take a element from the whole set
            random = Math.floor(Math.random() * this.gameSet.length);
            element = this.gameSet[random];
            //remove picked entry
            //this.gameSet.splice(random, 1);
        }
        this.excludeGameEntries.push(element.id);
        return element;
    }

    /**
     * Find a similar GameEntry base on Category when expert mode is on.
     * Otherwise find a not so similar GameEntry.
     * When non is found refill `gameSetByCat` with calling `createGameEntryListByCategory`.
     * @param catFromItem
     * @returns {IGameEntry}
     */
    fillQuizSet(catFromItem: number[]): IGameEntry {
        if (this.expertMode) {
            //try to catch similar GameEntry by Category for more difficulty
            for (var cat:number in catFromItem) {
                if (this.gameSetByCat[cat] && this.gameSetByCat[cat].length > 0) {
                    return this.pickElementAndRemoveFromOrigin(cat);
                }
            }
        }
        //otherwise get something else
        var keys = Object.keys(this.gameSetByCat);
        keys = QuizSetGenerate.shuffle(keys);
        for (var key in keys) {
            var skip = false;
            for (var cat in catFromItem) {
                if (cat == key) {
                    skip = true;
                    break;
                }
            }

            if (!skip) {
                if (this.gameSetByCat[key] && this.gameSetByCat[key].length > 0) {
                    return this.pickElementAndRemoveFromOrigin(key);
                }
            }
        }

        //ok, then take from the exclude categories a item
        for (var key in catFromItem) {
            if (this.gameSetByCat[key] && this.gameSetByCat[key].length > 0) {
                return this.pickElementAndRemoveFromOrigin(key);
            }
        }

        //Well when until now is nothing return probably there are no more items
        this.createGameEntryListByCategory();
        //And re-run the procedure
        this.fillQuizSet(catFromItem);
    }

    /**
     * Selected a random element from a gameSetByCat and remove afterwards from gameSet and gameSetByCat.
     * @param cat Selected GameEntry Category.
     * @returns {IGameEntry}
     */
    pickElementAndRemoveFromOrigin(cat:number) {
        var random:number = Math.floor(Math.random() * this.gameSet.length);
        var element:IGameEntry = this.gameSet[random];
        this.gameSetByCat[cat].splice(random, 1);
        for (var i=0; i < this.gameSet.length; i++) {
            if (element.id == this.gameSet[i].id) {
                this.gameSet.slice(i,1);
                break;
            }
        }
        return element;
    }

    /**
     * Remove `item` from gameSet.
     * @param item
     */
    cleanGameEntryList(item: IGameEntry):void {
        //Exclude doubles entries.
        //This could be improved O(|excludeGameEntries|) to O(log(|excludeGameEntries|))
        for (var i:number=0; i < this.gameSet.length; i++) {
            if (this.gameSet[i].id === item.id) {
                this.gameSet.splice(i,1);
            }
        }
    }

    /**
     * Remove `item` from `list`.
     * @param item
     * @param list
     */
    static cleanSpecialGameEntryList(item: IGameEntry, list: any):void {
        for (var i:number=0; i < list.length; i++) {
            if (item.id === list[i][0]) {
                list.splice(i,1);
                break;
            }
        }
    }

    /**
     * Create a GameEntry list sorted accessible through category.
     * Category is number organized x0y. x is general Category and y is more specific Category.
     */
    createGameEntryListByCategory() {
        if (this.gameSet.length == 0) {
            this.gameSet = Quiz.getGameSetById(this.quizSet.GameId).GamesSet;

            //remove all used entries from list.
            for (var i:number=0; i < this.gameSet.length; i++) {
                for(var id:string in this.excludeGameEntries) {
                    if (id === this.gameSet[i].id) {
                        this.gameSet.splice(i,1);
                        break;
                    }
                }
            }
        }

        for (var i:number=0; i < this.gameSet.length; i++) {
            var item: IGameEntry = this.gameSet[i];
            for(var cat:number in item.Categories) {
                QuizSetGenerate.savePush(this.gameSetByCat, cat, item);
            }
        }

    }

    static savePush(ary:any, cat:number, item:any): void {
        if (typeof ary[cat] === "object") {
            ary[cat].push(item)
        } else {
            ary[cat] = [item];
        }
    }

    static shuffle(o: any[]): any[] {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    private static chooseCorrectAnswer():number {
        return Math.floor(Math.random() * 4);
    }
}