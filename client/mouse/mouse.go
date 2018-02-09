package mouse

import (
	"github.com/go-vgo/robotgo"
)

func Click(img, button string, double bool) (status string) {
	image := robotgo.OpenBitmap(img)

	if image != nil {
		x, y := robotgo.FindBitmap(image)
		robotgo.MovesClick(x, y, button, double)
	} else {
		status = "Cannot open image."
	}
	return status
}
