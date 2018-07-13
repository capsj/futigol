package models.ebean;

import com.avaje.ebean.Expr;
import com.avaje.ebean.ExpressionList;
import com.avaje.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;
import java.util.Optional;

@Entity
public class TeamPlayer extends Model {

    @Id
    private Long id;
    @ManyToOne
    private Player player;
    @ManyToOne
    private Team team;
    private boolean isCaptain;

    private static Finder<Long, TeamPlayer> finder = new Finder<>(TeamPlayer.class);

    public TeamPlayer(Long id, Player player, Team team, boolean isCaptain) {
        this.id = id;
        this.player = player;
        this.team = team;
        this.isCaptain = isCaptain;
    }

    public static List<TeamPlayer> getTeamPlayers(Long teamId) {
        return finder.where().eq("team_id", teamId).findList();
    }

    public static List<TeamPlayer> getPlayerTeams(Long playerId) {
        return finder.where().eq("player_id", playerId).findList();
    }

    public static Optional<TeamPlayer> getTeamCaptain(Long teamId) {
        TeamPlayer teamPlayer = finder.where().eq("team_id", teamId).eq("team_captain", true).findUnique();
        if(teamPlayer != null) {
            return Optional.of(teamPlayer);
        } else return Optional.empty();
    }

    public Long getId() {
        return id;
    }

    public Player getPlayer() {
        return player;
    }

    public Team getTeam() {
        return team;
    }

    public boolean isCaptain() {
        return isCaptain;
    }
}
