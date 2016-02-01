import {Quiz, IQuizSet} from '../quiz/controller';

export namespace Game {
    export class Stats {
        addRound(quizSet: IQuizSet){
            var obj = {
              "GameId": quizSet.GameId,
              "Questions": [
                  quizSet.Set[quizSet.CrtQuestion][0].id,
                  quizSet.Set[quizSet.CrtQuestion][1].id,
                  quizSet.Set[quizSet.CrtQuestion][2].id,
                  quizSet.Set[quizSet.CrtQuestion][3].id,
              ],
                "CorrectAnswer": quizSet.CrtCorrectAnswerId,
                "Start": quizSet.StartRound,
                "End": quizSet.EndRound,
            };
        }
    }
}