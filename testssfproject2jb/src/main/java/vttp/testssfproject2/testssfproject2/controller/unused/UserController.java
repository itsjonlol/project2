// package vttp.testssfproject2.testssfproject2.controller;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import org.springframework.security.oauth2.core.user.OAuth2User;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import vttp.testssfproject2.testssfproject2.model.User;

// @RestController
// @RequestMapping("/api")
// public class UserController {
    
//     // @GetMapping("/user")
//     // public Map<String, Object> user(@AuthenticationPrincipal OAuth2User oauth2User) {
//     //     Map<String, Object> userDetails = new HashMap<>();
//     //     if (oauth2User != null) {
//     //         userDetails.put("name", oauth2User.getAttribute("name"));
//     //         userDetails.put("email", oauth2User.getAttribute("email"));
//     //     }
//     //     return userDetails;
//     // }

//     @GetMapping("/user")
//     public ResponseEntity<?> user(@AuthenticationPrincipal OAuth2User oauth2User) {
        
//         User user = new User();
        
//         if (oauth2User != null) {
            
//             user.setName(oauth2User.getAttribute("name"));
//             user.setEmail(oauth2User.getAttribute("email"));
            
//         }
//         return ResponseEntity.status(200).header("Content-Type", "application/json").body(user);
//     }
// }
