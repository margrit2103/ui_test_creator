package mouse

import (
	"errors"
	"sync"
	"time"

	"github.com/go-vgo/robotgo"
)

func getImageDimension(imagePath string) (int, int) {
	bitmap := robotgo.OpenBitmap(imagePath)
	gbit := robotgo.ToBitmap(bitmap)

	x := gbit.Width / 2
	y := gbit.Height / 2

	return x, y
}

func Click(img, button string, double bool, delay int) (err error) {
	image := robotgo.OpenBitmap(img)
	xOffset, yOffset := getImageDimension(img)

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
