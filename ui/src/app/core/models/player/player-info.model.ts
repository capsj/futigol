import {Team} from "../team/team.model";

export class PlayerInfo {
  public id: string;
  public name: string;
  public lastName: string;
  public phone: string;
  public location: string;
  public email: string;
  public position: string;
  public teams: Team[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.lastName = data.lastName;
    this.phone = data.phone;
    this.location = data.location;
    this.email = data.email;
    this.position = data.position;
    this.teams = data.teams;
  }
}
