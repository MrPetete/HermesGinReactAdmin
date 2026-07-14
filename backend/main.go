package main

import (
	"log"

	"server/config"
	"server/internal/database"
	"server/internal/router"
)

func main() {
	cfg, err := config.Load("config.yaml")
	if err != nil {
		log.Fatalf("config error: %v", err)
	}
	if err := database.Init(&cfg.Database); err != nil {
		log.Fatalf("database error: %v", err)
	}
	r := router.Setup(cfg)
	addr := ":" + cfg.Server.Port
	log.Printf("🚀 Ruyi AI Admin API listening on %s (ai=%s)", addr, cfg.AI.Provider)
	if err := r.Run(addr); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
