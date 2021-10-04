//importando mongoose,validator e bcryptjs
const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

//metodo para definir o que será posto no banco de dados
const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

//criando uma class Login
class Login {
  constructor(body) {
    //definindo o valor inicial das variaveis body, errors, user
    this.body = body;
    this.errors = [];
    this.user = null;
  }
  //método assíncrono para login
  async login() {
    //chamar a func valida
    this.valida();
    //if para prevenir errors
    if(this.errors.length > 0) return;
    //método para evitar de ter mais e 1 email por contato
    this.user = await LoginModel.findOne({ email: this.body.email });
    //if para chamar um erro em um usuario nao existente no login
    if(!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    }
    //if para comparar a senha inserida com a senha do banco de dados
    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      //garantindo o usuer como null
      this.user = null;
      return;
    }
  }
  //método para registrar um usuario
  async register() {
    //chamando a func valida
    this.valida();
    if(this.errors.length > 0) return;

    await this.userExists();

    if(this.errors.length > 0) return;

    //"criptografando" a senha no banco de dados
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }
  //método para verificar se o usuario já existe na hora de criar um novo usuário
  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if(this.user) this.errors.push('Usuário já existe.');
  }

  valida() {
    this.cleanUp();

    // Validação
    // O e-mail precisa ser válido
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    // A senha precisa ter entre 3 e 50
    if(this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }
  //método para deixar '' caso nao for uma string
  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    //definindo dentro do body os parametros email e password
    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;
