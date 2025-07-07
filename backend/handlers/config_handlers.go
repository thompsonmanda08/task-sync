package handlers

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/thompsonmanda08/task-sync/database"
	"github.com/thompsonmanda08/task-sync/models"
	"github.com/thompsonmanda08/task-sync/utils"
	"gorm.io/gorm"
)

func GetRoles(c *fiber.Ctx) error {
	db := database.DBConn

	var roles []models.Role

	// Get all roles and permissions
	if err := db.Preload("Permissions", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "name")
	}).Find(&roles).Select("id", "name").Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to get roles & permissions",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Roles retrieved successfully",
		"data":    roles,
		"status":  fiber.StatusOK,
	})
}

// GetRoleDetails retrieves a role by ID and returns its name and a list of permission names.
func GetRoleDetails(c *fiber.Ctx) error {
	db := database.DBConn
	roleID := c.Params("role_id") // Assuming the role ID comes from the URL parameters

	if roleID == "" {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid Role ID", errors.New("missing required parameter: role_id"))
	}

	var role models.Role

	// Preload the Permissions association
	// We can also select specific fields for permissions if needed:
	// .Preload("Permissions", func(db *gorm.DB) *gorm.DB {
	// 	return db.Select("id", "name") // Only select ID and Name from permissions
	// })
	if err := db.Preload("Permissions").Where("id = ?", roleID).First(&role).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return utils.SendErrorResponse(c, fiber.StatusNotFound, "Role not found", err)
		}
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to get role details", err)
	}

	// Extract permission names into a slice of strings
	var permissionNames []string
	for _, perm := range role.Permissions {
		permissionNames = append(permissionNames, perm.Name)
	}

	// Construct the response object
	response := models.RoleResponse{
		ID:          role.ID,
		Name:        role.Name,
		Permissions: permissionNames,
		CreatedAt:   role.CreatedAt,
		UpdatedAt:   role.UpdatedAt,
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Role details retrieved successfully",
		"data":    response,
		"status":  fiber.StatusOK,
	})
}

func CreateUserRoleMapping(c *fiber.Ctx) error {
	db := database.DBConn

	var request struct {
		RoleID  string `json:"role_id" validate:"required"`
		UserID  string `json:"user_id" validate:"required"`
		GroupID string `json:"group_id" validate:"required"`
	}

	if err := c.BodyParser(&request); err != nil {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err)
	}

	// Start a transaction for atomicity
	tx := db.Begin()

	if tx.Error != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to start transaction", tx.Error)
	}

	userGroupRoleMapping := models.UserGroupRoleMapping{
		UserID:  request.UserID,
		GroupID: request.GroupID, // Use the ID of the newly created group
		RoleID:  request.RoleID,  // Use the ID of the role
	}

	if err := tx.Create(&userGroupRoleMapping).Error; err != nil {
		tx.Rollback()
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to map user to owner role for group", err)
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to commit transaction", err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Role mapped successfully",
		"data":    userGroupRoleMapping,
		"status":  fiber.StatusOK,
	})
}
