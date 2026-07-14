package controller

import (
	"strconv"

	"github.com/gin-gonic/gin"

	"backend/internal/ai"
	"backend/internal/database"
	"backend/internal/response"
	"backend/model"
)

// AIController exposes the chat assistant, smart search, and document Q&A.
type AIController struct {
	provider ai.Provider
}

func NewAIController(provider ai.Provider) *AIController {
	return &AIController{provider: provider}
}

// Chat handles a free-form chat turn. Body: { messages: [{role,content}] }.
func (a *AIController) Chat(c *gin.Context) {
	var req struct {
		Messages []ai.Message `json:"messages" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || len(req.Messages) == 0 {
		response.BadRequest(c, "messages array required")
		return
	}
	system := ai.Message{Role: "system", Content: "You are Ruyi, a helpful AI assistant embedded in an admin management system. Answer clearly and concisely."}
	turns := append([]ai.Message{system}, req.Messages...)
	answer, err := a.provider.Chat(c.Request.Context(), turns)
	if err != nil {
		response.Fail(c, 502, "AI provider error: "+err.Error())
		return
	}
	response.OK(c, gin.H{"answer": answer})
}

// SmartSearch ranks documents by relevance and lets the AI synthesize results.
func (a *AIController) SmartSearch(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		response.BadRequest(c, "query param 'q' required")
		return
	}
	var docs []model.Document
	database.DB.Find(&docs)
	ranked := ai.RankDocuments(docs, query)
	if len(ranked) > 8 {
		ranked = ranked[:8]
	}
	ctxText := ai.BuildContext(ranked, len(ranked))
	messages := []ai.Message{
		{Role: "system", Content: "You are a smart search assistant. Use the retrieved context to answer the query. Cite document titles."},
		{Role: "user", Content: "Context:\n" + ctxText + "\n\nQuery: " + query},
	}
	answer, err := a.provider.Chat(c.Request.Context(), messages)
	if err != nil {
		response.Fail(c, 502, "AI provider error: "+err.Error())
		return
	}
	response.OK(c, gin.H{
		"answer":   answer,
		"results":  ranked,
		"count":    len(ranked),
	})
}

// Ask handles a question about a specific document (document Q&A).
func (a *AIController) Ask(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	var doc model.Document
	if err := database.DB.First(&doc, id).Error; err != nil {
		response.NotFound(c, "document not found")
		return
	}
	var req struct {
		Question string `json:"question" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "question required")
		return
	}
	messages := []ai.Message{
		{Role: "system", Content: "You answer questions strictly based on the provided document."},
		{Role: "user", Content: "Document title: " + doc.Title + "\nDocument content:\n" + doc.Content + "\n\nQuestion: " + req.Question},
	}
	answer, err := a.provider.Chat(c.Request.Context(), messages)
	if err != nil {
		response.Fail(c, 502, "AI provider error: "+err.Error())
		return
	}
	response.OK(c, gin.H{"answer": answer, "document": doc.Title})
}
