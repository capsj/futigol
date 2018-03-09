package models.ebean;

import com.avaje.ebean.Model;
import org.jetbrains.annotations.NotNull;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

@Entity
public class Location extends Model{

    @Id
    private Long id;
    @NotNull
    @Column(unique = true)
    private String name;

    private static Finder<Double, Location> finder = new Finder<>(Location.class);

    public Location(Long id, @NotNull String name) {
        this.id = id;
        this.name = name;
    }

    public static Optional<Location> getById(Long id) {
        Location location = finder.where().eq("id", id).findUnique();
        if(location != null) {
            return  Optional.of(location);
        } else {
            return Optional.empty();
        }
    }

    public static Optional<Location> getByName(String name) {
        Location location = finder.where().eq("name", name).findUnique();
        if(location != null) {
            return  Optional.of(location);
        } else {
            return Optional.empty();
        }
    }

    public static List<Location> getAll() {
        return finder.all();
    }

    public Long getId() {
        return id;
    }

    @NotNull
    public String getName() {
        return name;
    }
}
