package models.ebean;

import com.avaje.ebean.Model;
import org.jetbrains.annotations.NotNull;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;
import java.util.Optional;

@Entity
public class Team extends Model {

    @Id
    private Long id;
    @NotNull
    @Column(unique = true)
    private String name;
    private String location;
    private int size;
    @ManyToOne
    private Player captain;

    private static Finder<Double, Team> finder = new Finder<>(Team.class);

    public Team(Long id, @NotNull String name, String location, int size, Player captain) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.size = size;
        this.captain = captain;
    }

    public static Optional<Team> getById(Long id) {
        Team team = finder.where().eq("id", id).findUnique();
        if(team != null) {
            return  Optional.of(team);
        } else {
            return Optional.empty();
        }
    }

    public static Optional<Team> getByLocation(String location) {
        Team team = finder.where().eq("location", location).findUnique();
        if(team != null) {
            return  Optional.of(team);
        } else {
            return Optional.empty();
        }
    }

    public static Optional<Team> getByName(String name) {
        Team team = finder.where().eq("name", name).findUnique();
        if(team != null) {
            return  Optional.of(team);
        } else {
            return Optional.empty();
        }
    }

    public static List<Team> getAll() {
        return finder.all();
    }


    public Long getId() {
        return id;
    }

    @NotNull
    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public int getSize() {
        return size;
    }

    public Player getCaptain() {
        return captain;
    }

}
