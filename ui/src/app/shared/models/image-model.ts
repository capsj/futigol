export class Image {

    public static from(jsonObject: any): Image {
        if (!jsonObject || !jsonObject.id || !jsonObject.path) {
            throw new Error('Failed to instantiate User from given jsonObject');
        }
        return new Image(jsonObject.id, jsonObject.path);
    }

    public static empty(): Image{
      return new Image(undefined, '');
    }

    constructor(public id: number,
                public path: string) {}

}
