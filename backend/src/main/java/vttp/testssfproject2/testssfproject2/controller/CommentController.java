package vttp.testssfproject2.testssfproject2.controller;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.testssfproject2.testssfproject2.model.Comments;
import vttp.testssfproject2.testssfproject2.model.PostSocial;
import vttp.testssfproject2.testssfproject2.service.CommentService;



@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    CommentService commentService;

    @GetMapping("/postsocial/{postId}")
    public ResponseEntity<?> getPostSocial(@PathVariable("postId") String postId) {

        Optional<PostSocial> opt = commentService.getPostSocial(postId);

        Map<String,Object> response = new HashMap<>();

        if (opt.isEmpty()) {
            response.put("message",postId + " is not available");
            return ResponseEntity.status(404).body(response);
        }
      

       
        return ResponseEntity.status(200).body(opt.get());
    }
    
    @PostMapping("/comment")
    public ResponseEntity<?> insertComment(@RequestBody String commentPostJsonStr) {
       
        JsonObject commentPostJson = getJsonObjectFromPayloadString(commentPostJsonStr);

        String postId = commentPostJson.getString("postId");
        String username = commentPostJson.getString("username");
        String comment = commentPostJson.getString("comment");

        Comments commentPost = new Comments();

        commentPost.setUsername(username);
        commentPost.setComment(comment);

        
        

        Optional<PostSocial> opt = commentService.getPostSocial(postId);

        Map<String,Object> response = new HashMap<>();

        if (opt.isEmpty()) {
            response.put("message",postId + " is not available");
            return ResponseEntity.status(404).body(response);
        }
        commentService.insertComment(commentPost, postId);
       
        

        PostSocial postSocial = commentService.getPostSocial(postId).get();
        
        return ResponseEntity.status(201).body(postSocial);
    }

    @DeleteMapping("/comment")
    public ResponseEntity<?> deleteComment(@RequestBody String deleteCommentJsonStr) {
        System.out.println(deleteCommentJsonStr);
        JsonObject commentPostJson = getJsonObjectFromPayloadString(deleteCommentJsonStr);

        String postId = commentPostJson.getString("postId");
        String commentId = commentPostJson.getString("commentId");

        Map<String,Object> response = new HashMap<>();
        Optional<PostSocial> opt = commentService.getPostSocial(postId);
        if (opt.isEmpty()) {
            response.put("message",postId + " is not available");
            return ResponseEntity.status(404).body(response);
        }
        commentService.deleteComment(postId, commentId);
        PostSocial postSocial = commentService.getPostSocial(postId).get();
        
        return ResponseEntity.status(200).body(postSocial);
        
    }

    @PostMapping("/like")
    public ResponseEntity<?> postLike(@RequestBody String likePostJsonStr) {
        JsonObject commentPostJson = getJsonObjectFromPayloadString(likePostJsonStr);

        String postId = commentPostJson.getString("postId");
        
        Integer like = commentPostJson.getInt("like");

        Optional<PostSocial> opt = commentService.getPostSocial(postId);

        Map<String,Object> response = new HashMap<>();

        if (opt.isEmpty()) {
            response.put("message",postId + " is not available");
            return ResponseEntity.status(404).body(response);
        }
        
        commentService.changeLikes(like, postId);


        PostSocial postSocial = commentService.getPostSocial(postId).get();
        
        return ResponseEntity.status(201).body(postSocial);
    }
    
    
     private JsonObject getJsonObjectFromPayloadString (String message ) {
        InputStream is = new ByteArrayInputStream(message.getBytes());
        JsonReader reader = Json.createReader(is);
        
        JsonObject jsonObject = reader.readObject();
        return jsonObject;
    }

    

    
}
