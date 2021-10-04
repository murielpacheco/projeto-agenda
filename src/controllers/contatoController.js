//importando o ContatoModel para poder criar um new Contato
//
const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
  res.render('contato', {
    contato: {}
  });
};

//método register que vamos usar no routes quando contatoController.register
exports.register = async(req, res) => {
  //funções assíncronas precisam estar em um try catch para prevenir erros
  try {
    //criando um novo Contato
    const contato = new Contato(req.body);
    //await para executar o register
    await contato.register();
    
    //if para verificar se há algum erro, caso haja salvar a sessão e redirecionar para página anterior
    if(contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
    //mensagem de flash após cadastrar um contato com sucesso
    req.flash('success', 'Contato registrado com sucesso.');
    //redirecionar para a página com o id do contato como params.body
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    return;
  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const contato = await Contato.buscaPorId(req.params.id);
  if(!contato) return res.render('404');

  res.render('contato', { contato });
};

exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if(contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Contato editado com sucesso.');
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};

exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const contato = await Contato.delete(req.params.id);
  if(!contato) return res.render('404');

  req.flash('success', 'Contato apagado com sucesso.');
  req.session.save(() => res.redirect('back'));
  return;
};
