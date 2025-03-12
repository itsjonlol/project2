package vttp.testssfproject2.testssfproject2.model;

public class Post {
    private Integer postId;
    private String userId;
    private String username;
    private String title;
    private String description;
    private String aiComments;
    private String imageUrl;
    private String prompt;
    private Boolean isActive;
    private String aiImageUrl;

    public Post() {

    }

    public Post(Integer postId, String userId, String username, String title, String description, String aiComments,
            String imageUrl, String prompt) {
        this.postId = postId;
        this.userId = userId;
        this.username = username;
        this.title = title;
        this.description = description;
        this.aiComments = aiComments;
        this.imageUrl = imageUrl;
        this.prompt = prompt;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAiComments() {
        return aiComments;
    }

    public void setAiComments(String aiComments) {
        this.aiComments = aiComments;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getAiImageUrl() {
        return aiImageUrl;
    }

    public void setAiImageUrl(String aiImageUrl) {
        this.aiImageUrl = aiImageUrl;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    
}
