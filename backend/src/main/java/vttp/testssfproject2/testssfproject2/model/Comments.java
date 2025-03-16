package vttp.testssfproject2.testssfproject2.model;

import java.util.UUID;

public class Comments {
    
    private String commentId;
    private String username;
    private String comment;

    public Comments() {
        this.commentId = UUID.randomUUID().toString().substring(0,8);
    }

    
    

    public Comments(String username, String comment) {
        this.commentId = UUID.randomUUID().toString().substring(0,8);
        this.username = username;
        this.comment = comment;
    }




    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }


    public String getCommentId() {
        return commentId;
    }


    public void setCommentId(String commentId) {
        this.commentId = commentId;
    }

    
}
