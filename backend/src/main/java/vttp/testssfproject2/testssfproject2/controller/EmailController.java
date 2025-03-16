package vttp.testssfproject2.testssfproject2.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import vttp.testssfproject2.testssfproject2.model.EmailRequest;
import vttp.testssfproject2.testssfproject2.service.EmailService;


@RestController
@RequestMapping("/api")
public class EmailController {

    @Autowired
    EmailService emailService;


    @PostMapping(value="/sendemail",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> sendEmail(@RequestBody EmailRequest emailRequest) {
        Context context = new Context();
        // Set variables for the template from the POST request data
        context.setVariable("name", emailRequest.getName());
        context.setVariable("subject", emailRequest.getSubject());
        try {
            emailService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), "EmailTemplate", context);
          
            Map<String,String> response = new HashMap<>();
            response.put("message","Email sent successfully!");
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (MessagingException e) {
            Map<String,String> response = new HashMap<>();
            response.put("message","Error sending email: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
