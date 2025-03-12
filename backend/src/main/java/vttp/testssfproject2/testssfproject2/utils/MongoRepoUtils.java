package vttp.testssfproject2.testssfproject2.utils;

import java.util.List;

import org.bson.Document;

import vttp.testssfproject2.testssfproject2.model.GameRoom;
import vttp.testssfproject2.testssfproject2.model.GameSess;
import vttp.testssfproject2.testssfproject2.model.Player;
import vttp.testssfproject2.testssfproject2.model.PlayerSubmission;
import vttp.testssfproject2.testssfproject2.model.Submission;
import vttp.testssfproject2.testssfproject2.model.enumeration.GameState;

public class MongoRepoUtils {
    
    public static GameRoom getGameRoomFromDoc(Document document) {

        GameRoom gameRoom = new GameRoom();

        gameRoom.setId(document.getInteger("_id"));
        gameRoom.setGamePrompt(document.getString("gamePrompt"));
        gameRoom.setIsFull(document.getBoolean("isFull"));
        gameRoom.setIsActive(document.getBoolean("isActive"));
        gameRoom.setGameState(GameState.valueOf(document.getString("gameState")));
        
        List<Document> documents = document.getList("players", Document.class);
        List<Player> players = documents.stream().map(d -> {
            Player player = new Player();
            player.setName(d.getString("name"));
            player.setVote(d.getInteger("vote"));
            return player;
        }).toList();
        gameRoom.setPlayers(players);
        // gameRoom.setPlayers(document.getList("players", List<Player>.class));

        return gameRoom;
        
    }
    /*
     *  private Integer gameCode;
    private List<Player> players;
    private List<PlayerSubmission> playerSubmissions;
     */
    public static Submission getSubmissionFromDoc(Document document) {
        Submission submission = new Submission();
        submission.setGameCode(document.getInteger("_id"));
        submission.setGamePrompt(document.getString("gamePrompt"));
        List<Document> playerDocuments = document.getList("players", Document.class);
        List<Player> players = playerDocuments.stream().map(d -> {
            Player player = new Player();
            player.setName(d.getString("name"));
            player.setVote(d.getInteger("vote"));
            return player;
        }).toList();

        submission.setPlayers(players);

        List<Document> playerSubmissionDocuments = document.getList("submissions", Document.class);
        List<PlayerSubmission> playerSubmissions = playerSubmissionDocuments.stream().map(d -> {
            PlayerSubmission playerSubmission = new PlayerSubmission();
            playerSubmission.setUserId(d.getString("userId"));
            playerSubmission.setPlayerName(d.getString("playerName"));
            playerSubmission.setTitle(d.getString("title"));
            playerSubmission.setDescription(d.getString("description"));
            playerSubmission.setAiComments(d.getString("aiComments"));
            playerSubmission.setImageUrl(d.getString("imageUrl"));
            playerSubmission.setTotal(d.getInteger("total"));
            playerSubmission.setIsWinner(d.getBoolean("isWinner"));
            return playerSubmission;
        }).toList();



        submission.setPlayerSubmissions(playerSubmissions);

        return submission;
    }

    public static GameSess getGameSessFromDoc(Document document) {
        GameSess gameSess = new GameSess();
        gameSess.setGameCode(document.getInteger("_id"));
        List<Document> playerDocuments = document.getList("players", Document.class);
        List<Player> players = playerDocuments.stream().map(d -> {
            Player player = new Player();
            player.setName(d.getString("name"));
            player.setVote(d.getInteger("vote"));
            return player;
        }).toList();
        gameSess.setPlayers(players);
        gameSess.setGameState(GameState.valueOf(document.getString("gameState")));


        return gameSess;
    }

   

    
}
