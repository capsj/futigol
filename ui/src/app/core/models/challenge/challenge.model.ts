import {Team} from "../team/team.model";
import {Time} from "../utils/time.model";
import {DateModel} from "../utils/date.model";

export class Challenge {
  public id: string;
  public sender: Team;
  public receiver: Team;
  public date: DateModel;
  public time: Time;
  public location: string;
  public state: string;

  constructor(data: any) {
    this.id = data.id;
    this.sender = data.sender;
    this.receiver = data.receiver;
    this.date = data.date;
    this.time = data.time;
    this.location = data.location;
    this.state = data.state;
  }

}
