export class Category {

    public static from(jsonObject: any): Category {
        if (!jsonObject || !jsonObject.id || !jsonObject.name || !jsonObject.icon) {
            throw new Error('Failed to instantiate User from given jsonObject');
        }
        return new Category(jsonObject.id, jsonObject.name, jsonObject.icon);
    }

    public static empty(): Category{
      return new Category(undefined, '', '');
    }

    constructor(public id: number,
                public name: string,
                public icon: string) {}

}
