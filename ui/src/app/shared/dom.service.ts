import { Injectable }       from '@angular/core';

@Injectable()
export class DOMService {
    private _bodyClass: string;

    set bodyClass(value: string) {
        if (!value) {
            value = 'default';
        }
        document.querySelector('body').classList.remove(this._bodyClass);
        document.querySelector('body').classList.add(value);
        this._bodyClass = value;
    }

    public removeBodyClass() {
        document.querySelector('body').classList.remove(this._bodyClass);
        this._bodyClass = 'default';
    }

}
