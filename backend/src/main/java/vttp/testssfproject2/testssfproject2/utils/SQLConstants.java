package vttp.testssfproject2.testssfproject2.utils;

public class SQLConstants {
    
    public static final String INSERT_USER = "insert into users values (?,?,?)";

    public static final String FIND_USER_ID = 
        """

        select * from users where user_id = ?

        """;

    public static final String INSERT_GAME = "insert into games values (?,?,?)";

    public static final String INSERT_SUBMISSIONS = """
            
    insert into submissions(sub_id,title,description,aicomments,imageurl,user_id,game_id) values
    (?,?,?,?,?,?,?);
            """;

    public static final String RETRIEVE_ALL_POSTS = """
            
       WITH CTE AS (select s.sub_id,u.user_id,u.username,s.title,
        s.description,s.aicomments,s.imageurl,g.prompt,s.aiimageurl,s.isactive from submissions s
        join games g
        on s.game_id = g.game_id 
        join users u
        on s.user_id  = u.user_id)

        select * from CTE where isactive = true
        order by sub_id desc

            """;
            //limit ? offset ?;

    public static final String RETRIEVE_POST_BY_ID = """
            

        WITH CTE AS (select s.sub_id,u.user_id,u.username,s.title,s.description,s.aicomments,s.imageurl,g.prompt,s.aiimageurl,s.isactive from submissions s
        join games g
        on s.game_id = g.game_id 
        join users u
        on s.user_id  = u.user_id)

        select * from CTE
        where isactive = true and sub_id = ?;
                """;
    
    public static final String RETRIEVE_POSTS_BY_USER = """
            

        WITH CTE AS (select s.sub_id,u.user_id,u.username,s.title,
        s.description,s.aicomments,s.imageurl,g.prompt,s.aiimageurl,s.isactive from submissions s
        join games g
        on s.game_id = g.game_id 
        join users u
        on s.user_id  = u.user_id)

        select * from CTE
        where isactive = true and username like ?;
                """;

    public static final String SET_INACTIVE_POST = """
        
        update submissions
        set isactive = FALSE 
        where sub_id = ?

            """;

    public static final String GET_N_POSTS = """
        
        select count(*) as n_posts from submissions s 
        where isactive = true;
            """;

    public static final String INSERT_AI_IMAGEURL = """
        update submissions 
        set aiimageurl = ?
        where sub_id = ?

            """;

}
