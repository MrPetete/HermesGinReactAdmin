package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sort"
	"strings"
	"time"

	"server/config"
	"server/model"
)

// Provider is the AI backend abstraction. Implementations: mock, openai.
type Provider interface {
	Chat(ctx context.Context, messages []Message) (string, error)
}

// Message is a single chat turn.
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// NewProvider builds the configured AI provider.
func NewProvider(cfg *config.AIConfig) Provider {
	switch strings.ToLower(cfg.Provider) {
	case "openai", "azure", "openrouter", "anthropic-via-openai":
		return &OpenAIProvider{cfg: cfg}
	default:
		return &MockProvider{}
	}
}

// ---------- Mock provider (no API key required) ----------

// MockProvider generates canned but context-aware responses.
type MockProvider struct{}

func (m *MockProvider) Chat(ctx context.Context, messages []Message) (string, error) {
	last := ""
	for _, mmsg := range messages {
		if mmsg.Role == "user" {
			last = mmsg.Content
		}
	}
	prompt := strings.ToLower(last)

	switch {
	case strings.Contains(prompt, "summar"):
		return "Summary: This request asks for a summary. In a production deployment the configured LLM would condense the source text into key bullet points. (Mock provider active — set AI_PROVIDER=openai with AI_API_KEY to enable a real model.)", nil
	case strings.Contains(prompt, "translate"):
		return "(Mock) Translation would appear here once a real provider is configured. The mock provider keeps the system fully runnable with zero external dependencies.", nil
	case strings.Contains(prompt, "code"), strings.Contains(prompt, "function"), strings.Contains(prompt, "bug"):
		return "```go\n// Mock code suggestion\nfunc Suggest() string {\n\treturn \"wire up AI_PROVIDER=openai for real completions\"\n}\n```", nil
	default:
		return fmt.Sprintf("This is a mock AI response to: %q. Configure AI_PROVIDER=openai and AI_API_KEY to get real LLM answers. The API contract is identical, so no application code changes are needed.", last), nil
	}
}

// ---------- OpenAI-compatible provider ----------

type OpenAIProvider struct {
	cfg *config.AIConfig
}

type openAIRequest struct {
	Model       string   `json:"model"`
	Messages    []Message `json:"messages"`
	MaxTokens   int       `json:"max_tokens"`
	Temperature float64   `json:"temperature"`
}

type openAIResponse struct {
	Choices []struct {
		Message Message `json:"message"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error"`
}

func (o *OpenAIProvider) Chat(ctx context.Context, messages []Message) (string, error) {
	body := openAIRequest{
		Model:       o.cfg.Model,
		Messages:    messages,
		MaxTokens:   o.cfg.MaxTokens,
		Temperature: o.cfg.Temperature,
	}
	payload, _ := json.Marshal(body)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, strings.TrimRight(o.cfg.BaseURL, "/")+"/chat/completions", bytes.NewReader(payload))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+o.cfg.APIKey)

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	data, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("AI provider returned %d: %s", resp.StatusCode, string(data))
	}
	var oa openAIResponse
	if err := json.Unmarshal(data, &oa); err != nil {
		return "", err
	}
	if oa.Error != nil {
		return "", fmt.Errorf("AI provider error: %s", oa.Error.Message)
	}
	if len(oa.Choices) == 0 {
		return "", fmt.Errorf("AI provider returned no choices")
	}
	return oa.Choices[0].Message.Content, nil
}

// ---------- Document-aware helpers (used by controllers) ----------

// rankDocuments returns documents sorted by keyword relevance to a query.
func RankDocuments(docs []model.Document, query string) []model.Document {
	terms := strings.Fields(strings.ToLower(query))
	if len(terms) == 0 {
		return docs
	}
	type scored struct {
		doc   model.Document
		score int
	}
	scoredList := make([]scored, 0, len(docs))
	for _, d := range docs {
		hay := strings.ToLower(d.Title + " " + d.Tags + " " + d.Content)
		s := 0
		for _, t := range terms {
			if strings.Contains(hay, t) {
				s++
			}
		}
		if s > 0 {
			scoredList = append(scoredList, scored{d, s})
		}
	}
	sort.SliceStable(scoredList, func(i, j int) bool { return scoredList[i].score > scoredList[j].score })
	out := make([]model.Document, 0, len(scoredList))
	for _, s := range scoredList {
		out = append(out, s.doc)
	}
	return out
}

// BuildContext concatenates the top documents into a retrieval context.
func BuildContext(docs []model.Document, max int) string {
	if max <= 0 || max > len(docs) {
		max = len(docs)
	}
	var b strings.Builder
	for i, d := range docs[:max] {
		fmt.Fprintf(&b, "[%d] %s\n%s\n\n", i+1, d.Title, d.Summary)
	}
	return b.String()
}
