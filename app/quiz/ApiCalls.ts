import {Http} from '@angular/http';
import {IQuizSet} from "./interfaces";
import {StorageService} from "./storage-service";

/**
 * This class contains the logic to create messages to communicate with a rest service.
 */
export class ApiCalls {
    static ENDPOINT:string = "";
    static QUIZ_ROUND:string = "";
    static API_ACTIVE:boolean = false;

    /**
     * Push quiz round information to endpoint
     * @param http
     * @param quizSet
     */
    static postQuizRound(http: Http, storageService: StorageService, quizSet: IQuizSet) {
        if (storageService.getSendStats() && ApiCalls.API_ACTIVE && http) {
            http.post(ApiCalls.ENDPOINT + ApiCalls.QUIZ_ROUND, JSON.stringify({
                "GameId": quizSet.GameId,
                "Questions": [
                    quizSet.Set[quizSet.CrtQuestion][0].id,
                    quizSet.Set[quizSet.CrtQuestion][1].id,
                    quizSet.Set[quizSet.CrtQuestion][2].id,
                    quizSet.Set[quizSet.CrtQuestion][3].id,
                ],
                "numberTotalRounds": quizSet.NumberOfGames,
                "round": quizSet.CrtCorrectAnswer,
                "CorrectAnswer": quizSet.CrtCorrectAnswer.id,
                "SelectedAnswer": quizSet.Answers[quizSet.CrtQuestion],
                "Won": (quizSet.Answers[quizSet.CrtQuestion].id == quizSet.CrtCorrectAnswer.id),
                "Start": quizSet.StartRound,
                "End": quizSet.EndRound,
            }));
        }
    }
}