package vttp.testssfproject2.testssfproject2.repo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import vttp.testssfproject2.testssfproject2.model.User;
import static vttp.testssfproject2.testssfproject2.utils.SQLConstants.FIND_USER_ID;
import static vttp.testssfproject2.testssfproject2.utils.SQLConstants.INSERT_USER;

@Repository
public class UserRepo {
    
    @Autowired
    JdbcTemplate template;

    

    public void postUser(User user) {
        //see if user exist in the users table
        SqlRowSet rs = template.queryForRowSet(FIND_USER_ID, user.getUserId());

        // if user doesnt exist, insert the user
        if (!rs.next()) {
            this.insertUser(user);
        }
    }

    public void insertUser(User user) {
        template.update(INSERT_USER,user.getUserId(),user.getUsername(),user.getEmail());
    }
}
