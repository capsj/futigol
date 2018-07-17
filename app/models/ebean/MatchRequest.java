package models.ebean;

import com.avaje.ebean.Expr;
import com.avaje.ebean.Model;
import org.jetbrains.annotations.NotNull;
import org.joda.time.DateTime;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Entity
public class MatchRequest extends Model {

    @Id
    private UUID id;
    @NotNull
    @ManyToOne
    private Team sender;
    @NotNull
    @ManyToOne
    private Team receiver;
    @NotNull
    private DateTime date;
    @NotNull
    private DateTime time;
    private String location;
    private String state;

    private static Finder<UUID, MatchRequest> finder = new Finder<>(MatchRequest.class);

    public MatchRequest(UUID id, @NotNull Team sender, @NotNull Team receiver, @NotNull DateTime date, @NotNull DateTime time, String location, String state) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.date = date;
        this.time = time;
        this.location = location;
        this.state = state;
    }

    public static Optional<MatchRequest> getById(UUID id) {
        MatchRequest matchRequest = finder.where().eq("id", id).findUnique();
        if(matchRequest != null) {
            return  Optional.of(matchRequest);
        } else {
            return Optional.empty();
        }
    }

    public static List<MatchRequest> getSentRequests(UUID teamId) {
        return finder.where().eq("sender", teamId).findList();
    }

    public static List<MatchRequest> getReceivedRequests(UUID teamId) {
        return finder.where().eq("receiver", teamId).findList();
    }

    public static List<MatchRequest> checkRequests(UUID teamId, DateTime date, DateTime time) {
        return finder.where().eq("receiver_id", teamId).eq("date", date)
                .between("time", time.minusHours(2), time.plusHours(2)).findList();
    }

    public static List<MatchRequest> getPendingRequests(UUID senderId) {
        return finder.where().or(Expr.eq("sender_id", senderId), Expr.eq("receiver_id", senderId))
                .or(Expr.eq("state", "Pendiente"), Expr.eq("state", "Enviada")).findList();
    }

    public UUID getId() {
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

    public String getState() {
        return state;
    }
}
