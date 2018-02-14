package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
	"github.com/ui_test_creator/client/keyboard"
	"github.com/ui_test_creator/client/mouse"
)

func TCase(caseID int) {
	rows := getTestCaseData(caseID)
	// loop through json actions

	for {
		switch action {
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

func TSuite(suiteID int) {
	rows := getTestSuiteData(suiteID)
	// Do for loop to go through tests and get the ID then run the TCase function
	TCase(testID)
}

func dbConnect() (db *sql.DB) {
	connStr := "dbname=goodxtest user=postgres password=masterkey host=127.0.0.1 port=5432"
	if db, err := sql.Open("postgres", connStr); err != nil {
		log.Fatal(err)
		log.Fatal(db)
	}
	return db
}

func getTestCaseData(ID int) *sql.Rows {
	db := dbConnect()
	rows, err := db.Query(`SELECT actions FROM global.test_cases WHERE id = $1`, ID)
	if err != nil {
		log.Fatal(err)
	}

	return rows
}

func getTestSuiteData(ID int) *sql.Rows {
	db := dbConnect()
	rows, err := db.Query(`SELECT tests FROM global.test_suites WHERE id = $1`, ID)
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
