package vttp.testssfproject2.testssfproject2.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

@Service
public class S3Service {

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${do.storage.bucket}")
    private String bucketName;

    @Value("${do.storage.endpoint}")
    private String endPoint;

    public String uploadFile(MultipartFile file, String name) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty or null");
        }

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        Map<String, String> userMetadata = new HashMap<>();
        userMetadata.put("name", name);
        metadata.setUserMetadata(userMetadata);

      
        String originalFilename = file.getOriginalFilename();
        String finalFilename = UUID.randomUUID().toString()
        .replace("-", "")
        .substring(0, 8) + "_" + (originalFilename != null ? originalFilename : "uploaded_file");

        PutObjectRequest request = new PutObjectRequest(bucketName, finalFilename, file.getInputStream(), metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead);
        amazonS3.putObject(request);


        String fileUrl = String.format("https://%s.%s/%s", bucketName, endPoint, finalFilename);
    
        return fileUrl;
    }

    public String deleteFile(String fileKey) throws FileNotFoundException {
        try {
          
            if (!amazonS3.doesObjectExist(bucketName, fileKey)) {
                throw new FileNotFoundException(fileKey + "doesn't exist");
            }

            amazonS3.deleteObject(bucketName, fileKey);
            return "File deleted successfully: " + fileKey;

        } catch (AmazonS3Exception e) {
            throw new RuntimeException("Failed to delete file from S3: " + e.getMessage());
        }
    }
}