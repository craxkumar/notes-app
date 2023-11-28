package function

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// Handle an HTTP Request.
func Handle(ctx context.Context, res http.ResponseWriter, req *http.Request) {
	/*
	 * YOUR CODE HERE
	 *
	 * Try running `go test`.  Add more test as you code in `handle_test.go`.
	 */

	fmt.Println("Received request")
	 b := &strings.Builder{}
	jsonBodyStr, err := ParseJSONBody(req)
	if err != nil {
		fmt.Println(b, "%v\n", err)
		http.Error(res, "Error processing JSON body", http.StatusBadRequest)
		return
	}

	// Call processRemindersAndSendEvents asynchronously using a goroutine
	go func() {
		result := processRemindersAndSendEvents(jsonBodyStr)
		fmt.Println(result)
	}()
		
	// fmt.Println(prettyPrint(req))      // echo to local output
	fmt.Fprintf(res, prettyPrint(req)) // echo to caller
}

// ParseJSONBody parses and validates the JSON body of the request.
// If successful, it returns the parsed and marshaled JSON body as a string; otherwise, it returns an error.
func ParseJSONBody(req *http.Request) (string, error) {
	req.ParseForm()

	var jsonBody interface{}
	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&jsonBody); err == io.EOF {
		// Do nothing, EOF is not an error
	} else if err != nil {
		return "", fmt.Errorf("Error decoding JSON body: %v", err)
	}

	// Use the body interface{} as needed.
	// In this example, it prints the JSON representation.
	jsonBodyStr, err := json.MarshalIndent(jsonBody, "", "  ")
	if err != nil {
		return "", fmt.Errorf("Error marshaling JSON body: %v", err)
	}

	return string(jsonBodyStr), nil
}

// Your reminder processing logic will go here.
func processRemindersAndSendEvents(jsonBody interface{}) string {
	b := &strings.Builder{}
	fmt.Fprintf(b, "%s\n", jsonBody)

	// Add a sleep of 5 seconds inside the asynchronous operation
	time.Sleep(5 * time.Second)
	fmt.Println("Asynchronous operation completed after sleep")
	return b.String()

}

func prettyPrint(req *http.Request) string {
    b := &strings.Builder{}
    fmt.Fprintf(b, "%v %v %v %v\n", req.Method, req.URL, req.Proto, req.Host)
    for k, vv := range req.Header {
        for _, v := range vv {
            fmt.Fprintf(b, "  %v: %v\n", k, v)
        }
    }
    return b.String()
}
