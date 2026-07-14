package model

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

// SetPassword hashes and stores a plaintext password.
func (u *User) SetPassword(plain string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hash)
	return nil
}

// CheckPassword verifies a plaintext password against the stored hash.
func (u *User) CheckPassword(plain string) bool {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(plain)) == nil
}

// Role defines the RBAC role of a user.
type Role string

const (
	RoleAdmin   Role = "admin"
	RoleManager Role = "manager"
	RoleViewer  Role = "viewer"
)

// User is the account entity.
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"uniqueIndex;size:64"`
	Password  string    `json:"-" gorm:"size:255"`
	Email     string    `json:"email" gorm:"size:128"`
	Role      Role      `json:"role" gorm:"size:16;default:viewer"`
	Status    string    `json:"status" gorm:"size:16;default:active"` // active | disabled
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
