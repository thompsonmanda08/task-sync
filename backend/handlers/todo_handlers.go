package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/thompsonmanda08/task-sync/database"
	"github.com/thompsonmanda08/task-sync/models"
	"gorm.io/gorm"
)

// ************************************************************************************* //
// ******************************** TODO LISTS HANDLERS ******************************** //
// ************************************************************************************* //

// CreateNewTodoList creates a new Todo List for the authenticated user.
// It parses the request body into a models.TodoList struct, checks if the
// name field is empty, and sets the OwnerID to the authenticated user's ID.
// If a group ID is provided in the URL, it assigns it to the Todo List; otherwise,
// the Todo List is created without a group. In case of an invalid request body or
// empty name, it returns a 400 Bad Request status. If the group ID is invalid, it
// returns a 400 Bad Request status. If there is an error during the database
// operation, it returns a 500 Internal Server Error status. On success, it returns
// a 201 Created status with the new Todo List.

func CreateNewTodoList(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)

	var request struct {
		Name    string `json:"name" validate:"required"`
		GroupID string `json:"group_id,omitempty"`
	}

	var todoList models.TodoList

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusBadRequest,
		})
	}

	if request.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Todo List Name is required",
			"data": fiber.Map{
				"error": "Todo List Name cannot be empty",
			},
			"status": fiber.StatusBadRequest,
		})
	}

	// Set the OwnerID to the authenticated user's ID
	todoList.OwnerID = userID
	todoList.Name = request.Name

	// If a group ID is provided, set it; otherwise, leave it empty
	if request.GroupID != "" {
		todoList.GroupID = request.GroupID

		var group *models.GroupMinimal

		err := db.Transaction(func(tx *gorm.DB) error {

			// First Create the Todo List
			if err := tx.Create(&todoList).Error; err != nil {
				return err
			}

			// Then query the database to check if the group ID is valid
			if err := tx.Where("id = ?", todoList.GroupID).First(&group).Error; err != nil {
				return err
			}

			if err := tx.Model(&group).Association("TodoLists").Append(&todoList); err != nil {
				return err
			}

			return nil

		})

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "Failed to create Todo List, ensure group ID is valid",
				"data":    fiber.Map{"error": err.Error()},
				"status":  fiber.StatusInternalServerError,
			})
		}

		// IF THERE IS NOT GROUP ID PROVIDED THEN JUST CREATE THE TODO LIST
	} else if err := db.Create(&todoList).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to create Todo List",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Todo Lists created successfully",
		"data": fiber.Map{
			"id":        todoList.ID,
			"name":      todoList.Name,
			"owner_id":  todoList.OwnerID,
			"group_id":  todoList.GroupID,
			"group":     todoList.Group,
			"createdAt": todoList.CreatedAt,
		},
		"status": fiber.StatusCreated,
	})
}

// GetTodoLists retrieves all Todo Lists associated with the authenticated user.
//
// The function fetches the userID from the context, queries the database for all
// Todo Lists associated with that user, and returns them in the response. If there
// is an error during the database query, the function returns a JSON response with
// an appropriate error message and status code.

func GetTodoLists(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)

	var todoLists []models.TodoList

	// Optimized query with selective preloading
	if err := db.
		Preload("TodoItems", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, todo_list_id, title, completed") // Only select needed fields
		}).
		Preload("SharedWithUsers", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, email") // Only select needed fields
		}).
		Preload("Group", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name") // Only select needed fields
		}).
		Where("owner_id = ?", userID).
		Order("created_at DESC"). // Add sorting
		Find(&todoLists).Error; err != nil {

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve Todo Lists",
			"data":    fiber.Map{"error": err.Error()},
			"status":  fiber.StatusInternalServerError,
		})
	}

	// Convert to response structure
	response := make([]models.TodoListResponse, 0, len(todoLists))

	for _, list := range todoLists {
		// Prepare shared users (if needed)
		sharedUsers := make([]models.UserMinimal, 0, len(list.SharedWithUsers))

		for _, user := range list.SharedWithUsers {
			sharedUsers = append(sharedUsers, models.UserMinimal{
				ID:    user.ID,
				Name:  user.Name,
				Email: user.Email,
			})
		}

		// Prepare group info (if exists)
		var groupInfo *models.GroupMinimal

		if list.Group != nil && list.Group.ID != "" {
			groupInfo = &models.GroupMinimal{
				ID:   list.Group.ID,
				Name: list.Group.Name,
			}
		}

		response = append(response, models.TodoListResponse{
			ID:              list.ID,
			Name:            list.Name,
			OwnerID:         list.OwnerID,
			TodoItemsCount:  len(list.TodoItems),
			Group:           groupInfo,
			GroupID:         list.GroupID,
			SharedWith:      sharedUsers,
			SharedWithCount: len(list.SharedWithUsers),
			CreatedAt:       list.CreatedAt,
			UpdatedAt:       list.UpdatedAt,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Todo Lists retrieved successfully",
		"data":    fiber.Map{"todoLists": response, "count": len(response)},
		"status":  fiber.StatusOK,
	})
}

// GetTodoList is a handler that retrieves a single Todo List by ID. It fetches
// the userID from the context, queries the database for a Todo List associated
// with that user and the provided ID, and returns the Todo List if found. If the
// Todo List is not found or not owned by the user, it responds with a 404 Not
// Found status code. In case of any error during the database query, it responds
// with an appropriate error message and status code.
func GetTodoList(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)

	id := c.Params("list_id")

	var todoList models.TodoList

	if err := db.Preload("TodoItems", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, todo_list_id, title, completed")
	}).Preload("SharedWithUsers", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, name, email")
	}).Preload("Group", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, name")
	}).
		Where("id = ? AND owner_id = ?", id, userID).First(&todoList).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "Todo List not found or not owned by user",
				"data": fiber.Map{
					"error": "Todo List not found",
				},
				"status": fiber.StatusNotFound,
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve Todo List",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	sharedWith := make([]models.UserMinimal, 0, len(todoList.SharedWithUsers))

	var group *models.GroupMinimal

	if todoList.GroupID != "" || todoList.Group != nil {
		group = &models.GroupMinimal{
			ID:   todoList.Group.ID,
			Name: todoList.Group.Name,
		}
	}

	for _, user := range todoList.SharedWithUsers {
		sharedWith = append(sharedWith, models.UserMinimal{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		})
	}

	response := models.TodoListResponse{
		ID:              todoList.ID,
		Name:            todoList.Name,
		OwnerID:         todoList.OwnerID,
		TodoItemsCount:  len(todoList.TodoItems),
		Group:           group,
		GroupID:         todoList.GroupID,
		SharedWith:      sharedWith,
		SharedWithCount: len(todoList.SharedWithUsers),
		CreatedAt:       todoList.CreatedAt,
		UpdatedAt:       todoList.UpdatedAt,
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Todo List retrieved successfully",
		"data":    response,
		"status":  fiber.StatusOK,
	})
}

// UpdateTodoList updates a single Todo List by ID. It fetches the userID from the context,
// queries the database for a Todo List associated with that user and the provided ID,
// and updates the Todo List with the provided fields. If the Todo List is not found or
// not owned by the user, it responds with a 404 Not Found status code. In case of
// any error during the database query, it responds with an appropriate error message
// and status code.
func UpdateTodoList(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)
	id := c.Params("list_id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid Todo List ID",
			"data": fiber.Map{
				"error": "Todo List ID cannot be empty",
			},
			"status": fiber.StatusBadRequest,
		})
	}

	var request struct {
		Name string `json:"name,omitempty"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"data":    fiber.Map{"error": err.Error()},
			"status":  fiber.StatusBadRequest,
		})
	}

	var todoList models.TodoList

	if err := db.Where("id = ? AND owner_id = ?", id, userID).First(&todoList).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "Todo List not found or not owned by user",
				"data":    fiber.Map{"error": "Todo List not found"},
				"status":  fiber.StatusNotFound,
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve Todo List",
			"data":    fiber.Map{"error": err.Error()},
			"status":  fiber.StatusInternalServerError,
		})
	}

	if err := db.Model(&todoList).Updates(request).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to update Todo List",
			"data":    fiber.Map{"error": err.Error()},
			"status":  fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Todo List updated successfully",
		"data": fiber.Map{
			"id":       todoList.ID,
			"name":     todoList.Name,
			"owner_id": todoList.OwnerID,
		},
		"status": fiber.StatusOK,
	})
}

// DeleteTodoList deletes a single Todo List by ID. It fetches the userID from the context,
// queries the database for a Todo List associated with that user and the provided ID,
// and deletes the Todo List if found. If the Todo List is not found or not owned by the
// user, it responds with a 404 Not Found status code. In case of any error during the
// database query, it responds with an appropriate error message and status code.
func DeleteTodoList(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)

	id := c.Params("list_id")

	var todoList models.TodoList

	if err := db.Where("id = ? AND owner_id = ?", id, userID).First(&todoList).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "Todo List not found or not owned by user",
				"data": fiber.Map{
					"error": "Todo List not found",
				},
				"status": fiber.StatusNotFound,
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve Todo List",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	if err := db.Delete(&todoList).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to delete Todo List",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Todo List deleted successfully",
		"status":  fiber.StatusOK,
		"data":    fiber.Map{"id": id},
	})
}

// ************************************************************************************* //
// ****************************** TODO TASK ITEM HANDLERS ****************************** //
// ************************************************************************************* //

// GetTodos retrieves all todo items associated with the authenticated user.
// It fetches the userID from the context, queries the database for todos
// linked to that user, and returns the list of todos in the response.
// In case of any error during the database query, it responds with an
// appropriate error message and status code.

func GetTodoItems(c *fiber.Ctx) error {

	db := database.DBConn
	userID := c.Locals("userID").(string) // Get userID from JWT middleware

	var todos []models.Todo

	if err := db.Where("user_id = ?", userID).Find(&todos).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve todos",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Todos retrieved successfully",
		"data":    todos,
		"status":  fiber.StatusOK,
	})
}

// GetTodoItem retrieves a single todo item by ID. It fetches the userID from the
// context, queries the database for a todo associated with that user and the
// provided ID, and returns the todo in the response. If the todo is not found or
// not owned by the user, it responds with a 404 Not Found status code. In case of
// any error during the database query, it responds with an appropriate error
// message and status code.
func GetTodoItem(c *fiber.Ctx) error {

	db := database.DBConn
	id := c.Params("task_id")

	userID := c.Locals("userID").(string)

	var todo models.Todo

	if err := db.Where("id = ? AND user_id = ?", id, userID).First(&todo).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"status":  fiber.StatusNotFound,
				"data":    fiber.Map{"error": err.Error()},
				"message": "Todo not found or not owned by user",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve todo",
			"data":    fiber.Map{"error": err.Error()},
			"status":  fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "",
		"data": fiber.Map{
			"id":          todo.ID,
			"task":        todo.Task,
			"description": todo.Description,
			"completed":   todo.Completed,
			"createdAt":   todo.CreatedAt,
		},
		"status": fiber.StatusOK,
	})
}

// CreateNewTodoItem creates a new Todo item. It parses the request body into a models.Todo struct,
// checks that the title is not empty, and then creates a new Todo item in the database.
// If the request body is invalid, it returns a 400 Bad Request status code with an appropriate error message.
// If the title is empty, it returns a 400 Bad Request status code with an appropriate error message.
// If there is an error during the database query, it returns a 500 Internal Server Error status code with an appropriate error message.
// If the Todo item is created successfully, it returns a 201 Created status code with the created Todo item in the response.
func CreateNewTodoItem(c *fiber.Ctx) error {
	db := database.DBConn

	// userID := c.Locals("userID").(string)

	var request struct {
		Task        string `json:"task,omitempty"`
		Description string `json:"description,omitempty"`
	}

	todo := new(models.Todo)

	if err := c.BodyParser(request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"data":    fiber.Map{"error": err.Error()},
			"status":  fiber.StatusBadRequest,
		})
	}

	if request.Task == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "A title is required",
			"data":    nil,
			"status":  fiber.StatusBadRequest,
		})
	}

	todo.Task = request.Task

	var description interface{}
	if request.Description != "" {
		description = request.Description
		todo.Description = request.Description
	} else {
		description = nil
	}

	if err := db.Create(&todo).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
			"status":  fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Todo Created Successfully",
		"data": fiber.Map{
			"title":       todo.Task,
			"description": description,
			"createdAt":   todo.CreatedAt,
		},
		"status": fiber.StatusCreated,
	})
}

// UpdateTodoItem updates a single todo item by ID. It fetches the userID from the
// context, queries the database for a todo associated with that user and the
// provided ID, and updates the todo with the provided fields. If the todo is not
// found or not owned by the user, it responds with a 404 Not Found status code. In
// case of any error during the database query, it responds with an appropriate error
// message and status code.
func UpdateTodoItem(c *fiber.Ctx) error {
	db := database.DBConn

	userID := c.Locals("userID").(string)
	id := c.Params("task_id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid Todo ID",
			"data": fiber.Map{
				"error": "Missing required parameter: task_id",
			},
			"status": fiber.StatusBadRequest,
		})
	}

	var request struct {
		Title       string    `json:"name,omitempty"`
		Description string    `json:"description,omitempty"`
		StartDate   time.Time `json:"start_date,omitempty"`
		EndDate     time.Time `json:"end_date,omitempty"`
		Completed   bool      `json:"completed,omitempty"`
		Priority    string    `json:"priority,omitempty"`
	}

	// Parse the request body into the updates struct
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusBadRequest,
		})
	}

	var todo models.Todo

	// Find the todo and ensure it belongs to the authenticated user
	if err := db.Where("id = ? AND user_id = ?", id, userID).First(&todo).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"status":  fiber.StatusNotFound,
				"data":    fiber.Map{"error": err.Error()},
				"message": "Todo not found or not owned by user",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"status":  fiber.StatusInternalServerError,
			"message": "Failed to find todo",
			"data": fiber.Map{
				"error": err.Error(),
			},
		})
	}

	if err := db.Model(&todo).Updates(request).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"status":  fiber.StatusInternalServerError,
			"message": "Failed to update Todo",
			"data":    fiber.Map{"error": err.Error()},
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Todo updated successfully",
		"data":    todo,
		"status":  fiber.StatusOK,
	})
}

// DeleteTodoItem deletes a single todo item by ID. It fetches the userID from the
// context, queries the database for a todo associated with that user and the
// provided ID, and deletes the todo if found. If the todo is not found or not
// owned by the user, it responds with a 404 Not Found status code. In case of
// any error during the database query, it responds with an appropriate error
// message and status code.
func DeleteTodoItem(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)
	id := c.Params("task_id")

	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid Todo ID",
			"data": fiber.Map{
				"error": "Missing required parameter: task_id",
			},
			"status": fiber.StatusBadRequest,
		})
	}

	var todo models.Todo

	// Find the todo and ensure it belongs to the authenticated user
	// TODO: only delete if your have edit rights - [Role base action]
	if err := db.Where("id = ? AND user_id = ?", id, userID).First(&todo).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"status":  fiber.StatusNotFound,
				"data": fiber.Map{
					"error": err.Error(),
				},
				"message": "Todo not found or not owned by user",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"status":  fiber.StatusInternalServerError,
			"message": "Failed to find todo",
			"data": fiber.Map{
				"error": err.Error(),
			},
		})
	}

	if err := db.Delete(&todo).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to delete todo",
			"data": fiber.Map{
				"error": err.Error(),
			},
			"status": fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Todo deleted successfully",
		"status":  fiber.StatusOK,
		"data":    fiber.Map{"id": todo.ID},
	})
}
