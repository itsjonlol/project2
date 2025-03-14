package vttp.testssfproject2.testssfproject2.repo;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import vttp.testssfproject2.testssfproject2.config.CorsConfig;
import vttp.testssfproject2.testssfproject2.model.Post;
import static vttp.testssfproject2.testssfproject2.utils.SQLConstants.GET_N_POSTS;
import static vttp.testssfproject2.testssfproject2.utils.SQLConstants.INSERT_AI_IMAGEURL;
import static vttp.testssfproject2.testssfproject2.utils.SQLConstants.RETRIEVE_ALL_POSTS;
import static vttp.testssfproject2.testssfproject2.utils.SQLConstants.RETRIEVE_POSTS_BY_USER;
import static vttp.testssfproject2.testssfproject2.utils.SQLConstants.RETRIEVE_POST_BY_ID;
import static vttp.testssfproject2.testssfproject2.utils.SQLConstants.SET_INACTIVE_POST;
import static vttp.testssfproject2.testssfproject2.utils.SQLRepoUtils.toPost;

@Repository
public class PostRepo {

    private final CorsConfig corsConfig;
    
    
    @Autowired
    JdbcTemplate template;

    PostRepo(CorsConfig corsConfig) {
        this.corsConfig = corsConfig;
    }

    // public List<Post> retrieveAllPosts(Integer page,Integer limit) {
    //     Integer offset = (page-1) * limit;

    //     SqlRowSet rs = template.queryForRowSet(RETRIEVE_ALL_POSTS,limit,offset);
    //     List<Post> posts = new ArrayList<>();

    //     while (rs.next()) {
    //         posts.add(toPost(rs));
    //     }

    //     return posts;
    // }

    public List<Post> retrieveAllPosts() {
        

        SqlRowSet rs = template.queryForRowSet(RETRIEVE_ALL_POSTS);
        List<Post> posts = new ArrayList<>();

        while (rs.next()) {
            posts.add(toPost(rs));
        }

        return posts;
    }
    public List<Post> retrieveAllPostsByUsername(String username) {

        SqlRowSet rs = template.queryForRowSet(RETRIEVE_POSTS_BY_USER,"%%%s%%".formatted(username));
        List<Post> posts = new ArrayList<>();

        while (rs.next()) {
            posts.add(toPost(rs));
        }
        return posts;
    }


    public Optional<Post> retrievePostById(Integer postId) {
        
        SqlRowSet rs = template.queryForRowSet(RETRIEVE_POST_BY_ID, postId);

        if (!rs.next()) {
            return Optional.empty();
        }

        return Optional.of(toPost(rs));
    }

    public void deactivatePost(Integer postId) {
        template.update(SET_INACTIVE_POST,postId);
    }

    public Integer getNumOfPosts() { 

        return template.queryForObject(GET_N_POSTS, Integer.class);
    }

    public void insertAiImageurl(Integer postId, String aiImageUrl) { 
        template.update(INSERT_AI_IMAGEURL,aiImageUrl,postId);
    }

    
}
