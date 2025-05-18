package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	
)

func main() {
	// Example CSV data as a string.  You can replace this with reading from a file or other source.
	csvData1 := "output.csv"
	csvData2 := "FdHeaders - Sheet1.csv"

	// Call the function to convert the CSV data to a matrix.
	matrix1, err:= CSVToMatrix(csvData1)
	matrix2, err:= CSVToMatrix(csvData2)

	matrix1 = transposeMatrix(matrix1)
	matrix2 = transposeMatrix(matrix2)

	if err != nil {
		fmt.Println("Error exporting to CSV:", err)
		return
	}
	fmt.Println(matrix1[0][1])
	fmt.Println(len(matrix1))
	fmt.Println(len(matrix1[1][100]))



	cols:= []int{2, 9, 10, 23, 26, 27, 28, 37, 38, 39, 55}
	newMatrix:= populateNewStringMatrix(matrix1, cols)
	
	numRows := len(matrix1[0])
	fmt.Println(numRows)
	numRows2 := len(matrix2[0])
	fmt.Println(numRows2)

	
	for i:=0; i < numRows; i++{
		for j:=0; j < numRows2; j++{
			if matrix1[2][i] == matrix2[0][j]{
				newMatrix[0][i] = matrix2[10][j]
			}

		}
	}


	fmt.Println(newMatrix[0][0])

	filename := "string_matrix.csv"
	err1 := exportCSV(newMatrix, filename)
	if err1 != nil {
		fmt.Println("Error exporting to CSV:", err1)
		return
	}

	fmt.Printf("String matrix successfully exported to %s\n", filename)


}


// Function to read CSV data from a string and convert it into a 2D matrix 



func readFile(file *os.File) string {
	content, err := io.ReadAll(file)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return ""
	}
	return string(content)
}

//I WROTE THIS MYSELF BUT UPGRADED WITH AI
// func matchCols (csv2Col, store []string, csv1 [][]string, col int) ([][]string, int) {

// 	matrix := make([][]string, len(csv1[col]+1))
// 	count1 := 0 
// 	count2 := 0

// 	for i:= 0; i < len(csv1); i++{
// 		for j:= 0; j < len(csv2Col); j++{
// 			if csv1[col][i] == csv2Col[j] {
// 				for z:= 0; z < len(csv1); z ++{
// 					matrix[count1][count2] = csv1[z][i]
// 					count1++
// 				}

// 				for w:= 0; w < len(store); w++{
// 					matrix[count1+1][w] = store[w]
// 				}

				
// 				//get ready for next entry
// 				count2++
// 				count1 = 0
// 			}
// 		}

// 	}

// 	return matrix, count2
// }



// func addEmptyColumn(matrix [][]string) [][]string {
// 	if len(matrix) == 0 {
// 		return [][]string{} // Handle empty matrix case
// 	}

// 	numRows := len(matrix)
// 	newMatrix := make([][]string, numRows)

// 	for i := 0; i < numRows; i++ {
// 		newMatrix[i] = make([]string, len(matrix[i])+1) // Create a new row with one extra element
// 		// The first element of the new row is uninitialized (will be for input)
// 		for j := 0; j < len(matrix[i]); j++ {
// 			newMatrix[i][j+1] = matrix[i][j] // Shift existing elements to the right
// 		}
// 	}

// 	return newMatrix
// }
func CSVToMatrix(filename string) ([][]string, error) {
	// Open the CSV file.  This is crucial to handle errors robustly.
	file, err := os.Open(filename)
	if err != nil {
		return nil, fmt.Errorf("error opening file: %w", err) // Wrap for more context
	}
	defer file.Close() // Ensure file is closed after function execution

	// Create a new CSV reader.
	reader := csv.NewReader(file)

	// Initialize the matrix (2D slice) to store the data.
	var matrix [][]string

	// Read the CSV rows one by one.  This is the core logic.
	for {
		row, err := reader.Read()
		if err != nil {
			if err == io.EOF {
				break // End of file reached, exit the loop
			}
			return nil, fmt.Errorf("error reading CSV row: %w", err) // Wrap the error
		}
		// Append the row to the matrix.  Go's append is efficient for this.
		matrix = append(matrix, row)
	}
	return matrix, nil
}


func exportCSV(matrix [][]string, filename string) error {
	file, err := os.Create(filename)
	if err != nil {
		return fmt.Errorf("failed to create CSV file: %w", err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	for _, row := range matrix {
		if err := writer.Write(row); err != nil {
			return fmt.Errorf("failed to write row to CSV: %w", err)
		}
	}

	return nil
}

func populateNewStringMatrix(oldMatrix [][]string, columnIndices []int) [][]string {
	if len(oldMatrix) == 0 || len(columnIndices) == 0 {
		return [][]string{}
	}

	numRows := len(oldMatrix)
	numCols := len(columnIndices)
	newMatrix := make([][]string, numRows)

	for i := 0; i < numRows; i++ {
		newMatrix[i] = make([]string, numCols)
		for j, colIndex := range columnIndices {
			if colIndex >= 0 && colIndex < len(oldMatrix[i]) {
				newMatrix[i][j] = oldMatrix[i][colIndex]
			} else {
				fmt.Printf("Warning: Column index %d is out of bounds for row %d. Using default value \"\".\n", colIndex, i)
				newMatrix[i][j] = "" // Default to an empty string for out-of-bounds
			}
		}
	}

	return newMatrix
}

func transposeMatrix(matrix [][]string) [][]string {
	// Check for edge cases: nil matrix or zero rows/columns.
	if matrix == nil || len(matrix) == 0 || len(matrix[0]) == 0 {
		return nil // Return nil for an empty matrix
	}

	// Get the dimensions of the original matrix.
	rows := len(matrix)
	cols := len(matrix[0])

	// Create a new matrix with dimensions swapped (cols x rows).
	transposed := make([][]string, cols) // Initialize the outer slice (number of rows in transposed = number of cols in original)
	for i := range transposed {
		transposed[i] = make([]string, rows) // Initialize the inner slices (number of cols in transposed = number of rows in original)
	}

	// Iterate through the original matrix and fill the transposed matrix.
	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			transposed[j][i] = matrix[i][j] // The core logic of transposition: swap indices
		}
	}

	return transposed
}