import {isNullOrUndefined} from "util";

export class Admin {

  public searchText: string;
  public static from(jsonObject: any): Admin {
    if (!jsonObject || isNullOrUndefined(jsonObject.id) || !jsonObject.name || !jsonObject.lastName || !jsonObject.password || !jsonObject.fileNumber) {
      throw new Error('Failed to instantiate Admin from given jsonObject');
    }
    return new Admin(jsonObject.id, jsonObject.name, jsonObject.lastName, jsonObject.email, jsonObject.password, jsonObject.fileNumber);
  }

    public static empty(): Admin {
      return new Admin('', '', '', '', '', '');
    }

    constructor(public id: string,
                public name: string,
                public lastName: string,
                public email: string,
                public password: string,
                public fileNumber: string
                ) {
      this.searchText = name + ' ' + lastName;
    }
}
