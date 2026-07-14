package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"backend/config"
	"backend/internal/database"
	"backend/internal/middleware"
	"backend/internal/response"
	"backend/model"
)

type AuthController struct {
	cfg *config.JWTConfig
}

func NewAuthController(cfg *config.JWTConfig) *AuthController {
	return &AuthController{cfg: cfg}
}

type loginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Login authenticates a user and returns a JWT.
func (a *AuthController) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "username and password are required")
		return
	}
	var u model.User
	if err := database.DB.Where("username = ?", req.Username).First(&u).Error; err != nil {
		response.Unauthorized(c, "invalid credentials")
		return
	}
	if u.Status != "active" {
		response.Forbidden(c, "account is disabled")
		return
	}
	if !u.CheckPassword(req.Password) {
		response.Unauthorized(c, "invalid credentials")
		return
	}
	token, err := middleware.GenerateToken(a.cfg, &u)
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "failed to issue token")
		return
	}
	response.OK(c, gin.H{
		"token": token,
		"user":  u,
	})
}

// Me returns the currently authenticated user.
func (a *AuthController) Me(c *gin.Context) {
	claims := middleware.CurrentUser(c)
	if claims == nil {
		response.Unauthorized(c, "unauthorized")
		return
	}
	var u model.User
	if err := database.DB.First(&u, claims.UserID).Error; err != nil {
		response.NotFound(c, "user not found")
		return
	}
	response.OK(c, u)
}

// ChangePassword lets the current user change their password.
func (a *AuthController) ChangePassword(c *gin.Context) {
	claims := middleware.CurrentUser(c)
	type reqT struct {
		Old string `json:"old" binding:"required"`
		New string `json:"new" binding:"required,min=6"`
	}
	var req reqT
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "old and new (min 6 chars) required")
		return
	}
	var u model.User
	if err := database.DB.First(&u, claims.UserID).Error; err != nil {
		response.NotFound(c, "user not found")
		return
	}
	if !u.CheckPassword(req.Old) {
		response.BadRequest(c, "current password is incorrect")
		return
	}
	if err := u.SetPassword(req.New); err != nil {
		response.Fail(c, http.StatusInternalServerError, "failed to set password")
		return
	}
	database.DB.Save(&u)
	response.OK(c, gin.H{"changed": true})
}
