import {Player} from "../player/player.model";
import {Team} from "../team/team.model";

export class Invite {
  public id: string;
  public sender: Player;
  public receiver: Player;
  public team: Team;
  public answered: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.sender = data.sender;
    this.receiver = data.receiver;
    this.team = data.team;
    this.answered = data.answered;
  }

}
