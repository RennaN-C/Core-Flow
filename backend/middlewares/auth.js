const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  try {
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_senha_secreta_super_segura');

  
    req.user = {
      id: decoded.id,
      tenant_id: decoded.tenant_id,
      role: decoded.role
    };

   
    return next();

  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};
