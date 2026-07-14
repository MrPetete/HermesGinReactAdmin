package controller

import (
	"github.com/gin-gonic/gin"

	"backend/internal/ai"
	"backend/internal/database"
	"backend/internal/response"
	"backend/model"
)

// DashboardController serves aggregate analytics for the admin home page.
type DashboardController struct {
	ai ai.Provider
}

func NewDashboardController(provider ai.Provider) *DashboardController {
	return &DashboardController{ai: provider}
}

// Overview returns counts and recent activity.
func (d *DashboardController) Overview(c *gin.Context) {
	var users, docs int64
	database.DB.Model(&model.User{}).Count(&users)
	database.DB.Model(&model.Document{}).Count(&docs)

	var recentDocs []model.Document
	database.DB.Order("id desc").Limit(5).Find(&recentDocs)
	hydrateOwner(recentDocs)

	response.OK(c, gin.H{
		"stats": gin.H{
			"users":       users,
			"documents":   docs,
			"roles":       rolesBreakdown(),
		},
		"recent_documents": recentDocs,
	})
}

func rolesBreakdown() map[string]int64 {
	out := map[string]int64{}
	for _, r := range []model.Role{model.RoleAdmin, model.RoleManager, model.RoleViewer} {
		var n int64
		database.DB.Model(&model.User{}).Where("role = ?", r).Count(&n)
		out[string(r)] = n
	}
	return out
}

// Insights asks the AI provider to summarize the current system state.
func (d *DashboardController) Insights(c *gin.Context) {
	var users, docs int64
	database.DB.Model(&model.User{}).Count(&users)
	database.DB.Model(&model.Document{}).Count(&docs)

	stats := ai.BuildContext([]model.Document{
		{Title: "System users", Summary: "There are " + itoa(users) + " registered users across the platform."},
		{Title: "Documents", Summary: "There are " + itoa(docs) + " documents in the knowledge base."},
	}, 2)

	messages := []ai.Message{
		{Role: "system", Content: "You are an operations analyst for an AI-driven admin system. Given the metrics below, write 3 concise, actionable insight bullets."},
		{Role: "user", Content: "Metrics:\n" + stats},
	}
	answer, err := d.ai.Chat(c.Request.Context(), messages)
	if err != nil {
		response.Fail(c, 502, "AI provider error: "+err.Error())
		return
	}
	response.OK(c, gin.H{"insights": answer})
}
