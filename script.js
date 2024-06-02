class PasswordGen {

  constructor() {

    this.length = this.constructor.default_length;
    this.keyspace = '';

    this.generateKeyspace();
  }

  static get minimum_length() {
    return 8;
  }

  static get maximum_random_integer() {
    return 256;
  }

  static get default_length() {
    return 16;
  }

  static get default_sets() {
    return 'luns';
  }

  static get lowercase_letters() {
    return 'abcdefghijklmnopqrstuvwxyz';
  }

  static get uppercase_letters() {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  static get numbers() {
    return '1234567890';
  }

  static get special_characters() {
    return '!@#$%&*?,./|[]{}()';
  }

  static get whitespace() {
    return ' ';
  }

  static get character_sets() {
    return {
      'l': this.lowercase_letters,
      'u': this.uppercase_letters,
      'n': this.numbers,
      's': this.special_characters,
      'w': this.whitespace
    };

  }

  static arrayKeySearch(needles, haystack) {
    let i = 0, length = needles.length;

    while (i < length) {
      for (let item in haystack) {
        if (needles[i] === item) {
          return true;
        }
      }

      i++;
    }

    return false;
  }

  static randomInteger(min, max) {
    if (max < this.maximum_random_integer) {
      let crypto = window.crypto || window.msCrypto;
      let byteArray = new Uint8Array(1);
      crypto.getRandomValues(byteArray);

      let range = max - min + 1;

      if (
        byteArray[0] >=

        Math.floor(this.maximum_random_integer / range) * range) {
        return this.randomInteger(min, max);
      }

      return min + byteArray[0] % range;
    } else {
      throw `Sorry the maximum is too large\n` +
      `The maximum size is ${this.maximum_random_integer}\n`;
    }
  }

  setLength(value = 0) {
    if (
      value === parseInt(value) &&

      value >= this.constructor.minimum_length) {
      this.length = value;
    }

    return this;
  }

  setKeyspace(keyspace = '') {
    if (typeof keyspace === 'string' && keyspace !== '') {
      if (keyspace.length < this.constructor.maximum_random_integer) {
        this.keyspace = keyspace;
      } else {
        console.log(`The keyspace is too long, falling back to default`);
      }
    }

    return this;
  }

  generateKeyspace(sets = this.constructor.default_sets) {
    this.keyspace = '';

    if (
      typeof sets === 'string' &&

      this.constructor.arrayKeySearch(
        sets.split(''), this.constructor.character_sets)) {

      for (let set in sets.split('')) {
        this.keyspace += this.constructor.character_sets[
          sets[set]];

      }
    } else {
      for (let set in this.constructor.default_sets.split('')) {
        this.keyspace += this.constructor.character_sets[
          this.constructor.default_sets[set]];

      }
    }

    if (this.keyspace.length > this.constructor.maximum_random_integer) {
      console.log(`The keyspace is too long, falling back to default`);
      this.generateKeyspace();
    }

    return this;
  }

  generatePassword() {
    let password = '';

    for (let i = 0; i < this.length; i++) {
      password += this.keyspace.split('')[
        this.constructor.randomInteger(0, this.keyspace.length - 1)];

    }

    return password;
  }

  get password() {
    return this.generatePassword();
  }
}

(function ($) {
  $(function () {
    let gen = new PasswordGen();

    let passwordElement = $('.password');
    passwordElement.text(gen.password);

    $('select').select2();

    let fields = $('.field_input');
    fields.on('input change', function (e) {
      fields.each(function () {
        let field = $(this);

        if (field.attr('name') === 'length') {
          gen.setLength(parseInt(field.val()));
        }

        if (field.attr('name') === 'set_keyspace') {
          gen.setKeyspace(field.val());
        }

        if (field.attr('name') === 'generate_keyspace') {
          gen.generateKeyspace(field.val().join(''));
        }
      });

      passwordElement.text(gen.password);
    });

    $('#regenerate').on('click', function (e) {
      passwordElement.text(gen.password);
    });

    document.addEventListener('keyup', function (e) {
      if (e.which === 13) {
        passwordElement.text(gen.password);
      }
    });

    $('.password').on('click', function (e) {
      let rng, sel;

      if (document.body.createTextRange) {
        rng = document.body.createTextRange();
        rng.moveToElementText(e.target);
        rng.select();
      } else if (window.getSelection) {
        sel = window.getSelection();
        rng = document.createRange();
        rng.selectNodeContents(e.target);
        sel.removeAllRanges();
        sel.addRange(rng);
      }
    });
  });
})(jQuery);