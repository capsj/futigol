export class Video {

    public static from(jsonObject: any): Video {
        if (!jsonObject || !jsonObject.id || !jsonObject.url) {
            throw new Error('Failed to instantiate User from given jsonObject');
        }
        return new Video(jsonObject.id, jsonObject.url);
    }

    public static empty(): Video{
      return new Video(undefined, '');
    }

    constructor(public id: number,
                public url: string) {}

}
