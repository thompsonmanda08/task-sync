package handlers

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/thompsonmanda08/task-sync/database"
	"github.com/thompsonmanda08/task-sync/models"
	"github.com/thompsonmanda08/task-sync/utils"
	"gorm.io/gorm"
)

// CreateNewGroup is a handler for the "/groups" route that creates a new group.
// The name of the group is required in the request body.
// The OwnerID of the group is set to the ID of the authenticated user.
// If the group is created successfully, the handler returns a JSON response with
// a status code of 201 and the created group in the response body.
// If there is an error while creating the group, the handler returns a JSON response
// with a status code of 500 and the error message in the response body.
func CreateNewGroup(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)

	group := new(models.Group)
	var request struct {
		Name        string `json:"name" validate:"required"`
		Description string `json:"description,omitempty"`
	}

	if err := c.BodyParser(&request); err != nil {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err)
	}

	if request.Name == "" {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Group Name is required", errors.New("group name cannot be empty"))
	}

	// 1. Find the "owner" role ID
	var ownerRole models.Role

	if err := db.Where("name = ?", "Owner").First(&ownerRole).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Owner role not found in database. Please seed roles.", err)
		}
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to retrieve owner role", err)
	}

	group.OwnerID = userID
	group.Name = request.Name
	group.Description = request.Description

	// Start a transaction for atomicity
	tx := db.Begin()

	if tx.Error != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to start transaction", tx.Error)
	}

	// 2. Create the Group
	if err := tx.Create(&group).Error; err != nil {
		tx.Rollback()
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to create Group", err)
	}

	// 3. Create the UserGroupRoleMapping entry for the owner
	userGroupRoleMapping := models.UserGroupRoleMapping{
		UserID:  userID,
		GroupID: group.ID,     // Use the ID of the newly created group
		RoleID:  ownerRole.ID, // Use the ID of the "owner" role
	}

	if err := tx.Create(&userGroupRoleMapping).Error; err != nil {
		tx.Rollback()
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to map user to owner role for group", err)
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to commit transaction", err)
	}

	response := models.GroupMinimal{
		ID:          group.ID,
		Name:        group.Name,
		Description: group.Description,
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "New Group created successfully",
		"data":    response,
		"status":  fiber.StatusCreated,
	})
}

// GetUserGroups is a handler for the "/groups" route that retrieves all groups
// for the authenticated user. The groups are fetched from the database and
// returned in the response body in JSON format. The handler returns a JSON
// response with a status code of 200 if the groups are retrieved successfully.
// If there is an error while retrieving the groups, the handler returns a JSON
// response with a status code of 500 and the error message in the response body.
func GetUserGroups(c *fiber.Ctx) error {

	db := database.DBConn
	userID := c.Locals("userID").(string) // Get userID from JWT middleware

	var groups []models.Group

	// Get all groups for the user
	if err := db.Preload("GroupMembers", func(db *gorm.DB) *gorm.DB {
		return db.Select("group_id") // Only select the foreign key for counting
	}).Preload("TodoLists", func(db *gorm.DB) *gorm.DB {
		return db.Select("group_id") // Only select the foreign key for counting
	}).Preload("Owner", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "name", "email")
	}).Where("owner_id = ?", userID).Find(&groups).Error; err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to get user groups", err)

	}

	response := make([]models.GroupResponse, len(groups))

	for i, group := range groups {
		// ADD GROUPS TO RESPONSE FOR EACH GROUP ITEM AT INDEX i
		response[i] = models.GroupResponse{
			ID:            group.ID,
			Name:          group.Name,
			Description:   group.Description,
			MembersCount:  len(group.GroupMembers),
			TodoListCount: len(*group.TodoLists),
			Owner: &models.UserMinimal{
				ID:    group.Owner.ID,
				Name:  group.Name,
				Email: group.Owner.Email,
			},
			// OwnerID:       group.OwnerID,
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "User groups retrieved successfully",
		"data":    response,
		"status":  fiber.StatusOK,
	})
}

// GetUserGroup retrieves a specific group by ID for the authenticated user.
// It fetches the userID from the context and queries the database for a group
// associated with that user and the provided ID. If the group is not found or
// not owned by the user, it responds with a 404 Not Found status code. In case
// of any error during the database query, it responds with an appropriate error
// message and status code. On successful retrieval, it returns the group details
// in the response.

func GetUserGroupDetails(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string) // Get userID from JWT middleware
	groupID := c.Params("group_id")

	if groupID == "" {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid Group ID", errors.New("missing required parameter: group_id"))

	}

	var group models.Group

	// Get the group details
	if err := db.Preload("UserGroupRoleMappings.User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, name, email")
	}).Preload("UserGroupRoleMappings.Role", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, name")
	}).Preload("TodoLists", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "name", "group_id")
	}).Preload("Owner", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "name", "email")
	}).Where("id = ? AND owner_id = ?", groupID, userID).First(&group).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return utils.SendErrorResponse(c, fiber.StatusNotFound, "Group not found", err)
		}

		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to get group details", err)
	}

	var groupMembers []models.UserMinimal
	for _, mapping := range group.UserGroupRoleMappings {
		// Ensure that the User and Role objects were successfully preloaded
		if mapping.User.ID != "" && mapping.Role.ID != "" {
			groupMembers = append(groupMembers, models.UserMinimal{
				ID:        mapping.User.ID,
				Name:      mapping.User.Name,
				Email:     mapping.User.Email,
				GroupRole: mapping.Role.Name, // This is where we get the role name from the preloaded Role
			})
		}
	}

	var todoLists = make([]models.TodoListResponse, 0, len(*group.TodoLists))
	for _, todoList := range *group.TodoLists {
		todoLists = append(todoLists, models.TodoListResponse{
			ID:   todoList.ID,
			Name: todoList.Name,
		})
	}

	response := models.GroupResponse{
		ID:            group.ID,
		Name:          group.Name,
		Description:   group.Description,
		GroupMembers:  groupMembers,
		MembersCount:  len(groupMembers),
		TodoLists:     &todoLists,
		TodoListCount: len(todoLists),
		Owner: &models.UserMinimal{
			ID:    group.Owner.ID,
			Name:  group.Owner.Name,
			Email: group.Owner.Email,
		},
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Group details retrieved successfully",
		"data":    response,
		"status":  fiber.StatusOK,
	})
}

// UpdateUserGroup updates an existing group for the authenticated user.
// It retrieves the userID from the context and the group ID from the URL parameters.
// The request body is parsed to update the group details. If the group ID is invalid
// or not found, it responds with a 404 Not Found status. In case the request body
// cannot be parsed or any error occurs during the database operation, it responds
// with an appropriate error message and status code. On successful update, it
// returns the updated group details in the response.

func UpdateUserGroup(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)
	groupID := c.Params("group_id")

	if groupID == "" {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid Group ID", errors.New("missing required parameter: group_id"))

	}

	var request struct {
		Name        string `json:"name,omitempty"`
		Description string `json:"description,omitempty"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Failed to parse request body",
			"data":    fiber.Map{"error": err.Error()},
			"status":  fiber.StatusBadRequest,
		})
	}

	var group models.Group

	if err := db.Where("id = ? AND owner_id = ?", groupID, userID).First(&group).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "Group not found or not owned by user",
				"data":    fiber.Map{"error": "Group not found"},
				"status":  fiber.StatusNotFound,
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to update group details",
			"data":    fiber.Map{"error": err.Error()},
			"status":  fiber.StatusInternalServerError,
		})
	}

	if err := db.Model(&group).Updates(request).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to update group details",
			"data":    fiber.Map{"error": err.Error()},
			"status":  fiber.StatusInternalServerError,
		})
	}

	var groupMembers []models.UserMinimal
	for _, mapping := range group.UserGroupRoleMappings {
		// Ensure that the User and Role objects were successfully preloaded
		if mapping.User.ID != "" && mapping.Role.ID != "" {
			groupMembers = append(groupMembers, models.UserMinimal{
				ID:        mapping.User.ID,
				Name:      mapping.User.Name,
				Email:     mapping.User.Email,
				GroupRole: mapping.Role.Name, // This is where we get the role name from the preloaded Role
			})
		}
	}

	response := models.GroupResponse{
		ID:            group.ID,
		Name:          group.Name,
		Description:   group.Description,
		GroupMembers:  groupMembers,
		MembersCount:  len(group.GroupMembers),
		TodoListCount: len(*group.TodoLists),
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Group updated successfully",
		"data":    response,
		"status":  fiber.StatusOK,
	})
}

// DeleteGroup deletes an existing group for the authenticated user.
// It retrieves the userID from the context and the group ID from the URL parameters.
// If the group ID is invalid or not found, it responds with a 404 Not Found status.
// In case any error occurs during the database operation, it responds with an
// appropriate error message and status code. On successful deletion, it returns
// the deleted group ID in the response.
func DeleteGroup(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string) // Get userID from JWT middleware
	groupID := c.Params("group_id")

	if groupID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid Group ID",
			"data": fiber.Map{
				"error": "Missing required parameter: group_id",
			},
			"status": fiber.StatusBadRequest,
		})
	}

	var group models.Group

	if err := db.Where("id = ? AND owner_id = ?", groupID, userID).First(&group).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "Group not found or not owned by user",
				"data": fiber.Map{
					"error": "Group not found",
				},
				"status": fiber.StatusNotFound,
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to delete group",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	if err := db.Delete(&group).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to delete group",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Group deleted successfully",
		"data": fiber.Map{
			"group_id": groupID,
		},
		"status": fiber.StatusOK,
	})
}

// InviteUser invites a user to join a group. The user ID of the invitee is required in the request body.
// The group ID is obtained from the URL parameters. If the group ID is invalid, not found, or not owned by the user,
// the handler responds with a 404 Not Found status. If the invitee user ID is invalid or not found, the handler responds
// with a 400 Bad Request status. On successful invitation, the handler returns the invitee user ID and the group ID
// in the response.
func InviteUser(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string) // Get userID from JWT middleware
	groupID := c.Params("group_id")

	if groupID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid Group ID",
			"data": fiber.Map{
				"error": "Missing required parameter: group_id",
			},
			"status": fiber.StatusBadRequest,
		})
	}

	var group models.Group

	if err := db.Where("id = ? AND owner_id = ?", groupID, userID).First(&group).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "Group not found or not owned by user",
				"data": fiber.Map{
					"error": "Group not found",
				},
				"status": fiber.StatusNotFound,
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to invite user to group",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	var invitee models.User

	if err := c.BodyParser(&invitee); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusBadRequest,
		})
	}

	if invitee.ID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invitee User ID is required",
			"data": fiber.Map{
				"error": "Invitee User ID cannot be empty",
			},
			"status": fiber.StatusBadRequest,
		})
	}

	userRoleMapping := models.UserGroupRoleMapping{
		UserID:  invitee.ID,
		GroupID: groupID,
		RoleID:  "default_role_id", // Replace with actual role ID or logic to assign a role
	}
	if err := db.Create(&userRoleMapping).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to invite user to group",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "User invited to group successfully",
		"data": fiber.Map{
			"invitee_id": invitee.ID,
			"group_id":   groupID,
		},
		"status": fiber.StatusOK,
	})
}

// GetUserGroupRole retrieves the user group role mapping of a user in a group by group ID and user ID.
// It responds with a 404 Not Found status if the user group role mapping is not found.
// On successful retrieval, the handler returns the user group role mapping in the response.
func GetUserGroupRole(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string) // Get userID from JWT middleware
	groupID := c.Params("group_id")

	var userGroupRole models.UserGroupRoleMapping

	// Get the user group role mapping
	if err := db.Where("user_id = ? AND group_id = ?", userID, groupID).First(&userGroupRole).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "User group role mapping not found",
				"data": fiber.Map{
					"error": err.Error(),
				},
				"status": fiber.StatusNotFound,
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to get user group role mapping",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "User group role mapping retrieved successfully",
		"data":    userGroupRole,
		"status":  fiber.StatusOK,
	})

}
