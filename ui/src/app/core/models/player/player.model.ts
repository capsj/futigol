export class Player {
  public id: string;
  public name: string;
  public lastName: string;
  public phone: string;
  public location: string;
  public email: string;
  public password: string;
  public position: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.lastName = data.lastName;
    this.phone = data.phone;
    this.location = data.location;
    this.email = data.email;
    this.password = data.password;
    this.position = data.position;
  }

  static empty(): Player {
    return new Player({id: '', name: '', lastName: '', phone: '', location: '', email: '', password: '', position: ''})
  }
}
