package vttp.testssfproject2.testssfproject2.repo;



import java.util.Collections;
import java.util.Optional;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import vttp.testssfproject2.testssfproject2.model.GameRoom;
import vttp.testssfproject2.testssfproject2.model.GameSess;
import vttp.testssfproject2.testssfproject2.model.Player;
import vttp.testssfproject2.testssfproject2.model.PlayerSubmission;
import vttp.testssfproject2.testssfproject2.model.Submission;
import vttp.testssfproject2.testssfproject2.model.enumeration.GameState;
import static vttp.testssfproject2.testssfproject2.utils.DocToGame.getGameRoomFromDoc;
import static vttp.testssfproject2.testssfproject2.utils.DocToGame.getGameSessFromDoc;
import static vttp.testssfproject2.testssfproject2.utils.DocToGame.getSubmissionFromDoc;
import static vttp.testssfproject2.testssfproject2.utils.MongoConstants.C_GAMEROOM;

@Repository
public class GameRoomRepo {
    
    @Autowired
    MongoTemplate mongoTemplate;


    public Optional<GameRoom> getGameRoom(Integer gameCode) {

        Criteria criteria = Criteria.where("_id").is(gameCode);

        Query query = new Query(criteria);

        System.out.println("The game code searched for is "+gameCode);
        

        Document document =  mongoTemplate.findOne(query,Document.class,C_GAMEROOM);
       
        System.out.println(document==null);
        
        if (document == null) {
            return Optional.empty();
        }

        return Optional.of(getGameRoomFromDoc(document));

    }
    public Optional<GameRoom> getAvailableRoom() {

        Criteria criteria = Criteria.where("gameState").is(GameState.AVAILABLE)
            .and("isFull").is(false);

        Query query = new Query(criteria);

        Document document =  mongoTemplate.findOne(query,Document.class,C_GAMEROOM);
       

        if (document == null) {
            return Optional.empty();
        }

        return Optional.of(getGameRoomFromDoc(document));

    }

    public void initialiseGame(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .set("gameState",GameState.QUEUING);
        
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }
    public GameState getGameState(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Document document =  mongoTemplate.findOne(query,Document.class,C_GAMEROOM);
        GameRoom gameRoom = getGameRoomFromDoc(document);
        return gameRoom.getGameState();
    }

    public void changeGameState(Integer gameCode,GameState gameState) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .set("gameState",gameState);
        
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }

    public void addPlayers(Integer gameCode,Player player) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .addToSet("players", player);
        
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }

    public void removePlayers(Integer gameCode,String playerName, String role) {
        Query query = new Query(Criteria.where("_id").is(gameCode));
        if (role.toLowerCase().equals("player")) {
            
            Update update = new Update()
                .pull("players", Query.query(Criteria.where("name").is(playerName)))
                .pull("submissions", Query.query(Criteria.where("playerName").is(playerName)));

            mongoTemplate.updateFirst(query, update, C_GAMEROOM);
        } else if (role.toLowerCase().equals("host")) {
            Update update = new Update()
                .set("players", Collections.emptyList())  
                .set("submissions", Collections.emptyList()); 
            mongoTemplate.updateFirst(query, update, C_GAMEROOM);
        }
    }

    public void insertPlayerSubmission(Integer gameCode,PlayerSubmission playerSubmission) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .addToSet("submissions", playerSubmission);
        
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }
    
    public Submission getRoomSubmission(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Document document =  mongoTemplate.findOne(query,Document.class,C_GAMEROOM);

        Submission submission = getSubmissionFromDoc(document);
        return submission;
    }

    public void updatePlayerVote(Integer gameCode,String playerName, String currentPlayerDrawing,Integer vote ) {
        Query voterQuery = new Query(Criteria.where("_id").is(gameCode).and("players.name").is(playerName));
        Update voterUpdate = new Update().inc("players.$.vote", vote);
        mongoTemplate.updateFirst(voterQuery, voterUpdate, C_GAMEROOM);

        Query currentDrawingQuery = new Query(Criteria.where("_id").is(gameCode).and("submissions.playerName").is(currentPlayerDrawing));
        Update currentDrawingUpdate = new Update().inc("submissions.$.total", vote);
        mongoTemplate.updateFirst(currentDrawingQuery, currentDrawingUpdate, C_GAMEROOM);
    }

    public void resetPlayerVotes(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .set("players.$[].vote", 0);
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }

    public Submission getSortedSubmission(Integer gameCode) {
        Aggregation aggregation = Aggregation.newAggregation(
        Aggregation.match(Criteria.where("_id").is(gameCode)), 
        Aggregation.unwind("submissions"),
        Aggregation.sort(Sort.by(Sort.Direction.DESC, "submissions.total")), 
        Aggregation.group("_id")
            .first("isFull").as("isFull")
            .first("isActive").as("isActive")
            .first("gameState").as("gameState")
            .first("players").as("players")
            .push("submissions").as("submissions") 
    );

        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, C_GAMEROOM, Document.class);
        Document sortedGameRoomDoc = results.getUniqueMappedResult();
        Submission submission = getSubmissionFromDoc(sortedGameRoomDoc);
        return submission;
    }

    public GameSess getGameSession(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);

        Query query = new Query(criteria);

    
        Document document =  mongoTemplate.findOne(query,Document.class,C_GAMEROOM);
        GameSess gameSess = getGameSessFromDoc(document);
        return gameSess;
    }
    
}
