package vttp.testssfproject2.testssfproject2.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.testssfproject2.testssfproject2.config.CorsConfig;
import vttp.testssfproject2.testssfproject2.model.Post;
import vttp.testssfproject2.testssfproject2.repo.PostRepo;

@Service
public class PostService {

    private final CorsConfig corsConfig;
    
    @Autowired
    PostRepo postRepo;

    PostService(CorsConfig corsConfig) {
        this.corsConfig = corsConfig;
    }

    // public List<Post> retrieveAllPosts(Integer page,Integer limit) {
    //     return postRepo.retrieveAllPosts(page,limit);
    // }

    public List<Post> retrieveAllPosts() {
        return postRepo.retrieveAllPosts();
    }

    public List<Post> retrieveAllPostsByUsername(String username) {
        return postRepo.retrieveAllPostsByUsername(username);
    }

    public Optional<Post> retrievePostById(Integer postId) {
        return postRepo.retrievePostById(postId);
    }
    
    public void deactivatePost(Integer postId) {
        postRepo.deactivatePost(postId);
    }

    public Integer getNumOfPosts(){
        return postRepo.getNumOfPosts();
    }

    public void insertAiImageurl(Integer postId, String aiImageUrl) {
        postRepo.insertAiImageurl(postId,aiImageUrl);

    }
    
}
