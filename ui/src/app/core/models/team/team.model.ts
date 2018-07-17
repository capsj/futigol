import {Player} from "../player/player.model";

export class Team {
  public id: string;
  public name: string;
  public location: string;
  public size: number;
  public captain: Player;


  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.location = data.location;
    this.size = Number(data.size);
    this.captain = data.captain;
  }

  static empty() {
    return new Team({id: '', name: '', location: '', size: 0, captain: Player.empty()})
  }
}
