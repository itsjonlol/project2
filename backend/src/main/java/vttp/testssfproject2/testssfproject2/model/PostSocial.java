package vttp.testssfproject2.testssfproject2.model;

import java.util.List;

public class PostSocial {
    
    private String postId;
    private Integer likes;
    private List<Comments> comments;

    public PostSocial() {

    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public List<Comments> getComments() {
        return comments;
    }

    public void setComments(List<Comments> comments) {
        this.comments = comments;
    }

    
    
}
