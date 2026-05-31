const { requireRoles } = require('../middlewares/rbac');

const response = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test('RBAC permite cargo autorizado', () => {
  const next = jest.fn();
  requireRoles('admin')({ user: { role: 'admin' } }, response(), next);
  expect(next).toHaveBeenCalled();
});

test('RBAC bloqueia cargo sem permissão', () => {
  const res = response();
  requireRoles('admin')({ user: { role: 'staff' } }, res, jest.fn());
  expect(res.status).toHaveBeenCalledWith(403);
});
