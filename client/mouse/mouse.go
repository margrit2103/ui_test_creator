package mouse

import (
	"encoding/base64"
	"errors"
	"fmt"
	"image"
	_ "image/png" // De
	"log"
	"strings"
	"sync"
	"time"

	"github.com/go-vgo/robotgo"
)

func getImageDimension(bitmap robotgo.Bitmap) (int, int) {
	x := bitmap.Width / 2
	y := bitmap.Height / 2

	return x, y
}

func Click(img, button string, double bool, delay int) (err error) {
	fmt.Println("Test -1")
	reader := base64.NewDecoder(base64.StdEncoding, strings.NewReader(img))
	fmt.Println("Test 0")
	m, _, err := image.Decode(reader)
	if err != nil {
		log.Fatal(err)
	}
	bounds := m.Bounds()
	fmt.Println(bounds)
	fmt.Println(reader)
	fmt.Println("Test 1")
	image := robotgo.OpenBitmap(reader)
	fmt.Println("Test 2")
	bitmap := robotgo.ToBitmap(image)
	fmt.Println("Test 3")
	xOffset, yOffset := getImageDimension(bitmap)
	fmt.Println("Test 4")
	if image != nil {
		ticker := time.NewTicker(200 * time.Millisecond)
		wg := sync.WaitGroup{}
		wg.Add(2)
		go func() {
			for _ = range ticker.C {
				x, y := robotgo.FindBitmap(image)
				if x == -1 && y == -1 {
					continue
				} else {
					x += xOffset
					y += yOffset

					robotgo.MovesClick(x, y, button, double)
					ticker.Stop()
					wg.Done()
					wg.Done()
				}
			}
		}()

		findFailedChan := make(chan error, 1)
		go func() {
			time.Sleep(time.Duration(delay) * time.Second)
			ticker.Stop()
			findFailedChan <- errors.New("Cannot find image")
			err = <-findFailedChan
			close(findFailedChan)
			wg.Done()
			wg.Done()
		}()
		wg.Wait()

		return err
	} else {
		theError := make(chan error, 1)
		theError <- errors.New("Cannot open image")
		err = <-theError
		close(theError)
		return err
	}
	return nil
}
