function setConfig() {
  return {
    environment: process.env.NODE_ENV || 'development',
    server: {
      PORT: 3002,
    },
  };
}

export default setConfig;
