package models

import (
	"time"

	"github.com/lucsky/cuid"
	"gorm.io/gorm"
)

// A Group of users who can share todo lists, Not Required but can be a good way to structure the lists
type Group struct {
	ID          string `json:"id" gorm:"primaryKey;unique;not null"`
	Name        string `json:"name"`
	Description string `json:"description"`

	GroupMembers []User     `gorm:"many2many:group_members;" json:"members"`
	TodoLists    []TodoList `gorm:"foreignKey:GroupID;references:ID" json:"todo_lists"`

	Owner   User   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	OwnerID string `json:"owner_id" gorm:"index,foreignKey:OwnerID"` // User FK

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"` // `omitempty` hides if null
}

type GroupMinimal struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
}

type GroupResponse struct {
	ID            string     `json:"id"`
	Name          string     `json:"name"`
	Description   string     `json:"description"`
	MembersCount  int        `json:"members_count"`
	GroupMembers  []User     `json:"members,omitempty"`
	TodoLists     []TodoList `json:"todo_lists,omitempty"`
	TodoListCount int        `json:"todo_lists_count"`
	OwnerID       string     `json:"owner_id,omitempty"`
}

func (g *Group) BeforeCreate(tx *gorm.DB) (err error) {
	if g.ID == "" {
		g.ID = cuid.New()
	}
	return

}
