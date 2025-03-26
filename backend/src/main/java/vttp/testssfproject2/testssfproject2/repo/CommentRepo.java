package vttp.testssfproject2.testssfproject2.repo;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import vttp.testssfproject2.testssfproject2.model.Comments;
import vttp.testssfproject2.testssfproject2.model.PostSocial;
import static vttp.testssfproject2.testssfproject2.utils.MongoConstants.C_COMMENTS;
import static vttp.testssfproject2.testssfproject2.utils.MongoRepoUtils.DocToPostSocial;

@Repository
public class CommentRepo {



  
    @Autowired
    MongoTemplate template;



    // to insert comments for posts
    public void insertComment(Comments comments,String postId) {
        
        Criteria criteria = Criteria.where("_id").is(postId);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .push("comments", new BasicDBObject()
                .append("commentid",comments.getCommentId())
                .append("username", comments.getUsername())
                .append("comment", comments.getComment())
            );

        template.updateFirst(query, updateOps, C_COMMENTS);

        
    }
    // delete a comment
    public void deleteComment(String postId, String commentId) {
    

        Query query = new Query(Criteria.where("_id").is(postId));

        Update updateOps = new Update().pull("comments", 
        Query.query(Criteria.where("commentid").is(commentId)));

      
        template.updateFirst(query, updateOps, C_COMMENTS);
    }
    // to create the comment structure when first creating a post
    public void insertPostSocial(String postId) {

        List<Comments> comments = new ArrayList<>();
        JsonArray jsonCommentsArray = Json.createArrayBuilder(comments).build();
        JsonObject postJson = Json.createObjectBuilder()
            .add("_id",postId)
            .add("likes",0)
            .add("comments",jsonCommentsArray)
            .build();

        Document document = Document.parse(postJson.toString());

        template.insert(document, C_COMMENTS);


    }

    //change like even if positive or negative
    public void changeLikes(Integer like, String postId) {
        Criteria criteria = Criteria.where("_id").is(postId);

        Update updateOps;
       
        updateOps = new Update()
            .inc("likes",like);

        Query query = new Query(criteria);

        template.updateFirst(query, updateOps, C_COMMENTS);

        
    }
    // get the comments for the post
    public Optional<PostSocial> getPostSocial(String postId) {

        Criteria criteria = Criteria.where("_id").is(postId);
        Query query = new Query(criteria);
        
        Document document = template.findOne(query,Document.class, C_COMMENTS);

        if (document ==null) {
            return Optional.empty();
        }

        return Optional.of(DocToPostSocial(document));
    }
    // delete the comment from the post
    public void deletePostSocial(String postId) {
        Criteria criteria = Criteria.where("_id").is(postId);
        Query query = new Query(criteria);

        template.remove(query,C_COMMENTS);
    }


}
