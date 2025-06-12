package main

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/joho/godotenv"

	"github.com/thompsonmanda08/task-sync/database"
	"github.com/thompsonmanda08/task-sync/handlers"
	"github.com/thompsonmanda08/task-sync/models"
)

func main() {
	app := fiber.New()

	// COLLECT ALL MODELS IN DB
	dbModels := []interface{}{
		&models.User{},
		&models.Todo{},
		&models.Role{},
		&models.Group{},
		&models.TodoList{},
		&models.Permission{},
		&models.UserGroupRoleMapping{},
	}

	// INITIALIZE DATABASE
	if err := database.Initialize(dbModels...); err != nil {
		log.Fatal(err)
		// panic(err)
	}

	// LOAD .ENV FILE IF PRESENT
	err := godotenv.Load()
	if err != nil {
		log.Fatal("No .env file found, assuming environment variables are set.")
	}

	// SETUP ALL ROUTE HANDLERS
	handlers.SetupRoutes(app)

	// DEFINE PORT
	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "8080"
	}

	// START THE APP
	if err := app.Listen(":" + PORT); err != nil {
		log.Fatal(err)
		// panic(err)
	}

	fmt.Println("Server running on http://localhost:" + PORT + " ...")

}
