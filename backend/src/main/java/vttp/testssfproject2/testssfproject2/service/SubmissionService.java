package vttp.testssfproject2.testssfproject2.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vttp.testssfproject2.testssfproject2.model.Submission;
import vttp.testssfproject2.testssfproject2.repo.SubmissionRepo;

@Service
public class SubmissionService {
    @Autowired
    SubmissionRepo submissionRepo;

    
    @Transactional
    public void insertGameSubmissions(Submission submission) {
        String gameId = UUID.randomUUID().toString().substring(0,8);
        submissionRepo.insertGameTable(submission, gameId);
        submissionRepo.insertPlayerSubmissions(submission, gameId);
        
    }
}
