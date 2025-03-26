package vttp.testssfproject2.testssfproject2.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vttp.testssfproject2.testssfproject2.model.User;
import vttp.testssfproject2.testssfproject2.service.UserService;


@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;
    
    @PostMapping(path="/postuser",consumes=MediaType.APPLICATION_JSON_VALUE,
    produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postUser(@RequestBody User user) {

        userService.postUser(user);
    
        return ResponseEntity.status(200).body(user);
    }
}

