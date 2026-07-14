package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"backend/config"
	"backend/model"
)

// Claims is the JWT payload.
type Claims struct {
	UserID   uint       `json:"uid"`
	Username string     `json:"username"`
	Role     model.Role `json:"role"`
	jwt.RegisteredClaims
}

// GenerateToken issues a signed JWT for a user.
func GenerateToken(cfg *config.JWTConfig, u *model.User) (string, error) {
	claims := Claims{
		UserID:   u.ID,
		Username: u.Username,
		Role:     u.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(cfg.Expire) * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   u.Username,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.Secret))
}

// ParseToken validates and decodes a JWT.
func ParseToken(secret, tokenStr string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return nil, err
	}
	return claims, nil
}

// JWT returns a Gin middleware that enforces a valid bearer token.
func JWT(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		ah := c.GetHeader("Authorization")
		if !strings.HasPrefix(ah, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid Authorization header"})
			return
		}
		claims, err := ParseToken(secret, strings.TrimPrefix(ah, "Bearer "))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}
		c.Set("claims", claims)
		c.Next()
	}
}

// RequireRole returns a middleware that allows only the listed roles.
func RequireRole(allowed ...model.Role) gin.HandlerFunc {
	set := make(map[model.Role]struct{}, len(allowed))
	for _, r := range allowed {
		set[r] = struct{}{}
	}
	return func(c *gin.Context) {
		cl, ok := c.Get("claims")
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		claims := cl.(*Claims)
		if _, ok := set[claims.Role]; !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "insufficient permissions"})
			return
		}
		c.Next()
	}
}

// CurrentUser extracts the authenticated claims from the context.
func CurrentUser(c *gin.Context) *Claims {
	cl, ok := c.Get("claims")
	if !ok {
		return nil
	}
	return cl.(*Claims)
}
