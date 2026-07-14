package controller

import (
	"strconv"

	"github.com/gin-gonic/gin"

	"server/internal/database"
	"server/internal/middleware"
	"server/internal/response"
	"server/model"
)

// DocumentController manages knowledge-base documents.
type DocumentController struct{}

func (dc *DocumentController) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "10"))
	kw := c.Query("keyword")
	if page < 1 {
		page = 1
	}
	if size < 1 || size > 100 {
		size = 10
	}
	q := database.DB.Model(&model.Document{})
	if kw != "" {
		q = q.Where("title LIKE ? OR content LIKE ? OR tags LIKE ?", "%"+kw+"%", "%"+kw+"%", "%"+kw+"%")
	}
	var docs []model.Document
	var total int64
	q.Count(&total)
	q.Order("id desc").Offset((page - 1) * size).Limit(size).Find(&docs)
	hydrateOwner(docs)
	response.OK(c, gin.H{"items": docs, "total": total, "page": page, "size": size})
}

func (dc *DocumentController) Get(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	var d model.Document
	if err := database.DB.First(&d, id).Error; err != nil {
		response.NotFound(c, "document not found")
		return
	}
	response.OK(c, d)
}

type docRequest struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content"`
	Tags    string `json:"tags"`
	Summary string `json:"summary"`
}

func (dc *DocumentController) Create(c *gin.Context) {
	var req docRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "title required")
		return
	}
	claims := middleware.CurrentUser(c)
	d := model.Document{
		Title:   req.Title,
		Content: req.Content,
		Tags:    req.Tags,
		Summary: req.Summary,
		OwnerID: claims.UserID,
	}
	database.DB.Create(&d)
	response.Created(c, d)
}

func (dc *DocumentController) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	var d model.Document
	if err := database.DB.First(&d, id).Error; err != nil {
		response.NotFound(c, "document not found")
		return
	}
	var req docRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid body")
		return
	}
	d.Title = req.Title
	d.Content = req.Content
	d.Tags = req.Tags
	d.Summary = req.Summary
	database.DB.Save(&d)
	response.OK(c, d)
}

func (dc *DocumentController) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if err := database.DB.Delete(&model.Document{}, id).Error; err != nil {
		response.Fail(c, 500, "delete failed")
		return
	}
	response.OK(c, gin.H{"deleted": id})
}

func hydrateOwner(docs []model.Document) {
	ids := make([]uint, 0, len(docs))
	for _, d := range docs {
		ids = append(ids, d.OwnerID)
	}
	var users []model.User
	database.DB.Where("id IN ?", ids).Find(&users)
	byID := make(map[uint]string, len(users))
	for _, u := range users {
		byID[u.ID] = u.Username
	}
	for i := range docs {
		docs[i].OwnerName = byID[docs[i].OwnerID]
	}
}
