package vttp.testssfproject2.testssfproject2.model;

import java.util.List;

import vttp.testssfproject2.testssfproject2.model.enumeration.GameState;

public class GameSess {
    private Integer gameCode;
    private List<Player> players;
    private GameState gameState;

    public GameSess() {

    }

    

    public GameSess(Integer gameCode, GameState gameState) {
        this.gameCode = gameCode;
        this.gameState = gameState;
    }

    


   


    public GameSess(Integer gameCode, List<Player> players, GameState gameState) {
        this.gameCode = gameCode;
        this.players = players;
        this.gameState = gameState;
    }



    public Integer getGameCode() {
        return gameCode;
    }

    public void setGameCode(Integer gameCode) {
        this.gameCode = gameCode;
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
    
    
}
