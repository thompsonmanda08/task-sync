package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/thompsonmanda08/task-sync/database"
	"github.com/thompsonmanda08/task-sync/middleware"
)

func SetupRoutes(app *fiber.App) {

	db := database.DBConn
	route := app.Group("/api/v1/")

	// PUBLIC ROUTES
	route.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Public Route Access Successful",
			"status":  fiber.StatusOK,
		})
	})

	route.Post("/login", LogUserIn)
	route.Post("/register", RegisterNewUser)
	route.Get("/roles", GetRoles)

	// PRIVATE HANDLERS
	private := route.Group("/", middleware.JWTMiddleware)

	private.Get("/user", GetUserProfile)
	private.Patch("/user", UpdateUserProfile)
	private.Patch("/user/change-password", ChangeUserPassword)
	private.Patch("/user/profile-picture", UpdateProfileImage)

	private.Get("/lists", GetTodoLists)
	private.Post("/list", CreateNewTodoList)
	private.Get("/list/:list_id", GetTodoList)
	private.Patch("/list/:list_id", UpdateTodoList)
	private.Delete("/list/:list_id", DeleteTodoList)

	private.Get("/list/:list_id/todos", GetTodoItems)
	private.Post("/list/:list_id/todo", CreateNewTodoItem)
	private.Get("/list/:list_id/todo/:task_id", GetTodoItem)
	private.Patch("/list/:list_id/todo/:task_id", UpdateTodoItem)
	private.Delete("/list/:list_id/todo/:task_id", DeleteTodoItem)

	// GROUP HANDLERS
	groups := private.Group("/groups")
	groups.Get("/", GetUserGroups)
	groups.Post("/new", CreateNewGroup)
	groups.Get("/:group_id", middleware.RequireGroupPermission(db, "view"), GetUserGroupDetails)
	groups.Patch("/:group_id", middleware.RequireGroupPermission(db, "view", "edit"), UpdateUserGroup)
	groups.Delete("/:group_id", middleware.RequireGroupPermission(db, "view", "edit", "delete_group"), DeleteGroup)

	groups.Post("/:group_id/role/mapping", middleware.RequireGroupPermission(db, "change_role"), CreateUserRoleMapping)
	groups.Post("/:group_id/invite", middleware.RequireGroupPermission(db, "invite"), InviteUser)

	// group.Use(middleware.RequireGroupPermission(db, "edit"))

}
