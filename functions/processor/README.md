# Go HTTP Function

Welcome to your new Go Function! The boilerplate function code can be found in
[`handle.go`](handle.go). This Function responds to HTTP requests.

## Development

Develop new features by adding a test to [`handle_test.go`](handle_test.go) for
each feature, and confirm it works with `go test`.

Update the running analog of the function using the `func` CLI or client
library, and it can be invoked from your browser or from the command line:

```console
curl http://myfunction.example.com/
```

## How to run this function ?

#### Running using go cmd :

1. Change "package function" to "package main"
2. Run the function using "go run handle.go"

```
go run handle.go
```

#### Running using func[knative] cmd :
1. Change "package main" to "package function"
2. Run the function using "func run"

```
func run
```
For more, see [the complete documentation]('https://github.com/knative/func/tree/main/docs')


