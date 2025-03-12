// package vttp.testssfproject2.testssfproject2.service.unused;

// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;

// import vttp.testssfproject2.testssfproject2.model.unused.Image;
// import vttp.testssfproject2.testssfproject2.model.unused.ImageModel;

// @Service
// public class ImageService {
//     @Autowired
//     private CloudinaryService cloudinaryService;

//     public ResponseEntity<Map> uploadImage(ImageModel imageModel) {
//         try {
//             if (imageModel.getName().isEmpty()) {
//                 return ResponseEntity.badRequest().build();
//             }
//             if (imageModel.getFile().isEmpty()) {
//                 return ResponseEntity.badRequest().build();
//             }
//             Image image = new Image();
//             image.setName(imageModel.getName());
//             image.setUrl(cloudinaryService.uploadFile(imageModel.getFile(), "folder_1"));
//             if(image.getUrl() == null) {
//                 return ResponseEntity.badRequest().build();
//             }
            
//             return ResponseEntity.ok().body(Map.of("url", image.getUrl()));
//         } catch (Exception e) {
//             e.printStackTrace();
//             return null;
//         }


//     }

// }
