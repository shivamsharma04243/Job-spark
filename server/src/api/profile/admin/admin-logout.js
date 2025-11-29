const adminLogout = (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Admin logged out successfully'
  });
};

module.exports = adminLogout;