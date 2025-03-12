package vttp.testssfproject2.testssfproject2.model;

import org.springframework.web.multipart.MultipartFile;

public class Canvas {
    private String name;
   
    private MultipartFile file;

    public Canvas() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }


    
    

    


    

    
}
