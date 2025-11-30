async function  logout(req, res) {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    // Clear cookie by using clearCookie with same options used when setting it
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });

    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('Logout error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = logout;
