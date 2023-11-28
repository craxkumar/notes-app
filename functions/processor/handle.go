// uncomment below line when we are running it using "func run"
// package function

// uncomment below line when we are running it in localhost, and comment out the above line
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// main function is optional when running it using  "func run"
func main() {
	/*
		The purpose of creating a context with a timeout is to associate a deadline with the request.
		If the request processing takes longer than the specified timeout, 
		the context will be canceled, and any operations associated with it will be interrupted.

		context.Background(), which creates a background context without a timeout or deadline.
	*/
	
    // Start the HTTP server
    http.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		// Create a background context
		ctx := context.Background()

		Handle(ctx, res, req)
	})
	/*
	http.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		// You can create a context here if needed
		ctx, cancel := context.WithTimeout(req.Context(), 10*time.Second)
		defer cancel()

		Handle(ctx, res, req)
	})
	*/
	fmt.Println("Running on host port 8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

// Reminder struct represents the structure of a reminder document in the database.
type Reminder struct {
	ID        string `json:"_id,omitempty" bson:"_id,omitempty"`
	Title     string `json:"title,omitempty" bson:"title,omitempty"`
	Content   string `json:"description,omitempty" bson:"description,omitempty"`
}


// MongoDB configuration
const (
	mongoURI      = "mongodb://localhost:27017" // Update with your MongoDB URI
	databaseName  = "notes-db"
	collectionName = "reminders"
)

// fetchDataFromDatabase fetches all documents of reminders from the MongoDB database.
func fetchDataFromDatabase() {
    client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
    if err != nil {
        log.Fatal("Error creating MongoDB client:", err)
        return
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    err = client.Connect(ctx)
    if err != nil {
        log.Fatal("Error connecting to MongoDB:", err)
        return
    }

    defer func() {
        if err := client.Disconnect(ctx); err != nil {
            log.Fatal("Error disconnecting from MongoDB:", err)
        }
    }()

	pingErr := client.Ping(ctx, nil)
	if pingErr != nil {
		fmt.Println(pingErr.Error())
		return
	}

    fmt.Println("Connected to MongoDB")

    // Access the reminders collection
    collection := client.Database(databaseName).Collection(collectionName)

    // Define the filter to get all documents
    filter := bson.D{}

    // Define the projection to include only specific fields in the result
    projection := bson.D{
        {"_id", 1},
        {"title", 1},
        {"description", 1},
    }

    // Query the database to get all reminders with the specified projection
    cursor, err := collection.Find(ctx, filter, options.Find().SetProjection(projection))
    if err != nil {
        log.Fatal("Error querying reminders collection:", err)
        return
    }

    defer cursor.Close(ctx)

    // Iterate over the cursor and print each reminder
    for cursor.Next(ctx) {
        var reminder *Reminder // Note the use of pointer here
        if err := cursor.Decode(&reminder); err != nil {
            log.Fatal("Error decoding reminder document:", err)
            return
        }
        fmt.Printf("Fetched Reminder: %+v\n", *reminder)
    }

    if err := cursor.Err(); err != nil {
        log.Fatal("Error iterating over cursor:", err)
    }
}


// Handle an HTTP Request.
func Handle(ctx context.Context, res http.ResponseWriter, req *http.Request) {
	/*
	 * YOUR CODE HERE
	 *
	 * Try running `go test`.  Add more test as you code in `handle_test.go`.
	 */

	fmt.Println("Received request")
	fetchDataFromDatabase();
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
