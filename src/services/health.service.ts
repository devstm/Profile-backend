/**
 * Health service for checking application health
 */
const healthService = {
  /**
   * Get health status of the application
   * @returns Health status object
   */
  getHealth: async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'Server is healthy'
    };
  }
};

export { healthService };
