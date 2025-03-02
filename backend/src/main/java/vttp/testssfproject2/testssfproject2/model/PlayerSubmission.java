package vttp.testssfproject2.testssfproject2.model;

import java.util.Objects;

import org.springframework.data.annotation.TypeAlias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@TypeAlias("PlayerSubmission")
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlayerSubmission {
    
    private String playerName;
    private String title;
    private String description;
    private String imageUrl;
    private Integer total;
    private Boolean isWinner;

    public PlayerSubmission() {
        this.total=0;
        this.isWinner = false;
    }

    

    public PlayerSubmission(String playerName, String title, String description, String imageUrl) {
        this.playerName = playerName;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.total=0;
        this.isWinner = false;
    }



    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Boolean getIsWinner() {
        return isWinner;
    }

    public void setIsWinner(Boolean isWinner) {
        this.isWinner = isWinner;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlayerSubmission that = (PlayerSubmission) o;
        return Objects.equals(playerName, that.playerName) &&
               Objects.equals(title, that.title) &&
               Objects.equals(description, that.description) &&
               Objects.equals(imageUrl, that.imageUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playerName, title, description, imageUrl);
    }

    





}
