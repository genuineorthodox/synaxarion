/**
 * Synaxarion
 */
class Synaxarion {

  static locales = ['el','en','de'];
  static dict = {
    synaxarion: {
      el: "Συναξάριον",
      en: "Synaxarion",
      de: "Synaxarion"
    },
    bytheirprayers: {
      el: "Ταῖς αὐτῶν ἁγίαις πρεσβείαις, Χριστὲ ὁ Θεός, ἐλέησον ἡμᾶς. Ἀμήν.",
      en: "Through their holy intercessions, O Christ our God, have mercy on us. Amen.",
      de: "Ob ihrer heiligen Fürbitten, o Christos unser Gott, erbarme dich unser. Amen."
    }
  }
    
  /**
   * 
   * */
  constructor () {

    Object.assign(this, {
      locale: navigator.language.substr(0,2),
      today: new OrthoDate()
    });

    if (Synaxarion.locales.indexOf(this.locale) < 0)
      this.locale = Synaxarion.locales[0];
  }

  url () {
    return [
      '.', this.locale,
      `${this.today.getMonth() + 1}`.padStart(2, '0'),
      `${this.today.getDate()}`.padStart(2, '0')
    ].join('/') + '.json';
  }

  dict (lemma) {
    return Synaxarion.dict[lemma]?.[this.locale];
  }

  /**
   * Fetch JSON with fallback to English
   * */
  async fetch() {

    let app = this;
    let XHR = new XMLHttpRequest();

    return new Promise ((resolve, reject) => {
      XHR.open('GET', app.url(), true);
      XHR.onreadystatechange = function() {
        if (this.readyState === 4)
          if (200 <= this.status && this.status < 400)
            resolve(this.response)
          else
            reject(this.response)
      };
      XHR.send();
    });

  }

}
