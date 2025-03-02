// package vttp.testssfproject2.testssfproject2.controller;

// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.Random;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import org.springframework.security.oauth2.core.user.OAuth2User;
// import org.springframework.stereotype.Controller;
// import org.springframework.ui.Model;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestParam;

// import vttp.testssfproject2.testssfproject2.model.GameSession;
// import vttp.testssfproject2.testssfproject2.repo.GameSessionRepo;

// @Controller
// public class GameController {
//     @Autowired
//     GameSessionRepo gameSessionRepo;

//     @GetMapping("/host")
//     public String hostGame(Model model, @AuthenticationPrincipal OAuth2User principal) {
//         String gameCode = String.format("%04d", new Random().nextInt(10000)); // 4-digit code
//         String hostId = principal.getAttribute("name");

//         GameSession session = new GameSession();
//         session.setGameCode(gameCode);
//         session.setHostId(hostId);
//         session.setPlayers(new ArrayList<>());
//         session.setGameState("WAITING_FOR_PLAYERS");

//         gameSessionRepo.saveGameSession(session);
//         // GameSession activeSession = gameSessionRepo.getGameSession(gameCode);
//         model.addAttribute("players", session.getPlayers());

//         // Make sure gameCode and playerName are passed to the view
//         model.addAttribute("gameCode", gameCode);
//         model.addAttribute("playerName", hostId);  // Assuming the host's name is passed here

//         return "host";  // Ensure this maps to the correct Thymeleaf template
//     }
//     @GetMapping("/host/gamestart/{gamecode}") 
//     public String hostGameStart(@PathVariable("gamecode") String gameCode,Model model) {
//         model.addAttribute("gameCode", gameCode);
//         return "host_gamestart";
//     }
    

//     @GetMapping("/join")
//     public String showJoinForm() {
//         return "join";
//     }

//     @PostMapping("/join")
//     public String joinGame(@RequestParam String gameCode, @AuthenticationPrincipal OAuth2User principal, Model model) {
//         GameSession session = gameSessionRepo.getGameSession(gameCode);
//         System.out.println(gameCode);

//         if (session == null) {
//             model.addAttribute("error", "Invalid game code!");
//             return "join";
//         }
//         String playerName = principal.getAttribute("name");
//         if (!session.getPlayers().contains(playerName)) {
//             session.getPlayers().add(playerName);
//             gameSessionRepo.saveGameSession(session);
//         }
//         model.addAttribute("playerName", playerName);
//         model.addAttribute("gameCode", gameCode);
//         model.addAttribute("players", session.getPlayers());
//         return "lobby";
//     }

//     @GetMapping("/player/gamestart/{gamecode}")
//     public String playerGameStart(@PathVariable("gamecode") String gameCode,@AuthenticationPrincipal OAuth2User principal, Model model) {
//         String playerName = principal.getAttribute("name");
//         model.addAttribute("gameCode", gameCode);
//         model.addAttribute("playerName", playerName);
//         return "player_gamestart";
//     }

//     @GetMapping("/api/lol")
//     public ResponseEntity<?> getMethodName() {
//         Map<String,String> lol =  new HashMap<>();
//         lol.put("message","hehe");
//         return ResponseEntity.status(200).header("Content-Type", "application/json").body(lol);
//     }
    
    



// }
