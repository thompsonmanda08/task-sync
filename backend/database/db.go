package database

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2/log"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	DBConn *gorm.DB
)

func Initialize(models ...interface{}) error {
	var err error

	// Determine database driver from environment variable or default to SQLite
	dbDriver := os.Getenv("DB_DRIVER")
	dbDSN := os.Getenv("DB_DSN")

	if dbDriver == "" {
		dbDriver = "sqlite"
	}

	if dbDSN == "" {
		dbDSN = "todos.db" // Default DSN for SQLite
	}

	switch dbDriver {
	case "sqlite":
		// For SQLite, the DSN is typically the file path
		DBConn, err = gorm.Open(sqlite.Open(dbDSN), &gorm.Config{})
	// Add other database drivers here if needed, e.g., PostgreSQL, MySQL
	// case "postgres":
	// 	DBConn, err = gorm.Open(postgres.Open(dbDSN), &gorm.Config{})
	// case "mysql":
	// 	DBConn, err = gorm.Open(mysql.Open(dbDSN), &gorm.Config{})
	default:
		return fmt.Errorf("unsupported database driver: %s", dbDriver)
	}

	if err != nil {
		log.Fatalf("Failed to connect to database using driver %s and DSN %s: %v", dbDriver, dbDSN, err)
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	fmt.Print("Database connected successfully!\n\n")

	// AUTO MIGRATION: MIGRATE MODELS IF ANY
	if len(models) > 0 {
		fmt.Println("Migrating models...")
		err = DBConn.AutoMigrate(models...)

		if err != nil {
			log.Fatalf("Failed to migrate database tables: %v", err)
			return fmt.Errorf("failed to migrate database tables: %w", err)
		}

		fmt.Println("Database migrated successfully!")

		// SEEDING DATABASE WITH INITIAL DATA
		if err := SeedRolesAndPermissions(DBConn); err != nil {
			log.Fatalf("failed to seed roles and permissions: %v", err)
		}
	} else {

		fmt.Println("No models provided for migration.")
	}

	return nil

}
