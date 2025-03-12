package vttp.testssfproject2.testssfproject2.controller;

import java.io.FileNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import vttp.testssfproject2.testssfproject2.service.OpenAiService;
import vttp.testssfproject2.testssfproject2.service.S3Service;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api")

public class ImageController {

   

    // @Autowired
    // private ImageService imageService;

    @Autowired
    private S3Service s3Service;

     @Autowired
    OpenAiService openAiService;
    

    @PostMapping(path = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> uploadFile(
            @RequestPart("file") MultipartFile file, @RequestPart("name") String name) {

        try {
            // Upload file and get S3 URL
            String fileUrl = s3Service.uploadFile(file,name);
            String aiComments = "";
            // aiComments = openAiService.analyzeImage(fileUrl);
            

            // Build JSON response
            JsonObject response = Json.createObjectBuilder()
                .add("message", "File uploaded successfully!")
                .add("name", name)
                .add("url", fileUrl)
                .add("aiComments",aiComments)
                .build();

        return ResponseEntity.ok(response.toString());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

     @DeleteMapping("/{fileKey}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileKey) {
        try {
            String responseMessage = s3Service.deleteFile(fileKey);
            return ResponseEntity.ok(responseMessage); 
        } catch (FileNotFoundException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    
    
}