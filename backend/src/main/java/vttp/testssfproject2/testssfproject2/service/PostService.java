package vttp.testssfproject2.testssfproject2.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.testssfproject2.testssfproject2.model.Post;
import vttp.testssfproject2.testssfproject2.repo.PostRepo;

@Service
public class PostService {
    
    @Autowired
    PostRepo postRepo;

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
    
}
