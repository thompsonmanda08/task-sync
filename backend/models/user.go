package models

import (
	"time"

	"github.com/lucsky/cuid"
	"gorm.io/gorm"
)

type Permission struct {
	ID        string         `json:"id" gorm:"primaryKey;unique;not null"`
	Name      string         `json:"name" gorm:"unique"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"` // `omitempty` hides if null
}

func (p *Permission) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == "" {
		p.ID = cuid.New()
	}
	return
}

type Role struct {
	ID          string         `json:"id" gorm:"primaryKey;unique;not null"`
	Name        string         `json:"name"`
	Permissions []Permission   `gorm:"many2many:role_permissions;" json:"permissions"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"` // `omitempty` hides if null
}

func (r *Role) BeforeCreate(tx *gorm.DB) (err error) {
	if r.ID == "" {
		r.ID = cuid.New()
	}
	return
}

type RoleResponse struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Permissions []string  `json:"permissions"` // Array of permission names (strings)
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type UserGroupRoleMapping struct {
	ID        string         `json:"id" gorm:"primaryKey;unique;not null"`
	UserID    string         `gorm:"index" json:"user_id"`
	GroupID   string         `gorm:"index" json:"group_id"`
	RoleID    string         `gorm:"index" json:"role_id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`

	// Define relationships
	User  User  `gorm:"foreignKey:UserID"`
	Group Group `gorm:"foreignKey:GroupID"` // This might not be strictly needed here if preloading from Group
	Role  Role  `gorm:"foreignKey:RoleID"`
}

func (mapping *UserGroupRoleMapping) BeforeCreate(tx *gorm.DB) (err error) {
	if mapping.ID == "" {
		mapping.ID = cuid.New()
	}
	return
}

type User struct {
	ID        string         `json:"id" gorm:"primaryKey;unique;not null"`
	Name      string         `json:"name" gorm:"not null"`               // Not null, can be empty
	Email     string         `json:"email" gorm:"unique;not null;index"` // Unique email, not null
	Password  string         `json:"-"`
	Image     string         `json:"profile_picture"`                                    // Hashed password
	Groups    []Group        `gorm:"many2many:group_members;" json:"groups"`             // Many-to-many relationship with Group
	TodoLists []TodoList     `gorm:"foreignKey:OwnerID;references:ID" json:"todo_lists"` // List of todo lists owned by the user
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"` // `omitempty` hides if null
}

type UserMinimal struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	GroupRole string `json:"role,omitempty"`
}

func (user *User) BeforeCreate(tx *gorm.DB) (err error) {
	if user.ID == "" {
		user.ID = cuid.New()
	}
	return

}
