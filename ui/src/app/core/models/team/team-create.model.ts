export class TeamCreate {
  public name: string;
  public location: string;
  public size: number;

  constructor(data: any) {
    this.name = data.name;
    this.location = data.location;
    this.size = Number(data.size);
  }
}
