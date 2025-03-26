package vttp.testssfproject2.testssfproject2.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.testssfproject2.testssfproject2.model.User;
import vttp.testssfproject2.testssfproject2.repo.UserRepo;

@Service
public class UserService {
    
    @Autowired
    UserRepo userRepo;


    public void postUser(User user) {
        userRepo.postUser(user);
    }
}
