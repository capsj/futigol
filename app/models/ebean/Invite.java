package models.ebean;

import com.avaje.ebean.Model;
import org.jetbrains.annotations.NotNull;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Entity
public class Invite extends Model{

    @Id
    private UUID id;
    @NotNull
    @ManyToOne
    private Player sender;
    @NotNull
    @ManyToOne
    private Player receiver;
    @NotNull
    @ManyToOne
    private Team team;

    private boolean answered;
    private String requestType;

    private static Model.Finder<UUID, Invite> finder = new Model.Finder<>(Invite.class);

    public Invite(UUID id, @NotNull Player sender, @NotNull Player receiver, @NotNull Team team, boolean answered, String requestType) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.team = team;
        this.answered = answered;
        this.requestType = requestType;
    }

    public static Optional<Invite> getById(UUID id) {
        Invite team = finder.where().eq("id", id).findUnique();
        if(team != null) {
            return  Optional.of(team);
        } else {
            return Optional.empty();
        }
    }
    
    public static List<Invite> getReceivedInvites(UUID receiverId) {
        return finder.where().eq("receiver_id", receiverId).findList();
    }

    public static List<Invite> checkJoinRequests(UUID senderId, UUID teamId) {
        return finder.where().eq("sender_id", senderId).eq("team_id", teamId)
                .eq("request_type", "Join").findList();
    }

    public static List<Invite> getPlayerNotifications(UUID receiverId) {
        return finder.where().eq("receiver_id", receiverId).eq("answered", false).findList();
    }


    public UUID getId() {
        return id;
    }

    @NotNull
    public Player getSender() {
        return sender;
    }

    @NotNull
    public Player getReceiver() {
        return receiver;
    }

    public boolean isAnswered() {
        return answered;
    }

    public Team getTeam() {
        return team;
    }

    public String getType() {
        return requestType;
    }
}
