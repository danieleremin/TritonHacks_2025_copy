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
	matrix1, err1 := CSVToMatrix(csvData1)
	if err1 != nil {
		fmt.Println("Error reading CSV file 1:", err1)
		return
	}
	matrix2, err2 := CSVToMatrix(csvData2)
	if err2 != nil {
		fmt.Println("Error reading CSV file 2:", err2)
		return
	}

	fmt.Println("Value at matrix1[0][1]:", matrix1[0][1])
	fmt.Println("Number of rows in matrix1 (after transpose):", len(matrix1))
	if len(matrix1) > 1 && len(matrix1[1]) > 100 {
		fmt.Println("Length of matrix1[1] (after transpose):", len(matrix1[1]))
		// Note: Accessing matrix1[1][100] might cause a panic if the inner slice doesn't have that many elements.
		// It's better to check the bounds before accessing.
	} else {
		fmt.Println("matrix1[1] does not have at least 101 elements.")
	}

	cols := []int{0, 2, 9, 10, 23, 26, 27, 28, 37, 38, 39, 55}
	newMatrix := populateNewStringMatrix(matrix1, cols)

	if len(matrix1) > 0 {
		numRows := len(matrix1[0])
		fmt.Println("Number of original rows in matrix1:", numRows)
	} else {
		fmt.Println("matrix1 is empty after transpose.")
		return
	}

	if len(matrix2) > 0 {
		numRows2 := len(matrix2[0])
		fmt.Println("Number of original rows in matrix2:", numRows2)
	} else {
		fmt.Println("matrix2 is empty after transpose.")
		return
	}

	//Potential issue: Assuming matrix1 has at least 3 rows and matrix2 has at least 11 rows.
	//It's safer to check the lengths before accessing these indices.
	if len(matrix1) > 2 && len(matrix2) > 10 && len(newMatrix) > 0 {
		//numNewMatrixCols := len(newMatrix[0])
		//numMatrix2Row10Cols := len(matrix2[10])

		for i := 0; i < len(matrix1); i++ {
			// if i >= numNewMatrixCols {
			// 	fmt.Printf("Warning: Index %d is out of bounds for newMatrix[0]. Skipping.\n", i)
			// 	continue
			// }
			for j := 0; j < len(matrix2); j++ {
				if matrix1[i][2] == matrix2[j][0] {
					newMatrix[i][0] = matrix2[j][10]
				}
			}
		}
		if len(newMatrix[0]) > 0 { // Check if newMatrix has any columns before accessing index 0
			fmt.Println("Value at newMatrix[0][0]:", newMatrix[0][0])
		}
	} else {
		fmt.Println("Warning: matrix1 or matrix2 does not have enough rows, or newMatrix is empty.")
	}
	

	filename := "string_matrix.csv"
	err3 := exportCSV(newMatrix, filename)
	if err3 != nil {
		fmt.Println("Error exporting to CSV:", err3)
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
//
//  matrix := make([][]string, len(csv1[col]+1))
//  count1 := 0
//  count2 := 0
//
//  for i:= 0; i < len(csv1); i++{
//      for j:= 0; j < len(csv2Col); j++{
//          if csv1[col][i] == csv2Col[j] {
//              for z:= 0; z < len(csv1); z ++{
//                  matrix[count1][count2] = csv1[z][i]
//                  count1++
//              }
//
//              for w:= 0; w < len(store); w++{
//                  matrix[count1+1][w] = store[w]
//              }
//
//
//              //get ready for next entry
//              count2++
//              count1 = 0
//          }
//      }
//
//  }
//
//  return matrix, count2
// }

// func addEmptyColumn(matrix [][]string) [][]string {
//  if len(matrix) == 0 {
//      return [][]string{} // Handle empty matrix case
//  }
//
//  numRows := len(matrix)
//  newMatrix := make([][]string, numRows)
//
//  for i := 0; i < numRows; i++ {
//      newMatrix[i] = make([]string, len(matrix[i])+1) // Create a new row with one extra element
//      // The first element of the new row is uninitialized (will be for input)
//      for j := 0; j < len(matrix[i]); j++ {
//          newMatrix[i][j+1] = matrix[i][j] // Shift existing elements to the right
//      }
//  }
//
//  return newMatrix
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
	if len(oldMatrix) == 0 {
		return [][]string{}
	}

	// The new matrix will have the same number of rows as the old matrix
	// and the number of columns will be equal to the number of column indices.
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
	if matrix == nil || len(matrix) == 0 {
		return [][]string{} // Return empty slice for an empty matrix
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