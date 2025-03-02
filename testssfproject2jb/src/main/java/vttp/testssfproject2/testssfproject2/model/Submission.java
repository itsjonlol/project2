package vttp.testssfproject2.testssfproject2.model;

import java.util.List;

public class Submission {
    

    private Integer gameCode;
    private List<Player> players;
    private List<PlayerSubmission> playerSubmissions;

    public Submission() {

    }

    

    public Submission(Integer gameCode) {
        this.gameCode = gameCode;
    }



    public Integer getGameCode() {
        return gameCode;
    }

    public void setGameCode(Integer gameCode) {
        this.gameCode = gameCode;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public List<PlayerSubmission> getPlayerSubmissions() {
        return playerSubmissions;
    }

    public void setPlayerSubmissions(List<PlayerSubmission> playerSubmissions) {
        this.playerSubmissions = playerSubmissions;
    }

    



    
}
