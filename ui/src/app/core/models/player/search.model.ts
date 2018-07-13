export class SearchModel {
  public name: string;
  public lastName: string;
  public location: string;
  public position: string;

  constructor(data: any) {
    this.name = data.name;
    this.lastName = data.lastName;
    this.location = data.location;
    this.position = data.position;
  }
}
