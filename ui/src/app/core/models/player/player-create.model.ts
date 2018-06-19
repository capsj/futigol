export class PlayerCreate {
  public name: string;
  public phone: string;
  public email: string;
  public password: string;

  constructor(data: any) {
    this.name = data.name;
    this.phone = data.phone;
    this.email = data.email;
    this.password = data.password;
  }
}
