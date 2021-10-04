const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  //se tiver um user logado renderiza a pagina como logged in
  if (req.session.user) return res.render('login-logado');
  return res.render('login');
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('back');
      });
      return;
    }

    req.flash('success', 'Seu usuário foi criado com sucesso.');
    req.session.save(function () {
      return res.redirect('back');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.login = async function (req, res) {
  try {
    //criando um login com a class Login
    const login = new Login(req.body);
    //chamando o método login()
    await login.login();

    //check para saber se há algum erro para impedir o login
    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('back');
      });
      return;
    }
    //mensagem de sucesso
    req.flash('success', 'Você entrou no sistema.');
    //criando uma sessão para o usuário especifíco
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect('back');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect('/');
};
