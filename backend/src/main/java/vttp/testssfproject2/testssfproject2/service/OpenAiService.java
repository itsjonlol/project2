package vttp.testssfproject2.testssfproject2.service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import jakarta.json.Json;
import static jakarta.json.Json.createObjectBuilder;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import static vttp.testssfproject2.testssfproject2.utils.AIConstants.EXTRAPROMPT;
import static vttp.testssfproject2.testssfproject2.utils.AIConstants.IMAGEURL;
import static vttp.testssfproject2.testssfproject2.utils.AIConstants.MAXTOKENS;
import static vttp.testssfproject2.testssfproject2.utils.AIConstants.MODEL;
import static vttp.testssfproject2.testssfproject2.utils.AIConstants.SYSTEM;
import static vttp.testssfproject2.testssfproject2.utils.AIConstants.SYSTEMCONTENT;
import static vttp.testssfproject2.testssfproject2.utils.AIConstants.TEXT;
import static vttp.testssfproject2.testssfproject2.utils.AIConstants.USER;
import static vttp.testssfproject2.testssfproject2.utils.AIConstants.USERPROMPT;

@Service
public class OpenAiService {
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String OPENAI_GEN_IMAGE_URL ="https://api.openai.com/v1/images/generations";
    RestTemplate restTemplate = new RestTemplate();

    @Value("${openai.api-key}")
    private String API_KEY;

    
    // make a request to the OpenAI API to analyze an image
    public String analyzeImage(String imageUrl) {
      

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(API_KEY); // Sets Authorization: Bearer <API_KEY>

        JsonObject systemJson = Json.createObjectBuilder()
            .add("role",SYSTEM)
            .add("content",SYSTEMCONTENT)
            .build();

        JsonArrayBuilder messageJab = Json.createArrayBuilder();
        JsonArrayBuilder contentJab = Json.createArrayBuilder();

        JsonObject contentTextJson;
        contentTextJson = Json.createObjectBuilder()
                .add("type",TEXT)
                .add("text",USERPROMPT)
                .build();

        JsonObject urlJson;
        urlJson = createObjectBuilder()
                .add("url",imageUrl)
                .build();

        JsonObject contentImageJson = createObjectBuilder()
            .add("type",IMAGEURL)
            .add("image_url",urlJson)
            .build();

        JsonArray contentJsonArray = contentJab
        .add(contentTextJson)
        .add(contentImageJson)
        .build();

        JsonObject userJson = Json.createObjectBuilder()
            .add("role",USER)
            .add("content",contentJsonArray)
            .build();

        JsonArray messageArray = messageJab
            .add(systemJson)
            .add(userJson)
            .build();
        
        JsonObject requestJson;
        requestJson = Json.createObjectBuilder()
                .add("model",MODEL)
                .add("messages",messageArray)
                .add("max_tokens",MAXTOKENS)
                .build();

        RequestEntity<String> requestEntity = RequestEntity.post(OPENAI_API_URL)
        .headers(headers)
        .body(requestJson.toString());

        System.out.println("Generated JSON: " + requestJson.toString());
        String responseContent = "";
        try {
            ResponseEntity<String> responseEntity = restTemplate.exchange(requestEntity,String.class);
            String payload = responseEntity.getBody();
            // System.out.println(payload);
            InputStream is = new ByteArrayInputStream(payload.getBytes());
            JsonReader reader = Json.createReader(is);
            JsonObject jsonObj = reader.readObject();
            JsonArray choicesArray = jsonObj.getJsonArray("choices");

            responseContent = choicesArray.getJsonObject(0).getJsonObject("message").getString("content");
        } catch (RestClientException ex) {
            System.out.println(ex.getMessage());
           
        }


        return responseContent;

        
    }

    //function to generate ai image
    // implemented but not used in this current project (generate ai image)-> for future development
    public String generateImage(String prompt) {
        String imageUrl = "";


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(API_KEY);

        JsonObject jsonObject = Json.createObjectBuilder()
            .add("model", "dall-e-2")
            .add("prompt",EXTRAPROMPT +  prompt)
            .add("n",1)
            .add("size","256x256")
            .build();

        RequestEntity<String> requestEntity = RequestEntity.post(OPENAI_GEN_IMAGE_URL)
                                                           .headers(headers)
                                                           .body(jsonObject.toString());

        try {
            ResponseEntity<String> responseEntity = restTemplate.exchange(requestEntity,String.class);
            String payload = responseEntity.getBody();
            // System.out.println(payload);
            InputStream is = new ByteArrayInputStream(payload.getBytes());
            JsonReader reader = Json.createReader(is);
            JsonObject jsonObj = reader.readObject();
            JsonArray dataArray = jsonObj.getJsonArray("data");
            imageUrl = dataArray.getJsonObject(0).getString("url");
        } catch (RestClientException ex) {
            System.out.println(ex.getMessage());
        }
        return imageUrl;
    }



}
