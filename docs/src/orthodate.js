/**
 * 
 * 
 * */

class OrthoDate extends Date {

  constructor () {
    Object.assign(
      super(...arguments), {
        secular: new Date(...arguments)
      }
    ).fit();

    return new Proxy(this, {
      get(self, prop) {
        const value = self[prop];
        
        if (typeof value === 'function' && prop.startsWith('set')) {
          return function(...args) {
            self.secular[prop](...args);
            return self.fit();
          };
        }
        
        return typeof value === 'function' ? value.bind(self) : value;
      }
    });
  }

  fit() {
    const year     = this.secular.getFullYear();
    const century  = parseInt(year / 100);
    const delta    = parseInt(century - ( century / 4 ) - 2);

    this.setDate ( this.secular.getDate() - delta ) ;

    return this;
  }

  adjustWeekday (string, locale = 'en-en') {
    for (let type of ['long', 'short'])
      string = string.replace(
        Date.prototype.toLocaleDateString.call(
          this, locale, { weekday: type }
        ),
        this.secular.toLocaleDateString(
          locale, { weekday: type }
        )
      );

    return string;
  }

  pascha () {
    const year = this.getFullYear();
    const a = year % 4;
    const b = year % 7;
    const c = year % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;
    
    return [day, month, year];
  }

  toLocaleDateString () {
    return this.adjustWeekday(
      Date.prototype.toLocaleDateString.call(
        this, ...arguments
      ), [...arguments][0]
    );
  }

  toString() {
    return this.adjustWeekday(
        Date.prototype.toString.call(this)
    );
  }

  addDays ( numberOfDays ) {
    this.secular.setDate(this.secular.getDate() + numberOfDays);
    return this.fit();
  }
}