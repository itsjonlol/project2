package vttp.testssfproject2.testssfproject2.repo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import vttp.testssfproject2.testssfproject2.model.PlayerSubmission;
import vttp.testssfproject2.testssfproject2.model.Submission;
import static vttp.testssfproject2.testssfproject2.utils.SQLConstants.INSERT_GAME;
import static vttp.testssfproject2.testssfproject2.utils.SQLConstants.INSERT_SUBMISSIONS;

@Repository
public class SubmissionRepo {
    
    @Autowired
    JdbcTemplate template;

   
    public void insertGameTable(Submission submission,String gameId) {
        
        template.update(INSERT_GAME,gameId,submission.getGamePrompt(),"");

    }

    public void insertPlayerSubmissions(Submission submission,String gameId) {
        List<PlayerSubmission> lis = submission.getPlayerSubmissions();
        //should add random 4 digit number for primary key instead
        List<Object[]> params = lis.stream()
        .map(li -> {
            Object[] rec = new Object[6];
            rec[0] = li.getTitle();
            rec[1] = li.getDescription();
            rec[2] = li.getAiComments();
            rec[3] = li.getImageUrl();
            rec[4] = li.getUserId();
            rec[5] = gameId;
            return rec;
        }).toList();

        template.batchUpdate(INSERT_SUBMISSIONS,params);
    }


}
