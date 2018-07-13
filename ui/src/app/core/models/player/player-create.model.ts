export class PlayerCreate {
  public name: string;
  public lastName: string;
  public phone: string;
  public location: string;
  public email: string;
  public password: string;
  public position: string;

  constructor(data: any) {
    this.name = data.name;
    this.lastName = data.lastName;
    this.phone = data.phone;
    this.location = data.location;
    this.email = data.email;
    this.password = data.password;
    this.position = data.position;
  }
}
