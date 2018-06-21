import {Player} from "../player/player.model";

export class Team {
  public id: number;
  public name: string;
  public location: Location;
  public size: number;
  public captain: Player;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.location = data.location;
    this.size = Number(data.size);
    this.captain = data.captain;
  }

}
