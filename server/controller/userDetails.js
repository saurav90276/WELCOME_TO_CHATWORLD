
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function userDetails(request, response) {
  try {
    const authHeader = request.headers.authorization;

    const token =
      request.cookies?.token ||
      (authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : "");

    if (!token) {
      return response.status(401).json({
        message: "Authentication token missing",
        data: null,
        error: true,
      });
    }

    const user = await getUserDetailsFromToken(token);

    if (!user || !user._id) {
      return response.status(401).json({
        message: "Invalid or expired token",
        data: null,
        error: true,
      });
    }

    return response.status(200).json({
      message: "User details fetched successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    console.error("User details error:", error.message);

    return response.status(500).json({
      message: error.message || "Failed to fetch user details",
      error: true,
    });
  }
}

module.exports = userDetails;
