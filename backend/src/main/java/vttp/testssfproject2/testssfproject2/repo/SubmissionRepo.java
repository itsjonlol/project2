package vttp.testssfproject2.testssfproject2.repo;

import java.util.List;
import java.util.UUID;

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

    @Autowired
    CommentRepo commentRepo;

   
    public void insertGameTable(Submission submission,String gameId) {
        
        template.update(INSERT_GAME,gameId,submission.getGamePrompt(),"");

    }

    public void insertPlayerSubmissions(Submission submission,String gameId) {
        List<PlayerSubmission> lis = submission.getPlayerSubmissions();
       
        //batch update submissions after a game has ended
        List<Object[]> params = lis.stream()
        .map(li -> {
            Object[] rec = new Object[7];
            String postId = UUID.randomUUID().toString().substring(0,8); 
            rec[0] = postId; 
            // once postId is obtained, instantiate the comment section in mongodb for that postId
            commentRepo.insertPostSocial(postId); 
            System.out.println(li.getTitle());
            System.out.println(li.getDescription());
            System.out.println(li.getAiComments());
            System.out.println(li.getImageUrl());
            System.out.println(li.getUserId());
            System.err.println(gameId);

            rec[1] = li.getTitle();
            rec[2] = li.getDescription();
            rec[3] = li.getAiComments();
            rec[4] = li.getImageUrl();
            rec[5] = li.getUserId();
            rec[6] = gameId;
            return rec;
        }).toList();

        template.batchUpdate(INSERT_SUBMISSIONS,params);
    }


}
