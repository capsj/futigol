package models.ebean;

import com.avaje.ebean.Model;
import utils.Encrypter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

@Entity
public class Player extends Model {

    @Id
    private Long id;
    @Column(unique = true)
    private String username;
    private String password;
    private String name;
    @Column(unique = true)
    private String email;
    private String phone;

    private static Finder<Long, Player> finder = new Finder<>(Player.class);

    public Player(Long id, String username, String password, String name, String email, String phone) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    @Override
    public void save(){
        password = Encrypter.encrypt(password);
        super.save();
    }

    public static Optional<Player> getById(Long id) {
        Player player = finder.where().eq("id", id).findUnique();
        if(player != null) {
            return  Optional.of(player);
        } else {
            return Optional.empty();
        }
    }

    public static Optional<Player> getByUsername(String username) {
        Player player = finder.where().eq("username", username).findUnique();
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

    public static Optional<Player> authenticatePlayer(String username, String clearPassword) {
        return getByUsername(username).filter((user) -> Encrypter.checkEncrypted(clearPassword, user.password));
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
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

}
