import {Image} from "./image-model";
import {DateModel} from "./date-model";

export class Supplier {

    public static from(jsonObject: any): Supplier {
        if (!jsonObject || !jsonObject.id || !jsonObject.name || !jsonObject.username || !jsonObject.password || !jsonObject.email || !jsonObject.mainImage || !jsonObject.rating || !jsonObject.joinDate || !jsonObject.description) {
            throw new Error('Failed to instantiate User from given jsonObject');
        }
        return new Supplier(jsonObject.id, jsonObject.name, jsonObject.username, jsonObject.password, jsonObject.email, jsonObject.mainImage, jsonObject.rating, jsonObject.joinDate, jsonObject.description);
    }

    public static empty(): Supplier{
      return new Supplier(undefined, '', '', '', '', Image.empty(), undefined, DateModel.empty(),
        '');
    }

    constructor(public id: number,
                public name: string,
                public username: string,
                public password: string,
                public email: string,
                public mainImage: Image,
                public rating: number,
                public joinDate: DateModel,
                public description: string,
                ) {}
}
