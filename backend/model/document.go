package model

import "time"

// Document is a knowledge-base article that the AI can answer questions about.
type Document struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Title     string    `json:"title" gorm:"size:255"`
	Content   string    `json:"content" gorm:"type:text"`
	Summary   string    `json:"summary" gorm:"type:text"`
	Tags      string    `json:"tags" gorm:"size:255"`
	OwnerID   uint      `json:"owner_id"`
	OwnerName string    `json:"owner_name" gorm:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
