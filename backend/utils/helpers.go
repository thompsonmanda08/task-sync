package utils

import (
	"errors"
	"fmt"
	"strings"
	"unicode"

	"github.com/gofiber/fiber/v2"
	"github.com/lucsky/cuid"
	"github.com/thompsonmanda08/task-sync/models"
	"gorm.io/gorm"
)

func UserHasPermission(db *gorm.DB, userID string, groupID string, requiredPerm string) (bool, error) {
	var mapping models.UserGroupRoleMapping

	// 1. Find the UserGroupRoleMapping for the given user and group
	err := db.Where("user_id = ? AND group_id = ?", userID, groupID).First(&mapping).Error
	if err != nil {
		// If no mapping is found (e.g., user is not a member of the group), it's not an error
		// for the function's purpose, but means no permission.
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil // User is not part of this group or has no role
		}
		return false, fmt.Errorf("failed to retrieve user group role mapping: %w", err)
	}

	var role models.Role

	// 2. Load the Role and its Permissions using the RoleID from the mapping
	// Explicitly query by the ID column
	err = db.Preload("Permissions").Where("id = ?", mapping.RoleID).First(&role).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, fmt.Errorf("role with ID %s not found for user %s in group %s: %w", mapping.RoleID, userID, groupID, err)
		}
		return false, fmt.Errorf("failed to load role and permissions: %w", err)
	}

	// 3. Check if the required permission exists in the role's permissions
	for _, perm := range role.Permissions {
		if perm.Name == requiredPerm {
			return true, nil
		}
	}

	return false, nil
}

func GenerateCUID() string {
	return cuid.New()
}

func ErrString(err error) string {
	if err != nil {
		return err.Error()
	}
	return "Something went wrong"
}

// ContainsSymbol checks if the password contains at least one symbol.
func ContainsSymbol(password string) bool {
	symbols := "!@#$%^&*()-_=+[]{}|;:',.<>?/`~\"\\"
	for _, c := range password {
		if strings.ContainsRune(symbols, c) {
			return true
		}
	}
	return false
}

func ContainsNumber(password string) bool {
	for _, c := range password {
		if c >= '0' && c <= '9' {
			return true
		}
	}
	return false
}

// ContainsUpper checks if the password contains at least one uppercase letter.
func ContainsUpper(password string) bool {
	for _, c := range password {
		if unicode.IsUpper(c) {
			return true
		}
	}
	return false
}

// ContainsLower checks if the password contains at least one lowercase letter.
func ContainsLower(password string) bool {
	for _, c := range password {
		if unicode.IsLower(c) {
			return true
		}
	}
	return false
}

// IsValidEmail is still basic. Use a library for robust validation.
func IsValidEmail(email string) bool {
	// A very basic email validation - NOT RECOMMENDED FOR PRODUCTION
	if len(email) < 3 || !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		return false
	}
	return true
}

// IsValidPassword provides a more robust password validation.
func IsValidPassword(password string) error {

	// Recommended minimum length: 8-12 characters
	if len(password) < 8 { // Increased minimum length
		return errors.New("password must be at least 8 characters long")
	}

	// Check for at least one of each required character type
	if !ContainsSymbol(password) {
		return errors.New("password must contain at least one symbol")
	}
	if !ContainsNumber(password) {
		return errors.New("password must contain at least one number")
	}
	if !ContainsUpper(password) {
		return errors.New("password must contain at least one uppercase letter")
	}
	if !ContainsLower(password) {
		return errors.New("password must contain at least one lowercase letter")
	}

	return nil
}

func SendErrorResponse(c *fiber.Ctx, statusCode int, message string, err error) error {
	return c.Status(statusCode).JSON(fiber.Map{
		"success": false,
		"message": message,
		"data": fiber.Map{
			"error": err.Error(),
		},
		"status": statusCode,
	})
}
