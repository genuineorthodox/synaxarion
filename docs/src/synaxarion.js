/**
 * Synaxarion
 */
class Synaxarion {

  static locales = ['el','en','de'];
  static dict = {
    bytheirprayers: {
      el: "Ταῖς αὐτῶν ἁγίαις πρεσβείαις, Χριστὲ ὁ Θεός, ἐλέησον ἡμᾶς. Ἀμήν.",
      en: "Through their holy intercessions, O Christ our God, have mercy on us. Amen.",
      de: "Ob ihrer heiligen Fürbitten, o Christos unser Gott, erbarme dich unser. Amen."
    },
    irmos: {
      el: "Εἱρμός",
      en: "Irmos",
      de: "Irmos"
    },
    ode: {
      el: "ᾨδή",
      en: "Ode",
      de: "Ode"
    },
    synaxarion: {
      el: "Συναξάριον",
      en: "Synaxarion",
      de: "Synaxarion"
    },
    theotokion: {
      el: "Θεοτοκίον",
      en: "Theotokion",
      de: "Theotokion"
    }
  }
    
  constructor () {
    Object.assign(this, {
      locale: navigator.language.substr(0,2),
      today: new OrthoDate()
    });

    if (Synaxarion.locales.indexOf(this.locale) < 0)
      this.locale = Synaxarion.locales[0];

    this.enstage();
  }

  enstage () {
    const synaxarion = this;
    const pre = document.body.querySelector('pre');
    const dl = document.body.querySelector('dl');
    const i18nf = document.forms.i18n;

    if (i18nf.locale)
      i18nf.removeChild(i18nf.locale);

    const i18n = i18nf.appendChild(
      document.createElement('select')
    );

    i18n.name = 'locale';

    Synaxarion.locales.forEach(
      locale => {
        let opt = i18n.appendChild(
          document.createElement('option')
        );
        opt.innerText = locale;
        opt.selected = locale == synaxarion.locale;
      }
    );

    i18n.addEventListener('change', (e) => {
      synaxarion.setLocale(e.srcElement.value);
    }, false);

    synaxarion.fetch().then( r => {
      while (dl.firstChild)
        dl.removeChild(dl.firstChild);

      let data = JSON.parse(r);

      data.filter(
        entry => entry.hasOwnProperty('who')
      ).forEach( entry => {
        dl.appendChild(
          document.createElement('dt')
        ).innerText = entry.who;

        let dd = dl.appendChild(
          document.createElement('dd')
        );

        dd.appendChild(
          document.createElement('i')
        ).innerText = `${entry.intro}`;

        if (entry.hasOwnProperty('sticharion')) {
          dd.appendChild(document.createElement('br'));
          dd.appendChild(
            document.createElement('b')
          ).innerHTML = `${entry.sticharion.replace(/\h*\/\h*/g, '<br/>')}`;
        }
      });

      dl.appendChild(
        document.createElement('dt')
      ).innerText = synaxarion.dict('bytheirprayers');

      data.filter(
        ode => ode.hasOwnProperty('verses')
      ).forEach( ode => {
        dl.appendChild(
          document.createElement('dt')
        ).innerText = `${synaxarion.dict('ode')} ${ode.ode} (${ode.tune})`;

        let dd;
        ode.verses.forEach( verse => {
          dd = dl.appendChild(document.createElement('dd'));
          dd.innerText = verse;
        });

        if (ode.hasOwnProperty('theotokion'))
          dl.appendChild(document.createElement('dd')).innerHTML =
            `(${synaxarion.dict('theotokion')})<br/>${ode.theotokion}`;

        if (ode.hasOwnProperty('irmos'))
          dl.appendChild(document.createElement('dd')).innerHTML =
            `(${synaxarion.dict('irmos')})<br/>${ode.irmos}`;
        
      });
    });

    document.querySelectorAll('*[data-i18n]').forEach(
      i18node => i18node.innerText = synaxarion.dict(
        i18node.getAttribute('data-i18n')
      )
    );
  }

  setLocale (locale = 'en') {
    synaxarion.locale = locale;
    synaxarion.enstage();
  }

  url () {
    return [
      '.', this.locale,
      `${this.today.getMonth() + 1}`.padStart(2, '0'),
      `${this.today.getDate()}`.padStart(2, '0')
    ].join('/') + '.json';
  }

  dict (lemma) {
    return Synaxarion.dict[lemma]?.[
      this.locale
    ] ?? this.today.toLocaleDateString(
      this.locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );
  }

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
