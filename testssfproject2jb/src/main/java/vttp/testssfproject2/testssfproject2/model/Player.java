package vttp.testssfproject2.testssfproject2.model;

import java.util.Objects;

import org.springframework.data.annotation.TypeAlias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@TypeAlias("Player")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Player {
    
    private String name;
    private Integer vote;
    private String mascot;



    public Player() {
        this.vote=0;
        this.mascot="../mascot/mascot1.svg";
    }


    

    public Player(String name) {
        this.vote=0;
        this.name = name;
        this.mascot="../mascot/mascot1.svg";
    }




    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getVote() {
        return vote;
    }

    public void setVote(Integer vote) {
        this.vote = vote;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return Objects.equals(name, player.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    // private String mascot;

    public String getMascot() {
        return mascot;
    }

    public void setMascot(String mascot) {
        this.mascot = mascot;
    }

}
