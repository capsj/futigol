export class UserCredentials {

    public static empty(): UserCredentials {
        return new UserCredentials('', '');
    }

    constructor(private _email: string, private _password: string) {}

    get email(): string { return this._email; }
    set email(value: string) { this._email = value; }

    get password(): string { return this._password; }
    set password(value: string) { this._password = value; }

    public asJson() {
        return {
            email: this._email,
            password: this._password,
        };
    }

    public asJsonString(): string {
        return JSON.stringify(this.asJson());
    }

}
