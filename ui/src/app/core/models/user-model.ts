export class User {

    public static from(jsonObject: any): User {
        if (!jsonObject || !jsonObject.id || !jsonObject.name || !jsonObject.email || !jsonObject.userType) {
            throw new Error('Failed to instantiate User from given jsonObject');
        }
        return new User(jsonObject.id, jsonObject.name, jsonObject.email, jsonObject.userType);
    }

    constructor(public id: string,
                public name: string,
                public email: string,
                public userType: string) {}

}
