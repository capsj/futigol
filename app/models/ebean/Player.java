package models.ebean;

import com.avaje.ebean.ExpressionList;
import com.avaje.ebean.Model;
import play.api.Play;
import utils.Encrypter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Entity
public class Player extends Model {

    @Id
    private UUID id;
    private String password;
    private String name;
    private String lastName;
    private String location;
    @Column(unique = true)
    private String email;
    private String phone;
    private String position;

    private static Finder<UUID, Player> finder = new Finder<>(Player.class);

    public Player(UUID id, String password, String name, String lastName, String location, String email, String phone, String position) {
        this.id = id;
        this.password = password;
        this.name = name;
        this.lastName = lastName;
        this.location = location;
        this.email = email;
        this.phone = phone;
        this.position = position;
    }

    @Override
    public void save(){
        password = Encrypter.encrypt(password);
        super.save();
    }

    public static Optional<Player> getById(UUID id) {
        Player player = finder.where().eq("id", id).findUnique();
        if(player != null) {
            return  Optional.of(player);
        } else {
            return Optional.empty();
        }
    }

    public static Optional<Player> getByEmail(String email) {
        Player player = finder.where().eq("email", email).findUnique();
        if(player != null) {
            return  Optional.of(player);
        } else {
            return Optional.empty();
        }
    }

    public static List<Player> getAll() {
        return finder.all();
    }

    public static Optional<Player> authenticatePlayer(String email, String clearPassword) {
        return getByEmail(email).filter((user) -> Encrypter.checkEncrypted(clearPassword, user.password));
    }

    public static List<Player> search(String name, String lastName, String location, String position) {
        ExpressionList<Player> query = finder.where().like("name", name + "%").like("last_name", lastName + "%");
        if(location != null && !location.equals("")) query = query.eq("location", location);
        if(position != null && !position.equals("")) query = query.eq("position", position);

        return query.findList();
    }

    public UUID getId() {
        return id;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getLastName() {
        return lastName;
    }

    public String getLocation() {
        return location;
    }

    public String getPosition() {
        return position;
    }
}
