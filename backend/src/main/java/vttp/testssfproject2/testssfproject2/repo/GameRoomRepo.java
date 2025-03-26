package vttp.testssfproject2.testssfproject2.repo;



import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;
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
import static vttp.testssfproject2.testssfproject2.utils.MongoConstants.C_GAMEROOM;
import static vttp.testssfproject2.testssfproject2.utils.MongoRepoUtils.getGameRoomFromDoc;
import static vttp.testssfproject2.testssfproject2.utils.MongoRepoUtils.getGameSessFromDoc;
import static vttp.testssfproject2.testssfproject2.utils.MongoRepoUtils.getSubmissionFromDoc;

@Repository
public class GameRoomRepo {
    
    @Autowired
    MongoTemplate mongoTemplate;

    // Get an available gamer oom
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
    // Get a randomised available room
    public Optional<GameRoom> getRandomAvailableRoom() {
        Criteria criteria = Criteria.where("gameState").is(GameState.AVAILABLE)
                .and("isFull").is(false);

        MatchOperation matchStage = Aggregation.match(criteria);
        //just take 1 room
        SampleOperation sampleStage = Aggregation.sample(1); 

        Aggregation aggregation = Aggregation.newAggregation(matchStage, sampleStage);

        List<Document> results = mongoTemplate.aggregate(aggregation, C_GAMEROOM, Document.class).getMappedResults();

        if (results.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(getGameRoomFromDoc(results.get(0)));
    }
    
    // initialise the game i.e. set the game state to queuing
    public void initialiseGame(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .set("gameState",GameState.QUEUING);
        
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }
    // get the game state of the room at any point in time
    public GameState getGameState(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Document document =  mongoTemplate.findOne(query,Document.class,C_GAMEROOM);
        GameRoom gameRoom = getGameRoomFromDoc(document);
        return gameRoom.getGameState();
    }

    // to change the game state of the room throughout the game session
    public void changeGameState(Integer gameCode,GameState gameState) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .set("gameState",gameState);
        
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }
    // get the game prompt for that room chosen
    public String getGamePrompt(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Document document =  mongoTemplate.findOne(query,Document.class,C_GAMEROOM);
        GameRoom gameRoom = getGameRoomFromDoc(document);
        return gameRoom.getGamePrompt();
    }
    // add players who joined the room into the database
    public void addPlayers(Integer gameCode,Player player) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .addToSet("players", player);
        
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }
    // remove players who have left or disconnected
    public void removePlayers(Integer gameCode,String playerName, String role) {
        Query query = new Query(Criteria.where("_id").is(gameCode));
        if (role.toLowerCase().equals("player")) {
            
            Update update = new Update()
                .pull("players", Query.query(Criteria.where("name").is(playerName)));

               

            mongoTemplate.updateFirst(query, update, C_GAMEROOM);
        } else if (role.toLowerCase().equals("host")) {
            this.resetGameRoom(gameCode);
           
        }
    }
    // insert a unique player submission
    public void insertPlayerSubmission(Integer gameCode,PlayerSubmission playerSubmission) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .addToSet("submissions", playerSubmission);
        
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }
    // get the overall Room Submission
    public Submission getRoomSubmission(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Document document =  mongoTemplate.findOne(query,Document.class,C_GAMEROOM);

        Submission submission = getSubmissionFromDoc(document);
        return submission;
    }
    
    // increment the vote of the player for each round
    public void updatePlayerVote(Integer gameCode,String playerName, String currentPlayerDrawing,Integer vote ) {
        //update the vote count for the player
        Query voterQuery = new Query(Criteria.where("_id").is(gameCode).and("players.name").is(playerName));
        Update voterUpdate = new Update().inc("players.$.vote", vote);
        mongoTemplate.updateFirst(voterQuery, voterUpdate, C_GAMEROOM);
        // update the total vote count for the player throughout each round
        Query currentDrawingQuery = new Query(Criteria.where("_id").is(gameCode).and("submissions.playerName").is(currentPlayerDrawing));
        Update currentDrawingUpdate = new Update().inc("submissions.$.total", vote);
        mongoTemplate.updateFirst(currentDrawingQuery, currentDrawingUpdate, C_GAMEROOM);
    }
    // reset the player votes to 0 after each round ends
    public void resetPlayerVotes(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .set("players.$[].vote", 0);
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }
    // get the sorted submission after the game ends to find the winner
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
    
    // reset the game room after the game ends for that game code
    public void resetGameRoom(Integer gameCode) {
        Criteria criteria = Criteria.where("_id").is(gameCode);
        Query query = new Query(criteria);

        Update updateOps = new Update()
            .set("gameState", GameState.AVAILABLE)
            .set("players",new ArrayList<>())
            .set("submissions",new ArrayList<>())
            .set("isFull",false)
            .set("isActive",false);
        
        mongoTemplate.updateFirst(query, updateOps, C_GAMEROOM);
    }
    
}
