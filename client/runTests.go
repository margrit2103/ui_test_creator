package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"strconv"

	_ "github.com/lib/pq"
	"github.com/ui_test_creator/client/keyboard"
	"github.com/ui_test_creator/client/mouse"
)

type Actions struct {
	Data        string `json:"data"`
	Delay       int    `json:"delay"`
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
			i, err := strconv.Atoi(actions[action].Data)
			if err != nil {
				panic(err)
			}
			image := getImages(i)
			fmt.Println("FUCK MY LIFE 444444444444444444444444444444", image)
			if err = mouse.Click(image, "left", false, 0); err != nil {
				log.Fatal("MOTHER TRUCKER", err)
			}
		case "rclick":
			i, err := strconv.Atoi(actions[action].Data)
			if err != nil {
				panic(err)
			}
			if err := mouse.Click(getImages(i), "right", false, 0); err != nil {
				panic(err)
			}
		case "wait":
			//create wait feature
		case "doubleclick":
			i, err := strconv.Atoi(actions[action].Data)
			if err != nil {
				panic(err)
			}
			if err := mouse.Click(getImages(i), "left", true, 0); err != nil {
				panic(err)
			}
		case "clickwait":
			i, err := strconv.Atoi(actions[action].Data)
			if err != nil {
				panic(err)
			}

			if err := mouse.Click(getImages(i), "left", false, actions[action].Delay); err != nil {
				panic(err)
			}
		case "r_clickwait":
			i, err := strconv.Atoi(actions[action].Data)
			if err != nil {
				panic(err)
			}

			if err := mouse.Click(getImages(i), "right", false, actions[action].Delay); err != nil {
				panic(err)
			}
		case "doubleclickwait":
			i, err := strconv.Atoi(actions[action].Data)
			if err != nil {
				panic(err)
			}

			if err := mouse.Click(getImages(i), "left", true, actions[action].Delay); err != nil {
				panic(err)
			}
		case "type":
			keyboard.Write(actions[action].Data)
		case "keycombo":
			fmt.Println("Keycombo running...")
			keyboard.KeyCombination(actions[action].Data)
		case "keypress":
			keyboard.KeyCombination(actions[action].Data)
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

func getImages(ID int) string {
	db := dbConnect()
	var err error
	var image string
	err = db.QueryRow(`SELECT image FROM global.images WHERE id=$1`, ID).Scan(&image)
	if err != nil {
		log.Fatal(err)
	}

	return image
}
