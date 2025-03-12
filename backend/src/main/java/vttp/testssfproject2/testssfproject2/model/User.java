package vttp.testssfproject2.testssfproject2.model;

public class User {
    private String userId;
    private String username;
    private String email;

    public User() {
        // this.userId = UUID.randomUUID().toString().substring(0,8);
    }

    
    



  

    public User(String userId, String username, String email) {
        this.userId = userId;
        this.username = username;
        this.email = email;
    }








    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    
}
