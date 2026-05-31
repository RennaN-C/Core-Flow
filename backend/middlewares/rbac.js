const requireRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Você não possui permissão para esta operação.' });
  }

  return next();
};

module.exports = { requireRoles };
