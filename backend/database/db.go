package database

import (
	"fmt"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2/log"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DBConn *gorm.DB
)

// Connect function to establish database connection
func Initialize(models ...interface{}) error {
	// Load environment variables from .env file (optional)
	err := godotenv.Load()
	if err != nil {
		fmt.Printf("WARNING: No .env file found, assuming environment variables are set")
	}

	// Get database credentials from environment variables and provide sensible defaults.
	// This makes the application more resilient if some env vars are missing.
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost" // Default for local development without Docker Compose
		// If running in Docker Compose, 'host.docker.internal' or the service name like 'postgres' is expected.
		// For Docker Compose, ensure DB_HOST is set in docker-compose.yml
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "postgres" // Common default PostgreSQL user
	}

	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		// IMPORTANT: For production, you should probably return an error here
		// or log a fatal error if password is required and missing.
		// For local dev, an empty password might be acceptable depending on your PG setup.
		return fmt.Errorf("WARNING: DB_PASSWORD environment variable is empty. This might cause connection issues.")
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "postgres" // Common default PostgreSQL database name
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432" // Default PostgreSQL port
	} else {
		// Optional: Validate if the port is a valid number
		if _, parseErr := strconv.Atoi(dbPort); parseErr != nil {
			return fmt.Errorf("invalid DB_PORT value: %s, must be a number: %w", dbPort, parseErr)
		}
	}

	sslMode := os.Getenv("DB_SSLMODE")
	if sslMode == "" {
		sslMode = "disable" // Default for local development where SSL is often not configured
		// For production (e.g., Supabase), this MUST be "require" or "verify-full"
	}

	timeZone := os.Getenv("DB_TIMEZONE")
	if timeZone == "" {
		timeZone = "UTC" // Sensible default timezone
	}

	// Construct the DSN (Data Source Name)
	// Example DSN: "host=localhost user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai"
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		dbHost, dbUser, dbPassword, dbName, dbPort, sslMode, timeZone)

	// Open the database connection
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("Database connection established!")

	DBConn = db

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
