#!/usr/bin/osascript

on run argv
	tell application "Discord" to activate

	tell application "System Events"
		keystroke "/"
		delay 1.2

        # delete slash
        key code 51
        delay 0.6

        key code 48 using shift down
		delay 0.3
        key code 48 using shift down
		delay 0.4
        key code 48 using shift down
		delay 0.4
        key code 48 using shift down
		delay 0.3
        key code 48 using shift down
		delay 0.5
        key code 48 using shift down
		delay 0.8
        key code 48 using shift down
		delay 0.9
        key code 48 using shift down
		delay 0.4
        key code 48 using shift down
		delay 0.5
        key code 48 using shift down
		delay 0.7
        key code 48 using shift down
		delay 0.8
        key code 48 using shift down
		delay 0.4
        key code 48 using shift down
		delay 0.5
        key code 48 using shift down
		delay 0.8
        key code 48 using shift down
		delay 0.8

        # Click on Image
		keystroke space
		delay 0.6
        key code 48 
		delay 0.7

        # Click Save Icon
		keystroke return
		delay 1

		keystroke return
		delay 0.8

        # Tab to close icon
        key code 48 using shift down
		delay 0.8
		keystroke return
		delay 0.8
        
        # Cmd Shift U to attach
        key code 32 using {command down, shift down}
		delay 0.6
        # Down arrow to first image in downloads dir
        key code 125 
		delay 0.6
		keystroke return
		delay 0.6
        # Post It
		keystroke return
	end tell

	tell application "Chrome" to activate
end run



