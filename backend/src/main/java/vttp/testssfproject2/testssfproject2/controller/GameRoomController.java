package vttp.testssfproject2.testssfproject2.controller;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.testssfproject2.testssfproject2.model.GameRoom;
import vttp.testssfproject2.testssfproject2.model.enumeration.GameState;
import vttp.testssfproject2.testssfproject2.service.GameRoomService;


@RestController
@RequestMapping("/api")
public class GameRoomController {

    @Autowired
    GameRoomService gameRoomService;
    

    @PostMapping("/accessroom")
    public ResponseEntity<?> accessGameRoom(@RequestBody String entryDetailsJson) {
        InputStream is = new ByteArrayInputStream(entryDetailsJson.getBytes());
        JsonReader reader = Json.createReader(is);       
        JsonObject entryDetailJsonObject = reader.readObject();
        Integer gameCode = entryDetailJsonObject.getInt("gameCode");
        String name = entryDetailJsonObject.getString("name");

        System.out.println("game Code: "+ gameCode + "name "+ name);
    

        Map<String,Object> response = new HashMap<>();
        
        Optional<GameRoom> opt = gameRoomService.getGameRoom(gameCode);
        // System.out.println(opt.get().getGameState());
        

        if (opt.isEmpty()){
            response.put("success", false);
            response.put("message", "Game Code of " + gameCode + " not found");
            return ResponseEntity.status(400).header("Content-Type", "application/json").body(response);

        }
        if (opt.get().getIsActive()){
            response.put("success", false);
            response.put("message", "Game is currently running");
            return ResponseEntity.status(400).header("Content-Type", "application/json").body(response);

        }
        
        if (opt.get().getGameState() != GameState.QUEUING){
            response.put("success", false);
            response.put("message", "Game is currently unavailable");
            return ResponseEntity.status(400).header("Content-Type", "application/json").body(response);

        }

        if (opt.get().getIsFull()){
            response.put("success", false);
            response.put("message", "Game is currently full");
            return ResponseEntity.status(400).header("Content-Type", "application/json").body(response);

        }
        

        response.put("success", true);
        response.put("message", "Joining game " + gameCode);
        // response.put("players",opt.get().getPlayers());
        


        return ResponseEntity.status(200).header("Content-Type", "application/json").body(response);
    }

    @GetMapping("/getgameroom")
    public ResponseEntity<?> getGameRoom() {
        Optional<GameRoom> opt = gameRoomService.getAvailableGameRoom();

        Map<String,Object> response = new HashMap<>();

        if (opt.isEmpty()){
            response.put("success",false);
            response.put("message", "No available game room at the moment");
            return ResponseEntity.status(400).header("Content-Type", "application/json").body(response);

        }

        response.put("success",true);
        response.put("gameCode",opt.get().getId());
        return ResponseEntity.status(200).header("Content-Type", "application/json").body(response);

        

    }
    

    
}
