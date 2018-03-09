export class PlayerCreate {

    public static empty(): PlayerCreate{
      return new PlayerCreate('', '', '', '', '');
    }

    constructor(public username: string,
                public password: string,
                public email: string,
                public name: string,
                public phone: string,
                ) {}
}
