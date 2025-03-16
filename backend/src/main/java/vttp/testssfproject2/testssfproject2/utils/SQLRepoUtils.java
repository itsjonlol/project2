package vttp.testssfproject2.testssfproject2.utils;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import vttp.testssfproject2.testssfproject2.model.Post;
import vttp.testssfproject2.testssfproject2.model.User;

public class SQLRepoUtils {
    

    public static User toUser(SqlRowSet rs) {

        User user = new User();

        user.setUserId(rs.getString("user_id"));
        user.setUsername(rs.getString("username"));
        user.setEmail(rs.getString("email"));

        return user;
        
    }

    public static Post toPost(SqlRowSet rs) {

        Post post = new Post();

        post.setPostId(rs.getString("sub_id"));
        post.setUserId(rs.getString("user_id"));
        post.setUsername(rs.getString("username"));
        post.setTitle(rs.getString("title"));
        post.setDescription(rs.getString("description"));
        post.setAiComments(rs.getString("aicomments"));
        post.setImageUrl(rs.getString("imageurl"));
        post.setPrompt(rs.getString("prompt"));
        post.setIsActive(rs.getBoolean("isactive"));
        post.setAiImageUrl(rs.getString("aiimageurl"));

        return post;
    }
}
