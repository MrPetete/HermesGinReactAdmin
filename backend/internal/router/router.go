package router

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"backend/config"
	"backend/internal/ai"
	"backend/internal/controller"
	"backend/internal/middleware"
	"backend/model"
)

// Setup builds the Gin engine with all routes wired.
func Setup(cfg *config.Config) *gin.Engine {
	if cfg.Server.Mode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORS.AllowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	provider := ai.NewProvider(&cfg.AI)

	// Health
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "ai_provider": cfg.AI.Provider})
	})

	// Auth
	auth := controller.NewAuthController(&cfg.JWT)
	r.POST("/api/auth/login", auth.Login)

	// Protected API
	api := r.Group("/api")
	api.Use(middleware.JWT(cfg.JWT.Secret))
	{
		api.GET("/auth/me", auth.Me)
		api.POST("/auth/password", auth.ChangePassword)

		// Dashboard
		dash := controller.NewDashboardController(provider)
		api.GET("/dashboard/overview", dash.Overview)
		api.GET("/dashboard/insights", dash.Insights)

		// Documents
		doc := &controller.DocumentController{}
		api.GET("/documents", doc.List)
		api.GET("/documents/:id", doc.Get)
		api.POST("/documents", middleware.RequireRole(model.RoleAdmin, model.RoleManager), doc.Create)
		api.PUT("/documents/:id", middleware.RequireRole(model.RoleAdmin, model.RoleManager), doc.Update)
		api.DELETE("/documents/:id", middleware.RequireRole(model.RoleAdmin), doc.Delete)

		// Users (admin only)
		uc := &controller.UserController{}
		api.GET("/users", middleware.RequireRole(model.RoleAdmin), uc.List)
		api.POST("/users", middleware.RequireRole(model.RoleAdmin), uc.Create)
		api.PUT("/users/:id", middleware.RequireRole(model.RoleAdmin), uc.Update)
		api.DELETE("/users/:id", middleware.RequireRole(model.RoleAdmin), uc.Delete)

		// AI features
		aiCtrl := controller.NewAIController(provider)
		api.POST("/ai/chat", aiCtrl.Chat)
		api.GET("/ai/search", aiCtrl.SmartSearch)
		api.POST("/ai/documents/:id/ask", aiCtrl.Ask)
	}

	return r
}
