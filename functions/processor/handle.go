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

	// Run Handle function every 10 seconds in a goroutine
	go func() {
		ticker := time.NewTicker(10 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				ctx := context.Background()
				Handle(ctx, nil, nil) // You can pass nil or mock objects here
			}
		}
	}()

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
	UserId    string `json:"user_id,omitempty" bson:"user_id,omitempty"`
	Expired   bool `json:"expired,omitempty" bson:"expired,omitempty"`
	Date      time.Time `json:"date,omitempty" bson:"date,omitempty"`
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

	
	// Load the IST time zone

	// istLocation, err := time.LoadLocation("Asia/Kolkata")
	// if err != nil {
	// 	log.Fatal("Error loading IST time zone:", err)
	// 	return
	// }

	// // Get the current time in IST
	// currentDate := time.Now().In(istLocation).Truncate(time.Minute)
	// fmt.Printf("Current time: %v\n", currentDate)

	// // Truncate seconds part
	// currentDateIST := currentDate.Truncate(time.Minute)

	// // Calculate the next minute to include records up to the next minute
	// nextMinute := currentDateIST.Add(time.Minute)

	// fmt.Println("Next minute: %v\n", nextMinute);

	// // Define the filter to get all documents
	// filter := bson.D{
	// 	{"date", bson.D{
	// 		{"$gte", currentDateIST},
	// 		{"$lt", nextMinute},
	// 	}},
	// }

	// Get the current time in UTC
	currentDateUTC := time.Now().UTC().Truncate(time.Minute)

	// Add 5 hours and 30 minutes to the current time in UTC, so that it matchs indian time
	currentDateUTC = currentDateUTC.Add(5*time.Hour + 30*time.Minute)

	// Calculate the next minute to include records up to the next minute
	nextMinute := currentDateUTC.Add(time.Minute)

	fmt.Printf("Current time in UTC: %v\n", currentDateUTC)
	fmt.Printf("Next minute in UTC: %v\n", nextMinute)

	// Define the filter to get all documents
	filter := bson.D{
		{"date", bson.D{
			{"$gte", currentDateUTC},
			{"$lt", nextMinute},
		}},
	}


    // Define the projection to include only specific fields in the result
    projection := bson.D{
        {"_id", 1},
        {"title", 1},
        {"description", 1},
		{"user_id", 1},
		{"expired", 1},
		{"date", 1},
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

	fmt.Println("Received request")

	// fetch the data from the database
	fetchDataFromDatabase();

	// If the request is not null it will process the request async and return
	if req != nil {
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
	} else {
		fmt.Println("HTTP Request is nil\n")
	}
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
    if req != nil {
        fmt.Fprintf(b, "%v %v %v %v\n", req.Method, req.URL, req.Proto, req.Host)
        for k, vv := range req.Header {
            for _, v := range vv {
                fmt.Fprintf(b, "  %v: %v\n", k, v)
            }
        }
    } else {
        fmt.Fprintf(b, "HTTP Request is nil\n")
    }
    return b.String()
}

