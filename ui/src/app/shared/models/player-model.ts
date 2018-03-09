export class Player {

    public static from(jsonObject: any): Player {
        if (!jsonObject || !jsonObject.id || !jsonObject.username || !jsonObject.password || !jsonObject.email || !jsonObject.name || !jsonObject.phone) {
            throw new Error('Failed to instantiate User from given jsonObject');
        }
        return new Player(jsonObject.id, jsonObject.username, jsonObject.password, jsonObject.email, jsonObject.name, jsonObject.phone);
    }

    public static empty(): Player{
      return new Player(undefined, '', '', '', '', '');
    }

    constructor(public id: number,
                public username: string,
                public password: string,
                public email: string,
                public name: string,
                public phone: string,
                ) {}
}
