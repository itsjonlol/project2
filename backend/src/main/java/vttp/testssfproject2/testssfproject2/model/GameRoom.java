package vttp.testssfproject2.testssfproject2.model;

import java.util.List;

import vttp.testssfproject2.testssfproject2.model.enumeration.GameState;

public class GameRoom {
    
    private Integer id;
    private String gamePrompt;
    private Boolean isFull; // 8/8 is full
    private Boolean isActive; // to see if a game is currently playing
    private GameState gameState;
    private List<Player> players;
    
    public GameRoom() {

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getIsFull() {
        return isFull;
    }

    public void setIsFull(Boolean isFull) {
        this.isFull = isFull;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

   

    public GameState getGameState() {
        return gameState;
    }

    public void setGameState(GameState gameState) {
        this.gameState = gameState;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public String getGamePrompt() {
        return gamePrompt;
    }

    public void setGamePrompt(String gamePrompt) {
        this.gamePrompt = gamePrompt;
    }

    
}
