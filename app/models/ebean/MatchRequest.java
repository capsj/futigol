package models.ebean;

import com.avaje.ebean.Model;
import org.jetbrains.annotations.NotNull;
import org.joda.time.DateTime;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

@Entity
public class MatchRequest extends Model {

    @Id
    private Long id;
    @NotNull
    private Team sender;
    @NotNull
    private Team receiver;
    @NotNull
    private DateTime date;
    @NotNull
    private DateTime time;
    private String location;

    private static Finder<Long, MatchRequest> finder = new Finder<>(MatchRequest.class);

    public MatchRequest(Long id, @NotNull Team sender, @NotNull Team receiver, @NotNull DateTime date, @NotNull DateTime time, String location) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.date = date;
        this.time = time;
        this.location = location;
    }

    public static Optional<MatchRequest> getById(Long id) {
        MatchRequest matchRequest = finder.where().eq("id", id).findUnique();
        if(matchRequest != null) {
            return  Optional.of(matchRequest);
        } else {
            return Optional.empty();
        }
    }

    public static List<MatchRequest> getSentRequests(Long teamId) {
        return finder.where().eq("sender", teamId).findList();
    }

    public static List<MatchRequest> getReceivedRequests(Long teamId) {
        return finder.where().eq("receiver", teamId).findList();
    }

    public Long getId() {
        return id;
    }

    @NotNull
    public Team getSender() {
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

    @NotNull
    public DateTime getTime() {
        return time;
    }

    public String getLocation() {
        return location;
    }

}
