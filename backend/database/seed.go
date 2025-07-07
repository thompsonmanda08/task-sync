package database

import (
	"github.com/thompsonmanda08/task-sync/models"
	"gorm.io/gorm"
)

func SeedRolesAndPermissions(db *gorm.DB) error {
	// 1. Define permission names
	permissionNames := []string{"view", "edit", "invite", "delete_todo", "delete_list", "change_role"}
	var permissions []models.Permission

	for _, name := range permissionNames {
		var perm models.Permission
		err := db.FirstOrCreate(&perm, models.Permission{Name: name}).Error
		if err != nil {
			return err
		}
		permissions = append(permissions, perm)
	}

	// 2. Helper to find permission by name
	findPerm := func(name string) *models.Permission {
		for _, p := range permissions {
			if p.Name == name {
				return &p
			}
		}
		return nil
	}

	// 3. Define roles and the permission names they include
	roles := []struct {
		Name            string
		PermissionNames []string
	}{
		{"Owner", []string{"view", "edit", "invite", "delete_todo", "delete_list", "change_role"}},
		{"Contributor", []string{"view", "edit"}},
		{"Viewer", []string{"view"}},
	}

	for _, r := range roles {
		var role models.Role
		err := db.FirstOrCreate(&role, models.Role{Name: r.Name}).Error
		if err != nil {
			return err
		}

		// Match permission objects
		var rolePerms []models.Permission
		for _, pname := range r.PermissionNames {
			if perm := findPerm(pname); perm != nil {
				rolePerms = append(rolePerms, *perm)
			}
		}

		// Set up role-permission associations
		err = db.Model(&role).Association("Permissions").Replace(&rolePerms)
		if err != nil {
			return err
		}
	}

	return nil
}
