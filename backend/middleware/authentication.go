package middleware

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/thompsonmanda08/task-sync/utils"
)

var SECRET_KEY = os.Getenv("JWT_SECRET")

var AuthSecretKey = []byte(SECRET_KEY)

// JWTMiddleware is the function that checks for a valid JWT in the Authorization header
func JWTMiddleware(c *fiber.Ctx) error {

	// Get the token from the Authorization header
	authHeader := c.Get("Authorization")

	// Check for missing header
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Missing authorization header",
			"status":  fiber.StatusUnauthorized,
			"data":    fiber.Map{"error": "Authorization header is required"},
		})
	}

	// Expected format: "Bearer <token>"
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Invalid Authorization header format. Expected 'Bearer <token>'",
		})
	}

	// Parse and verify the JWT
	tokenString := parts[1]
	claims, err := utils.ParseJWT(tokenString)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Invalid/Expired Token",
			"status":  fiber.StatusUnauthorized,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	// Store the UserID in Fiber's context for later use in handlers
	c.Locals("userID", claims.UserID)

	// Continue to the next handler
	return c.Next()
}
