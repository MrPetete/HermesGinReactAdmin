package controller

import (
	"strconv"

	"github.com/gin-gonic/gin"

	"server/internal/database"
	"server/internal/middleware"
	"server/internal/response"
	"server/model"
)

// UserController handles user/account management (admin only).
type UserController struct{}

func (uc *UserController) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "10"))
	if page < 1 {
		page = 1
	}
	if size < 1 || size > 100 {
		size = 10
	}
	var users []model.User
	var total int64
	database.DB.Model(&model.User{}).Count(&total)
	database.DB.Order("id desc").Offset((page - 1) * size).Limit(size).Find(&users)
	response.OK(c, gin.H{
		"items": users,
		"total": total,
		"page":  page,
		"size":  size,
	})
}

type createUserRequest struct {
	Username string     `json:"username" binding:"required"`
	Email    string     `json:"email"`
	Password string     `json:"password" binding:"required,min=6"`
	Role     model.Role `json:"role"`
}

func (uc *UserController) Create(c *gin.Context) {
	var req createUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "username, password(min 6) required; role optional")
		return
	}
	if req.Role == "" {
		req.Role = model.RoleViewer
	}
	u := model.User{Username: req.Username, Email: req.Email, Role: req.Role, Status: "active"}
	if err := u.SetPassword(req.Password); err != nil {
		response.Fail(c, 500, "failed to hash password")
		return
	}
	if err := database.DB.Create(&u).Error; err != nil {
		response.Fail(c, 400, "username may already exist")
		return
	}
	response.Created(c, u)
}

func (uc *UserController) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	var u model.User
	if err := database.DB.First(&u, id).Error; err != nil {
		response.NotFound(c, "user not found")
		return
	}
	type reqT struct {
		Email  string     `json:"email"`
		Role   model.Role `json:"role"`
		Status string     `json:"status"`
	}
	var req reqT
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid body")
		return
	}
	if req.Email != "" {
		u.Email = req.Email
	}
	if req.Role != "" {
		u.Role = req.Role
	}
	if req.Status != "" {
		u.Status = req.Status
	}
	database.DB.Save(&u)
	response.OK(c, u)
}

func (uc *UserController) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	claims := middleware.CurrentUser(c)
	if claims != nil && claims.UserID == uint(id) {
		response.BadRequest(c, "cannot delete your own account")
		return
	}
	if err := database.DB.Delete(&model.User{}, id).Error; err != nil {
		response.Fail(c, 500, "delete failed")
		return
	}
	response.OK(c, gin.H{"deleted": id})
}
