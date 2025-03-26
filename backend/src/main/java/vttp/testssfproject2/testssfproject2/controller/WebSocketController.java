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

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // template for sending messages to clients

    @Autowired
    SubmissionService submissionService;
   
    @MessageMapping("/initialisegame/{gameCode}")
    public void initialiseGame(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {
    
        //change state of game room of that game code
        gameRoomService.changeGameState(gameCode, GameState.QUEUING);
        
     }

     @MessageMapping("/players/{gameCode}")
     public void manageGamePlayers(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {
       
        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
 

        String playerName = jsonObject.getString("name");
        String mascot = jsonObject.getString("mascot");
   

       // insert into a player list in mongodb
        Player player = new Player(playerName,mascot);
        gameRoomService.addPlayers(gameCode, player);
        
       // get the updated Submission object for the whole room
        Submission submission = gameRoomService.getRoomSubmission(gameCode);
        messagingTemplate.convertAndSend("/topic/players/" + gameCode,submission);
       
      
     }
     // handle disconnections
     @MessageMapping("/disconnect/{gameCode}") 
     public void manageDisconnections(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {
        // System.out.println("disconnected ---> "+ message);
        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
        String playerName = jsonObject.getString("name");
        String role = jsonObject.getString("role");
        // if a player disconnect, just disconnect them from the game room
        if (role.equals("player")) {
            gameRoomService.removePlayers(gameCode, playerName, role);
            Submission submission = gameRoomService.getRoomSubmission(gameCode);
            messagingTemplate.convertAndSend("/topic/players/" + gameCode,submission);
        }
        // if host disconnect, disconnect everyone then reset the room
        if (role.equals("host")) {
            gameRoomService.removePlayers(gameCode, playerName, role);
            Map<String,Object> response = new HashMap<>();
            response.put("gameCode",gameCode);
            response.put("disconnect",true);
    
            messagingTemplate.convertAndSend("/topic/disconnect/" + gameCode,response);
        }   
       

     }
     // manage a player's entry for that game room
     @MessageMapping("/playersubmission/{gameCode}")
     public void manageSubmissions(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {
        // System.out.println("/playersubmission/" + gameCode + ">>>" + message) ;


        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
        
        String userId = jsonObject.getString("userId");
        String playerName = jsonObject.getString("name");
       
        String title = jsonObject.getString("title");
        String description = jsonObject.getString("description");
        String imageUrl = jsonObject.getString("image");
        String aiComments = jsonObject.getString("aiComments");

        
        
        //insert a player submission into mongodb
        PlayerSubmission playerSubmissionM = new PlayerSubmission(userId,playerName, title, description,aiComments, imageUrl);
        gameRoomService.insertPlayerSubmission(gameCode, playerSubmissionM);

        // retrieve the updated submission object for the whole room
        Submission submissionM = gameRoomService.getRoomSubmission(gameCode);
        messagingTemplate.convertAndSend("/topic/submission/" + gameCode,submissionM);

        
     }

     // handle the player votes in real time
     @MessageMapping("/playervote/{gameCode}")
     public void manageGameVotes(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {
        // System.out.println(message);
        
        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
       
        String currentPlayerName = jsonObject.getString("currentPlayerName");
        String playerName = jsonObject.getString("name");
        Integer playerVote =jsonObject.getInt("vote");
        
        //increment the playervote in mongodb
        gameRoomService.updatePlayerVote(gameCode, playerName, currentPlayerName,playerVote);
        Submission submission = gameRoomService.getRoomSubmission(gameCode);
        
        messagingTemplate.convertAndSend("/topic/submission/" + gameCode,submission);





     }

     //for managing game states
    @MessageMapping("/gamestate/{gameCode}")
    public void manageGameState(@Payload String message,
     @DestinationVariable("gameCode") Integer gameCode) {

        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
        // receive from host to start game
        // methods to change game state
        if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.STARTED) {
            
            // System.out.println("Starting game...");

            GameSess gameSess = new GameSess(gameCode,GameState.STARTED);
          

            gameRoomService.changeGameState(gameCode, GameState.STARTED);
            // give the list of updated players
            messagingTemplate.convertAndSend("/topic/gamestate/" + gameCode, gameSess);
            // voting section
        } else if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.VOTING) {
            GameSess gameSess = new GameSess(gameCode,GameState.VOTING);

            gameRoomService.changeGameState(gameCode, GameState.VOTING);
            messagingTemplate.convertAndSend("/topic/gamestate/" + gameCode, gameSess);

        } 
        else if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.NEXT) {
           
            gameRoomService.resetPlayerVotes(gameCode);
            Submission submission = gameRoomService.getRoomSubmission(gameCode);
            messagingTemplate.convertAndSend("/topic/submission/" + gameCode,submission);


            // results section
        } else if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.RESULTS) {
           

            GameSess gameSess = new GameSess(gameCode,GameState.RESULTS);
            gameRoomService.changeGameState(gameCode, GameState.RESULTS);
           
            // give updated room submission object
            Submission sortedSubmission = gameRoomService.getSortedSubmission(gameCode);
            messagingTemplate.convertAndSend("/topic/gamestate/" + gameCode,gameSess);
            messagingTemplate.convertAndSend("/topic/submission/" + gameCode,sortedSubmission);
            
            //when players are giving their images a title and description
        } else if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.DESCRIBE) {
          
            GameSess gameSess = new GameSess(gameCode,GameState.DESCRIBE);

            gameRoomService.changeGameState(gameCode, GameState.DESCRIBE);

            messagingTemplate.convertAndSend("/topic/gamestate/" + gameCode,gameSess);

            // when game has ended
        } else if (GameState.valueOf(jsonObject.getString("gameState")) == GameState.FINISHED) {
          

            GameSess gameSess = new GameSess(gameCode,GameState.FINISHED);
            gameRoomService.changeGameState(gameCode, GameState.FINISHED);
            messagingTemplate.convertAndSend("/topic/gamestate/" + gameCode,gameSess);

            Submission submission = gameRoomService.getRoomSubmission(gameCode);

            //add submission results into mysql table before setting mongodb doc
            submissionService.insertGameSubmissions(submission);

            //reset game room for that code
            gameRoomService.resetGameRoom(gameCode);

        } 

        System.out.println(message);
        
    }
    // topic to know the current drawing that everyone is viewing
    @MessageMapping("/currentdrawing/{gameCode}")
    public void showCurrentDrawing(@Payload String message,
    @DestinationVariable("gameCode") Integer gameCode) {
        // System.out.println(message);
        JsonObject jsonObject = getJsonObjectFromPayloadString(message);
        Map<String,Object> response = new HashMap<>();
        response.put("gameCode",gameCode);
        response.put("currentPlayerName",jsonObject.getString("currentPlayerName"));
        messagingTemplate.convertAndSend("/topic/currentdrawing/" + gameCode,response);

    }

     
    private JsonObject getJsonObjectFromPayloadString (String message ) {
        InputStream is = new ByteArrayInputStream(message.getBytes());
        JsonReader reader = Json.createReader(is);
        
        JsonObject jsonObject = reader.readObject();
        return jsonObject;
    }
    
    

}



