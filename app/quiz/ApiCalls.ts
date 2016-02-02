import {Http} from 'angular2/http';
import {IQuizSet} from "./controller";

export class ApiCalls {
    static ENDPOINT:string = "";
    static QUIZ_ROUND:string = "";
    static API_ACTIVE:boolean = false;

    static postQuizRound(http: Http, quizSet: IQuizSet) {
        if (ApiCalls.API_ACTIVE) {
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
                "Start": quizSet.StartRound,
                "End": quizSet.EndRound,
            }));
        }
    }
}