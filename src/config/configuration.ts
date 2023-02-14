export default function () {
  return {
    port: parseInt(process.env.API_PORT, 10) || 3000,
    mode: process.env.NODE_ENV,
    allowUserSelfRegistration: process.env.ALLOW_USER_SELF_REGISTRATION,
    database: {
      driver: process.env.DB_DRIVER || 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
      disableOrmSync: process.env.DISABLE_ORM_SYNC || false,
    },
    tokens: {
      accessToken: {
        secret: process.env.JWT_SECRET,
        duration: process.env.JWT_DURATION || '2m',
      },
      refreshToken: {
        secret: process.env.REFRESH_TOKEN_SECRET,
        duration: process.env.REFRESH_TOKEN_DURATION || '1h',
      },
    },
  };
}
