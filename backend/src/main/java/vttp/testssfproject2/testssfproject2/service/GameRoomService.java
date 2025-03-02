package vttp.testssfproject2.testssfproject2.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.testssfproject2.testssfproject2.model.GameRoom;
import vttp.testssfproject2.testssfproject2.model.GameSess;
import vttp.testssfproject2.testssfproject2.model.Player;
import vttp.testssfproject2.testssfproject2.model.PlayerSubmission;
import vttp.testssfproject2.testssfproject2.model.Submission;
import vttp.testssfproject2.testssfproject2.model.enumeration.GameState;
import vttp.testssfproject2.testssfproject2.repo.GameRoomRepo;

@Service
public class GameRoomService {


    @Autowired
    GameRoomRepo gameRoomRepo;

    public Optional<GameRoom> getGameRoom(Integer gameCode) {
        System.out.println("getting game room from service...");
        return gameRoomRepo.getGameRoom(gameCode);
    }
    
    public Optional<GameRoom> getAvailableGameRoom() {
        return gameRoomRepo.getAvailableRoom();
    }
    
    public void initialiseGame(Integer gameCode) {
        gameRoomRepo.initialiseGame(gameCode);
    }
    
    public GameState getGameState(Integer gameCode) {
        return gameRoomRepo.getGameState(gameCode);
    }

    public void changeGameState(Integer gameCode,GameState gameState) {
        gameRoomRepo.changeGameState(gameCode, gameState);
    }

    public void addPlayers(Integer gameCode,Player player) {
        gameRoomRepo.addPlayers(gameCode, player);
    }
    public void insertPlayerSubmission(Integer gameCode,PlayerSubmission playerSubmission) {
        gameRoomRepo.insertPlayerSubmission(gameCode, playerSubmission);
    }

    public Submission getRoomSubmission(Integer gameCode) {
        return gameRoomRepo.getRoomSubmission(gameCode);
    }

    public void updatePlayerVote(Integer gameCode,String playerName, String currentPlayerDrawing,Integer vote ) {
        gameRoomRepo.updatePlayerVote(gameCode, playerName, currentPlayerDrawing,vote);
    }
    public void resetPlayerVotes(Integer gameCode) {
        gameRoomRepo.resetPlayerVotes(gameCode);
    }

    public Submission getSortedSubmission(Integer gameCode) {
        return gameRoomRepo.getSortedSubmission(gameCode);
    }

    public GameSess getGameSession(Integer gameCode) {
        return gameRoomRepo.getGameSession(gameCode);
    }

    public void removePlayers(Integer gameCode,String playerName, String role) {
        gameRoomRepo.removePlayers(gameCode, playerName, role);
    }
}


