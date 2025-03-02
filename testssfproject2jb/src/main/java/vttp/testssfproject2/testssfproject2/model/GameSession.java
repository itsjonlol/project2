package vttp.testssfproject2.testssfproject2.model;

import java.util.List;
import java.util.Map;

public class GameSession {
    private String gameCode;
    private String hostId;
    private boolean gameStarted;
    private String prompt;
    private List<String> players;
    private String gameState;
    private Map<String, String> playerAnswers;

    public GameSession() {

    }

    public GameSession(String gameCode, String hostId, List<String> players, String gameState) {
        this.gameCode = gameCode;
        this.hostId = hostId;
        this.players = players;
        this.gameState = gameState;
    }
    public boolean allAnswersSubmitted() {
        return playerAnswers.size() == players.size();
    }

    public void startNewRound() {
        this.playerAnswers.clear();
        this.prompt = "New prompt here...";
    }

    public String getGameCode() {
        return gameCode;
    }

    public void setGameCode(String gameCode) {
        this.gameCode = gameCode;
    }

    public String getHostId() {
        return hostId;
    }

    public void setHostId(String hostId) {
        this.hostId = hostId;
    }

    public List<String> getPlayers() {
        return players;
    }

    public void setPlayers(List<String> players) {
        this.players = players;
    }

    public String getGameState() {
        return gameState;
    }

    public void setGameState(String gameState) {
        this.gameState = gameState;
    }

    public Map<String, String> getAnswers() {
        return playerAnswers;
    }

    public void setAnswers(Map<String, String> answers) {
        this.playerAnswers = answers;
    }

    public boolean isGameStarted() {
        return gameStarted;
    }

    public void setGameStarted(boolean gameStarted) {
        this.gameStarted = gameStarted;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    
    
}
