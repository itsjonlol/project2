package vttp.testssfproject2.testssfproject2.unused;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import vttp.testssfproject2.testssfproject2.model.unused.GameSession;

@Repository
public class GameSessionRepo {
    @Autowired
    private RedisTemplate<String, GameSession> redisTemplate;

    private static final String PREFIX = "game:";

    public void saveGameSession(GameSession session) {
        redisTemplate.opsForValue().set(PREFIX + session.getGameCode(), session);
    }

    public GameSession getGameSession(String gameCode) {
        return redisTemplate.opsForValue().get(PREFIX + gameCode);
    }

    public void deleteGameSession(String gameCode) {
        redisTemplate.delete(PREFIX + gameCode);
    }
}
