package vttp.testssfproject2.testssfproject2.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vttp.testssfproject2.testssfproject2.model.AiImage;
import vttp.testssfproject2.testssfproject2.model.Post;
import vttp.testssfproject2.testssfproject2.service.CommentService;
import vttp.testssfproject2.testssfproject2.service.OpenAiService;
import vttp.testssfproject2.testssfproject2.service.PostService;





@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    PostService postService;

    @Autowired
    OpenAiService openAiService;

    @Autowired
    CommentService commentService;
    
    // @GetMapping(path="/allposts",produces=MediaType.APPLICATION_JSON_VALUE)
    // public ResponseEntity<?> getAllPosts(@RequestParam("page") Integer page) {
    //     Integer limit = 4;

    //     Map<String,Object> response = new HashMap<>();

    //     Integer numPosts = postService.getNumOfPosts();
    //     Integer numPages = (int) Math.ceil((double) numPosts / limit);


    //     List<Post> posts = postService.retrieveAllPosts(page,limit);

    //     response.put("posts",posts);
    //     response.put("currentPage",page);
    //     response.put("totalPosts",numPosts);
    //     response.put("totalPages",numPages);
        


    //     return ResponseEntity.status(200).body(response);
    // }

    @GetMapping(path="/allposts",produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllPosts() {
       

        List<Post> posts = postService.retrieveAllPosts();

       
        return ResponseEntity.status(200).body(posts);
    }

    @GetMapping(path="/getpost/{postid}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPostById(@PathVariable("postid") Integer postId) {
        Optional<Post> opt = postService.retrievePostById(postId);
        Map<String,Object> response = new HashMap<>();
        
        
        if (opt.isEmpty()) {
            response.put("message",postId + " not available.");
            return ResponseEntity.status(404).body(response);
        }
        

        return ResponseEntity.status(200).body(opt.get());
    }

    @GetMapping(path="getposts",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPostsByUsername(@RequestParam("username") String username) {
        List<Post> posts = postService.retrieveAllPostsByUsername(username);

        return ResponseEntity.status(200).body(posts);
    }
    

    @DeleteMapping(path="/deletepost/{postid}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deletePostById(@PathVariable("postid") Integer postId) {
        Optional<Post> opt = postService.retrievePostById(postId);
       
        Map<String,Object> response = new HashMap<>();
        if (opt.isEmpty()) {
            response.put("message",postId + " not available.");
            return ResponseEntity.status(404).body(response);
        }
        postService.deactivatePost(postId);
        response.put("message",true);
        
        return ResponseEntity.status(200).body(response);

    }

    @PostMapping(path="/generateimage",produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> generateAiImage(@RequestBody AiImage aiImageRequest) {

        Optional<Post> opt = postService.retrievePostById(aiImageRequest.getPostId());
        Map<String,Object> response = new HashMap<>();
        
        if (opt.isEmpty()) {
            response.put("message",aiImageRequest.getPostId() + " not available.");
            return ResponseEntity.status(404).body(response);
        }


       String aiImageUrl = "blabla"; // placeholder

       postService.insertAiImageurl(aiImageRequest.getPostId(), aiImageUrl);

    

       response.put("postId",aiImageRequest.getPostId());
       response.put("aiImageUrl",aiImageUrl);

        
        return ResponseEntity.status(200).body(response);
    }
    

  
    
    
}
