package database

import (
	"errors"
	"log"
	"os"
	"path/filepath"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"backend/config"
	"backend/model"
)

// DB is the shared GORM handle.
var DB *gorm.DB

// Init opens the database, runs migrations, and seeds an admin user.
func Init(cfg *config.DatabaseConfig) error {
	var dialector gorm.Dialector
	if cfg.Driver == "postgres" {
		dialector = postgres.Open(cfg.DSN)
	} else {
		// sqlite: ensure parent dir exists
		if dir := filepath.Dir(cfg.DSN); dir != "" && dir != "." {
			_ = os.MkdirAll(dir, 0o755)
		}
		dialector = sqlite.Open(cfg.DSN)
	}

	db, err := gorm.Open(dialector, &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return err
	}
	DB = db

	if err := db.AutoMigrate(&model.User{}, &model.Document{}); err != nil {
		return err
	}
	return Seed()
}

// Seed creates a default admin account if none exists.
func Seed() error {
	var count int64
	if err := DB.Model(&model.User{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}
	admin := model.User{
		Username: "admin",
		Email:    "admin@ruyi.dev",
		Role:     model.RoleAdmin,
		Status:   "active",
	}
	if err := admin.SetPassword("admin123"); err != nil {
		return err
	}
	if err := DB.Create(&admin).Error; err != nil {
		return err
	}
	log.Println("[seed] created default admin (username=admin, password=admin123)")
	return nil
}

// ErrNotFound is returned when a record does not exist.
var ErrNotFound = errors.New("record not found")
