package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// OK writes a successful JSON response.
func OK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, gin.H{"code": 0, "message": "ok", "data": data})
}

// Created writes a 201 response.
func Created(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, gin.H{"code": 0, "message": "created", "data": data})
}

// Fail writes an error response with the given HTTP status.
func Fail(c *gin.Context, status int, msg string) {
	c.JSON(status, gin.H{"code": 1, "message": msg, "data": nil})
}

// BadRequest is a 400 helper.
func BadRequest(c *gin.Context, msg string) { Fail(c, http.StatusBadRequest, msg) }

// Unauthorized is a 401 helper.
func Unauthorized(c *gin.Context, msg string) { Fail(c, http.StatusUnauthorized, msg) }

// Forbidden is a 403 helper.
func Forbidden(c *gin.Context, msg string) { Fail(c, http.StatusForbidden, msg) }

// NotFound is a 404 helper.
func NotFound(c *gin.Context, msg string) { Fail(c, http.StatusNotFound, msg) }
