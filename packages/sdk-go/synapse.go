package synapse

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// Client represents the Synapse API Gateway client
type Client struct {
	APIKey     string
	BaseURL    string
	HTTPClient *http.Client
}

// NewClient initializes a new Synapse Client
func NewClient(apiKey string, baseURL string) (*Client, error) {
	if apiKey == "" {
		return nil, errors.New("apiKey cannot be empty")
	}
	if baseURL == "" {
		baseURL = "https://gateway.synapse.dev/v1"
	}
	return &Client{
		APIKey:  apiKey,
		BaseURL: strings.TrimRight(baseURL, "/"),
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}, nil
}

// VerifyWebhookSignature validates an HMAC-SHA256 signature from Synapse Webhook engine
func VerifyWebhookSignature(payload []byte, header string, secretKey string, toleranceSeconds int64) bool {
	parts := strings.Split(header, ",")
	var timestamp int64
	var signature string

	for _, part := range parts {
		kv := strings.Split(part, "=")
		if len(kv) == 2 {
			if kv[0] == "t" {
				timestamp, _ = strconv.ParseInt(kv[1], 10, 64)
			} else if kv[0] == "v1" {
				signature = kv[1]
			}
		}
	}

	if timestamp == 0 || signature == "" {
		return false
	}

	now := time.Now().Unix()
	if now-timestamp > toleranceSeconds || timestamp-now > toleranceSeconds {
		return false
	}

	mac := hmac.New(sha256.New, []byte(secretKey))
	mac.Write([]byte(fmt.Sprintf("t=%d,v1=%s", timestamp, string(payload))))
	expectedSignature := hex.EncodeToString(mac.Sum(nil))

	return hmac.Equal([]byte(signature), []byte(expectedSignature))
}
