export const getUserIdMiddleware = (req, res, next) => {
    // Extract user ID from query parameter (for simulation purposes)
    // tryed to use for some fake authentication
    const userId = req.query.userId;
    req.userId = userId;
    // If userId is not provided in the query parameter, you can generate a mock user ID
    // if (!userId) {
    //   req.user = { id: 'mockUserId' };
    // } else {
    //   req.user = { id: userId };
    // }
  
    next();
  };

  export default getUserIdMiddleware;