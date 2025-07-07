package handlers

import (
	"errors"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/thompsonmanda08/task-sync/database"
	"github.com/thompsonmanda08/task-sync/models"
	"github.com/thompsonmanda08/task-sync/utils"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// LogUserIn is the handler for logging in a user.
//
// It parses the request body into a models.LoginRequest struct, checks if the
// email and password fields are empty, and finds the user with the matching
// email. If the user does not exist or the password is invalid, it returns a
// 404 Not Found or 401 Unauthorized status with an appropriate error message.
// If the user exists, it generates a JWT token using the user's ID, and logs the
// user in by returning the token and the user details in the response. If there
// is an error during the token generation, it returns a 500 Internal Server
// Error status with an appropriate error message. On success, it returns a 202
// Accepted status with the token and user details.
func LogUserIn(c *fiber.Ctx) error {

	var request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	user := new(models.User)

	// PARSE REQUEST BODY
	if err := c.BodyParser(&request); err != nil {
		utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err)
	}

	// VALIDATE REQUEST BODY - NONE EMPTY
	if request.Email == "" || request.Password == "" {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Email and Password are required", errors.New("email and password cannot be empty"))
	}

	// FIND THE USER WITH MATCHING EMAIL
	if err := database.DBConn.Where("email = ?", request.Email).First(&user).Error; err != nil {
		return utils.SendErrorResponse(c, fiber.StatusNotFound, "User does not exist", err)

	}

	// CHECK HASHED THE PASSWORD
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		return utils.SendErrorResponse(c, fiber.StatusUnauthorized, "Invalid Login Credentials", err)

	}

	/// GENERATE JWT TOKEN AND LOG USER IN
	token, expiresAt, err := utils.GenerateJWT(user.ID)

	if err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to generate token", err)

	}

	// SEND RESPONSE WITH AUTHENTICATED USER
	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"success": true,
		"status":  fiber.StatusAccepted,
		"message": "Login Successful",
		"data": fiber.Map{
			"token":  token,
			"expiry": expiresAt,
			"user":   fiber.Map{"id": user.ID, "name": user.Name, "email": user.Email},
		},
	})
}

// RegisterNewUser registers a new user with the provided details.
//
// It parses the request body into a models.RegisterRequest struct, checks if the user
// with the same email already exists, and creates a new user in the database if
// the email is not already registered. If the user already exists, it returns a
// 409 Conflict status with an appropriate error message. If the request body is
// invalid, it returns a 400 Bad Request status with an appropriate error message.
// If there is an error during the database query, it returns a 500 Internal Server
// Error status with an appropriate error message. On success, it returns a 201
// Created status with the created user details and a JWT token in the response.
func RegisterNewUser(c *fiber.Ctx) error {
	db := database.DBConn
	var request struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// PARSE REQUEST BODY
	if err := c.BodyParser(&request); err != nil {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err)
	}

	// VALIDATE REQUEST BODY - NONE EMPTY
	if request.Email == "" || request.Name == "" || request.Password == "" {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Name, Email and Password are required", errors.New("name, email and password cannot be empty"))
	}

	var user models.User

	// CHECK IF THE USER EXISTS IN THE DB
	err := db.Where("email = ?", request.Email).First(&user).Error

	if err == nil {
		// A user with this email was found — conflict
		return utils.SendErrorResponse(c, fiber.StatusConflict, "User already exists", errors.New("user already exists"))
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		// Some unexpected DB error occurred
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Something went wrong while checking for existing user", err)

	}
	// else: gorm.ErrRecordNotFound — proceed with user creation

	if !utils.IsValidEmail(request.Email) {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid Email Address", errors.New("invalid email"))
	}

	// Check for symbols in the password
	if err := utils.IsValidPassword(request.Password); err != nil {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Password must contain at least a Capital letter, a Symbol and a Number", err)
	}

	// HASH THE PASSWORD
	hash, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)

	if err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to create an account", err)
	}

	user.Name = request.Name
	user.Email = strings.ToLower(strings.TrimSpace(request.Email))
	user.Password = string(hash) // SET THE HASHED PASSWORD

	err = db.Transaction(func(tx *gorm.DB) error {
		// First create the user
		if err := tx.Create(&user).Error; err != nil {
			return err
		}

		// 2. Create default list with the user's ID
		defaultList := models.TodoList{
			Name:    "DEFAULT",
			OwnerID: user.ID, // Using the user's UUID
			// GroupID: "",
		}

		if err := tx.Create(&defaultList).Error; err != nil {
			fmt.Printf("Error creating default list: %v\n", err) // Debug
			return err
		}

		fmt.Printf("Created default list with ID: %s for user %s\n", defaultList.ID, user.ID) // Debug

		// 3. Verify association
		if err := tx.Model(&user).Association("TodoLists").Append(&defaultList); err != nil {
			fmt.Printf("Error updating association: %v\n", err) // Debug
			return err
		}

		return nil
	})

	if err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to create an account", err)

	}

	/// GENERATE JWT TOKEN AND LOG USER IN
	token, expiry, err := utils.GenerateJWT(user.ID)

	if err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to generate a token for your account", err)
	}

	c.Cookie(&fiber.Cookie{
		Name:     "auth_session",
		Value:    token,
		HTTPOnly: !c.IsFromLocal(),
		Secure:   !c.IsFromLocal(),
		MaxAge:   3600 * 24 * 7,
		Expires:  expiry.Time,
		// SameSite: fiber.CookieSameSiteStrictMode,
	})

	// SEND RESPONSE WITH AUTHENTICATED USER
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"status":  fiber.StatusCreated,
		"message": "Registration Successful",
		"data": fiber.Map{
			"token":  token,
			"expiry": expiry,
			"user": fiber.Map{
				"id":    user.ID,
				"name":  user.Name,
				"email": user.Email,
			},
		},
	})
}

// func GetAllUsers(c *fiber.Ctx) error {

// 	// GET DATABASE CONNECTION
// 	db := database.DBConn
// 	var users []models.User

// 	// GET ALL USERS
// 	result := db.Find(&users)

// 	// Fetch all users from the database

// 	if result.Error != nil {
// 		return c.Status(500).JSON(fiber.Map{"success": false, "message": "Error fetching users"})
// 	}

// 	// Create a new slice to hold sanitized users
// 	var sanitizedUsers []models.UserResponse

// 	for _, newUser := range users {
// 		// Add the sanitized version without password and other unwanted fields
// 		sanitizedUser := models.UserResponse{
// 			ID:    newUser.ID,
// 			Name:  newUser.Name,
// 			Email: newUser.Email,
// 		}
// 		sanitizedUsers = append(sanitizedUsers, sanitizedUser)
// 	}

// 	return c.Status(fiber.StatusOK).JSON(fiber.Map{
// 		"success": true,
// 		"message": "",
// 		"data":    sanitizedUsers,
// 		"status":  fiber.StatusOK,
// 	})
// }

// GetUserProfile is a handler for retrieving a user's profile by their ID.
//
// If the user is not found, it returns a 404 Not Found status with an appropriate error message.
// If there is an error while retrieving the user's profile, it returns a 500 Internal Server Error status with an appropriate error message.
// On successful retrieval, the handler returns the user profile in the response body with a 200 OK status.
func GetUserProfile(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)

	var user models.User

	// Find the user by ID
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "User not found",
				"status":  fiber.StatusNotFound,
				"data":    fiber.Map{"error": err.Error()},
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve user profile",
			"status":  fiber.StatusInternalServerError,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"status":  fiber.StatusOK,
		"message": "User profile retrieved successfully",
		"data": fiber.Map{
			"id":              user.ID,
			"name":            user.Name,
			"email":           user.Email,
			"profile_picture": user.Image},
	})
}

// UpdateUserProfile updates the user's profile with the provided details.
//
// The function updates the user's name and/or email address and returns a JSON
// response with the updated user profile. If the request body is invalid, the
// function returns a 400 Bad Request status with an appropriate error message.
// If the user is not found, the function returns a 404 Not Found status with an
// appropriate error message. If there is an error while updating the user's
// profile, the function returns a 500 Internal Server Error status with an
// appropriate error message.
func UpdateUserProfile(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)

	// UpdateUserProfile updates the user's profile with the provided details.
	var updateData struct {
		Name  string `json:"name,omitempty"`
		Email string `json:"email,omitempty"`
	}

	// Parse the request body
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"status":  fiber.StatusBadRequest,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	var user models.User

	// Find the user by ID
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "User not found",
				"status":  fiber.StatusNotFound,
				"data":    fiber.Map{"error": err.Error()},
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve user profile",
			"status":  fiber.StatusInternalServerError,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	if updateData.Email != "" {
		if !utils.IsValidEmail(updateData.Email) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Invalid email format",
				"status":  fiber.StatusBadRequest,
				"data":    fiber.Map{"error": "Invalid email format"},
			})
		}
	}

	if err := db.Model(&user).Updates(updateData).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to update user profile",
			"status":  fiber.StatusInternalServerError,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"status":  fiber.StatusOK,
		"message": "User profile updated successfully",
		"data": fiber.Map{
			"id":              user.ID,
			"name":            user.Name,
			"email":           user.Email,
			"profile_picture": user.Image},
	})
}

// ChangeUserPassword changes the password for a user with the given ID.
//
// It expects a JSON body with two fields: `current_password` and `new_password`.
// It checks if the `current_password` matches the user's current password, and if
// the `new_password` meets the password requirements (length, uppercase, lowercase, numbers, and symbols).
// If the checks pass, it updates the user's password with the new hash, and returns a 200 OK status.
// If any of the checks fail, it returns an appropriate error status with a JSON body containing an error message.
func ChangeUserPassword(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)

	var request struct {
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}

	// Parse the request body
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"status":  fiber.StatusBadRequest,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	var user models.User

	// Find the user by ID
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "User not found",
				"status":  fiber.StatusNotFound,
				"data":    fiber.Map{"error": err.Error()},
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve user profile",
			"status":  fiber.StatusInternalServerError,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.CurrentPassword)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Current password is incorrect",
			"status":  fiber.StatusUnauthorized,
			"data":    fiber.Map{"error": "Incorrect current password"},
		})
	}

	// Check if the new password meets the requirements
	if err := utils.IsValidPassword(request.NewPassword); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
			"status":  fiber.StatusBadRequest,
			"data":    fiber.Map{"error": "New password does not meet requirements"},
		})
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(request.NewPassword), bcrypt.DefaultCost)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to hash new password",
			"status":  fiber.StatusInternalServerError,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	user.Password = string(newHash)

	if err := db.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to update password",
			"status":  fiber.StatusInternalServerError,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"status":  fiber.StatusOK,
		"message": "Password updated successfully",
		"data":    fiber.Map{"user_id": user.ID},
	})
}

// UpdateProfileImage updates the user's profile picture with the provided URL.
//
// The function takes a URL for the user's profile picture and updates the user's
// profile picture in the database. If the request body is invalid, the function
// returns a 400 Bad Request status with an appropriate error message. If the user
// is not found, the function returns a 404 Not Found status with an appropriate
// error message. If there is an error while updating the user's profile picture,
// the function returns a 500 Internal Server Error status with an appropriate
// error message. On success, the function returns a 200 OK status with the
// updated user profile in the response.
func UpdateProfileImage(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)

	var request struct {
		Image string `json:"profile_picture"`
	}

	// Parse the request body
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"status":  fiber.StatusBadRequest,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	var user models.User

	// Find the user by ID
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "User not found",
				"status":  fiber.StatusNotFound,
				"data":    fiber.Map{"error": err.Error()},
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve user profile",
			"status":  fiber.StatusInternalServerError,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	if request.Image == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Profile picture URL is required",
			"status":  fiber.StatusBadRequest,
			"data":    fiber.Map{"error": "Profile picture URL is required"},
		})
	}

	if err := db.Model(&user).Updates(request).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to update user profile picture",
			"status":  fiber.StatusInternalServerError,
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"status":  fiber.StatusOK,
		"message": "User profile picture updated successfully",
		"data":    fiber.Map{"profile_picture": user.Image},
	})
}
