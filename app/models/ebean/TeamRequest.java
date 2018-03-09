package models.ebean;

import com.avaje.ebean.Model;
import org.jetbrains.annotations.NotNull;
import org.joda.time.DateTime;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

@Entity
public class TeamRequest extends Model {

    @Id
    private Long id;
    @NotNull
    private Player sender;
    @NotNull
    private Team receiver;
    @NotNull
    private DateTime date;

    private static Finder<Long, TeamRequest> finder = new Finder<>(TeamRequest.class);

    public TeamRequest(Long id, @NotNull Player sender, @NotNull Team receiver, @NotNull DateTime date) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.date = date;
    }


    public static Optional<TeamRequest> getById(Long id) {
        TeamRequest teamRequest = finder.where().eq("id", id).findUnique();
        if(teamRequest != null) {
            return  Optional.of(teamRequest);
        } else {
            return Optional.empty();
        }
    }

    public static List<TeamRequest> getSentRequests(Long playerId) {
        return finder.where().eq("sender", playerId).findList();
    }

    public static List<TeamRequest> getReceivedRequests(Long teamId) {
        return finder.where().eq("receiver", teamId).findList();
    }

    public Long getId() {
        return id;
    }

    @NotNull
    public Player getSender() {
        return sender;
    }

    @NotNull
    public Team getReceiver() {
        return receiver;
    }

    @NotNull
    public DateTime getDate() {
        return date;
    }

}
