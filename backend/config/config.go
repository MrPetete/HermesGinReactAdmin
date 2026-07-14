package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

// Config is the top-level application configuration.
type Config struct {
	Server   ServerConfig   `yaml:"server"`
	Database DatabaseConfig `yaml:"database"`
	JWT      JWTConfig      `yaml:"jwt"`
	AI       AIConfig       `yaml:"ai"`
	CORS     CORSConfig     `yaml:"cors"`
}

type ServerConfig struct {
	Port string `yaml:"port"`
	Mode string `yaml:"mode"`
}

type DatabaseConfig struct {
	Driver string `yaml:"driver"`
	DSN    string `yaml:"dsn"`
}

type JWTConfig struct {
	Secret     string `yaml:"secret"`
	Expire     int    `yaml:"expire_hours"`
}

type AIConfig struct {
	Provider    string  `yaml:"provider"`
	BaseURL     string  `yaml:"base_url"`
	APIKey      string  `yaml:"api_key"`
	Model       string  `yaml:"model"`
	MaxTokens   int     `yaml:"max_tokens"`
	Temperature float64 `yaml:"temperature"`
}

type CORSConfig struct {
	AllowOrigins []string `yaml:"allow_origins"`
}

// Load reads config.yaml (if present) then applies environment overrides.
func Load(path string) (*Config, error) {
	c := defaultConfig()
	if data, err := os.ReadFile(path); err == nil {
		if err := yaml.Unmarshal(data, c); err != nil {
			return nil, fmt.Errorf("parse config %s: %w", path, err)
		}
	}
	// Environment overrides (12-factor friendly).
	if v := os.Getenv("PORT"); v != "" {
		c.Server.Port = v
	}
	if v := os.Getenv("DB_DSN"); v != "" {
		c.Database.DSN = v
	}
	if v := os.Getenv("JWT_SECRET"); v != "" {
		c.JWT.Secret = v
	}
	if v := os.Getenv("AI_PROVIDER"); v != "" {
		c.AI.Provider = v
	}
	if v := os.Getenv("AI_BASE_URL"); v != "" {
		c.AI.BaseURL = v
	}
	if v := os.Getenv("AI_API_KEY"); v != "" {
		c.AI.APIKey = v
	}
	if v := os.Getenv("AI_MODEL"); v != "" {
		c.AI.Model = v
	}
	return c, nil
}

func defaultConfig() *Config {
	return &Config{
		Server:   ServerConfig{Port: "8080", Mode: "debug"},
		Database: DatabaseConfig{Driver: "sqlite", DSN: "data/app.db"},
		JWT:      JWTConfig{Secret: "ruyi-ai-admin-secret-change-me", Expire: 24},
		AI: AIConfig{
			Provider:    "mock",
			BaseURL:     "https://api.openai.com/v1",
			APIKey:      "",
			Model:       "gpt-4o-mini",
			MaxTokens:   1024,
			Temperature: 0.7,
		},
		CORS: CORSConfig{AllowOrigins: []string{"*"}},
	}
}
