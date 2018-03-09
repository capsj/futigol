export class User {

    public static from(jsonObject: any): User {
        if (!jsonObject || !jsonObject.id || !jsonObject.name || !jsonObject.username) {
            throw new Error('Failed to instantiate User from given jsonObject');
        }
        return new User(jsonObject.id, jsonObject.name, jsonObject.username);
    }

    constructor(public id: number,
                public name: string,
                public username: string) {}

}
