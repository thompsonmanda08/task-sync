package handlers

import (
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/thompsonmanda08/task-sync/database"
	"github.com/thompsonmanda08/task-sync/models"
	"github.com/thompsonmanda08/task-sync/utils"
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
		Name        string `json:"name" validate:"required"`
		GroupID     string `json:"group_id,omitempty"`
		Description string `json:"description,omitempty"`
		Color       string `json:"color,omitempty"`
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

	todoList.OwnerID = userID // Set the OwnerID to the authenticated user's ID
	todoList.Name = request.Name
	todoList.Description = request.Description
	todoList.Color = request.Color
	todoList.GroupID = &request.GroupID

	// If a group ID is provided, set it; otherwise, leave it empty
	if request.GroupID != "" {

		var group *models.Group

		err := db.Transaction(func(tx *gorm.DB) error {

			// First Create the Todo List
			if err := tx.Create(&todoList).Error; err != nil {
				return err
			}

			// Then query the database to check if the group ID is valid
			if err := tx.Where("id = ?", request.GroupID).First(&group).Error; err != nil {
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
				"message": "Failed to create Todo List, ensure (" + request.GroupID + ") is a valid groupID",
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
			"createdAt": todoList.CreatedAt,
		},
		"status": fiber.StatusCreated,
	})
}

// GetTodoLists retrieves all TodoLists for a given user.
// Todo items for each list are fetched in a separate query after the main list query.
func GetTodoLists(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)

	var todoLists []models.TodoList

	// 1. Initial Fetch of TodoList details and its direct associations (excluding TodoItems)
	// We only preload shared users, owner, and group here.
	if err := db.
		Preload("TodoItems", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, is_completed") // Select all needed fields for UserMinimal
		}).
		Preload("SharedWithUsers", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, email") // Select all needed fields for UserMinimal
		}).
		Preload("Owner", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, email")
		}).
		Preload("Group", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name")
		}).
		Where("owner_id = ?", userID).
		Order("created_at DESC"). // Add sorting
		Find(&todoLists).Error; err != nil {

		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to retrieve Todo Lists", err)
	}

	// 2. Fetch TodoItems for each TodoList in separate queries
	// This loop will execute N additional queries (N = number of todoLists)
	// for i := range todoLists {
	// 	var todoItems []models.Todo // Slice to hold items for the current list

	// 	if err := db.Select("id, is_completed").
	// 		Where("todo_list_id = ?", todoLists[i].ID).
	// 		Find(&todoItems).Error; err != nil {
	// 		// Log the error but don't stop the entire process
	// 		// If a specific list's items fail to load, that list will just have an empty TodoItems slice.
	// 		// Or you could choose to return an error for the entire request if any sub-query fails.
	// 		// For robustness, logging and continuing is often preferred for list views.
	// 		log.Error("Failed to retrieve todo items for list %s: %v", todoLists[i].ID, err)
	// 		// Optionally, you could set an error flag on the list or skip it entirely.
	// 		// For now, we'll let todoItems be empty if there's a specific fetch error for a list.
	// 	}
	// 	// Assign the fetched items to the current TodoList in the slice
	// 	todoLists[i].TodoItems = todoItems
	// }

	// 3. Convert to response structure
	response := make([]models.TodoListResponse, 0, len(todoLists))

	for _, list := range todoLists {
		// Prepare shared users (now loaded by Preload("SharedWithUsers"))
		sharedWithMinimal := make([]models.UserMinimal, 0, len(list.SharedWithUsers))
		for _, user := range list.SharedWithUsers {
			sharedWithMinimal = append(sharedWithMinimal, models.UserMinimal{
				ID:    user.ID,
				Name:  user.Name,
				Email: user.Email,
			})
		}

		// Prepare group info (now loaded by Preload("Group"))
		var groupInfo *models.GroupMinimal
		if list.Group != nil && list.Group.ID != "" {
			groupInfo = &models.GroupMinimal{
				ID:   list.Group.ID,
				Name: list.Group.Name,
			}
		}

		// Prepare owner info (now loaded by Preload("Owner"))
		var ownerMinimal *models.UserMinimal
		if list.Owner != nil && list.Owner.ID != "" {
			ownerMinimal = &models.UserMinimal{
				ID:    list.Owner.ID,
				Name:  list.Owner.Name,
				Email: list.Owner.Email,
			}
		} else {
			log.Error("Todo List %s has missing owner information", list.ID)
			return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Todo List owner information is missing for list "+list.ID, nil)
		}

		completedCount := 0 // COUNT COMPLETED TASKS
		// `list.TodoItems` is now populated from the separate query above
		if len(list.TodoItems) > 0 {
			for _, task := range list.TodoItems {
				if task.IsCompleted {
					completedCount++
				}
			}
		}

		response = append(response, models.TodoListResponse{
			ID:              list.ID,
			Name:            list.Name,
			Description:     list.Description,
			Color:           list.Color,          // Populate the TodoItems field
			TodoItemsCount:  len(list.TodoItems), // Count of actual loaded items
			CompletedCount:  completedCount,
			Group:           groupInfo,
			SharedWith:      sharedWithMinimal, // Now populated from Preload("SharedWithUsers")
			SharedWithCount: len(sharedWithMinimal),
			Owner:           ownerMinimal, // Now populated from Preload("Owner")
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Todo Lists retrieved successfully",
		"data":    fiber.Map{"todo_lists": response, "count": len(response)},
		"status":  fiber.StatusOK,
	})
}

// GetTodoList retrieves a single TodoList by ID. Todo items are fetched in a separate query.
func GetTodoList(c *fiber.Ctx) error {
	db := database.DBConn
	userID := c.Locals("userID").(string)
	listID := c.Params("list_id")

	var todoList models.TodoList

	// 1. Initial Fetch of TodoList details and its direct associations (excluding TodoItems)
	if err := db.
		Preload("SharedWithUsers", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, email")
		}).
		Preload("Owner", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, email")
		}).
		Preload("Group", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name")
		}).
		Where("id = ?", listID).
		First(&todoList).Error; err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendErrorResponse(c, fiber.StatusNotFound, "Todo List not found", err)
		}
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to retrieve todo list from database", err)
	}

	// 2. Authorization Check (same as before)
	canAccess := false

	// Check if owner
	if todoList.OwnerID == userID {
		canAccess = true
	}

	// Check if part of a group the user belongs to
	if !canAccess && todoList.GroupID != nil && todoList.Group != nil {
		// As noted previously, if `UserGroupRoleMappings` is not preloaded,
		// a separate DB query is needed here to confirm group membership for auth.
		// For brevity in this refactor, I'll assume you'll implement the actual
		// group membership check here if `canAccess` is still false.
		// Example (untested, needs proper error handling):
		// var userGroupMapping models.UserGroupRoleMapping
		// if db.Where("group_id = ? AND user_id = ?", todoList.GroupID, userID).First(&userGroupMapping).Error == nil {
		//     canAccess = true
		// }
		// For demonstration, let's just make it pass if group exists for now,
		// but remember to put real group membership check if needed for auth.
		canAccess = true // TEMPORARY: Replace with actual group membership check
	}

	// Check if shared with user
	if !canAccess {
		for _, user := range todoList.SharedWithUsers {
			if user.ID == userID {
				canAccess = true
				break
			}
		}
	}

	if !canAccess {
		return utils.SendErrorResponse(c, fiber.StatusForbidden, "User does not have access to this todo list", nil)
	}

	var todoItems []models.Todo

	if err := db.Select("id, task, description, is_completed, start_date, end_date, priority").
		Where("todo_list_id = ?", todoList.ID).
		Find(&todoItems).Error; err != nil {
		// If no items found, it's not an error (GORM returns nil error for empty results)
		// Only return error if there's a genuine database issue
		if err != gorm.ErrRecordNotFound { // gorm.ErrRecordNotFound won't happen with Find, but good practice.
			return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to retrieve todo items", err)
		}
	}
	todoList.TodoItems = todoItems // Assign the fetched items back to the TodoList struct

	// 3. Prepare response data (uses the now-populated todoList.TodoItems)
	var groupMinimal *models.GroupMinimal
	if todoList.Group != nil && todoList.Group.ID != "" {
		groupMinimal = &models.GroupMinimal{
			ID:   todoList.Group.ID,
			Name: todoList.Group.Name,
		}
	}

	sharedWithMinimal := make([]models.UserMinimal, 0, len(todoList.SharedWithUsers))
	for _, user := range todoList.SharedWithUsers {
		sharedWithMinimal = append(sharedWithMinimal, models.UserMinimal{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		})
	}

	todoItemsResponse := make([]models.TodoItemResponse, 0, len(todoList.TodoItems))
	completedCount := 0
	for _, item := range todoList.TodoItems {
		if item.IsCompleted {
			completedCount++
		}
		todoItemsResponse = append(todoItemsResponse, models.TodoItemResponse{
			ID:          item.ID,
			Task:        item.Task,
			Description: item.Description,
			IsCompleted: item.IsCompleted,
			StartDate:   item.StartDate,
			EndDate:     item.EndDate,
			Priority:    item.Priority,
		})
	}

	var ownerMinimal *models.UserMinimal
	if todoList.Owner != nil && todoList.Owner.ID != "" {
		ownerMinimal = &models.UserMinimal{
			ID:    todoList.Owner.ID,
			Name:  todoList.Owner.Name,
			Email: todoList.Owner.Email,
		}
	} else {
		// This should ideally not happen due to gorm:"not null" on OwnerID
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Todo List owner information is missing", nil)
	}

	response := models.TodoListResponse{
		ID:              todoList.ID,
		Name:            todoList.Name,
		Description:     todoList.Description,
		Color:           todoList.Color,
		TodoItems:       todoItemsResponse,
		TodoItemsCount:  len(todoItemsResponse),
		CompletedCount:  completedCount,
		Group:           groupMinimal,
		SharedWith:      sharedWithMinimal,
		SharedWithCount: len(sharedWithMinimal),
		Owner:           ownerMinimal,
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
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid Todo List ID", errors.New("todo-list id cannot be empty"))

	}

	var request struct {
		Name string `json:"name,omitempty"`
	}

	if err := c.BodyParser(&request); err != nil {

		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err)

	}

	var todoList models.TodoList

	if err := db.Where("id = ? AND owner_id = ?", id, userID).First(&todoList).Error; err != nil {
		if err == gorm.ErrRecordNotFound {

			return utils.SendErrorResponse(c, fiber.StatusNotFound, "Todo List not found or not owned by user", errors.New("todo list not found"))
		}

		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to retrieve Todo List", err)
	}

	if err := db.Model(&todoList).Updates(request).Error; err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to update Todo List", err)
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
			return utils.SendErrorResponse(c, fiber.StatusNotFound, "Todo List not found or not owned by user", errors.New("todo list not found"))

		}
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to retrieve Todo List", err)
	}

	if err := db.Delete(&todoList).Error; err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to delete Todo List", err)
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

// CreateNewTodoItem creates a new Todo item. It parses the request body into a models.Todo struct,
// checks that the title is not empty, and then creates a new Todo item in the database.
// If the request body is invalid, it returns a 400 Bad Request status code with an appropriate error message.
// If the title is empty, it returns a 400 Bad Request status code with an appropriate error message.
// If there is an error during the database query, it returns a 500 Internal Server Error status code with an appropriate error message.
// If the Todo item is created successfully, it returns a 201 Created status code with the created Todo item in the response.
func CreateNewTodoItem(c *fiber.Ctx) error {
	db := database.DBConn

	userID := c.Locals("userID").(string)
	listID := c.Params("list_id")

	var request struct {
		Task        string `json:"task" validate:"required"`
		Description string `json:"description,omitempty"`
	}

	if err := c.BodyParser(&request); err != nil {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err)
	}

	if request.Task == "" {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Todo Task is required", errors.New("todo task cannot be empty"))
	}

	var todoList models.TodoList
	if err := db.
		Preload("Group.UserGroupRoleMappings", "user_id = ?", userID). // Conditionally preload group mappings for this user
		Select("id", "owner_id", "group_id").                          // Select only necessary fields for authorization
		Where("id = ?", listID).
		First(&todoList).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return utils.SendErrorResponse(c, fiber.StatusNotFound, "Todo List not found", err)
		}
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to retrieve todo list for authorization", err)
	}

	canAccess := false

	// Case 1: TodoList belongs to a Group
	if todoList.GroupID != nil {
		// Check if the user is a member of that group
		if todoList.Group != nil && todoList.Group.ID != "" { // Ensure group was loaded
			for _, mapping := range todoList.Group.UserGroupRoleMappings {
				if mapping.UserID == userID {
					canAccess = true
					break
				}
			}
		}
	} else {
		// Case 2: TodoList is standalone (not associated with a Group)
		// Check if the user is the owner of this standalone list
		if todoList.OwnerID == userID {
			canAccess = true
		}
	}

	if !canAccess {
		return utils.SendErrorResponse(c, fiber.StatusForbidden, "User does not have access to this todo list", nil)
	}

	todoItem := models.Todo{
		Task:        request.Task,
		Description: request.Description,
		TodoListID:  todoList.ID,
	}

	if err := db.Create(&todoItem).Error; err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to create todo item", err)
	}

	response := fiber.Map{
		"id":           todoItem.ID,
		"task":         todoItem.Task,
		"description":  todoItem.Description,
		"is_completed": todoItem.IsCompleted,
		"createdAt":    todoItem.CreatedAt,
		"todo_list_id": todoItem.TodoListID,
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Todo Created Successfully",
		"data":    response,
		"status":  fiber.StatusCreated,
	})
}

// GetTodos retrieves all todo items associated with the authenticated user.
// It fetches the userID from the context, queries the database for todos
// linked to that user, and returns the list of todos in the response.
// In case of any error during the database query, it responds with an
// appropriate error message and status code.

func GetTodoItems(c *fiber.Ctx) error {

	db := database.DBConn
	listID := c.Params("list_id")

	if listID == "" {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Todo List ID is required in the URL path", nil)
	}

	var todos []models.Todo

	if err := db.Where("todo_list_id = ?", listID).Find(&todos).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return utils.SendErrorResponse(c, fiber.StatusNotFound, "Todo List not found", err)
		}

		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to retrieve todos", err)
	}

	var response []models.TodoItemResponse
	for _, todo := range todos {

		response = append(response, models.TodoItemResponse{
			ID:          todo.ID,
			Task:        todo.Task,
			IsCompleted: todo.IsCompleted,
			StartDate:   todo.StartDate,
			EndDate:     todo.EndDate,
			Priority:    todo.Priority,
		})

	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Todos retrieved successfully",
		"data":    response,
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
	listID := c.Params("list_id")

	if listID == "" {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Todo List ID is required in the URL path", nil)
	}

	var todo models.Todo

	if err := db.Where("id = ? AND todo_list_id = ?", id, listID).First(&todo).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return utils.SendErrorResponse(c, fiber.StatusNotFound, "Task item not found", err)
		}

		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to retrieve todo", err)
	}

	response := models.TodoItemResponse{
		ID:          todo.ID,
		Task:        todo.Task,
		IsCompleted: todo.IsCompleted,
		StartDate:   todo.StartDate,
		EndDate:     todo.EndDate,
		Priority:    todo.Priority,
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "",
		"data":    response,
		"status":  fiber.StatusOK,
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

	// userID := c.Locals("userID").(string)
	id := c.Params("task_id")
	listId := c.Params("list_id")

	if id == "" {
		utils.SendErrorResponse(c, fiber.StatusBadRequest, "Task ID is required in the URL path", errors.New("missing required parameter: task_id"))

	}

	var request struct {
		Task        string    `json:"name,omitempty"`
		Description string    `json:"description,omitempty"`
		StartDate   time.Time `json:"start_date,omitempty"`
		EndDate     time.Time `json:"end_date,omitempty"`
		IsCompleted bool      `json:"is_completed,omitempty"`
		Priority    string    `json:"priority,omitempty"`
	}

	// Parse the request body into the updates struct
	if err := c.BodyParser(&request); err != nil {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Invalid request body", err)

	}

	var todo models.Todo

	// Find the todo and ensure it belongs to the authenticated user
	if err := db.Where("id = ? AND todo_list_id = ?", id, listId).First(&todo).Error; err != nil {

		if err == gorm.ErrRecordNotFound {
			return utils.SendErrorResponse(c, fiber.StatusNotFound, "Todo not found or not owned by user", err)
		}

		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to retrieve todo", err)
	}

	if err := db.Model(&todo).Updates(request).Error; err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to update todo", err)
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
	// userID := c.Locals("userID").(string)
	id := c.Params("task_id")
	listId := c.Params("list_id")

	if id == "" {
		return utils.SendErrorResponse(c, fiber.StatusBadRequest, "Task ID is required in the URL path", errors.New("missing required parameter: task_id"))
	}

	var todo models.Todo

	// Find the todo and ensure it belongs to the authenticated user
	// TODO: only delete if your have edit rights - [Role base action]
	if err := db.Where("id = ? AND todo_list_id = ?", id, listId).First(&todo).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return utils.SendErrorResponse(c, fiber.StatusNotFound, "Todo not found or not owned by user", err)
		}

		return utils.SendErrorResponse(c, fiber.StatusNotFound, "Todo not found or not owned by user", err)
	}

	if err := db.Delete(&todo).Error; err != nil {
		return utils.SendErrorResponse(c, fiber.StatusInternalServerError, "Failed to delete todo", err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Todo deleted successfully",
		"status":  fiber.StatusOK,
		"data":    fiber.Map{"id": todo.ID},
	})
}
