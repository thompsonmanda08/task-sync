package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/thompsonmanda08/task-sync/utils"
	"gorm.io/gorm"
)

func RequireGroupPermission(db *gorm.DB, permissions ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Extract userID from context (must be set during authentication)
		userID := c.Locals("userID").(string)

		if userID == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"message": "User is unauthenticated",
				"status":  fiber.StatusUnauthorized,
				"data":    fiber.Map{"error": "unauthenticated user"},
			})
		}

		// Extract group ID from route params: /groups/:group_id/...
		groupID := c.Params("group_id")

		if groupID == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Invalid group ID",
				"status":  fiber.StatusBadRequest,
				"data":    fiber.Map{"error": "A group ID is required to access a group"},
			})
		}

		// Check permission
		for _, perm := range permissions {
			if ok, _ := utils.UserHasPermission(db, userID, (groupID), perm); ok {
				return c.Next()
			}
		}

		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"success": false,
			"message": "Permission denied",
			"status":  fiber.StatusForbidden,
			"data":    fiber.Map{"error": "permission denied"},
		})
	}
}
