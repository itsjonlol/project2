package vttp.testssfproject2.testssfproject2.model;

public class EmailRequest {
    private String to;
    private String subject;
    private String name;

    public EmailRequest() {
        this.subject = "Game Updates!";
    }

    

    public EmailRequest(String to, String name) {
        this.to = to;
        this.subject = "Game Updates!";
        this.name = name;
    }





    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

  
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    
}

