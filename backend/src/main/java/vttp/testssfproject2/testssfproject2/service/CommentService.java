package vttp.testssfproject2.testssfproject2.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.testssfproject2.testssfproject2.model.Comments;
import vttp.testssfproject2.testssfproject2.model.PostSocial;
import vttp.testssfproject2.testssfproject2.repo.CommentRepo;

@Service
public class CommentService {


    
    @Autowired
    CommentRepo commentRepo;


    public void insertComment(Comments comments, Integer postId) {
        commentRepo.insertComment(comments, postId);
    }

    public void insertPostSocial(Integer postId) {
        commentRepo.insertPostSocial(postId);
    }
    
    public void changeLikes(Integer like, Integer postId) {
        commentRepo.changeLikes(like, postId);
    }

    public Optional<PostSocial> getPostSocial(Integer postId) {
        return commentRepo.getPostSocial(postId);
    }

    public void deletePostSocial(Integer postId) {
        commentRepo.deletePostSocial(postId);
    }


}
