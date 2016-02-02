import {Http} from 'angular2/http';
import {IQuizSet} from "./controller";

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
    static postQuizRound(http: Http, quizSet: IQuizSet) {
        if (ApiCalls.API_ACTIVE && http) {
            http.post(ApiCalls.ENDPOINT + ApiCalls.QUIZ_ROUND, JSON.stringify({
                "GameId": quizSet.GameId,
                "Questions": [
                    quizSet.Set[quizSet.CrtQuestion][0].id,
                    quizSet.Set[quizSet.CrtQuestion][1].id,
                    quizSet.Set[quizSet.CrtQuestion][2].id,
                    quizSet.Set[quizSet.CrtQuestion][3].id,
                ],
                "numberOfRounds": quizSet.NumberOfGames,
                "numberOfRound": quizSet.CrtCorrectAnswer,
                "CorrectAnswer": quizSet.CrtCorrectAnswerId,
                "SelectedAnswer": quizSet.Answers[quizSet.CrtQuestion],
                "Won": (quizSet.Answers[quizSet.CrtQuestion] == quizSet.CrtCorrectAnswer),
                "Start": quizSet.StartRound,
                "End": quizSet.EndRound,
            }));
        }
    }
}