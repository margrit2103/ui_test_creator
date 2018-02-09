package keyboard

import (
	"strings"

	"github.com/go-vgo/robotgo"
)

// Write types the string given
func Write(str string) {
	robotgo.TypeString(str)
}

// KeyCombination press keys on the keyboard or press combination keys seprated by a +
func KeyCombination(str string) {
	keys := strings.Split(str, "+")

	for _, key := range keys {
		robotgo.KeyTap(key)
	}
}
