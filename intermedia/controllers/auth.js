// En auth.js
const { validatorCreateItem } = require('../validators/users'); 
const { handleHttpError } = require('../utils/handleError');
const { sendEmail } = require('../utils/handleEmail');
const User = require('../models/users');
const { encrypt } = require('../utils/handlePassword');

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleHttpError(res, errors.array(), 400);
    }

    const { name, email, password } = req.body;

    try {
        const hashedPassword = await encrypt(password);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            emailVerification: { verificationCode, verified: false }
        });

        await newUser.save();

        // Enviar correo electrónico
        await sendEmail({
            to: email,
            subject: 'Verificación de Email',
            text: `Tu código de verificación es: ${verificationCode}`
        });

        res.status(201).json({ user: { name, email, verified: false }, token: tokenSign(newUser) });
    } catch (error) {
        handleHttpError(res, "Error al crear el usuario", 500);
    }
};


// En auth.js
const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) return handleHttpError(res, "Usuario no encontrado", 404);

      if (user.emailVerification.verificationCode === code) {
          user.emailVerification.verified = true;
          await user.save();
          res.json({ message: "Email verificado con éxito" });
      } else {
          handleHttpError(res, "Código incorrecto", 400);
      }
  } catch (error) {
      handleHttpError(res, "Error al verificar el email", 500);
  }
};

// En auth.js
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await compare(password, user.password))) {
      return handleHttpError(res, "Credenciales incorrectas", 401);
  }

  res.json({ user: { email: user.email, role: user.role }, token: tokenSign(user) });
};

// En users.js
const updateUser = async (req, res) => {
  const { name, age } = req.body;
  const userId = req.user._id; 

  try {
      await User.findByIdAndUpdate(userId, { name, age }, { new: true });
      res.json({ message: "Usuario actualizado" });
  } catch (error) {
      handleHttpError(res, "Error al actualizar el usuario", 500);
  }
};

// En storage.js
const uploadLogo = async (req, res) => {
  const userId = req.user._id;
  const logoUrl = await uploadToPinata(req.file.buffer, req.file.originalname); 

  await User.findByIdAndUpdate(userId, { logo: logoUrl }, { new: true });
  res.json({ message: "Logo actualizado", logoUrl });
};
