const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");

function signUp(req, res) {
  const user = new User();

  //console.log(req.body)
  const { name, lastname,email, password, repeatPassword } = req.body;
  user.name=name;
  user.lastname=lastname;
  user.email = email;
  user.role = "admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Las contraseñas son obligatorias" });
  } else {
    if (password !== repeatPassword) {
      res
        .status(404)
        .send({ message: "Las contraseñas tienen que ser iguales" });
    } else {
      //res.status(200).send({message:"Usuario creado"})
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
          res.statur(500).send({ message: "Error al encriptar la contraseña" });
        } else {
          //res.status(200).send({ message: hash });
          user.password = hash;
          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: err });
            } else {
              if (!userStored) {
                res.status(400).send({ message: "Error al crear al usuario" });
              } else {
                res.status(200).send({ user: userStored });
              }
            }
          });
        }
      });
    }
  }
}

module.exports = {
  signUp,
};
