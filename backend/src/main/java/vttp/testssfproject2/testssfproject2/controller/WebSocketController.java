package vttp.testssfproject2.testssfproject2.controller;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.testssfproject2.testssfproject2.model.GameSess;
import vttp.testssfproject2.testssfproject2.model.Player;
import vttp.testssfproject2.testssfproject2.model.PlayerSubmission;
import vttp.testssfproject2.testssfproject2.model.Submission;
import vttp.testssfproject2.testssfproject2.model.enumeration.GameState;
import vttp.testssfproject2.testssfproject2.service.GameRoomService;
import vttp.testssfproject2.testssfproject2.service.SubmissionService;




@Controller
public class WebSocketController {

    @Autowired
    GameRoomService gameRoomService;

   

    // List<String> playerstest = new ArrayList<>();
    // List<String> messagestest = new ArrayList<>();
    
    // List<PlayerSubmission1> playerSubmissions1 = new ArrayList<>();

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Automatically sends messages to subscribed clients

    @Autowired
    SubmissionService submissionService;
   
    

    ///// starting from here

    @MessageMapping("/initialisegame/{gameCode}")
    public void initialiseGame(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {
    
        //change state of game room of that game code
        gameRoomService.changeGameState(gameCode, GameState.QUEUING);
        
        System.out.println(message);
     }

     @MessageMapping("/players/{gameCode}")
     public void manageGamePlayers(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {
        // GameSess gameSess = new GameSess();
        // gameSessionsMap.putIfAbsent(gameCode, new ArrayList<>()); // ✅ Initialize only once
        // List<String> players = gameSessionsMap.get(gameCode);
        // System.out.println(message);
        System.out.println(message);
        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
 
        // JsonArray playersJsonArray = jsonObject.getJsonArray("players");

        String playerName = jsonObject.getString("name");
        String mascot = jsonObject.getString("mascot");
        // if (!players.contains(playerName)) {
        //     players.add(playerName);
        // }
        
        // for (int i = 0;i<playersJsonArray.size();i++) {
        //     //avoid duplicate player names
        //     String playerName = playersJsonArray.getString(i);
        //     if (!players.contains(playerName)) {
        //         players.add(playerName);
        //     }
        // }
       
        // Avoid duplicate player names
        

       // need to store player list for that game session

       //mongo way
        Player player = new Player(playerName,mascot);
        gameRoomService.addPlayers(gameCode, player);
        
        // GameSess gameSess = gameRoomService.getGameSession(gameCode);
        Submission submission = gameRoomService.getRoomSubmission(gameCode);
        messagingTemplate.convertAndSend("/topic/players/" + gameCode,submission);
        // messagingTemplate.convertAndSend("/topic/submission/" + gameCode,submission);

      
     }

     @MessageMapping("/disconnect/{gameCode}") 
     public void manageDisconnections(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {
        System.out.println("disconnected ---> "+ message);
        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
        String playerName = jsonObject.getString("name");
        String role = jsonObject.getString("role");
        if (role.equals("player")) {
            gameRoomService.removePlayers(gameCode, playerName, role);
            Submission submission = gameRoomService.getRoomSubmission(gameCode);
            messagingTemplate.convertAndSend("/topic/players/" + gameCode,submission);
        }
        
        if (role.equals("host")) {
            gameRoomService.removePlayers(gameCode, playerName, role);
            Map<String,Object> response = new HashMap<>();
            response.put("gameCode",gameCode);
            response.put("disconnect",true);
    
            messagingTemplate.convertAndSend("/topic/disconnect/" + gameCode,response);
        }   
       

     }

     @MessageMapping("/playersubmission/{gameCode}")
     public void manageSubmissions(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {
        System.out.println("/playersubmission/" + gameCode + ">>>" + message) ;

        
        // gameSubmissionMap.putIfAbsent(gameCode, new Submission(gameCode));

        // List<Player> players = gameSubmissionMap.get(gameCode).getPlayers();

        // if (players == null) {
        //     players = new ArrayList<>(); // Initialize the list if null
        //     gameSubmissionMap.get(gameCode).setPlayers( players); // Set the initialized list back
        // }
        

        // // List<PlayerSubmission> playerSubmissions = gameSubmissionMap.get(gameCode).getPlayerSubmissions();
        // List<PlayerSubmission> playerSubmissions = gameSubmissionMap.get(gameCode).getPlayerSubmissions();
        
        // if (playerSubmissions == null) {
        //     playerSubmissions = new ArrayList<>();
        //     gameSubmissionMap.get(gameCode).setPlayerSubmissions(playerSubmissions);
        // }

        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
        
        String userId = jsonObject.getString("userId");
        String playerName = jsonObject.getString("name");
        // Player player = new Player(playerName);

        
        // if (!players.contains(player)) {
        //     players.add(player);
        // }
        
        
        String title = jsonObject.getString("title");
        String description = jsonObject.getString("description");
        String imageUrl = jsonObject.getString("image");
        String aiComments = jsonObject.getString("aiComments");

        // PlayerSubmission playerSubmission = new PlayerSubmission(playerName, title, description, imageUrl);

        // if (!playerSubmissions.contains(playerSubmission)) {
        //     playerSubmissions.add(playerSubmission);
        // }

        // System.out.println(playerSubmissions.toString());

        // Submission submission = gameSubmissionMap.get(gameCode);
        
        // submission.setPlayers(players);
        // submission.setPlayerSubmissions(playerSubmissions);

        // gameSubmissionMap.put(gameCode, submission);


        // player.setName(message);

        // messagingTemplate.convertAndSend("/topic/submission/" + gameCode,submission);

        

    

        //mongo way
        PlayerSubmission playerSubmissionM = new PlayerSubmission(userId,playerName, title, description,aiComments, imageUrl);
        gameRoomService.insertPlayerSubmission(gameCode, playerSubmissionM);
        
        Submission submissionM = gameRoomService.getRoomSubmission(gameCode);
        messagingTemplate.convertAndSend("/topic/submission/" + gameCode,submissionM);

        
        

     }

     @MessageMapping("/playervote/{gameCode}")
     public void manageGameVotes(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {
        System.out.println(message);
        // List<Player> players = gameSubmissionMap.get(gameCode).getPlayers();

        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
       
        // List<PlayerSubmission> playerSubmissions = gameSubmissionMap.get(gameCode).getPlayerSubmissions();
        String currentPlayerName = jsonObject.getString("currentPlayerName");
        String playerName = jsonObject.getString("name");
        Integer playerVote =jsonObject.getInt("vote");
        // String mascot = jsonObject.getString("mascot");

        // Integer currentPlayerIndex =getIndexOfCurrentDrawing(playerSubmissions,currentPlayerName);

        // playerSubmissions.get(currentPlayerIndex)
        // .setTotal(playerSubmissions.get(currentPlayerIndex).getTotal() + playerVote);
        

        // for(int i =0; i<playerSubmissions.size(); i++) {
        //     // if (playerSubmission.getPlayerName().equals(currentPlayerName)){
        //     //     playerSubmission.setTotal(playerSubmission.getTotal()+playerVote);
        //     // }
        //     if (playerSubmissions.get(i).getPlayerName().equals(currentPlayerName)) {
        //         playerSubmissions.get(i).setTotal(playerSubmissions.get(i).getTotal() + playerVote);
        //     }

           
        //     if (playerSubmissions.get(i).getPlayerName().equals(playerName)) {
        //         players.get(i).setVote(playerVote);
                
        //     }
        // }

        // for (Player player : players) {
            
        //     if (player.getName().equals(playerName)) {
                
        //         player.setVote(playerVote);
        //     }
            
        // }
        // Submission submission = gameSubmissionMap.get(gameCode);
        
        gameRoomService.updatePlayerVote(gameCode, playerName, currentPlayerName,playerVote);
        Submission submission = gameRoomService.getRoomSubmission(gameCode);
        
        
        messagingTemplate.convertAndSend("/topic/submission/" + gameCode,submission);





     }

     //for managing game states
    @MessageMapping("/gamestate/{gameCode}")
    // @SendTo("/topic/{gameCode}")
    public void manageGameState(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {

        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
        // receive from host to start game
        if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.STARTED) {
            
            System.out.println("Starting game...");

            GameSess gameSess = new GameSess(gameCode,GameState.STARTED);
            // List<String> players = gameSessionsMap.get(gameCode);
            // gameSess.setGameCode(gameCode);
            // // gameSess.setPlayers(players);
            // gameSess.setGameState(GameState.STARTED);

            //change mongodb to started

            gameRoomService.changeGameState(gameCode, GameState.STARTED);
            
            messagingTemplate.convertAndSend("/topic/gamestate/" + gameCode, gameSess);
            
        } else if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.VOTING) {
            GameSess gameSess = new GameSess(gameCode,GameState.VOTING);

            // GameSess gameSess = new GameSess();
            // List<String> players = gameSessionsMap.get(gameCode);
            // gameSess.setGameCode(gameCode);
            // gameSess.setPlayers(players);
            // gameSess.setGameState(GameState.VOTING);
            //change mongodb to started
            gameRoomService.changeGameState(gameCode, GameState.VOTING);
            messagingTemplate.convertAndSend("/topic/gamestate/" + gameCode, gameSess);

        } 
        else if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.NEXT) {
            // Submission submission = gameSubmissionMap.get(gameCode);
            // List<Player> players = gameSubmissionMap.get(gameCode).getPlayers();
            // for (Player player : players) {
            //     player.setVote(0);
            // }
            // submission.setPlayers(players);

            // gameRoomService.changeGameState(gameCode, GameState.NEXT);
            gameRoomService.resetPlayerVotes(gameCode);
            Submission submission = gameRoomService.getRoomSubmission(gameCode);
            messagingTemplate.convertAndSend("/topic/submission/" + gameCode,submission);

            // gameSubmissionMap.put(gameCode, submission);


        } else if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.RESULTS) {
           

            // Submission submission = gameSubmissionMap.get(gameCode);
            // List<PlayerSubmission> playerSubmissions = submission.getPlayerSubmissions();
            // Integer maxIndex = getIndexOfWinner(playerSubmissions);

            // playerSubmissions.get(maxIndex).setIsWinner(true);
            // submission.setPlayerSubmissions(playerSubmissions);
            // gameSubmissionMap.put(gameCode, submission);
            GameSess gameSess = new GameSess(gameCode,GameState.RESULTS);
            gameRoomService.changeGameState(gameCode, GameState.RESULTS);
            // GameSess gameSess = new GameSess();
            // List<String> players = gameSessionsMap.get(gameCode);
            // gameSess.setGameCode(gameCode);
            // gameSess.setPlayers(players);
            // gameSess.setGameState(GameState.RESULTS);

            Submission sortedSubmission = gameRoomService.getSortedSubmission(gameCode);
            messagingTemplate.convertAndSend("/topic/gamestate/" + gameCode,gameSess);
            messagingTemplate.convertAndSend("/topic/submission/" + gameCode,sortedSubmission);
            
            
            

        } else if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.DESCRIBE) {
            // GameSess gameSess = new GameSess();
            // List<String> players = gameSessionsMap.get(gameCode);
            // gameSess.setGameCode(gameCode);
            // gameSess.setPlayers(players);
            // gameSess.setGameState(GameState.DESCRIBE);
            GameSess gameSess = new GameSess(gameCode,GameState.DESCRIBE);

            gameRoomService.changeGameState(gameCode, GameState.DESCRIBE);

            messagingTemplate.convertAndSend("/topic/gamestate/" + gameCode,gameSess);

        } else if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.FINISHED) {
            // GameSess gameSess = new GameSess();
            // List<String> players = gameSessionsMap.get(gameCode);
            // gameSess.setGameCode(gameCode);
            // gameSess.setPlayers(players);
            // gameSess.setGameState(GameState.FINISHED);

            GameSess gameSess = new GameSess(gameCode,GameState.FINISHED);
            gameRoomService.changeGameState(gameCode, GameState.FINISHED);
            messagingTemplate.convertAndSend("/topic/gamestate/" + gameCode,gameSess);

            Submission submission = gameRoomService.getRoomSubmission(gameCode);



            //add submission results into mysql table before setting mongodb doc
            submissionService.insertGameSubmissions(submission);

            //add comment section for each post
            

            //reset game room for that code
            gameRoomService.resetGameRoom(gameCode);

        } 

        System.out.println(message);
        
    }

    @MessageMapping("/currentdrawing/{gameCode}")
    public void showCurrentDrawing(@Payload String message,
    @DestinationVariable("gameCode") Integer gameCode) {
        System.out.println(message);
        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
        Map<String,Object> response = new HashMap<>();
        response.put("gameCode",gameCode);
        response.put("currentPlayerName",jsonObject.getString("currentPlayerName"));
        messagingTemplate.convertAndSend("/topic/currentdrawing/" + gameCode,response);

    }

  

    //  @MessageMapping("/gamesession/{gameCode}")
    //  public GameSess manageGameSession(@Payload String message,
    //  @DestinationVariable("gameCode") Integer gameCode) {
       

    //     GameSess gameSess = new GameSess();
    //     gameSessionsMap.putIfAbsent(gameCode, new ArrayList<>()); // ✅ Initialize only once
    //     List<String> players = gameSessionsMap.get(gameCode);

    //     InputStream is = new ByteArrayInputStream(message.getBytes());
    //     JsonReader reader = Json.createReader(is);
        
    //     JsonObject jsonObject = reader.readObject();

    //     JsonArray playersJsonArray = jsonObject.getJsonArray("players");
        
    //     for (int i = 0;i<playersJsonArray.size();i++) {
    //         //avoid duplicate player names
    //         String playerName = playersJsonArray.getString(i);
    //         if (!players.contains(playerName)) {
    //             players.add(playerName);
    //         }
    //     }
    //     gameSess.setGameCode(gameCode);
    //     gameSess.setPlayers(players);
    //     // Avoid duplicate player names
        

    
    //     return gameSess;
    //  }
     

    private JsonObject getJsonObjectFromPayloadString (String message ) {
        InputStream is = new ByteArrayInputStream(message.getBytes());
        JsonReader reader = Json.createReader(is);
        
        JsonObject jsonObject = reader.readObject();
        return jsonObject;
    }
    
    // private Integer getIndexOfCurrentDrawing(List<PlayerSubmission> playerSubmissions,String currentPlayerName) {
    //     for(int i =0; i<playerSubmissions.size(); i++) {

    //         if (playerSubmissions.get(i).getPlayerName().equals(currentPlayerName)) {
    //             return i;
    //         }    
    //     }
        
    //     return -1;
    // }

    // private Integer getIndexOfWinner(List<PlayerSubmission> playerSubmissions) {
    //     Integer maxIndex = 0;
    //     Integer maxScore = 0;
    //     for(int i =0; i<playerSubmissions.size(); i++) {

    //         if (playerSubmissions.get(i).getTotal()>maxScore) {
    //             maxScore = playerSubmissions.get(i).getTotal();
    //             maxIndex = i;
    //         }
    //     }
    //     return maxIndex;
    // }

    

}



