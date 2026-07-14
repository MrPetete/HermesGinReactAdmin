package controller

import "strconv"

// itoa converts an int64 to its decimal string form.
func itoa(n int64) string { return strconv.FormatInt(n, 10) }
