package models

import (
	"time"

	"github.com/lucsky/cuid"
	"gorm.io/gorm"
)

type Status string
type Priority string

// PRIORITY ENUMS
const (
	Low      Priority = "low"
	Medium   Priority = "medium"
	High     Priority = "high"
	Normal   Priority = "normal"
	Urgent   Priority = "urgent"
	Critical Priority = "critical"
)

type Todo struct {
	ID string `json:"id" gorm:"primaryKey;unique;not null"`

	Task       string    `json:"task" gorm:"not null"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed" gorm:"default:false"`
	StartDate   time.Time `json:"start_date,omitempty"`             // Optional start date
	EndDate     time.Time `json:"end_date,omitempty"`               // Optional end date
	Priority    Priority  `json:"priority" gorm:"default:'normal'"` // Default to 'normal', can be 'low', 'medium', 'high'
	// Tags        []string  `json:"tags"`

	TodoList   TodoList `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	TodoListID string   `json:"todo_list_id" gorm:"index"` // FK for TodoList

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"` // `omitempty` hides if null

}

// A Group of Todo Items accessible by only users who are part of the group
type TodoList struct {
	ID string `json:"id" gorm:"primaryKey;unique;not null"`

	Name      string `json:"name"`
	TodoItems []Todo `json:"todo_items"`
	// List of todo items in this list
	SharedWithUsers []User `gorm:"many2many:shared_with;" json:"shared_with"` //users who can see the todo list even if its not part of a group

	Group   *Group `gorm:"foreignKey:GroupID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"group"`
	GroupID string `json:"group_id"` // Foreign key for Group

	OwnerID string `json:"owner_id" gorm:"index;not null"` // Foreign key for User

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"` // `omitempty` hides if null
}

type TodoItemResponse struct {
	ID        string `json:"id"`
	Task     string `json:"task"`
	Completed bool   `json:"completed"`
	StartDate   time.Time `json:"start_date,omitempty"`             // Optional start date
	EndDate     time.Time `json:"end_date,omitempty"`               // Optional end date
	Priority    Priority  `json:"priority"` // Default to 'normal', can be 'low', 'medium', 'high'
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

}

type TodoListResponse struct {
	ID              string        `json:"id"`
	Name            string        `json:"name"`
	OwnerID         string        `json:"owner_id"`
	TodoItemsCount  int           `json:"todo_items_count"`
	Group           *GroupMinimal `json:"group,omitempty"`
	GroupID         string        `json:"group_id,omitempty"`
	SharedWith      []UserMinimal `json:"shared_with,omitempty"`
	SharedWithCount int           `json:"shared_with_count"`
	CreatedAt       time.Time     `json:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at"`
}

func (t *TodoList) BeforeCreate(tx *gorm.DB) (err error) {
	if t.ID == "" {
		t.ID = cuid.New()
	}
	return

}

func (t *Todo) BeforeCreate(tx *gorm.DB) (err error) {
	if t.ID == "" {
		t.ID = cuid.New()
	}
	return

}
