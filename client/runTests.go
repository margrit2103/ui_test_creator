package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"github.com/ui_test_creator/client/keyboard"
	"github.com/ui_test_creator/client/mouse"
)

type Actions struct {
	Data        string `json:"data"`
	Delay       string `json:"delay"`
	Action      string `json:"action"`
	Repeat      int    `json:"repeat"`
	Description string `json:"description"`
}

func TCase(testName string) {
	rows := getTestCaseData(testName)
	fmt.Println("TCASE rows:", rows)
	var actions []Actions
	if err := json.Unmarshal([]byte(rows), &actions); err != nil {
		panic(err)
	}

	// loop through json actions

	for action := range actions {
		switch actions[action].Action {
		case "click":
			mouse.Click()
		case "r_click":
			mouse.Click()
		case "doubleclick":
			mouse.Click()
		case "clickwait":
			mouse.Click()
		case "r_clickwait":
			mouse.Click()
		case "doubleclickwait":
			mouse.Click()
		case "type":
			keyboard.Write()
		case "keycombo":
			keyboard.KeyCombination()
		case "keypress":
			keyboard.KeyCombination()
		}
	}
}

func TSuite(suiteName string) {
	// rows := getTestSuiteData(suiteName)
	// Do for loop to go through tests and get the ID then run the TCase function
	TCase(suiteName)
}

func dbConnect() (db *sql.DB) {
	connStr := "dbname=goodxtest user=postgres password=masterkey host=127.0.0.1 port=5432 sslmode=disable"
	var err error
	if db, err = sql.Open("postgres", connStr); err != nil {
		log.Fatal(err)
		log.Fatal(db)
	}
	return db
}

func getTestCaseData(name string) string {
	db := dbConnect()
	var actions string
	var err error
	fmt.Printf(`SELECT actions FROM global.test_cases WHERE name = '%s'`, name)
	fmt.Println()
	err = db.QueryRow(`SELECT actions FROM global.test_cases WHERE name=$1`, name).Scan(&actions)
	if err != nil {
		log.Fatal("getTestCaseData: ", err)
	}
	fmt.Println(actions)

	return actions
}

func getTestSuiteData(name string) *sql.Rows {
	db := dbConnect()
	rows, err := db.Query(`SELECT tests FROM global.test_suites WHERE name = $1`, name)
	if err != nil {
		log.Fatal(err)
	}

	return rows
}

func getImages(ID int) *sql.Rows {
	db := dbConnect()
	rows, err := db.Query(`SELECT image FROM global.images WHERE id = $1`, ID)
	if err != nil {
		log.Fatal(err)
	}

	return rows
}
